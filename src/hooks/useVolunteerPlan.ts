import { useMemo } from 'react';
import type { StudentInfo, VolunteerItem, VolunteerPlan, School } from '@/types';
import { schools, getSchoolScore } from '@/data/schools';

const RUSH_COUNT = 4;
const STEADY_COUNT = 4;
const SAFE_COUNT = 4;
const TOTAL_TARGET_COUNT = RUSH_COUNT + STEADY_COUNT + SAFE_COUNT;

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

function getScoreElasticityFactor(score: number): number {
  if (score >= 575) return 0.72;
  if (score >= 560) return 0.82;
  if (score >= 540) return 0.9;
  if (score >= 500) return 1;
  return 1.1;
}

function getRushMaxGap(score: number): number {
  if (score >= 575) return 15;
  if (score >= 560) return 20;
  if (score >= 540) return 22;
  if (score >= 500) return 30;
  if (score >= 480) return 35;
  return 40;
}

function scaleWindow(base: number, factor: number, minValue: number): number {
  return Math.max(minValue, Math.round(base * factor));
}

function getStudentScoreSigma(score: number, strategyStyle: StudentInfo['strategyStyle']): number {
  const baseSigma = strategyStyle === 'conservative' ? 15 : strategyStyle === 'aggressive' ? 20 : 17;
  const factor = getScoreElasticityFactor(score);
  return Number((baseSigma * factor).toFixed(1));
}

function calculateScoreProbability(score: number, schoolScore: number, strategyStyle: StudentInfo['strategyStyle']): number {
  const studentSigma = getStudentScoreSigma(score, strategyStyle);
  const schoolLineSigma = 6;
  const combinedSigma = Math.sqrt(studentSigma ** 2 + schoolLineSigma ** 2);
  const lineDriftBias = -2;
  const meanDifference = score - (schoolScore + lineDriftBias);
  const probability = normalCdf(meanDifference, 0, combinedSigma) * 100;
  return Math.max(1, Math.min(99, Math.round(probability)));
}

function calculateProbability(
  score: number,
  schoolScore: number,
  strategyStyle: StudentInfo['strategyStyle'],
  bucket?: 'rush' | 'steady' | 'safe'
): number {
  const baseProbability = calculateScoreProbability(score, schoolScore, strategyStyle);

  if (!bucket) return baseProbability;

  const adjustment = bucket === 'rush' ? -4 : bucket === 'steady' ? 2 : 5;
  return Math.max(1, Math.min(99, baseProbability + adjustment));
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

  return /综合高中|留学基金委自费出国留学班|港澳|国际体系|出国方向|国际书院/.test(text);
}

function getSchoolLevelWeight(level: School['level']): number {
  if (level === '四大名校') return 100;
  if (level === '八大名校') return 88;
  if (level === '区属重点') return 75;
  if (level === '普通公办') return 60;
  return 48;
}

function calculateSchoolUtility(school: School, student: StudentInfo): number {
  const levelWeight = getSchoolLevelWeight(school.level);
  const schoolScore = getSchoolScore(school, student.studentType);
  const scoreWeight = schoolScore * 0.45;
  const matchWeight = calculateMatchScore(school, student) * 0.45;
  const reputationWeight = (school.reputation?.compositeScore || 50) * 0.1;
  return levelWeight + scoreWeight + matchWeight + reputationWeight;
}

// ========== Phase 8: 人校匹配评分系统 ==========

const OUTER_DISTRICTS = ['光明', '坪山', '盐田', '大鹏', '深汕'];

function calculateMatchScore(school: School, student: StudentInfo): number {
  let score = 0;
  const schoolScore = getSchoolScore(school, student.studentType);
  const diff = student.score - schoolScore;

  // 1. 分数匹配（50%）
  let baseScore = 0;
  if (diff >= 20) baseScore = 95;
  else if (diff >= 10) baseScore = 80;
  else if (diff >= 0) baseScore = 65;
  else if (diff >= -10) baseScore = 50;
  else if (diff >= -20) baseScore = 35;
  else baseScore = 20;
  score += baseScore * 0.5;

  // 2. 地域匹配（10%）
  let regionScore = 100;
  if (student.commuteTolerance === 'near') {
    if (!student.preferredDistricts.includes(school.district)) regionScore = 30;
  } else if (student.commuteTolerance === 'medium') {
    if (OUTER_DISTRICTS.includes(school.district)) regionScore = 60;
  }
  score += regionScore * 0.1;

  // 3. 学科匹配（10%）
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

  // 4. 特点匹配（10%）
  let traitScore = 50;
  if (student.preferNewSchool === false && school.traits?.includes('新兴学校')) traitScore -= 20;
  if (student.preferNewSchool === true && school.traits?.includes('新兴学校')) traitScore += 20;
  if (student.preferStrictManagement === true && school.traits?.includes('管理严格')) traitScore += 25;
  if (student.preferStrictManagement === false && school.traits?.includes('管理严格')) traitScore -= 15;
  if (student.preferArtSports === true && (school.traits?.includes('艺术特色') || school.traits?.includes('体育特色') || school.traits?.includes('竞赛强校'))) traitScore += 25;
  score += Math.max(0, Math.min(100, traitScore)) * 0.1;

  // 5. 口碑匹配（10%）
  const reputationScore = school.reputation?.compositeScore || 50;
  score += reputationScore * 0.1;

  // 6. 规模匹配（5%）
  let sizeScore = 50;
  if (school.totalPlan2025) {
    if (school.totalPlan2025 >= 1000) sizeScore = 80;
    else if (school.totalPlan2025 >= 600) sizeScore = 65;
    else if (school.totalPlan2025 >= 300) sizeScore = 50;
    else sizeScore = 40;
  }
  score += sizeScore * 0.05;

  // 7. 性别匹配（5%）
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

  if (student.preferredDistricts.includes(school.district)) {
    reasons.push(`位于意向区域${school.district}`);
  }

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

function dedupeSchools(schoolList: School[]): School[] {
  const seen = new Set<string>();
  return schoolList.filter((school) => {
    if (seen.has(school.id)) return false;
    seen.add(school.id);
    return true;
  });
}

function takeTopSchools(schoolList: School[], count: number): School[] {
  return schoolList.slice(0, count);
}

function sortBucketSchools(
  schoolList: School[],
  studentInfo: StudentInfo,
  primarySchoolIds: Set<string>,
  targetScore: number,
  mode: 'score_desc' | 'closest'
): School[] {
  const { studentType } = studentInfo;

  return [...schoolList].sort((a, b) => {
    const scoreA = getSchoolScore(a, studentType);
    const scoreB = getSchoolScore(b, studentType);

    const primaryDiff = Number(primarySchoolIds.has(b.id)) - Number(primarySchoolIds.has(a.id));
    if (primaryDiff !== 0) return primaryDiff;

    if (mode === 'closest') {
      const targetGapA = Math.abs(targetScore - scoreA);
      const targetGapB = Math.abs(targetScore - scoreB);
      if (targetGapA !== targetGapB) return targetGapA - targetGapB;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return calculateMatchScore(b, studentInfo) - calculateMatchScore(a, studentInfo);
    }

    if (scoreA !== scoreB) return scoreB - scoreA;

    return calculateMatchScore(b, studentInfo) - calculateMatchScore(a, studentInfo);
  });
}

function sortSelectedByScoreDesc(schoolList: School[], studentType: StudentInfo['studentType']): School[] {
  return [...schoolList].sort((a, b) => getSchoolScore(b, studentType) - getSchoolScore(a, studentType));
}

function rankBucketByExpectedValue(
  schoolList: School[],
  studentInfo: StudentInfo,
  primarySchoolIds: Set<string>,
  bucket: 'rush' | 'steady' | 'safe'
): School[] {
  const { score, studentType, strategyStyle } = studentInfo;

  return [...schoolList].sort((a, b) => {
    const probabilityA = calculateProbability(score, getSchoolScore(a, studentType), strategyStyle, bucket);
    const probabilityB = calculateProbability(score, getSchoolScore(b, studentType), strategyStyle, bucket);
    const expectedValueA = probabilityA * calculateSchoolUtility(a, studentInfo);
    const expectedValueB = probabilityB * calculateSchoolUtility(b, studentInfo);
    if (expectedValueA !== expectedValueB) return expectedValueB - expectedValueA;

    const primaryDiff = Number(primarySchoolIds.has(b.id)) - Number(primarySchoolIds.has(a.id));
    if (primaryDiff !== 0) return primaryDiff;

    return getSchoolScore(b, studentType) - getSchoolScore(a, studentType);
  });
}

export function useVolunteerPlan(studentInfo: StudentInfo | null): VolunteerPlan | null {
  return useMemo(() => {
    if (!studentInfo) return null;

    const { score, studentType, preferredDistricts, accommodation, preferredLevels, acceptPrivate, strategyStyle, applicantTrack } = studentInfo;
    const hasDistrictPreference = preferredDistricts.length > 0;
    const isArtApplicant = applicantTrack === 'art';

    // 风格偏移：保守整体下移，激进整体上移
    const styleOffset = strategyStyle === 'conservative' ? -5 : strategyStyle === 'aggressive' ? 5 : 0;
    const adjustedScore = score + styleOffset;
    const elasticityFactor = getScoreElasticityFactor(score);
    const rushMaxGap = getRushMaxGap(score);
    const steadyWindowBelow = scaleWindow(
      strategyStyle === 'aggressive' ? 15 : strategyStyle === 'conservative' ? 12 : 15,
      elasticityFactor,
      8
    );
    const safeMaxGap = scaleWindow(
      strategyStyle === 'aggressive' ? 65 : strategyStyle === 'conservative' ? 55 : 60,
      elasticityFactor,
      35
    );

    // ========== 1. 筛选学校 ==========
    const baseFiltered = schools.filter(s => {
      if (!acceptPrivate && s.type === '民办') return false;
      if (accommodation === 'boarding' && !s.hasBoarding) return false;
      if (accommodation === 'day' && !s.hasDay) return false;
      if (!isArtApplicant && (isArtTrackSchool(s) || isSpecialProgramSchool(s))) return false;
      if (isArtApplicant && isSpecialProgramSchool(s) && !isArtTrackSchool(s)) return false;
      return true;
    });

    const districtFiltered = hasDistrictPreference
      ? baseFiltered.filter(s => preferredDistricts.includes(s.district))
      : baseFiltered;

    const primaryFiltered = preferredLevels.length > 0
      ? districtFiltered.filter(s => preferredLevels.includes(s.level))
      : districtFiltered;

    // 地域偏好优先保留；如果学校层次偏好导致样本过少，则先放宽层次，不直接放宽地域。
    const primaryPool = primaryFiltered.length < 12 ? districtFiltered : primaryFiltered;

    // 仅在地域学校池仍不足时，才允许从全市补充。
    const secondaryDistrictPool = hasDistrictPreference
      ? baseFiltered.filter(s => !preferredDistricts.includes(s.district))
      : [];
    const secondaryPool = preferredLevels.length > 0
      ? secondaryDistrictPool.filter(s => preferredLevels.includes(s.level))
      : secondaryDistrictPool;

    const primarySchoolIds = new Set(primaryPool.map(s => s.id));
    const combinedPool = dedupeSchools([...primaryPool, ...secondaryPool]);

    const rushCandidates = sortBucketSchools(
      combinedPool.filter(s => {
        const schoolScore = getSchoolScore(s, studentType);
        return schoolScore > score && schoolScore <= score + rushMaxGap;
      }),
      studentInfo,
      primarySchoolIds,
      adjustedScore,
      'score_desc'
    );
    const rushRanked = rankBucketByExpectedValue(rushCandidates, studentInfo, primarySchoolIds, 'rush');

    const pickedRush = sortSelectedByScoreDesc(takeTopSchools(rushRanked, RUSH_COUNT), studentType);
    const usedIds = new Set(pickedRush.map(s => s.id));

    const steadyCandidates = sortBucketSchools(
      combinedPool.filter(s => {
        const schoolScore = getSchoolScore(s, studentType);
        return !usedIds.has(s.id) && schoolScore <= score && schoolScore >= score - steadyWindowBelow;
      }),
      studentInfo,
      primarySchoolIds,
      adjustedScore,
      'closest'
    );
    const steadyRanked = rankBucketByExpectedValue(steadyCandidates, studentInfo, primarySchoolIds, 'steady');
    const pickedSteady = sortSelectedByScoreDesc(
      takeTopSchools(steadyRanked, STEADY_COUNT),
      studentType
    );
    pickedSteady.forEach(s => usedIds.add(s.id));

    const safeCandidates = sortBucketSchools(
      combinedPool.filter(s => {
        const schoolScore = getSchoolScore(s, studentType);
        return !usedIds.has(s.id) && schoolScore < score - steadyWindowBelow && schoolScore >= score - safeMaxGap;
      }),
      studentInfo,
      primarySchoolIds,
      adjustedScore,
      'score_desc'
    );
    const safeRanked = rankBucketByExpectedValue(safeCandidates, studentInfo, primarySchoolIds, 'safe');
    const pickedSafe = sortSelectedByScoreDesc(takeTopSchools(safeRanked, SAFE_COUNT), studentType);
    pickedSafe.forEach(s => usedIds.add(s.id));

    const rushFinal = [...pickedRush];
    const steadyFinal = [...pickedSteady];
    const safeFinal = [...pickedSafe];

    const finalSelected = [...rushFinal, ...steadyFinal, ...safeFinal].slice(0, TOTAL_TARGET_COUNT);

    // ========== 3. 生成志愿项 ==========
    const items: VolunteerItem[] = finalSelected.map((school, idx) => {
      const schoolScore = getSchoolScore(school, studentType);
      const diff = score - schoolScore;

      return {
        order: idx + 1,
        school,
        strategy: idx < RUSH_COUNT ? '冲一冲' : idx < RUSH_COUNT + STEADY_COUNT ? '稳一稳' : '保一保',
        probability: calculateProbability(
          score,
          schoolScore,
          strategyStyle,
          idx < RUSH_COUNT ? 'rush' : idx < RUSH_COUNT + STEADY_COUNT ? 'steady' : 'safe'
        ),
        scoreDiff: diff,
        matchScore: calculateMatchScore(school, studentInfo),
        matchReasons: generateMatchReasons(school, studentInfo),
      };
    });

    // ========== 4. 计算摘要 ==========
    const publicCount = items.filter(i => i.school.type === '公办').length;
    const privateCount = items.filter(i => i.school.type === '民办').length;
    const probabilities = items.map(i => i.probability);
    const avgProbability = probabilities.length > 0
      ? Math.round(probabilities.reduce((a, b) => a + b, 0) / probabilities.length)
      : 0;
    const maxProbability = probabilities.length > 0 ? Math.max(...probabilities) : 0;
    const minProbability = probabilities.length > 0 ? Math.min(...probabilities) : 0;

    return {
      items,
      studentInfo,
      generatedAt: new Date().toISOString(),
      summary: {
        totalSchools: items.length,
        publicCount,
        privateCount,
        avgProbability,
        maxProbability,
        minProbability,
      },
    };
  }, [studentInfo]);
}
