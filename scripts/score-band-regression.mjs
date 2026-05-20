import { generateVolunteerPlan } from '../src/lib/volunteerPlanEngine.ts';

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

const startScore = 430;
const endScore = 610;
const step = 10;
const failures = [];
const summaryRows = [];

const patternTargets = {
  '4-4-4': { '冲一冲': 4, '稳一稳': 4, '保一保': 4 },
  '3-6-3': { '冲一冲': 3, '稳一稳': 6, '保一保': 3 },
};

function runPatternRegression(volunteerPattern) {
  for (let score = startScore; score <= endScore; score += step) {
    const plan = generateVolunteerPlan({
      ...baseStudent,
      volunteerPattern,
      score,
    });

    if (!plan) {
      failures.push(`${volunteerPattern} ${score}分: 未生成方案`);
      continue;
    }

    const strategyCounts = plan.items.reduce((acc, item) => {
      acc[item.strategy] = (acc[item.strategy] || 0) + 1;
      return acc;
    }, {});

    const lineValues = plan.items.map((item) => item.forecastLine || 0);
    const probabilityValues = plan.items.map((item) => item.probability);
    const finalValues = plan.items.map((item) => item.finalAdmissionProbability || 0);
    const lineSpread = lineValues.length > 0 ? Math.max(...lineValues) - Math.min(...lineValues) : 0;

    const row = {
      pattern: volunteerPattern,
      score,
      total: plan.items.length,
      public: plan.summary.publicCount,
      private: plan.summary.privateCount,
      firstBatchAdmissionProbability: plan.summary.firstBatchAdmissionProbability ?? 0,
      missRisk: plan.summary.missRisk ?? 0,
      strategies: strategyCounts,
      lineSpread,
      maxLine: lineValues.length > 0 ? Math.max(...lineValues) : 0,
      minLine: lineValues.length > 0 ? Math.min(...lineValues) : 0,
      maxProbability: probabilityValues.length > 0 ? Math.max(...probabilityValues) : 0,
      minProbability: probabilityValues.length > 0 ? Math.min(...probabilityValues) : 0,
      maxFinalProbability: finalValues.length > 0 ? Math.max(...finalValues) : 0,
      top3: plan.items.slice(0, 3).map((item) => `${item.school.name}(${item.probability}%/${item.finalAdmissionProbability || 0}%)`),
      tail3: plan.items.slice(-3).map((item) => `${item.school.name}(${item.probability}%/${item.finalAdmissionProbability || 0}%)`),
    };

    summaryRows.push(row);
    console.log(`\n=== ${volunteerPattern} · ${score}分 ===`);
    console.log(row);

    if (plan.items.some((item) => item.school.type !== '公办')) {
      failures.push(`${volunteerPattern} ${score}分: 出现非公办学校`);
    }

    if (plan.items.some((item) => (item.lineSigma || 0) > 25)) {
      failures.push(`${volunteerPattern} ${score}分: 出现异常 lineSigma > 25`);
    }

    if (score >= 500 && plan.items.length < 12) {
      failures.push(`${volunteerPattern} ${score}分: 500分以上未凑满12所公办`);
    }

    if (score >= 490) {
      const targets = patternTargets[volunteerPattern];
      if (
        (strategyCounts['冲一冲'] || 0) !== targets['冲一冲'] ||
        (strategyCounts['稳一稳'] || 0) !== targets['稳一稳'] ||
        (strategyCounts['保一保'] || 0) !== targets['保一保']
      ) {
        failures.push(`${volunteerPattern} ${score}分: 490分以上未保持目标冲稳保结构`);
      }
    }

    if (score <= 480 && plan.items.length < 10) {
      failures.push(`${volunteerPattern} ${score}分: 低分段公办密度不足`);
    }
  }
}

runPatternRegression('4-4-4');
runPatternRegression('3-6-3');

console.log('\n=== 汇总表 ===');
console.table(
  summaryRows.map((row) => ({
    score: row.score,
    pattern: row.pattern,
    total: row.total,
    public: row.public,
    missRisk: row.missRisk,
    firstBatch: row.firstBatchAdmissionProbability,
    strategies: JSON.stringify(row.strategies),
    lineSpread: row.lineSpread,
  }))
);

if (failures.length > 0) {
  console.error('\n回归校验失败:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('\n回归校验通过');
}
