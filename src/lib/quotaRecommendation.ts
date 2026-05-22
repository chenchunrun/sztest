import type { QuotaProfile, School, StudentInfo, StudentType } from '../types/index.ts';
import { buildStudentScoreModel, convertRawScore610To630, getSchoolScore, schools } from '../data/schools.ts';
import { getQuotaPlan2026BySchoolName } from '../data/admissionPlans2026Utils.ts';
import { findJuniorSchoolIndicatorAllocation } from '../data/indicatorAllocations.ts';

export type QuotaRecommendation = {
  school: School;
  quota: number;
  indicatorLine: number;
  regularGap: number;
  controlLineMargin: number;
  probability: number;
  expectedCompetitors: number;
  competitorScoreMean: number;
  competitorScoreSigma: number;
};

export type QuotaRecommendationContext =
  | { status: 'missing' }
  | { status: 'ineligible' }
  | { status: 'not_found'; juniorSchool: string }
  | { status: 'no_quota'; juniorSchool: string; district: string }
  | { status: 'no_candidate'; juniorSchool: string; district: string }
  | { status: 'ready'; juniorSchool: string; district: string; recommendation: QuotaRecommendation };

const MIN_RECOMMENDATION_PROBABILITY = 10;

type JuniorSchoolCompetitiveness = {
  score: number;
  avgTargetLine: number;
  highTierShare: number;
};

function mergeQuotaMaps(...maps: Array<Record<string, number> | undefined>) {
  const merged: Record<string, number> = {};
  for (const map of maps) {
    if (!map) continue;
    for (const [schoolName, quota] of Object.entries(map)) {
      if (quota <= 0) continue;
      merged[schoolName] = (merged[schoolName] || 0) + quota;
    }
  }
  return merged;
}

function getQuotaMapByStudentType(
  allocation: Awaited<ReturnType<typeof findJuniorSchoolIndicatorAllocation>>,
  studentType: StudentType
) {
  if (!allocation) return {};
  return studentType === 'AC'
    ? mergeQuotaMaps(allocation.acQuotas, allocation.acdQuotas)
    : mergeQuotaMaps(allocation.dQuotas, allocation.acdQuotas);
}

function hashSeed(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seedInput: string) {
  let state = hashSeed(seedInput) || 1;
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomNormal(random: () => number) {
  let u = 0;
  let v = 0;
  while (u === 0) u = random();
  while (v === 0) v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function randomPoisson(lambda: number, random: () => number) {
  const safeLambda = Math.max(0.1, lambda);
  const limit = Math.exp(-safeLambda);
  let p = 1;
  let k = 0;
  do {
    k += 1;
    p *= random();
  } while (p > limit);
  return k - 1;
}

function isArtSchool(school: School) {
  const text = [
    school.name,
    school.description,
    school.classTypes,
    ...(school.features || []),
    ...(school.traits || []),
  ]
    .filter(Boolean)
    .join(' ');

  return /艺术高中|美术学校|艺术普高|艺术类普通高考|美术|音乐|传媒/.test(text);
}

function isSpecialProgramSchool(school: School) {
  const text = [
    school.name,
    school.description,
    school.classTypes,
    ...(school.features || []),
  ]
    .filter(Boolean)
    .join(' ');

  return /综合高中|留学基金委自费出国留学班|国际书院/.test(text);
}

function getLevelHotness(school: School) {
  if (school.level === '四大名校') return 1.35;
  if (school.level === '八大名校') return 1.22;
  if (school.level === '区属重点') return 1.1;
  return 1;
}

function getCommuteFactor(student: StudentInfo, school: School) {
  if (student.preferredDistricts.includes(school.district)) return 0.92;
  if (student.homeDistrict && student.homeDistrict === school.district) return 0.92;
  return 1;
}

function getLevelValue(school: School) {
  if (school.level === '四大名校') return 100;
  if (school.level === '八大名校') return 88;
  if (school.level === '区属重点') return 74;
  return 60;
}

function buildJuniorSchoolCompetitiveness(
  allocation: Awaited<ReturnType<typeof findJuniorSchoolIndicatorAllocation>>,
  studentType: StudentType
): JuniorSchoolCompetitiveness {
  if (!allocation) {
    return { score: 50, avgTargetLine: 540, highTierShare: 0.35 };
  }

  const quotaMap = getQuotaMapByStudentType(allocation, studentType);
  const entries = Object.entries(quotaMap).filter(([, quota]) => quota > 0);
  if (entries.length === 0) {
    return { score: 50, avgTargetLine: 540, highTierShare: 0.35 };
  }

  let totalQuota = 0;
  let weightedLine = 0;
  let weightedLevel = 0;
  let highTierQuota = 0;

  entries.forEach(([schoolName, quota]) => {
    const school = schools.find((item) => item.name === schoolName);
    if (!school) return;
    const line = getSchoolScore(school, studentType);
    const levelValue = getLevelValue(school);
    totalQuota += quota;
    weightedLine += line * quota;
    weightedLevel += levelValue * quota;
    if (school.level === '四大名校' || school.level === '八大名校') highTierQuota += quota;
  });

  if (totalQuota === 0) {
    return { score: 50, avgTargetLine: 540, highTierShare: 0.35 };
  }

  const avgTargetLine = weightedLine / totalQuota;
  const avgLevelValue = weightedLevel / totalQuota;
  const highTierShare = highTierQuota / totalQuota;
  const score = Math.max(
    30,
    Math.min(
      95,
      (avgTargetLine - 500) * 0.32 + (avgLevelValue - 60) * 1.1 + highTierShare * 26
    )
  );

  return {
    score: Number(score.toFixed(1)),
    avgTargetLine: Number(avgTargetLine.toFixed(1)),
    highTierShare: Number(highTierShare.toFixed(2)),
  };
}

function buildCompetitorModel(
  student: StudentInfo,
  school: School,
  quota: number,
  regularLine: number,
  controlLine: number,
  juniorSchoolCompetitiveness: JuniorSchoolCompetitiveness
) {
  const studentModel = buildStudentScoreModel(student);
  const regularGap = regularLine - studentModel.muScore;
  const hotness = getLevelHotness(school);
  const commuteFactor = getCommuteFactor(student, school);
  const competitiveness = juniorSchoolCompetitiveness.score / 100;
  const scoreTier = studentModel.muScore >= 595
    ? 1
    : studentModel.muScore >= 580
      ? 0.82
      : studentModel.muScore >= 560
        ? 0.62
        : studentModel.muScore >= 530
          ? 0.42
          : 0.24;
  const quotaPressure = quota <= 1 ? 2.2 : quota === 2 ? 1.75 : quota === 3 ? 1.45 : 1.2;
  const baseCompetitors = Math.max(
    quota + 1,
    Math.round((quota + 2) * quotaPressure * hotness * commuteFactor * (0.88 + competitiveness * 0.42 + scoreTier * 0.18))
  );
  const expectedCompetitors = Math.max(quota, baseCompetitors);

  const lineSpread = Math.max(8, regularLine - controlLine);
  const meanRatio = Math.max(
    0.42,
    Math.min(1.02, 0.5 + (hotness - 1) * 0.34 + competitiveness * 0.22 + scoreTier * 0.14)
  );
  const overshootAllowance = Math.max(0, Math.min(4, (competitiveness - 0.55) * 10 + (scoreTier - 0.45) * 6));
  const competitorScoreMean = Math.max(
    controlLine + 2,
    Math.min(regularLine + overshootAllowance, controlLine + lineSpread * meanRatio)
  );
  const competitorScoreSigma = Math.max(
    4.8,
    Math.min(12.5, studentModel.sigmaScore * (0.9 - competitiveness * 0.08) + Math.max(0, regularGap) * 0.06 + scoreTier * 0.8)
  );

  return {
    expectedCompetitors,
    competitorScoreMean: Number(competitorScoreMean.toFixed(1)),
    competitorScoreSigma: Number(competitorScoreSigma.toFixed(1)),
  };
}

function simulateQuotaProbability(
  student: StudentInfo,
  school: School,
  controlLine: number,
  quota: number,
  regularLine: number,
  juniorSchoolCompetitiveness: JuniorSchoolCompetitiveness,
  simulations = 6000
) {
  const studentModel = buildStudentScoreModel(student);
  const competitorModel = buildCompetitorModel(student, school, quota, regularLine, controlLine, juniorSchoolCompetitiveness);
  const random = createSeededRandom(JSON.stringify({
    student: {
      score: student.score,
      muScore: student.muScore,
      sigmaScore: student.sigmaScore,
      studentType: student.studentType,
      bioGeoGrade: student.bioGeoGrade,
      juniorSchool: student.juniorSchool,
      isQuotaEligible: student.isQuotaEligible,
      strategyStyle: student.strategyStyle,
      riskPreference: student.riskPreference,
    },
    schoolId: school.id,
    controlLine,
    quota,
    regularLine,
    simulations,
  }));

  let success = 0;
  for (let i = 0; i < simulations; i += 1) {
    const score = Math.max(0, Math.min(630, Math.round(studentModel.muScore + randomNormal(random) * studentModel.sigmaScore)));
    if (score < controlLine) continue;

    const competitors = randomPoisson(competitorModel.expectedCompetitors, random);
    let higherCount = 0;
    let equalCount = 0;

    for (let j = 0; j < competitors; j += 1) {
      const competitorScore = Math.max(
        0,
        Math.min(630, Math.round(competitorModel.competitorScoreMean + randomNormal(random) * competitorModel.competitorScoreSigma))
      );
      if (competitorScore > score) higherCount += 1;
      else if (competitorScore === score) equalCount += 1;
    }

    let tieAhead = 0;
    for (let j = 0; j < equalCount; j += 1) {
      if (random() > studentModel.tieBreakAdvantage) tieAhead += 1;
    }

    if (higherCount + tieAhead < quota) success += 1;
  }

  return {
    probability: Math.round((success / simulations) * 100),
    competitorModel,
  };
}

function getQuotaValueScore(school: School, probability: number, regularGap: number) {
  const levelWeight = school.level === '四大名校' ? 100 : school.level === '八大名校' ? 88 : school.level === '区属重点' ? 75 : 62;
  const desireScore = Math.max(45, levelWeight - Math.max(0, regularGap - 12) * 1.2);
  return probability * 0.55 + desireScore * 0.45;
}

async function getQuotaProfile(
  school: School,
  studentType: StudentType,
  juniorSchool?: string
): Promise<QuotaProfile> {
  const controlLineRaw = studentType === 'AC' ? school.indicatorLineAc : school.indicatorLineD;
  const controlLine = controlLineRaw !== undefined ? convertRawScore610To630(controlLineRaw) : undefined;
  const quotaPlan2026 = getQuotaPlan2026BySchoolName(school.name);
  const quotaPlan = quotaPlan2026
    ? ((studentType === 'AC' ? quotaPlan2026.acQuota : quotaPlan2026.dQuota) || quotaPlan2026.acdQuota)
    : (school.quotaPlan2026 ?? (studentType === 'AC' ? school.indicatorAc2025 : school.indicatorD2025));

  let quotaToJuniorSchool = 0;
  if (juniorSchool) {
    const allocation = await findJuniorSchoolIndicatorAllocation(juniorSchool);
    if (allocation) {
      const quotaMap = getQuotaMapByStudentType(allocation, studentType);
      quotaToJuniorSchool = quotaMap[school.name] || 0;
    }
  }

  return {
    quotaPlan,
    quotaToJuniorSchool,
    controlLine,
  };
}

export async function getQuotaRecommendationContext(planStudentInfo: StudentInfo, quotaBenchmarkLine?: number): Promise<QuotaRecommendationContext> {
  const studentType = planStudentInfo.studentType;
  const studentModel = buildStudentScoreModel(planStudentInfo);
  const score = studentModel.muScore;
  const juniorSchool = planStudentInfo.juniorSchool?.trim();
  const regularBenchmarkLine = quotaBenchmarkLine ?? score;

  if (planStudentInfo.isQuotaEligible === false) return { status: 'ineligible' };
  if (!juniorSchool) return { status: 'missing' };

  const allocation = await findJuniorSchoolIndicatorAllocation(juniorSchool);
  if (!allocation) return { status: 'not_found', juniorSchool };
  const juniorSchoolCompetitiveness = buildJuniorSchoolCompetitiveness(allocation, studentType);

  const quotaMap = getQuotaMapByStudentType(allocation, studentType);
  const quotaEntries = Object.entries(quotaMap).filter(([, quota]) => quota > 0);
  if (quotaEntries.length === 0) {
    return { status: 'no_quota', juniorSchool: allocation.juniorSchool, district: allocation.district };
  }

  const candidateEntries = await Promise.all(quotaEntries
    .map(async ([schoolName, quota]) => {
      const school = schools.find((item) => item.name === schoolName);
      if (!school) return null;
      if (school.type !== '公办') return null;
      if (planStudentInfo.applicantTrack !== 'art' && (isArtSchool(school) || isSpecialProgramSchool(school))) return null;
      if (planStudentInfo.subjectGradeOk === false && (school.minSubjectRule || school.provinceLevel)) return null;

      const quotaProfile = await getQuotaProfile(school, studentType, juniorSchool);
      const indicatorLine = quotaProfile.controlLine;
      const quotaToJuniorSchool = quotaProfile.quotaToJuniorSchool || quota;
      if (indicatorLine === undefined || quotaToJuniorSchool <= 0) return null;
      if (score < indicatorLine) return null;

      const regularLine = getSchoolScore(school, studentType);
      const regularGap = regularLine - score;
      if (regularLine < regularBenchmarkLine) return null;
      if (regularGap > 20) return null;

      const simulated = simulateQuotaProbability(
        planStudentInfo,
        school,
        indicatorLine,
        quotaToJuniorSchool,
        regularLine,
        juniorSchoolCompetitiveness
      );

      return {
        school,
        quota: quotaToJuniorSchool,
        indicatorLine,
        regularGap,
        controlLineMargin: Math.round(score - indicatorLine),
        probability: simulated.probability,
        expectedCompetitors: simulated.competitorModel.expectedCompetitors,
        competitorScoreMean: simulated.competitorModel.competitorScoreMean,
        competitorScoreSigma: simulated.competitorModel.competitorScoreSigma,
        valueScore: getQuotaValueScore(school, simulated.probability, regularGap),
      };
    }));

  const candidates = candidateEntries
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => {
      if (b.valueScore !== a.valueScore) return b.valueScore - a.valueScore;
      if (b.probability !== a.probability) return b.probability - a.probability;
      if (b.regularGap !== a.regularGap) return b.regularGap - a.regularGap;
      return getSchoolScore(b.school, studentType) - getSchoolScore(a.school, studentType);
    });

  const bestCandidate = candidates.find((candidate) => candidate.probability >= MIN_RECOMMENDATION_PROBABILITY);
  if (!bestCandidate) {
    return { status: 'no_candidate', juniorSchool: allocation.juniorSchool, district: allocation.district };
  }

  const recommendation: QuotaRecommendation = {
    school: bestCandidate.school,
    quota: bestCandidate.quota,
    indicatorLine: bestCandidate.indicatorLine,
    regularGap: bestCandidate.regularGap,
    controlLineMargin: bestCandidate.controlLineMargin,
    probability: bestCandidate.probability,
    expectedCompetitors: bestCandidate.expectedCompetitors,
    competitorScoreMean: bestCandidate.competitorScoreMean,
    competitorScoreSigma: bestCandidate.competitorScoreSigma,
  };
  return {
    status: 'ready',
    juniorSchool: allocation.juniorSchool,
    district: allocation.district,
    recommendation,
  };
}
