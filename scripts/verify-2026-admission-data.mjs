import { schools } from '../src/data/schools.ts';
import {
  getAdmissionPlanCoverageSummary,
  getValidatedPublicHighSchoolPlans2026,
  getValidatedQuotaPlans2026,
  isValidPublicPlan2026,
  isValidQuotaPlan2026,
  publicHighSchoolPlans2026,
  quotaPlans2026,
} from '../src/data/admissionPlans2026Utils.ts';

const publicSchoolNames = schools.filter((school) => school.type === '公办').map((school) => school.name);
const coverage = getAdmissionPlanCoverageSummary(publicSchoolNames);
const validatedPublic = getValidatedPublicHighSchoolPlans2026();
const validatedQuota = getValidatedQuotaPlans2026();

const badPublicRows = publicHighSchoolPlans2026.filter((item) => !isValidPublicPlan2026(item));
const badQuotaRows = quotaPlans2026.filter((item) => !isValidQuotaPlan2026(item));

console.log({
  totalSchools: schools.length,
  publicSchools: publicSchoolNames.length,
  publicPlanRows: publicHighSchoolPlans2026.length,
  validatedPublicRows: validatedPublic.length,
  quotaRows: quotaPlans2026.length,
  validatedQuotaRows: validatedQuota.length,
  matchedPublic: coverage.matchedPublic,
  matchedQuota: coverage.matchedQuota,
  eligibleQuotaSchools: coverage.eligibleQuotaSchools,
  badPublicRows: badPublicRows.length,
  badQuotaRows: badQuotaRows.length,
});

const failures = [];
if (coverage.matchedPublic < publicSchoolNames.length) failures.push(`公办计划匹配覆盖未满: ${coverage.matchedPublic}/${publicSchoolNames.length}`);
if (coverage.matchedQuota < coverage.eligibleQuotaSchools) failures.push(`名额分配匹配覆盖未满: ${coverage.matchedQuota}/${coverage.eligibleQuotaSchools}`);
if (badPublicRows.length > 0) failures.push(`公办计划坏行存在: ${badPublicRows.length}`);
if (badQuotaRows.length > 0) failures.push(`名额分配坏行存在: ${badQuotaRows.length}`);

if (failures.length > 0) {
  console.error('\n2026招生计划数据校验失败:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('\n2026招生计划数据校验通过');
}
