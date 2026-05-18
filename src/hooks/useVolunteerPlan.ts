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
  let reputationScore = school.reputation?.compositeScore || 50;
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

export function useVolunteerPlan(studentInfo: StudentInfo | null): VolunteerPlan | null {
  return useMemo(() => {
    if (!studentInfo) return null;

    const { score, studentType, preferredDistricts, accommodation, preferredLevels, acceptPrivate, strategyStyle } = studentInfo;

    // 风格只影响冲高学校数量，不改变分数边界
    const maxRush = strategyStyle === 'conservative' ? 2 : strategyStyle === 'aggressive' ? 6 : 4;

    // ========== 1. 筛选学校 ==========
    let filtered = schools.filter(s => {
      if (!acceptPrivate && s.type === '民办') return false;
      if (accommodation === 'boarding' && !s.hasBoarding) return false;
      if (accommodation === 'day' && !s.hasDay) return false;
      return true;
    });

    if (preferredDistricts.length > 0) {
      filtered = filtered.filter(s => preferredDistricts.includes(s.district));
    }
    if (preferredLevels.length > 0) {
      filtered = filtered.filter(s => preferredLevels.includes(s.level));
    }

    // 如果学校太少或可录取学校太少，放宽区域/层次限制
    const safeCount = filtered.filter(s => getSchoolScore(s, studentType) <= score).length;
    if (filtered.length < 12 || safeCount < 4) {
      filtered = schools.filter(s => {
        if (!acceptPrivate && s.type === '民办') return false;
        if (accommodation === 'boarding' && !s.hasBoarding) return false;
        if (accommodation === 'day' && !s.hasDay) return false;
        return true;
      });
    }

    // ========== 2. 按分数线从高到低排序 ==========
    const sorted = [...filtered].sort((a, b) => {
      return getSchoolScore(b, studentType) - getSchoolScore(a, studentType);
    });

    // ========== 3. 选出12所 ==========
    const selected: School[] = [];
    const usedIds = new Set<string>();

    // 冲高：分数线 > 考生分数，按从高到低，最多 maxRush 所
    for (const s of sorted) {
      if (selected.length >= maxRush) break;
      if (getSchoolScore(s, studentType) > score) {
        selected.push(s);
        usedIds.add(s.id);
      }
    }

    // 可录取：分数线 <= 考生分数，按从高到低，选到第11所（留第12给强保底）
    for (const s of sorted) {
      if (selected.length >= 11) break;
      if (usedIds.has(s.id)) continue;
      if (getSchoolScore(s, studentType) <= score) {
        selected.push(s);
        usedIds.add(s.id);
      }
    }

    // 第12志愿：强保底，分数线 <= 考生分数 - 40（逐步降级到最低）
    let backup12: School | undefined;
    for (const threshold of [40, 30, 20, 10, 0]) {
      backup12 = sorted.find(s => {
        if (usedIds.has(s.id)) return false;
        return getSchoolScore(s, studentType) <= score - threshold;
      });
      if (backup12) break;
    }

    if (backup12) {
      selected.push(backup12);
      usedIds.add(backup12.id);
    }

    // 如果仍不足12所，从剩余学校补充
    for (const s of sorted) {
      if (selected.length >= 12) break;
      if (usedIds.has(s.id)) continue;
      selected.push(s);
      usedIds.add(s.id);
    }

    // ========== 4. 整体按分数线从高到低重新排序 ==========
    selected.sort((a, b) => getSchoolScore(b, studentType) - getSchoolScore(a, studentType));

    // ========== 5. 生成12个志愿 ==========
    const items: VolunteerItem[] = selected.slice(0, 12).map((school, idx) => {
      const schoolScore = getSchoolScore(school, studentType);
      const diff = score - schoolScore;

      // 标记策略标签（仅用于展示，不影响排序）
      let strategy: StrategyType;
      if (schoolScore > score) {
        strategy = '冲一冲';
      } else if (diff >= 10) {
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

    // ========== 6. 计算摘要 ==========
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
