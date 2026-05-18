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

function determineStrategy(order: number): StrategyType {
  if (order <= 4) return '冲一冲';
  if (order <= 8) return '稳一稳';
  return '保一保';
}

function getStrategyScoreRange(
  effectiveScore: number,
  strategy: StrategyType,
  style: StudentInfo['strategyStyle']
): { min: number; max: number } {
  const styleOffset = style === 'conservative' ? -8 : style === 'aggressive' ? 5 : 0;
  const adjustedScore = effectiveScore + styleOffset;

  switch (strategy) {
    case '冲一冲':
      return { min: adjustedScore + 3, max: adjustedScore + 28 };
    case '稳一稳':
      return { min: adjustedScore - 10, max: adjustedScore + 8 };
    case '保一保':
      return { min: adjustedScore - 40, max: adjustedScore - 8 };
  }
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

  // 7. 性别匹配（5%）— 深圳高中绝大多数为男女同校，保持中性权重
  score += 100 * 0.05;

  return Math.round(score);
}

function generateMatchReasons(school: School, student: StudentInfo): string[] {
  const reasons: string[] = [];
  const schoolScore = getSchoolScore(school, student.studentType);
  const diff = student.score - schoolScore;

  // 分数理由
  if (diff >= 10) reasons.push('分数匹配度高');
  else if (diff >= -5) reasons.push('分数接近，冲刺有望');
  else reasons.push('分数保底，录取稳妥');

  // 地域理由
  if (student.preferredDistricts.includes(school.district)) {
    reasons.push(`位于意向区域${school.district}`);
  }

  // 学科理由
  if (student.strongSubjects && student.strongSubjects.length > 0 && school.wenli) {
    const hasScience = student.strongSubjects.some(s => ['数学', '物理', '化学'].includes(s));
    const hasLiberal = student.strongSubjects.some(s => ['语文', '英语', '历史', '地理'].includes(s));
    if (school.wenli === '偏理' && hasScience) reasons.push('偏理属性匹配理科优势');
    if (school.wenli === '偏文' && hasLiberal) reasons.push('偏文属性匹配文科优势');
    if (school.wenli === '均衡') reasons.push('文理均衡，适合全面发展');
  }

  // 特点理由
  if (school.traits?.includes('竞赛强校')) reasons.push('竞赛培养体系完善');
  if (school.traits?.includes('艺术特色')) reasons.push('艺术教育特色突出');
  if (school.traits?.includes('体育特色')) reasons.push('体育特长培养优势');
  if (school.traits?.includes('外语特色')) reasons.push('外语教学优势');
  if (school.traits?.includes('老牌名校')) reasons.push('历史悠久，底蕴深厚');
  if (school.traits?.includes('新兴学校')) reasons.push('新建学校，设施先进');

  // 口碑理由
  if (school.reputation) {
    if ((school.reputation.compositeScore || 0) >= 75) reasons.push('口碑优秀');
    if ((school.reputation.teacherQuality || 0) >= 80) reasons.push('师资力量强');
    if ((school.reputation.teachingQuality || 0) >= 80) reasons.push('教学质量高');
  }

  // 规模理由
  if (school.totalPlan2025 && school.totalPlan2025 >= 1000) reasons.push('招生规模大，资源丰富');

  return reasons.slice(0, 4);
}

export function useVolunteerPlan(studentInfo: StudentInfo | null): VolunteerPlan | null {
  return useMemo(() => {
    if (!studentInfo) return null;

    const { score, studentType, preferredDistricts, accommodation, preferredLevels, acceptPrivate, strategyStyle } = studentInfo;

    const styleOffset = strategyStyle === 'conservative' ? -8 : strategyStyle === 'aggressive' ? 5 : 0;
    const effectiveScore = score + styleOffset;

    // 筛选学校
    let filtered = schools.filter(s => {
      if (preferredDistricts.length > 0 && !preferredDistricts.includes(s.district)) return false;
      if (preferredLevels.length > 0 && !preferredLevels.includes(s.level)) return false;
      if (!acceptPrivate && s.type === '民办') return false;
      if (accommodation === 'boarding' && !s.hasBoarding) return false;
      if (accommodation === 'day' && !s.hasDay) return false;
      return true;
    });

    if (filtered.length < 12) {
      filtered = schools.filter(s => {
        if (!acceptPrivate && s.type === '民办') return false;
        if (accommodation === 'boarding' && !s.hasBoarding) return false;
        if (accommodation === 'day' && !s.hasDay) return false;
        return true;
      });
    }

    const sortedByScore = [...filtered].sort((a, b) => {
      const scoreA = getSchoolScore(a, studentType);
      const scoreB = getSchoolScore(b, studentType);
      return scoreB - scoreA;
    });

    const items: VolunteerItem[] = [];
    const usedSchoolIds = new Set<string>();

    for (let order = 1; order <= 12; order++) {
      const strategy = determineStrategy(order);
      const range = getStrategyScoreRange(effectiveScore, strategy, strategyStyle);

      let candidates = sortedByScore.filter(s => {
        if (usedSchoolIds.has(s.id)) return false;
        const schoolScore = getSchoolScore(s, studentType);
        return schoolScore >= range.min && schoolScore <= range.max;
      });

      if (candidates.length === 0) {
        candidates = sortedByScore.filter(s => {
          if (usedSchoolIds.has(s.id)) return false;
          const schoolScore = getSchoolScore(s, studentType);
          if (strategy === '冲一冲') return schoolScore > effectiveScore;
          if (strategy === '稳一稳') return schoolScore >= effectiveScore - 15 && schoolScore <= effectiveScore + 10;
          return schoolScore < effectiveScore;
        });
      }

      // Phase 8: 按匹配分数排序（在分数策略基础上叠加匹配度）
      candidates.sort((a, b) => {
        const scoreA = getSchoolScore(a, studentType);
        const scoreB = getSchoolScore(b, studentType);
        const probA = calculateProbability(effectiveScore, scoreA);
        const probB = calculateProbability(effectiveScore, scoreB);
        const matchA = calculateMatchScore(a, studentInfo);
        const matchB = calculateMatchScore(b, studentInfo);

        if (strategy === '冲一冲') {
          // 冲: 优先学校层次，其次匹配度
          if (a.level !== b.level) {
            const levelOrder = ['四大名校', '八大名校', '区属重点', '普通公办', '民办'];
            return levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level);
          }
          // 同层次内按匹配度排序
          return matchB - matchA;
        }
        if (strategy === '稳一稳') {
          // 稳: 概率接近65%优先，再考虑匹配度
          const probDiffA = Math.abs(probA - 65);
          const probDiffB = Math.abs(probB - 65);
          if (Math.abs(probDiffA - probDiffB) > 10) {
            return probDiffA - probDiffB;
          }
          return matchB - matchA;
        }
        // 保: 概率高且匹配度好
        if (Math.abs(probB - probA) > 10) return probB - probA;
        return matchB - matchA;
      });

      const selected = candidates[0];
      if (selected) {
        usedSchoolIds.add(selected.id);
        const schoolScore = getSchoolScore(selected, studentType);
        const probability = calculateProbability(effectiveScore, schoolScore);
        const matchScore = calculateMatchScore(selected, studentInfo);
        const matchReasons = generateMatchReasons(selected, studentInfo);
        items.push({
          order,
          school: selected,
          strategy,
          probability,
          scoreDiff: effectiveScore - schoolScore,
          matchScore,
          matchReasons,
        });
      }
    }

    // 填充未满的志愿
    let fallbackOrder = items.length + 1;
    for (let order = 1; order <= 12; order++) {
      if (items.find(i => i.order === order)) continue;

      const strategy = determineStrategy(order);
      const remaining = sortedByScore.filter(s => !usedSchoolIds.has(s.id));
      
      if (remaining.length > 0) {
        // Phase 8: 在剩余学校中选择匹配度最高的
        remaining.sort((a, b) => calculateMatchScore(b, studentInfo) - calculateMatchScore(a, studentInfo));
        const pick = strategy === '保一保' ? remaining[0] : remaining[Math.floor(remaining.length / 2)];
        usedSchoolIds.add(pick.id);
        const schoolScore = getSchoolScore(pick, studentType);
        const probability = calculateProbability(effectiveScore, schoolScore);
        const matchScore = calculateMatchScore(pick, studentInfo);
        const matchReasons = generateMatchReasons(pick, studentInfo);
        items.push({
          order: fallbackOrder++,
          school: pick,
          strategy,
          probability,
          scoreDiff: effectiveScore - schoolScore,
          matchScore,
          matchReasons,
        });
      }
    }

    items.sort((a, b) => a.order - b.order);

    while (items.length < 12) {
      const remaining = sortedByScore.filter(s => !usedSchoolIds.has(s.id));
      const pick = remaining[0] || sortedByScore[items.length % sortedByScore.length];
      if (pick) {
        usedSchoolIds.add(pick.id);
        const schoolScore = getSchoolScore(pick, studentType);
        const probability = calculateProbability(effectiveScore, schoolScore);
        const matchScore = calculateMatchScore(pick, studentInfo);
        const matchReasons = generateMatchReasons(pick, studentInfo);
        items.push({
          order: items.length + 1,
          school: pick,
          strategy: determineStrategy(items.length + 1),
          probability,
          scoreDiff: effectiveScore - schoolScore,
          matchScore,
          matchReasons,
        });
      } else {
        break;
      }
    }

    items.forEach((item, idx) => {
      item.order = idx + 1;
      item.strategy = determineStrategy(idx + 1);
    });

    const publicCount = items.filter(i => i.school.type === '公办').length;
    const privateCount = items.filter(i => i.school.type === '民办').length;
    const probabilities = items.map(i => i.probability);

    return {
      items: items.slice(0, 12),
      studentInfo,
      generatedAt: new Date().toISOString(),
      summary: {
        totalSchools: Math.min(items.length, 12),
        publicCount,
        privateCount,
        avgProbability: Math.round(probabilities.reduce((a, b) => a + b, 0) / probabilities.length),
        maxProbability: Math.max(...probabilities),
        minProbability: Math.min(...probabilities),
      },
    };
  }, [studentInfo]);
}
