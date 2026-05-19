import { useMemo } from 'react';
import type { StudentInfo, VolunteerItem, VolunteerPlan, StrategyType, School } from '@/types';
import { schools, getSchoolScore } from '@/data/schools';

function calculateProbability(score: number, schoolScore: number): number {
  const diff = score - schoolScore;
  if (diff >= 30) return 99;
  if (diff >= 20) return 95;
  if (diff >= 15) return 90;
  if (diff >= 10) return 80;
  if (diff >= 5) return 65;
  if (diff >= 0) return 50;
  if (diff >= -5) return 35;
  if (diff >= -10) return 25;
  if (diff >= -15) return 15;
  if (diff >= -20) return 10;
  return 5;
}

/** 学校层次优先级：高 → 低 */
const LEVEL_ORDER = ['四大名校', '八大名校', '区属重点', '普通公办', '民办'];

function sortByLevel(schoolList: School[]): School[] {
  return [...schoolList].sort((a, b) => {
    return LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level);
  });
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

/**
 * ========== 密度分布志愿算法 ==========
 * 
 * 核心思想：考生实际中考分数会围绕预估分波动（±10-20分是正常的）。
 * 因此志愿密度应该像正态分布/金字塔：
 * 
 *   冲高区  (分数线 > 预估+15)        : 1-2所  ← 密度低
 *   尝试区  (预估+5 ~ 预估+15)        : 2所    ← 密度中等
 *   核心上沿(预估 ~ 预估+5)           : 3所    ← 密度最大 ⭐
 *   核心下沿(预估-10 ~ 预估)          : 3所    ← 密度最大 ⭐
 *   稳妥区  (预估-25 ~ 预估-10)       : 2所    ← 密度中等
 *   兜底区  (分数线 < 预估-25)        : 1-2所  ← 密度低
 * 
 * 风格影响整体分布位置：
 *   保守 → 整体下移5分（更保守的区间）
 *   激进 → 整体上移5分（更激进的区间）
 *   均衡 → 以预估分为中心
 */

interface DensityZone {
  label: string;
  minScore: number;
  maxScore: number;
  targetCount: number;
  strategyLabel: StrategyType;
}

function buildDensityZones(adjustedScore: number): DensityZone[] {
  return [
    { label: '冲高',    minScore: adjustedScore + 15, maxScore: Infinity,           targetCount: 1, strategyLabel: '冲一冲' },
    { label: '尝试',    minScore: adjustedScore + 5,  maxScore: adjustedScore + 15, targetCount: 2, strategyLabel: '冲一冲' },
    { label: '核心上沿', minScore: adjustedScore,      maxScore: adjustedScore + 5,  targetCount: 3, strategyLabel: '稳一稳' },
    { label: '核心下沿', minScore: adjustedScore - 10, maxScore: adjustedScore,      targetCount: 3, strategyLabel: '稳一稳' },
    { label: '稳妥',    minScore: adjustedScore - 25, maxScore: adjustedScore - 10, targetCount: 2, strategyLabel: '保一保' },
    { label: '兜底',    minScore: -Infinity,          maxScore: adjustedScore - 25, targetCount: 1, strategyLabel: '保一保' },
  ];
}

export function useVolunteerPlan(studentInfo: StudentInfo | null): VolunteerPlan | null {
  return useMemo(() => {
    if (!studentInfo) return null;

    const { score, studentType, preferredDistricts, accommodation, preferredLevels, acceptPrivate, strategyStyle } = studentInfo;
    const hasDistrictPreference = preferredDistricts.length > 0;

    // 风格偏移：保守整体下移，激进整体上移
    const styleOffset = strategyStyle === 'conservative' ? -5 : strategyStyle === 'aggressive' ? 5 : 0;
    const adjustedScore = score + styleOffset;

    // ========== 1. 筛选学校 ==========
    const baseFiltered = schools.filter(s => {
      if (!acceptPrivate && s.type === '民办') return false;
      if (accommodation === 'boarding' && !s.hasBoarding) return false;
      if (accommodation === 'day' && !s.hasDay) return false;
      return true;
    });

    const districtFiltered = hasDistrictPreference
      ? baseFiltered.filter(s => preferredDistricts.includes(s.district))
      : baseFiltered;

    const primaryFiltered = preferredLevels.length > 0
      ? districtFiltered.filter(s => preferredLevels.includes(s.level))
      : districtFiltered;

    // 地域偏好优先保留；如果学校层次偏好导致样本过少，则先放宽层次，不直接放宽地域。
    const primarySafeCount = primaryFiltered.filter(s => getSchoolScore(s, studentType) <= score).length;
    const primaryPool = (primaryFiltered.length < 12 || primarySafeCount < 4) ? districtFiltered : primaryFiltered;

    // 仅在地域学校池仍不足时，才允许从全市补充。
    const secondaryDistrictPool = hasDistrictPreference
      ? baseFiltered.filter(s => !preferredDistricts.includes(s.district))
      : [];
    const secondaryPool = preferredLevels.length > 0
      ? secondaryDistrictPool.filter(s => preferredLevels.includes(s.level))
      : secondaryDistrictPool;

    // 按分数线从高到低排序（全局基准序）
    const primarySorted = [...primaryPool].sort((a, b) => {
      return getSchoolScore(b, studentType) - getSchoolScore(a, studentType);
    });
    const secondarySorted = [...secondaryPool].sort((a, b) => {
      return getSchoolScore(b, studentType) - getSchoolScore(a, studentType);
    });
    const sorted = [...primarySorted, ...secondarySorted];

    // ========== 2. 密度分布选校 ==========
    const zones = buildDensityZones(adjustedScore);
    const selected: School[] = [];
    const usedIds = new Set<string>();

    for (const zone of zones) {
      // 从该区间选校：先按层次排序，再选最好的
      const pool = sorted.filter(s => {
        if (usedIds.has(s.id)) return false;
        const sc = getSchoolScore(s, studentType);
        return sc >= zone.minScore && sc < zone.maxScore;
      });
      const picked = sortByLevel(pool).slice(0, zone.targetCount);
      for (const s of picked) {
        selected.push(s);
        usedIds.add(s.id);
      }
    }

    // 如果总数不足12，从剩余学校补充（按层次+匹配度）
    const remaining = sorted.filter(s => !usedIds.has(s.id));
    const fallback = [...remaining].sort((a, b) => {
      const levelDiff = LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level);
      if (levelDiff !== 0) return levelDiff;
      return calculateMatchScore(b, studentInfo) - calculateMatchScore(a, studentInfo);
    });
    for (const s of fallback) {
      if (selected.length >= 12) break;
      selected.push(s);
      usedIds.add(s.id);
    }

    // 如果超过12所，截取前12（按分数线从高到低，确保优先级正确）
    selected.sort((a, b) => getSchoolScore(b, studentType) - getSchoolScore(a, studentType));
    const finalSelected = selected.slice(0, 12);

    // ========== 3. 生成志愿项 ==========
    const items: VolunteerItem[] = finalSelected.map((school, idx) => {
      const schoolScore = getSchoolScore(school, studentType);
      const diff = score - schoolScore;

      // 根据实际分数线与原始分数的差距标记策略
      let strategy: StrategyType;
      if (schoolScore > score) {
        strategy = '冲一冲';
      } else if (diff >= 15) {
        strategy = '保一保';
      } else {
        strategy = '稳一稳';
      }

      return {
        order: idx + 1,
        school,
        strategy,
        probability: calculateProbability(score, schoolScore),
        scoreDiff: diff,
        matchScore: calculateMatchScore(school, studentInfo),
        matchReasons: generateMatchReasons(school, studentInfo),
      };
    });

    // ========== 4. 计算摘要 ==========
    const publicCount = items.filter(i => i.school.type === '公办').length;
    const privateCount = items.filter(i => i.school.type === '民办').length;
    const probabilities = items.map(i => i.probability);

    return {
      items,
      studentInfo,
      generatedAt: new Date().toISOString(),
      summary: {
        totalSchools: items.length,
        publicCount,
        privateCount,
        avgProbability: Math.round(probabilities.reduce((a, b) => a + b, 0) / probabilities.length),
        maxProbability: Math.max(...probabilities),
        minProbability: Math.min(...probabilities),
      },
    };
  }, [studentInfo]);
}
