import type { StudentInfo, VolunteerItem, VolunteerPlan, School, SchoolLineForecast, VolunteerPattern, WalkDayAdjustmentSuggestion } from '../types/index.ts';
import { schools, getSchoolScore, buildSchoolLineForecast, buildStudentScoreModel, getDefaultPreferenceWeights } from '../data/schools.ts';

const SHARED_LINE_CORRELATION = 0.28;
const MONTE_CARLO_SIMULATIONS = 8000;
const OUTER_DISTRICTS = ['光明', '坪山', '盐田', '大鹏', '深汕'];
const DISTRICT_GROUPS: Record<string, string[]> = {
  west: ['南山', '宝安', '龙华', '光明'],
  east: ['罗湖', '盐田', '龙岗', '坪山', '大鹏'],
  central: ['福田'],
  distant: ['深汕'],
};

type CandidateBucket = 'rush' | 'steady' | 'safe';

type RankedSchoolCandidate = {
  school: School;
  forecast: SchoolLineForecast;
  probability: number;
  utility: number;
  bucket: CandidateBucket;
  preferenceScore: number;
  scoreGap: number;
};

type FinalStrategyCandidate = RankedSchoolCandidate & {
  strategy: VolunteerItem['strategy'];
};

type PatternConfig = {
  rush: number;
  steady: number;
  safe: number;
  total: number;
};

const PATTERN_CONFIGS: Record<VolunteerPattern, PatternConfig> = {
  '4-4-4': { rush: 4, steady: 4, safe: 4, total: 12 },
  '3-6-3': { rush: 3, steady: 6, safe: 3, total: 12 },
};

function getPatternConfig(pattern?: VolunteerPattern): PatternConfig {
  return PATTERN_CONFIGS[pattern ?? '4-4-4'] ?? PATTERN_CONFIGS['4-4-4'];
}

function isPreferredDistrictSchool(school: School, preferredDistricts: string[]) {
  return preferredDistricts.length > 0 && preferredDistricts.includes(school.district);
}

function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * absX);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX));
  return sign * y;
}

function normalCdf(value: number, mean: number, sigma: number): number {
  return 0.5 * (1 + erf((value - mean) / (sigma * Math.SQRT2)));
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

function randomNormal(random: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = random();
  while (v === 0) v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function isArtTrackSchool(school: School): boolean {
  const text = [
    school.name,
    school.description,
    school.classTypes,
    school.dormitory,
    ...(school.features || []),
    ...(school.traits || []),
  ]
    .filter(Boolean)
    .join(' ');

  return /艺术高中|美术学校|艺术普高|艺术类普通高考|美术|音乐|传媒/.test(text);
}

function isSpecialProgramSchool(school: School): boolean {
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

function getSchoolLevelWeight(level: School['level']): number {
  if (level === '四大名校') return 100;
  if (level === '八大名校') return 88;
  if (level === '区属重点') return 75;
  if (level === '普通公办') return 60;
  return 48;
}

function calculateMatchScore(school: School, student: StudentInfo): number {
  let score = 0;
  const schoolScore = getSchoolScore(school, student.studentType);
  const diff = student.score - schoolScore;

  let baseScore = 0;
  if (diff >= 20) baseScore = 95;
  else if (diff >= 10) baseScore = 80;
  else if (diff >= 0) baseScore = 65;
  else if (diff >= -10) baseScore = 50;
  else if (diff >= -20) baseScore = 35;
  else baseScore = 20;
  score += baseScore * 0.5;

  let regionScore = 100;
  if (student.commuteTolerance === 'near') {
    if (!student.preferredDistricts.includes(school.district)) regionScore = 30;
  } else if (student.commuteTolerance === 'medium') {
    if (OUTER_DISTRICTS.includes(school.district)) regionScore = 60;
  }
  score += regionScore * 0.1;

  let subjectScore = 50;
  if (student.strongSubjects && student.strongSubjects.length > 0 && school.wenli) {
    const hasScience = student.strongSubjects.some(s => ['数学', '物理', '化学'].includes(s));
    const hasLiberal = student.strongSubjects.some(s => ['语文', '英语', '历史', '地理'].includes(s));
    if (school.wenli === '偏理' && hasScience) subjectScore = 90;
    else if (school.wenli === '偏文' && hasLiberal) subjectScore = 90;
    else if (school.wenli === '均衡') subjectScore = 80;
    else if (hasScience && hasLiberal) subjectScore = 85;
    else if (hasScience || hasLiberal) subjectScore = 65;
  }
  score += subjectScore * 0.1;

  let traitScore = 50;
  if (student.preferNewSchool === false && school.traits?.includes('新兴学校')) traitScore -= 20;
  if (student.preferNewSchool === true && school.traits?.includes('新兴学校')) traitScore += 20;
  if (student.preferStrictManagement === true && school.traits?.includes('管理严格')) traitScore += 25;
  if (student.preferStrictManagement === false && school.traits?.includes('管理严格')) traitScore -= 15;
  if (student.preferArtSports === true && (school.traits?.includes('艺术特色') || school.traits?.includes('体育特色') || school.traits?.includes('竞赛强校'))) traitScore += 25;
  score += Math.max(0, Math.min(100, traitScore)) * 0.1;

  const reputationScore = school.reputation?.compositeScore || 50;
  score += reputationScore * 0.1;

  let sizeScore = 50;
  if (school.totalPlan2025) {
    if (school.totalPlan2025 >= 1000) sizeScore = 80;
    else if (school.totalPlan2025 >= 600) sizeScore = 65;
    else if (school.totalPlan2025 >= 300) sizeScore = 50;
    else sizeScore = 40;
  }
  score += sizeScore * 0.05;
  score += 100 * 0.05;

  return Math.round(score);
}

function generateMatchReasons(school: School, student: StudentInfo): string[] {
  const reasons: string[] = [];
  const schoolScore = getSchoolScore(school, student.studentType);
  const diff = student.score - schoolScore;

  if (diff >= 10) reasons.push('分数匹配度高');
  else if (diff >= -5) reasons.push('分数接近，冲刺有望');
  else reasons.push('分数保底，录取稳妥');

  if (student.preferredDistricts.includes(school.district)) reasons.push(`位于意向区域${school.district}`);

  if (student.strongSubjects && student.strongSubjects.length > 0 && school.wenli) {
    const hasScience = student.strongSubjects.some(s => ['数学', '物理', '化学'].includes(s));
    const hasLiberal = student.strongSubjects.some(s => ['语文', '英语', '历史', '地理'].includes(s));
    if (school.wenli === '偏理' && hasScience) reasons.push('偏理属性匹配理科优势');
    if (school.wenli === '偏文' && hasLiberal) reasons.push('偏文属性匹配文科优势');
    if (school.wenli === '均衡') reasons.push('文理均衡，适合全面发展');
  }

  if (school.traits?.includes('竞赛强校')) reasons.push('竞赛培养体系完善');
  if (school.traits?.includes('艺术特色')) reasons.push('艺术教育特色突出');
  if (school.traits?.includes('体育特色')) reasons.push('体育特长培养优势');
  if (school.traits?.includes('外语特色')) reasons.push('外语教学优势');
  if (school.traits?.includes('老牌名校')) reasons.push('历史悠久，底蕴深厚');
  if (school.traits?.includes('新兴学校')) reasons.push('新建学校，设施先进');

  if (school.reputation) {
    if ((school.reputation.compositeScore || 0) >= 75) reasons.push('口碑优秀');
    if ((school.reputation.teacherQuality || 0) >= 80) reasons.push('师资力量强');
    if ((school.reputation.teachingQuality || 0) >= 80) reasons.push('教学质量高');
  }

  if (school.totalPlan2025 && school.totalPlan2025 >= 1000) reasons.push('招生规模大，资源丰富');
  return reasons.slice(0, 4);
}

function dedupeSchoolList(schoolList: School[]): School[] {
  const seen = new Set<string>();
  return schoolList.filter((school) => {
    if (seen.has(school.id)) return false;
    seen.add(school.id);
    return true;
  });
}

function dedupeRankedSchools<T extends { school: School }>(schoolList: T[]): T[] {
  const seen = new Set<string>();
  return schoolList.filter((school) => {
    if (seen.has(school.school.id)) return false;
    seen.add(school.school.id);
    return true;
  });
}

function calculateAdmissionProbability(studentInfo: StudentInfo, forecast: SchoolLineForecast): number {
  const studentModel = buildStudentScoreModel(studentInfo);
  const denominator = Math.sqrt(
    Math.max(
      1,
      studentModel.sigmaScore ** 2 + forecast.sigmaLine ** 2 - 2 * SHARED_LINE_CORRELATION * studentModel.sigmaScore * forecast.sigmaLine
    )
  );
  const zScore = (studentModel.muScore - forecast.muLine) / denominator;
  return Math.max(0.01, Math.min(0.99, normalCdf(zScore, 0, 1)));
}

function classifyCandidateBucket(probability: number): CandidateBucket | null {
  if (probability < 0.15) return null;
  if (probability < 0.55) return 'rush';
  if (probability < 0.85) return 'steady';
  return 'safe';
}

function getStrategyFromProbability(probability: number): VolunteerItem['strategy'] {
  if (probability < 0.55) return '冲一冲';
  if (probability < 0.85) return '稳一稳';
  return '保一保';
}

function getEstimatedCommuteMinutes(student: StudentInfo, school: School): number {
  if (student.preferredDistricts.includes(school.district)) return 25;
  const preferred = student.homeDistrict ? [student.homeDistrict] : student.preferredDistricts;
  if (preferred.length === 0) return OUTER_DISTRICTS.includes(school.district) ? 55 : 40;
  const inSameGroup = preferred.some((district) => Object.values(DISTRICT_GROUPS).some((group) => group.includes(district) && group.includes(school.district)));
  if (inSameGroup) return 40;
  if (school.district === '深汕') return 110;
  return 70;
}

function getSchoolQualityScore(school: School, forecast: SchoolLineForecast): number {
  const levelScore = getSchoolLevelWeight(school.level);
  const reputationScore = school.reputation?.compositeScore || 60;
  const planScore = school.totalPlan2025 ? Math.min(95, 50 + Math.log10(Math.max(100, school.totalPlan2025)) * 16) : 60;
  return Number((levelScore * 0.5 + reputationScore * 0.3 + planScore * 0.1 + forecast.stabilityScore * 0.1).toFixed(1));
}

function getFeatureFitScore(school: School, student: StudentInfo): number {
  let score = 70;
  if (student.strongSubjects?.length && school.wenli) {
    const hasScience = student.strongSubjects.some((subject) => ['数学', '物理', '化学'].includes(subject));
    const hasLiberal = student.strongSubjects.some((subject) => ['语文', '英语', '历史', '地理'].includes(subject));
    if (school.wenli === '偏理' && hasScience) score += 18;
    if (school.wenli === '偏文' && hasLiberal) score += 18;
    if (school.wenli === '均衡') score += 10;
  }
  if (student.preferArtSports === true && (school.traits?.includes('艺术特色') || school.traits?.includes('体育特色') || school.traits?.includes('竞赛强校'))) score += 12;
  if (student.preferNewSchool === false && school.traits?.includes('新兴学校')) score -= 10;
  if (student.preferNewSchool === true && school.traits?.includes('新兴学校')) score += 10;
  return Math.max(0, Math.min(100, score));
}

function getBoardingFitScore(school: School, student: StudentInfo): number {
  if (student.boardingNeed === 'hard') return school.hasBoarding ? 100 : 0;
  if (student.boardingNeed === 'preferred') return school.hasBoarding ? 92 : 58;
  if (student.accommodation === 'boarding') return school.hasBoarding ? 95 : 10;
  if (student.accommodation === 'day') return school.hasDay ? 95 : 30;
  return school.hasBoarding && school.hasDay ? 88 : 72;
}

function getTuitionFitScore(school: School, student: StudentInfo): number {
  if (school.type === '公办') return 96;
  if (!student.acceptPrivate) return 0;
  return student.riskPreference === 'conservative' ? 45 : 58;
}

function getPenaltyScore(school: School, student: StudentInfo): number {
  let penalty = 0;
  const commuteMinutes = getEstimatedCommuteMinutes(student, school);
  if (student.commuteTolerance === 'near') penalty += Math.max(0, commuteMinutes - 30) * 0.9;
  else if (student.commuteTolerance === 'medium') penalty += Math.max(0, commuteMinutes - 45) * 0.55;
  else penalty += Math.max(0, commuteMinutes - 65) * 0.3;
  if (student.preferStrictManagement === false && school.traits?.includes('管理严格')) penalty += 12;
  if (student.preferStrictManagement === true && !school.traits?.includes('管理严格')) penalty += 4;
  if (school.type === '民办') penalty += 8;
  if (school.traits?.includes('新兴学校')) penalty += 4;
  return Number(Math.max(0, Math.min(100, penalty)).toFixed(1));
}

function getBucketSortScore(candidate: RankedSchoolCandidate): number {
  const levelScore = getSchoolLevelWeight(candidate.school.level);
  const probabilityPct = candidate.probability * 100;
  const stabilityScore = candidate.forecast.stabilityScore;
  if (candidate.bucket === 'rush') return candidate.utility * 0.7 + probabilityPct * 0.15 + levelScore * 0.15;
  if (candidate.bucket === 'steady') return candidate.utility * 0.55 + probabilityPct * 0.25 + levelScore * 0.2;
  return candidate.utility * 0.35 + probabilityPct * 0.5 + stabilityScore * 0.15;
}

function calculateSchoolUtility(school: School, student: StudentInfo, forecast: SchoolLineForecast): number {
  const weights = getDefaultPreferenceWeights(student.preferenceWeights);
  const qualityScore = getSchoolQualityScore(school, forecast);
  const commuteMinutes = getEstimatedCommuteMinutes(student, school);
  const regionScore = Number(Math.max(0, Math.min(100, 100 - 0.5 * commuteMinutes)).toFixed(1));
  const featureScore = getFeatureFitScore(school, student);
  const boardingScore = getBoardingFitScore(school, student);
  const tuitionScore = getTuitionFitScore(school, student);
  const penaltyScore = getPenaltyScore(school, student);
  const managementBonus = school.traits?.includes('管理严格') ? (student.preferStrictManagement === true ? 92 : 68) : 80;
  const matchScore = calculateMatchScore(school, student);
  const utility = qualityScore * weights.schoolLevel + regionScore * weights.district + featureScore * weights.features + boardingScore * weights.boarding + tuitionScore * weights.tuition + managementBonus * weights.management + matchScore * weights.commute - penaltyScore * 0.6;
  return Number(Math.max(0, Math.min(100, utility)).toFixed(1));
}

function sortCandidatePool(candidatePool: RankedSchoolCandidate[], studentInfo: StudentInfo, primarySchoolIds: Set<string>): RankedSchoolCandidate[] {
  const { studentType } = studentInfo;
  return [...candidatePool].sort((a, b) => {
    const primaryDiff = Number(primarySchoolIds.has(b.school.id)) - Number(primarySchoolIds.has(a.school.id));
    if (primaryDiff !== 0) return primaryDiff;
    if (a.school.type !== b.school.type) return a.school.type === '公办' ? -1 : 1;
    const bucketScoreDiff = getBucketSortScore(b) - getBucketSortScore(a);
    if (bucketScoreDiff !== 0) return bucketScoreDiff;
    const scoreA = getSchoolScore(a.school, studentType);
    const scoreB = getSchoolScore(b.school, studentType);
    if (scoreA !== scoreB) return scoreB - scoreA;
    return b.preferenceScore - a.preferenceScore;
  });
}

function pickDiversifiedCandidates(
  candidatePool: RankedSchoolCandidate[],
  count: number,
  minLineGap: number
) {
  const picked: RankedSchoolCandidate[] = [];
  const remaining = [...candidatePool];

  let requiredGap = minLineGap;
  while (picked.length < count && remaining.length > 0) {
    const nextIndex = remaining.findIndex((candidate) => (
      picked.every((selected) => Math.abs(selected.forecast.muLine - candidate.forecast.muLine) >= requiredGap)
    ));

    if (nextIndex >= 0) {
      picked.push(remaining.splice(nextIndex, 1)[0]);
      continue;
    }

    if (requiredGap > 0) {
      requiredGap = Math.max(0, requiredGap - 2);
      continue;
    }

    picked.push(remaining.shift()!);
  }

  return picked;
}

function buildCategoryCandidates(
  candidatePool: RankedSchoolCandidate[],
  count: number,
  minLineGap: number
) {
  return dedupeRankedSchools(pickDiversifiedCandidates(candidatePool, count, minLineGap));
}

function sortPublicTailCandidates(candidatePool: RankedSchoolCandidate[]): RankedSchoolCandidate[] {
  return [...candidatePool].sort((a, b) => {
    if (a.forecast.muLine !== b.forecast.muLine) return a.forecast.muLine - b.forecast.muLine;
    if (a.probability !== b.probability) return b.probability - a.probability;
    if (a.utility !== b.utility) return b.utility - a.utility;
    return getSchoolLevelWeight(b.school.level) - getSchoolLevelWeight(a.school.level);
  });
}

function sortByForecastLineDesc(candidatePool: RankedSchoolCandidate[], studentType: StudentInfo['studentType']) {
  return [...candidatePool].sort((a, b) => {
    if (b.forecast.muLine !== a.forecast.muLine) return b.forecast.muLine - a.forecast.muLine;
    if (b.probability !== a.probability) return b.probability - a.probability;
    return getSchoolScore(b.school, studentType) - getSchoolScore(a.school, studentType);
  });
}

function rebalanceStrategiesByForecast(
  candidates: RankedSchoolCandidate[],
  studentType: StudentInfo['studentType'],
  patternConfig: PatternConfig,
) {
  const ordered = sortByForecastLineDesc(dedupeRankedSchools(candidates), studentType).slice(0, patternConfig.total);
  return ordered.map((candidate, index) => ({
    ...candidate,
    strategy: index < patternConfig.rush ? '冲一冲' as const : index < patternConfig.rush + patternConfig.steady ? '稳一稳' as const : '保一保' as const,
  }));
}

function hasTargetStrategyMix(items: FinalStrategyCandidate[], patternConfig: PatternConfig) {
  const counts = items.reduce<Record<VolunteerItem['strategy'], number>>((acc, candidate) => {
    acc[candidate.strategy] = (acc[candidate.strategy] || 0) + 1;
    return acc;
  }, { '冲一冲': 0, '稳一稳': 0, '保一保': 0 });

  return (
    counts['冲一冲'] === patternConfig.rush &&
    counts['稳一稳'] === patternConfig.steady &&
    counts['保一保'] === patternConfig.safe
  );
}

function sortByStrategyAndScore(items: FinalStrategyCandidate[], studentType: StudentInfo['studentType']) {
  const strategyWeight: Record<VolunteerItem['strategy'], number> = { '冲一冲': 0, '稳一稳': 1, '保一保': 2 };
  return [...items].sort((a, b) => {
    const strategyDiff = strategyWeight[a.strategy] - strategyWeight[b.strategy];
    if (strategyDiff !== 0) return strategyDiff;
    if (b.forecast.muLine !== a.forecast.muLine) return b.forecast.muLine - a.forecast.muLine;
    if (getSchoolScore(b.school, studentType) !== getSchoolScore(a.school, studentType)) {
      return getSchoolScore(b.school, studentType) - getSchoolScore(a.school, studentType);
    }
    if (b.probability !== a.probability) return b.probability - a.probability;
    return getBucketSortScore(b) - getBucketSortScore(a);
  });
}

function getWalkDayAdjustmentReason(candidate: FinalStrategyCandidate, studentInfo: StudentInfo) {
  const commuteMinutes = getEstimatedCommuteMinutes(studentInfo, candidate.school);
  if (studentInfo.preferredDistricts.includes(candidate.school.district)) return '位于意向区域，走读通勤更可控';
  if (studentInfo.homeDistrict && studentInfo.homeDistrict === candidate.school.district) return '与居住区域一致，适合作为走读调剂选择';
  if (commuteMinutes <= 35) return '预估通勤较近，适合接受走读调剂';
  if (candidate.strategy === '稳一稳') return '处于主力录取带，适合用走读调剂增强录取机会';
  return '学校支持走读，且梯度位置适合作为备用走读选择';
}

function buildWalkDayAdjustmentSuggestions(items: FinalStrategyCandidate[], studentInfo: StudentInfo): WalkDayAdjustmentSuggestion[] {
  if (studentInfo.walkDayAdjustmentPreference === 'none') return [];
  if (studentInfo.accommodation === 'boarding' || studentInfo.boardingNeed === 'hard') return [];

  const eligible = items
    .filter((candidate) => candidate.school.type === '公办' && candidate.school.hasDay)
    .map((candidate) => ({
      candidate,
      commuteMinutes: getEstimatedCommuteMinutes(studentInfo, candidate.school),
      isPreferredDistrict: isPreferredDistrictSchool(candidate.school, studentInfo.preferredDistricts),
      strategyWeight: candidate.strategy === '稳一稳' ? 0 : candidate.strategy === '保一保' ? 1 : 2,
    }))
    .filter(({ commuteMinutes }) => {
      if (studentInfo.commuteTolerance === 'near') return commuteMinutes <= 45;
      if (studentInfo.commuteTolerance === 'medium') return commuteMinutes <= 70;
      return commuteMinutes <= 90;
    })
    .sort((a, b) => {
      const preferredDiff = Number(b.isPreferredDistrict) - Number(a.isPreferredDistrict);
      if (preferredDiff !== 0) return preferredDiff;
      if (a.strategyWeight !== b.strategyWeight) return a.strategyWeight - b.strategyWeight;
      if (a.commuteMinutes !== b.commuteMinutes) return a.commuteMinutes - b.commuteMinutes;
      if (b.candidate.forecast.muLine !== a.candidate.forecast.muLine) return b.candidate.forecast.muLine - a.candidate.forecast.muLine;
      return b.candidate.probability - a.candidate.probability;
    })
    .slice(0, 4);

  return eligible.map(({ candidate }) => ({
    schoolId: candidate.school.id,
    schoolName: candidate.school.name,
    reason: getWalkDayAdjustmentReason(candidate, studentInfo),
  }));
}

function enforceDistrictPreference(
  items: FinalStrategyCandidate[],
  preferredCandidates: RankedSchoolCandidate[],
  studentInfo: StudentInfo,
  primarySchoolIds: Set<string>,
) {
  if (studentInfo.preferredDistricts.length === 0) return items;

  const nextItems = [...items];
  const selectedIds = new Set(nextItems.map((candidate) => candidate.school.id));
  const preferredPool = sortCandidatePool(
    preferredCandidates.filter((candidate) => !selectedIds.has(candidate.school.id)),
    studentInfo,
    primarySchoolIds
  );

  for (const strategy of ['冲一冲', '稳一稳', '保一保'] as const) {
    const groupIndexes = nextItems
      .map((candidate, index) => ({ candidate, index }))
      .filter(({ candidate }) => candidate.strategy === strategy);

    const groupPreferredPool = preferredPool.filter((candidate) => getStrategyFromProbability(candidate.probability) === strategy);
    if (groupPreferredPool.length === 0) continue;

    const replacementTargets = groupIndexes
      .filter(({ candidate }) => !isPreferredDistrictSchool(candidate.school, studentInfo.preferredDistricts))
      .sort((a, b) => a.candidate.forecast.muLine - b.candidate.forecast.muLine);

    for (const target of replacementTargets) {
      const replacementIndex = groupPreferredPool.findIndex((candidate) => !selectedIds.has(candidate.school.id));
      if (replacementIndex < 0) break;
      const replacement = groupPreferredPool[replacementIndex];
      const lineDrop = target.candidate.forecast.muLine - replacement.forecast.muLine;
      const utilityDrop = target.candidate.utility - replacement.utility;
      if (lineDrop > 16 && utilityDrop > 14) continue;

      selectedIds.delete(target.candidate.school.id);
      selectedIds.add(replacement.school.id);
      nextItems[target.index] = { ...replacement, strategy };
      groupPreferredPool.splice(replacementIndex, 1);
    }
  }

  return nextItems;
}

function isStrongSafetyCandidate(candidate: RankedSchoolCandidate, studentInfo: StudentInfo): boolean {
  const studentModel = buildStudentScoreModel(studentInfo);
  return candidate.probability >= 0.97 && candidate.scoreGap >= studentModel.sigmaScore * 2;
}

function isSafetyCandidate(candidate: RankedSchoolCandidate): boolean {
  return candidate.probability >= 0.94;
}

function rebuildUsedIds(groups: RankedSchoolCandidate[][]): Set<string> {
  return new Set(groups.flat().map((candidate) => candidate.school.id));
}

function enforceSafetyTail(
  rushFinal: RankedSchoolCandidate[],
  steadyFinal: RankedSchoolCandidate[],
  safeFinal: RankedSchoolCandidate[],
  allSafeOrdered: RankedSchoolCandidate[],
  studentInfo: StudentInfo,
  patternConfig: PatternConfig,
) {
  const nextRush = [...rushFinal];
  const nextSteady = [...steadyFinal];
  let nextSafe = dedupeRankedSchools([...safeFinal]).sort((a, b) => a.probability - b.probability);
  let usedIds = rebuildUsedIds([nextRush, nextSteady, nextSafe]);

  const ensureSafeSlot = (predicate: (candidate: RankedSchoolCandidate) => boolean) => {
    if (nextSafe.some(predicate)) return;
    const replacement = allSafeOrdered.find((candidate) => !usedIds.has(candidate.school.id) && predicate(candidate));
    if (!replacement) return;
    if (nextRush.length > 0) {
      const removed = nextRush.shift();
      if (removed) usedIds.delete(removed.school.id);
    } else if (nextSteady.length > 0) {
      const removed = nextSteady.shift();
      if (removed) usedIds.delete(removed.school.id);
    } else if (nextSafe.length >= patternConfig.safe) {
      const removed = nextSafe.shift();
      if (removed) usedIds.delete(removed.school.id);
    }
    nextSafe.push(replacement);
    usedIds.add(replacement.school.id);
    nextSafe = dedupeRankedSchools(nextSafe).sort((a, b) => a.probability - b.probability).slice(-patternConfig.safe);
    usedIds = rebuildUsedIds([nextRush, nextSteady, nextSafe]);
  };

  ensureSafeSlot((candidate) => isStrongSafetyCandidate(candidate, studentInfo));

  while (nextSafe.filter(isSafetyCandidate).length < Math.min(2, patternConfig.safe)) {
    const replacement = allSafeOrdered.find((candidate) => !usedIds.has(candidate.school.id) && isSafetyCandidate(candidate));
    if (!replacement) break;
    if (nextRush.length > 0) {
      const removed = nextRush.shift();
      if (removed) usedIds.delete(removed.school.id);
    } else if (nextSteady.length > 0) {
      const removed = nextSteady.shift();
      if (removed) usedIds.delete(removed.school.id);
    } else {
      break;
    }
    nextSafe.push(replacement);
    usedIds.add(replacement.school.id);
    nextSafe = dedupeRankedSchools(nextSafe).sort((a, b) => a.probability - b.probability).slice(-patternConfig.safe);
    usedIds = rebuildUsedIds([nextRush, nextSteady, nextSafe]);
  }

  return {
    rushFinal: nextRush.slice(0, patternConfig.rush),
    steadyFinal: nextSteady.slice(0, patternConfig.steady),
    safeFinal: nextSafe.slice(-patternConfig.safe),
  };
}

function simulateOrderedAdmissions(orderedCandidates: FinalStrategyCandidate[], studentInfo: StudentInfo, simulations = MONTE_CARLO_SIMULATIONS) {
  if (orderedCandidates.length === 0) {
    return { admissionBySchoolId: {}, missProbability: 1, firstBatchAdmissionProbability: 0 };
  }
  const studentModel = buildStudentScoreModel(studentInfo);
  const random = createSeededRandom(JSON.stringify({
    student: studentInfo,
    orderedCandidates: orderedCandidates.map((candidate) => ({
      id: candidate.school.id,
      strategy: candidate.strategy,
      muLine: candidate.forecast.muLine,
      sigmaLine: candidate.forecast.sigmaLine,
      probability: candidate.probability,
    })),
    simulations,
  }));
  const counts: Record<string, number> = {};
  let missCount = 0;
  orderedCandidates.forEach((candidate) => { counts[candidate.school.id] = 0; });
  for (let i = 0; i < simulations; i += 1) {
    const score = Math.max(0, Math.min(630, Math.round(studentModel.muScore + randomNormal(random) * studentModel.sigmaScore)));
    const commonShock = randomNormal(random);
    let admitted = false;
    for (const candidate of orderedCandidates) {
      const sensitivity = candidate.forecast.commonSensitivity;
      const schoolSigma = candidate.forecast.sigmaLine;
      const ownSigma = schoolSigma * Math.sqrt(Math.max(0, 1 - sensitivity ** 2));
      const simulatedLine = Math.max(0, Math.min(630, Math.round(candidate.forecast.muLine + sensitivity * schoolSigma * commonShock + randomNormal(random) * ownSigma)));
      if (score > simulatedLine) {
        counts[candidate.school.id] += 1;
        admitted = true;
        break;
      }
      if (score === simulatedLine) {
        const tiePassProb = Math.max(0.2, Math.min(0.85, (candidate.forecast.tiePassProb + studentModel.tieBreakAdvantage) / 2));
        if (random() < tiePassProb) {
          counts[candidate.school.id] += 1;
          admitted = true;
          break;
        }
      }
    }
    if (!admitted) missCount += 1;
  }
  return {
    admissionBySchoolId: Object.fromEntries(Object.entries(counts).map(([schoolId, count]) => [schoolId, count / simulations])),
    missProbability: missCount / simulations,
    firstBatchAdmissionProbability: 1 - missCount / simulations,
  };
}

export function generateVolunteerPlan(studentInfo: StudentInfo | null): VolunteerPlan | null {
  if (!studentInfo) return null;

  const patternConfig = getPatternConfig(studentInfo.volunteerPattern);
  const { score, studentType, preferredDistricts, accommodation, preferredLevels, applicantTrack } = studentInfo;
  const hasDistrictPreference = preferredDistricts.length > 0;
  const isArtApplicant = applicantTrack === 'art';

  const baseFiltered = schools.filter(s => {
    if (s.type === '民办') return false;
    if (accommodation === 'boarding' && !s.hasBoarding) return false;
    if (accommodation === 'day' && !s.hasDay) return false;
    if (studentInfo.boardingNeed === 'hard' && !s.hasBoarding) return false;
    if (!isArtApplicant && (isArtTrackSchool(s) || isSpecialProgramSchool(s))) return false;
    if (isArtApplicant && isSpecialProgramSchool(s) && !isArtTrackSchool(s)) return false;
    return true;
  });

  const districtFiltered = hasDistrictPreference ? baseFiltered.filter(s => preferredDistricts.includes(s.district)) : baseFiltered;
  const primaryFiltered = preferredLevels.length > 0 ? districtFiltered.filter(s => preferredLevels.includes(s.level)) : districtFiltered;
  const primaryPool = primaryFiltered.length < 12 ? districtFiltered : primaryFiltered;
  const secondaryDistrictPool = hasDistrictPreference ? baseFiltered.filter(s => !preferredDistricts.includes(s.district)) : [];
  const secondaryPool = preferredLevels.length > 0 ? secondaryDistrictPool.filter(s => preferredLevels.includes(s.level)) : secondaryDistrictPool;

  const primarySchoolIds = new Set(primaryPool.map(s => s.id));
  const combinedPool = dedupeSchoolList([...primaryPool, ...secondaryPool]);
  const studentModel = buildStudentScoreModel(studentInfo);
  const rankedCandidates = combinedPool
    .map((school) => {
      const forecast = buildSchoolLineForecast(school, studentType);
      const probability = calculateAdmissionProbability(studentInfo, forecast);
      const bucket = classifyCandidateBucket(probability);
      if (!bucket) return null;
      if (studentInfo.subjectGradeOk === false && (school.minSubjectRule || school.provinceLevel)) return null;
      const utility = calculateSchoolUtility(school, studentInfo, forecast);
      return {
        school,
        forecast,
        probability,
        utility,
        bucket,
        preferenceScore: utility,
        scoreGap: Number((studentModel.muScore - forecast.muLine).toFixed(1)),
      } as RankedSchoolCandidate;
    })
    .filter((candidate): candidate is RankedSchoolCandidate => candidate !== null);

  const regularPublicCandidates = combinedPool
    .filter((school) => {
      if (school.type !== '公办') return false;
      if (studentInfo.subjectGradeOk === false && (school.minSubjectRule || school.provinceLevel)) return false;
      return true;
    })
    .map((school) => {
      const forecast = buildSchoolLineForecast(school, studentType);
      const probability = calculateAdmissionProbability(studentInfo, forecast);
      return {
        school,
        forecast,
        probability,
        utility: calculateSchoolUtility(school, studentInfo, forecast),
        bucket: probability >= 0.85 ? 'safe' : probability >= 0.55 ? 'steady' : 'rush',
        preferenceScore: Math.max(0, 100 - Math.abs(studentModel.muScore - forecast.muLine) * 2),
        scoreGap: Number((studentModel.muScore - forecast.muLine).toFixed(1)),
      } as RankedSchoolCandidate;
    });

  const lowScoreTailWindow = studentModel.muScore < 500 ? Math.max(40, studentModel.sigmaScore * 4.2) : Math.max(22, studentModel.sigmaScore * 2.2);
  const publicTailCeiling = studentModel.muScore + lowScoreTailWindow;
  const densePublicTail = sortCandidatePool(
    regularPublicCandidates
      .filter((candidate) => candidate.forecast.muLine <= publicTailCeiling)
      .map((candidate) => ({
        ...candidate,
        preferenceScore: Math.max(0, 100 - Math.abs(candidate.scoreGap) * 2),
      })),
    studentInfo,
    primarySchoolIds
  );
  const publicFloorBand = sortPublicTailCandidates(regularPublicCandidates).slice(0, Math.max(patternConfig.total, 12));
  const publicCeilingBand = sortByForecastLineDesc(
    regularPublicCandidates.filter((candidate) => candidate.forecast.muLine >= studentModel.muScore - 18),
    studentType
  ).slice(0, patternConfig.total);

  const rushPublic = sortCandidatePool(rankedCandidates.filter((candidate) => candidate.bucket === 'rush' && candidate.school.type === '公办'), studentInfo, primarySchoolIds);
  const steadyPublic = sortCandidatePool(rankedCandidates.filter((candidate) => candidate.bucket === 'steady' && candidate.school.type === '公办'), studentInfo, primarySchoolIds);
  const safePublic = sortCandidatePool(rankedCandidates.filter((candidate) => candidate.bucket === 'safe' && candidate.school.type === '公办'), studentInfo, primarySchoolIds);
  const diversificationGap = studentModel.muScore >= 560 ? 4 : studentModel.muScore >= 500 ? 5 : 6;
  const rushFinal = buildCategoryCandidates(rushPublic, patternConfig.rush, diversificationGap);
  const usedIds = new Set(rushFinal.map((candidate) => candidate.school.id));

  const steadyFinal = buildCategoryCandidates(
    steadyPublic.filter((candidate) => !usedIds.has(candidate.school.id)),
    patternConfig.steady,
    diversificationGap
  );
  steadyFinal.forEach((candidate) => usedIds.add(candidate.school.id));

  const safeStrong = safePublic.filter((candidate) => !usedIds.has(candidate.school.id) && candidate.probability >= 0.97).sort((a, b) => b.probability - a.probability);
  const safeRegular = safePublic.filter((candidate) => !usedIds.has(candidate.school.id) && candidate.probability < 0.97);
  const safeFinalBase = buildCategoryCandidates(safeRegular, patternConfig.safe, diversificationGap);
  const safeFinal = safeStrong.length > 0
    ? [...safeFinalBase.filter((candidate) => candidate.school.id !== safeStrong[0].school.id).slice(0, Math.max(0, patternConfig.safe - 1)), safeStrong[0]]
    : safeFinalBase.slice(0, patternConfig.safe);

  const allSafeOrdered = sortCandidatePool(rankedCandidates.filter((candidate) => candidate.bucket === 'safe'), studentInfo, primarySchoolIds)
    .sort((a, b) => b.probability - a.probability || getBucketSortScore(b) - getBucketSortScore(a));

  const enforced = enforceSafetyTail(rushFinal, steadyFinal, safeFinal, allSafeOrdered, studentInfo, patternConfig);
  const finalSelected = sortByStrategyAndScore(
    [
      ...enforced.rushFinal.map((candidate) => ({ ...candidate, strategy: '冲一冲' as const })),
      ...enforced.steadyFinal.map((candidate) => ({ ...candidate, strategy: '稳一稳' as const })),
      ...enforced.safeFinal.map((candidate) => ({ ...candidate, strategy: '保一保' as const })),
    ],
    studentType
  ).slice(0, patternConfig.total);

  const selectedIds = new Set(finalSelected.map((candidate) => candidate.school.id));
  const denseFallback = dedupeRankedSchools([...densePublicTail, ...publicFloorBand, ...publicCeilingBand])
    .filter((candidate) => !selectedIds.has(candidate.school.id))
    .map((candidate) => ({
      ...candidate,
      strategy: getStrategyFromProbability(candidate.probability),
    } as FinalStrategyCandidate));

  let completedSelected = sortByStrategyAndScore(
    dedupeRankedSchools([...finalSelected, ...denseFallback]).slice(0, patternConfig.total),
    studentType
  );

  const strategyCounts = completedSelected.reduce<Record<VolunteerItem['strategy'], number>>((acc, candidate) => {
    acc[candidate.strategy] = (acc[candidate.strategy] || 0) + 1;
    return acc;
  }, { '冲一冲': 0, '稳一稳': 0, '保一保': 0 });
  const selectedMaxProbability = completedSelected.reduce((max, candidate) => Math.max(max, candidate.probability), 0);

  const shouldRebalanceLowScore =
    studentModel.muScore <= 480 &&
    strategyCounts['稳一稳'] + strategyCounts['保一保'] <= 1 &&
    selectedMaxProbability < 0.7;

  const shouldRebalanceHighScore =
    studentModel.muScore >= 590 &&
    strategyCounts['冲一冲'] === 0;

  if (shouldRebalanceLowScore) {
    completedSelected = sortByStrategyAndScore(
      rebalanceStrategiesByForecast(dedupeRankedSchools([...completedSelected, ...publicFloorBand]), studentType, patternConfig),
      studentType
    );
  }

  if (shouldRebalanceHighScore) {
    const highReachableBand = dedupeRankedSchools([
      ...publicCeilingBand,
      ...completedSelected,
      ...sortByForecastLineDesc(
        regularPublicCandidates.filter((candidate) => candidate.forecast.muLine >= studentModel.muScore - 25),
        studentType
      ).slice(0, patternConfig.total),
    ]).slice(0, patternConfig.total);

    completedSelected = sortByStrategyAndScore(
      rebalanceStrategiesByForecast(highReachableBand, studentType, patternConfig),
      studentType
    );
  }

  if (completedSelected.length < patternConfig.total) {
    const filledBand = dedupeRankedSchools([
      ...completedSelected,
      ...sortByForecastLineDesc([...publicCeilingBand, ...densePublicTail, ...publicFloorBand], studentType),
    ]).slice(0, patternConfig.total);

    completedSelected = sortByStrategyAndScore(
      rebalanceStrategiesByForecast(filledBand, studentType, patternConfig),
      studentType
    );
  }

  if (
    studentModel.muScore >= 490 &&
    completedSelected.length === patternConfig.total &&
    !hasTargetStrategyMix(completedSelected, patternConfig)
  ) {
    completedSelected = sortByStrategyAndScore(
      rebalanceStrategiesByForecast(completedSelected, studentType, patternConfig),
      studentType
    );
  }

  completedSelected = sortByStrategyAndScore(
    enforceDistrictPreference(
      completedSelected,
      regularPublicCandidates.filter((candidate) => isPreferredDistrictSchool(candidate.school, preferredDistricts)),
      studentInfo,
      primarySchoolIds
    ),
    studentType
  );

  const walkDayAdjustmentSuggestions = buildWalkDayAdjustmentSuggestions(completedSelected, studentInfo);
  const walkDaySuggestionIds = new Set(walkDayAdjustmentSuggestions.map((item) => item.schoolId));
  const simulationResult = simulateOrderedAdmissions(completedSelected, studentInfo);
  const items: VolunteerItem[] = completedSelected.map(({ school, strategy, probability, forecast, bucket }, idx) => {
    const schoolScore = getSchoolScore(school, studentType);
    const diff = score - schoolScore;
    return {
      order: idx + 1,
      school,
      strategy,
      probability: Math.round(probability * 100),
      bucket: bucket === 'rush' ? '冲' : bucket === 'steady' ? '稳' : probability >= 0.97 ? '强保' : '保',
      scoreDiff: diff,
      forecastLine: Math.round(forecast.muLine),
      lineSigma: forecast.sigmaLine,
      finalAdmissionProbability: Math.round((simulationResult.admissionBySchoolId[school.id] || 0) * 100),
      matchScore: calculateMatchScore(school, studentInfo),
      matchReasons: generateMatchReasons(school, studentInfo),
      walkDayEligible: school.type === '公办' && school.hasDay && studentInfo.walkDayAdjustmentPreference !== 'none' && studentInfo.accommodation !== 'boarding' && studentInfo.boardingNeed !== 'hard',
      walkDayRecommended: walkDaySuggestionIds.has(school.id),
    };
  });

  const publicCount = items.filter(i => i.school.type === '公办').length;
  const privateCount = items.filter(i => i.school.type === '民办').length;
  const probabilities = items.map(i => i.probability);
  const avgProbability = probabilities.length > 0 ? Math.round(probabilities.reduce((a, b) => a + b, 0) / probabilities.length) : 0;
  const summaryMaxProbability = probabilities.length > 0 ? Math.max(...probabilities) : 0;
  const summaryMinProbability = probabilities.length > 0 ? Math.min(...probabilities) : 0;

  return {
    items,
    studentInfo,
    generatedAt: new Date().toISOString(),
    summary: {
      totalSchools: items.length,
      publicCount,
      privateCount,
      avgProbability,
      maxProbability: summaryMaxProbability,
      minProbability: summaryMinProbability,
      firstBatchAdmissionProbability: Math.round(simulationResult.firstBatchAdmissionProbability * 100),
      missRisk: Math.round(simulationResult.missProbability * 100),
    },
    walkDayAdjustmentSuggestions,
  };
}
