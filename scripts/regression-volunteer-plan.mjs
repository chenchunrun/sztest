import { generateVolunteerPlan } from '../src/lib/volunteerPlanEngine.ts';

const baseStudent = {
  studentType: 'AC',
  bioGeoGrade: 'A',
  applicantTrack: 'general',
  preferredDistricts: [],
  accommodation: 'any',
  preferredLevels: [],
  acceptPrivate: true,
  strategyStyle: 'balanced',
  riskPreference: 'balanced',
  commuteTolerance: 'medium',
  strongSubjects: [],
};

const scores = [460, 470, 480, 500, 545];
const failures = [];

for (const score of scores) {
  const plan = generateVolunteerPlan({
    ...baseStudent,
    score,
  });

  if (!plan) {
    console.log(`\n=== ${score}分 ===`);
    console.log('未生成方案');
    continue;
  }

  const strategies = plan.items.reduce((acc, item) => {
    acc[item.strategy] = (acc[item.strategy] || 0) + 1;
    return acc;
  }, {});

  console.log(`\n=== ${score}分 ===`);
  console.log({
    total: plan.items.length,
    public: plan.summary.publicCount,
    private: plan.summary.privateCount,
    firstBatchAdmissionProbability: plan.summary.firstBatchAdmissionProbability,
    missRisk: plan.summary.missRisk,
    strategies,
  });

  console.log(
    plan.items.map((item) => ({
      order: item.order,
      strategy: item.strategy,
      school: item.school.name,
      type: item.school.type,
      line: item.forecastLine,
      sigma: item.lineSigma,
      single: item.probability,
      final: item.finalAdmissionProbability,
    }))
  );

  if (plan.items.some((item) => item.school.type !== '公办')) {
    failures.push(`${score}分: 出现非公办学校`);
  }

  if (plan.items.some((item) => (item.lineSigma || 0) > 25)) {
    failures.push(`${score}分: 出现异常 lineSigma > 25`);
  }

  if (score >= 500 && plan.items.length < 12) {
    failures.push(`${score}分: 500分以上未凑满12所公办`);
  }
}

if (failures.length > 0) {
  console.error('\n回归校验失败:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('\n回归校验通过');
}
