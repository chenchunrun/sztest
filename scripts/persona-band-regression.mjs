import { generateVolunteerPlan } from '../src/lib/volunteerPlanEngine.ts';

const scores = [430, 460, 490, 520, 550, 580, 610];

const baseStudent = {
  studentType: 'AC',
  bioGeoGrade: 'A',
  applicantTrack: 'general',
  preferredDistricts: [],
  accommodation: 'any',
  preferredLevels: [],
  acceptPrivate: false,
  strategyStyle: 'balanced',
  volunteerPattern: '4-4-4',
  riskPreference: 'balanced',
  commuteTolerance: 'medium',
  strongSubjects: [],
};

const personas = [
  {
    key: 'baseline',
    label: '基础均衡',
    overrides: {},
    validate: () => [],
  },
  {
    key: 'district_near',
    label: '地域优先就近',
    overrides: {
      homeDistrict: '福田',
      preferredDistricts: ['福田', '南山'],
      commuteTolerance: 'near',
    },
    validate: ({ plan, baselinePlan, score }) => {
      const failures = [];
      const preferredCount = plan.items.filter((item) => ['福田', '南山'].includes(item.school.district)).length;
      const baselinePreferred = baselinePlan.items.filter((item) => ['福田', '南山'].includes(item.school.district)).length;
      if (preferredCount < baselinePreferred) {
        failures.push(`${score}分: 意向区域学校数量少于基础均衡方案`);
      }
      if (score >= 520 && preferredCount === 0) {
        failures.push(`${score}分: 高分段地域优先方案未出现福田/南山学校`);
      }
      return failures;
    },
  },
  {
    key: 'boarding_hard',
    label: '强住宿需求',
    overrides: {
      accommodation: 'boarding',
      boardingNeed: 'hard',
    },
    validate: ({ plan, score }) => {
      const failures = [];
      if (plan.items.some((item) => !item.school.hasBoarding)) {
        failures.push(`${score}分: 出现无法住宿学校`);
      }
      return failures;
    },
  },
  {
    key: 'science_aggressive',
    label: '理科冲高',
    overrides: {
      strategyStyle: 'aggressive',
      riskPreference: 'aggressive',
      strongSubjects: ['数学', '物理', '化学'],
      preferredLevels: ['四大名校', '八大名校'],
    },
    validate: ({ plan, baselinePlan, score }) => {
      const failures = [];
      const avgLine = average(plan.items.map((item) => item.forecastLine || 0));
      const baselineAvgLine = average(baselinePlan.items.map((item) => item.forecastLine || 0));
      if (score >= 550 && avgLine < baselineAvgLine - 3) {
        failures.push(`${score}分: 冲高型方案平均预测线异常低于基础均衡`);
      }
      return failures;
    },
  },
  {
    key: 'conservative_elite',
    label: '稳妥名校偏好',
    overrides: {
      strategyStyle: 'conservative',
      riskPreference: 'conservative',
      preferredLevels: ['四大名校', '八大名校'],
    },
    validate: ({ plan, baselinePlan, score }) => {
      const failures = [];
      const topLevelCount = countTopLevel(plan);
      const baselineTopLevelCount = countTopLevel(baselinePlan);
      if (score >= 550 && topLevelCount < baselineTopLevelCount) {
        failures.push(`${score}分: 名校偏好方案高层级学校数量反而少于基础均衡`);
      }
      return failures;
    },
  },
  {
    key: 'subject_limited',
    label: '单科等级受限',
    overrides: {
      subjectGradeOk: false,
    },
    validate: ({ plan, score }) => {
      const failures = [];
      const invalid = plan.items.filter((item) => item.school.minSubjectRule || item.school.provinceLevel);
      if (invalid.length > 0) {
        failures.push(`${score}分: 出现单科等级受限后仍不可报学校 -> ${invalid.map((item) => item.school.name).join('、')}`);
      }
      return failures;
    },
  },
  {
    key: 'pattern_363',
    label: '冲3稳6保3',
    overrides: {
      volunteerPattern: '3-6-3',
    },
    validate: ({ plan, score }) => {
      const failures = [];
      if (score >= 490) {
        const counts = getStrategyCounts(plan);
        if ((counts['冲一冲'] || 0) !== 3 || (counts['稳一稳'] || 0) !== 6 || (counts['保一保'] || 0) !== 3) {
          failures.push(`${score}分: 未保持冲3稳6保3结构`);
        }
      }
      return failures;
    },
  },
];

const failures = [];
const rows = [];
const diversityChecks = [];

function average(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function countTopLevel(plan) {
  return plan.items.filter((item) => item.school.level === '四大名校' || item.school.level === '八大名校').length;
}

function getStrategyCounts(plan) {
  return plan.items.reduce((acc, item) => {
    acc[item.strategy] = (acc[item.strategy] || 0) + 1;
    return acc;
  }, {});
}

function validateCommon(plan, personaKey, score) {
  const localFailures = [];
  if (!plan || plan.items.length !== 12) {
    localFailures.push(`${personaKey} ${score}分: 志愿数量不是12`);
    return localFailures;
  }
  if (plan.items.some((item) => item.school.type !== '公办')) {
    localFailures.push(`${personaKey} ${score}分: 出现非公办学校`);
  }
  const nameSet = new Set(plan.items.map((item) => item.school.name));
  if (nameSet.size !== plan.items.length) {
    localFailures.push(`${personaKey} ${score}分: 出现重复学校`);
  }
  if (plan.items.some((item) => (item.lineSigma || 0) > 25)) {
    localFailures.push(`${personaKey} ${score}分: 出现异常 lineSigma > 25`);
  }

  const pattern = plan.studentInfo.volunteerPattern || '4-4-4';
  if (score >= 490) {
    const counts = getStrategyCounts(plan);
    const expected = pattern === '3-6-3'
      ? { '冲一冲': 3, '稳一稳': 6, '保一保': 3 }
      : { '冲一冲': 4, '稳一稳': 4, '保一保': 4 };
    if (
      (counts['冲一冲'] || 0) !== expected['冲一冲']
      || (counts['稳一稳'] || 0) !== expected['稳一稳']
      || (counts['保一保'] || 0) !== expected['保一保']
    ) {
      localFailures.push(`${personaKey} ${score}分: 未保持目标冲稳保结构`);
    }
  }

  for (const strategy of ['冲一冲', '稳一稳', '保一保']) {
    const subset = plan.items.filter((item) => item.strategy === strategy);
    for (let i = 1; i < subset.length; i += 1) {
      const prev = subset[i - 1].forecastLine ?? 0;
      const current = subset[i].forecastLine ?? 0;
      if (prev < current) {
        localFailures.push(`${personaKey} ${score}分: ${strategy} 内部分数线未按高到低排序`);
        break;
      }
    }
  }

  return localFailures;
}

for (const score of scores) {
  const baselinePlan = generateVolunteerPlan({
    ...baseStudent,
    score,
  });

  failures.push(...validateCommon(baselinePlan, 'baseline', score));

  for (const persona of personas) {
    const student = {
      ...baseStudent,
      ...persona.overrides,
      score,
    };

    const plan = generateVolunteerPlan(student);
    const commonFailures = validateCommon(plan, persona.key, score);
    failures.push(...commonFailures);

    if (commonFailures.length === 0) {
      failures.push(...persona.validate({
        plan,
        baselinePlan,
        score,
      }).map((message) => `${persona.key} ${message}`));
    }

    rows.push({
      persona: persona.label,
      score,
      pattern: plan.studentInfo.volunteerPattern || '4-4-4',
      top1: plan.items[0]?.school.name || '',
      top1Line: plan.items[0]?.forecastLine || 0,
      districtHits: plan.items.filter((item) => ['福田', '南山'].includes(item.school.district)).length,
      boardingOnly: plan.items.every((item) => item.school.hasBoarding) ? 'yes' : 'no',
      topLevelCount: countTopLevel(plan),
      missRisk: plan.summary.missRisk ?? 0,
      strategyCounts: JSON.stringify(getStrategyCounts(plan)),
    });
  }

  const aggressivePlan = generateVolunteerPlan({
    ...baseStudent,
    strategyStyle: 'aggressive',
    riskPreference: 'aggressive',
    strongSubjects: ['数学', '物理', '化学'],
    score,
  });
  const conservativePlan = generateVolunteerPlan({
    ...baseStudent,
    strategyStyle: 'conservative',
    riskPreference: 'conservative',
    score,
  });

  const sameTop3 = aggressivePlan.items.slice(0, 3).map((item) => item.school.name).join('|')
    === conservativePlan.items.slice(0, 3).map((item) => item.school.name).join('|');
  diversityChecks.push({
    score,
    sameTop3,
    aggressiveTop1: aggressivePlan.items[0]?.school.name || '',
    conservativeTop1: conservativePlan.items[0]?.school.name || '',
  });
}

console.log('\n=== 个性化场景回归摘要 ===');
console.table(rows);

console.log('\n=== 风格差异检查 ===');
console.table(diversityChecks);

const identicalCount = diversityChecks.filter((item) => item.sameTop3).length;
if (identicalCount === diversityChecks.length) {
  failures.push('激进/保守风格在全部测试分数段 top3 完全相同，个性参数可能失效');
}

if (failures.length > 0) {
  console.error('\n个性化回归失败:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('\n个性化场景回归通过');
}
