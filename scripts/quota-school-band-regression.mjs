import { generateVolunteerPlan } from '../src/lib/volunteerPlanEngine.ts';
import { getSchoolScore } from '../src/data/schools.ts';
import { getQuotaRecommendationContext } from '../src/lib/quotaRecommendation.ts';

const juniorSchoolGroups = {
  strong: [
    '深圳中学光明科学城学校',
    '深圳市第二实验学校初中部',
    '深圳市南山外国语学校（集团）文华学校',
  ],
  middle: [
    '光明区公明中学',
    '宝安区西乡实验学校',
    '龙岗区平湖中学',
  ],
  tail: [
    '光明区理创实验学校',
    '宝安区育才学校',
    '龙岗区同心实验学校',
  ],
};

const studentTypes = ['AC', 'D'];
const scores = [520, 540, 560, 580, 595, 610];
const failures = [];
const summaryRows = [];
let sawShenzhenMiddleForGongming595 = false;

const baseStudent = {
  bioGeoGrade: 'A',
  applicantTrack: 'general',
  preferredDistricts: [],
  accommodation: 'any',
  preferredLevels: [],
  acceptPrivate: false,
  strategyStyle: 'balanced',
  volunteerPattern: '4-4-4',
  strongSubjects: [],
  commuteTolerance: 'medium',
};

for (const studentType of studentTypes) {
  for (const [group, juniorSchools] of Object.entries(juniorSchoolGroups)) {
    for (const juniorSchool of juniorSchools) {
      for (const score of scores) {
        const student = {
          ...baseStudent,
          studentType,
          score,
          juniorSchool,
        };

        const plan = generateVolunteerPlan(student);
        if (!plan || plan.items.length === 0) {
          failures.push(`${studentType} ${group} ${juniorSchool} ${score}分: 正取方案未生成`);
          continue;
        }

        const benchmark = getSchoolScore(plan.items[0].school, studentType);
        const quotaContext = await getQuotaRecommendationContext(student, benchmark);

        const row = {
          studentType,
          group,
          juniorSchool,
          score,
          benchmark,
          status: quotaContext.status,
          recommendationSchool: quotaContext.status === 'ready' ? quotaContext.recommendation.school.name : '',
          probability: quotaContext.status === 'ready' ? quotaContext.recommendation.probability : '',
          regularGap: quotaContext.status === 'ready' ? quotaContext.recommendation.regularGap : '',
          quota: quotaContext.status === 'ready' ? quotaContext.recommendation.quota : '',
          indicatorLine: quotaContext.status === 'ready' ? quotaContext.recommendation.indicatorLine : '',
          competitors: quotaContext.status === 'ready' ? quotaContext.recommendation.expectedCompetitors : '',
        };

        summaryRows.push(row);

        if (
          studentType === 'AC'
          && juniorSchool === '光明区公明中学'
          && score === 595
          && quotaContext.status === 'ready'
          && quotaContext.recommendation.school.name === '深圳中学'
        ) {
          sawShenzhenMiddleForGongming595 = true;
        }

        if (quotaContext.status === 'ready') {
          const recommendationLine = getSchoolScore(quotaContext.recommendation.school, studentType);
          if (recommendationLine < benchmark) {
            failures.push(`${studentType} ${juniorSchool} ${score}分: 指标生学校低于正取第1志愿基准线`);
          }
          if (quotaContext.recommendation.regularGap > 20) {
            failures.push(`${studentType} ${juniorSchool} ${score}分: 指标生冲高超过20分`);
          }
          if (score < quotaContext.recommendation.indicatorLine) {
            failures.push(`${studentType} ${juniorSchool} ${score}分: 达不到指标控制线却返回了推荐`);
          }
        }
      }
    }
  }
}

console.log('\n=== 指标生专项样本 ===');
console.table(summaryRows);

const aggregateRows = [];
for (const studentType of studentTypes) {
  for (const group of Object.keys(juniorSchoolGroups)) {
    const subset = summaryRows.filter((row) => row.studentType === studentType && row.group === group);
    const readyRows = subset.filter((row) => row.status === 'ready');
    aggregateRows.push({
      studentType,
      group,
      cases: subset.length,
      ready: readyRows.length,
      noCandidate: subset.filter((row) => row.status === 'no_candidate').length,
      noQuota: subset.filter((row) => row.status === 'no_quota').length,
      avgProbability: readyRows.length > 0
        ? Math.round(readyRows.reduce((sum, row) => sum + Number(row.probability), 0) / readyRows.length)
        : 0,
      avgCompetitors: readyRows.length > 0
        ? Number((readyRows.reduce((sum, row) => sum + Number(row.competitors), 0) / readyRows.length).toFixed(1))
        : 0,
    });
  }
}

console.log('\n=== 分组汇总 ===');
console.table(aggregateRows);

if (!sawShenzhenMiddleForGongming595) {
  failures.push('AC 光明区公明中学 595分: 期望深圳中学进入指标生推荐，但未出现');
}

if (failures.length > 0) {
  console.error('\n指标生专项回归失败:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('\n指标生专项回归通过');
}
