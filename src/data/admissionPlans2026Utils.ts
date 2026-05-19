import { privateHighSchoolPlans2026, publicHighSchoolPlans2026, quotaPlans2026, vocationalPlans2026 } from './admissionPlans2026.ts';

type PublicPlan = (typeof publicHighSchoolPlans2026)[number];
type QuotaPlan = (typeof quotaPlans2026)[number];

const SCHOOL_NAME_ALIASES: Record<string, string> = {
  '深圳大学附属中学中心校区（深大附中中心校区）': '深圳大学附属中学（深大附中）',
  '深圳大学附属中学盐田校区（深大附中盐田校区）': '深圳大学附属中学盐田校区（深大附中盐田校区）',
  '深圳大学附属中学中心校区深大附中中心校区': '深圳大学附属中学（深大附中）',
  '深圳大学附属中学盐田校区深大附中盐田校区': '深圳大学附属中学盐田校区（深大附中盐田校区）',
  '深圳市第三高级中学（国内高考班）': '深圳市第三高级中学（国内高考班）',
  '深圳市第三高级中学（国家留学基金委自费出国留学班）': '深圳市第三高级中学（国家留学基金委自费出国留学班）',
  '深圳市第三高级中学国内高考班': '深圳市第三高级中学（国内高考班）',
  '深圳市第三高级中学国家留学基金委自费出国留学班': '深圳市第三高级中学（国家留学基金委自费出国留学班）',
  '深圳市第二高级中学宝安高中部': '深圳市第二高级中学宝安高中部',
  '深圳理工大学附属中学': '中国科学院深圳理工大学附属实验高级中学',
  '石岩外国语学校': '宝安中学（集团）石岩外国语学校',
  '布吉中学': '布吉高级中学',
  '育才一中': '育才中学蛇口校区',
  '深圳市龙岗区第二高级中学': '深圳市龙岗区第二高级中学',
  '龙岗区实验高级中学': '深圳市龙岗区实验高级中学',
  '南山外国语学校（集团）高级中学': '深圳市南山外国语学校（集团）高级中学',
  '北京师范大学南山附属学校': '北师大南山附属学校高中部',
  '中国科学院深圳理工大学附属实验高级中学（中科附高）': '中国科学院深圳理工大学附属实验高级中学',
  '红岭教育集团大鹏华侨中学': '深圳市红岭教育集团大鹏华侨中学',
  '翠园中学（爱国路校区）': '翠园中学',
  '翠园中学（东门北路校区）': '翠园中学',
  '香港中文大学深圳附属明德高级中学': '香港中文大学(深圳)附属明德高级中学',
  '西交利物浦大学基础教育集团外国语高级中学': '西交利物浦大学基础教育集团外国语高级中学',
  '深圳市第一职业技术学校（综合高中）': '深圳市第一职业技术学校（综合高中班）',
  '深圳市盐港中学（综合高中）': '深圳市盐港中学（综合高中班）',
  '深圳市行知职业技术学校（综合高中）': '深圳市行知职业技术学校（综合高中班）',
  '布吉高级中学': '深圳市龙岗区第二高级中学',
};

const NORMALIZED_NAME_ALIASES: Record<string, string> = {
  '深圳大学附属中学中心校区深大附中中心校区': '深圳大学附属中学深大附中',
  '深圳大学附属中学盐田校区深大附中盐田校区': '深圳大学附属中学盐田校区深大附中盐田校区',
  '香港中文大学深圳附属明德高级中学': '香港中文大学深圳附属明德高级中学',
};

export const ADMISSION_PLAN_2026_DATA_NOTES = {
  source: '深圳市 2026 年 4 份官方招生计划 PDF',
  runtimePolicy: '运行时仅使用通过校验的解析结果；特殊跨行条目已在生成脚本阶段修正。',
  coveragePolicy: '覆盖率按学校库中的公办普高与应参与名额分配的公办学校分别统计。',
} as const;

const QUOTA_EXCLUDED_SCHOOL_NAMES = new Set([
  '深圳市第一职业技术学校（综合高中）',
  '深圳市第一职业技术学校（综合高中班）',
  '深圳市盐港中学（综合高中）',
  '深圳市盐港中学（综合高中班）',
  '深圳市行知职业技术学校（综合高中）',
  '深圳市行知职业技术学校（综合高中班）',
]);

export function normalizeAdmissionPlanSchoolName(name: string) {
  const trimmed = name.trim();
  const aliased = SCHOOL_NAME_ALIASES[trimmed] || trimmed;
  const normalized = aliased
    .replace(/\s+/g, '')
    .replace(/[()（）]/g, '')
    .replace(/（中科附高）/g, '')
    .replace(/（深大附中中心校区）/g, '')
    .replace(/（深大附中盐田校区）/g, '')
    .replace(/深圳市/g, '深圳')
    .replace(/学校（集团）/g, '学校（集团）')
    .replace(/高中部/g, '高中部')
    .replace(/校区/g, '校区');
  return NORMALIZED_NAME_ALIASES[normalized] || normalized;
}

function matchByName<T extends { name: string }>(list: readonly T[], schoolName: string): T | undefined {
  const target = normalizeAdmissionPlanSchoolName(schoolName);
  return list.find((item) => normalizeAdmissionPlanSchoolName(item.name) === target);
}

export function getAdmissionPlanCoverageSummary(allSchoolNames: string[]) {
  const matchedPublic = allSchoolNames.filter((name) => getPublicPlan2026BySchoolName(name)).length;
  const eligibleQuotaSchoolNames = allSchoolNames.filter((name) => !QUOTA_EXCLUDED_SCHOOL_NAMES.has(name));
  const matchedQuota = eligibleQuotaSchoolNames.filter((name) => getQuotaPlan2026BySchoolName(name)).length;
  return {
    matchedPublic,
    matchedQuota,
    eligibleQuotaSchools: eligibleQuotaSchoolNames.length,
    totalPublicPlanEntries: publicHighSchoolPlans2026.length,
    totalQuotaPlanEntries: quotaPlans2026.length,
  };
}

export function isQuotaPlanExpectedForSchool(name: string) {
  return !QUOTA_EXCLUDED_SCHOOL_NAMES.has(name);
}

function hasCorruptedSchoolName(name: string) {
  return !name
    || name === '省一级'
    || name === '市一级'
    || name.startsWith('公办')
    || name.startsWith('民办')
    || /^\d+$/.test(name);
}

export function isValidPublicPlan2026(item: (typeof publicHighSchoolPlans2026)[number]) {
  return !hasCorruptedSchoolName(item.name) && item.totalPlan > 0 && item.totalPlan >= item.boardingPlan + item.dayPlan;
}

export function isValidQuotaPlan2026(item: (typeof quotaPlans2026)[number]) {
  return !hasCorruptedSchoolName(item.name) && (item.acQuota > 0 || item.dQuota > 0 || item.acdQuota > 0);
}

export function getValidatedPublicHighSchoolPlans2026() {
  const deduped = new Map<string, (typeof publicHighSchoolPlans2026)[number]>();
  for (const item of publicHighSchoolPlans2026.filter(isValidPublicPlan2026)) {
    deduped.set(normalizeAdmissionPlanSchoolName(item.name), item);
  }
  return [...deduped.values()];
}

export function getValidatedQuotaPlans2026() {
  return quotaPlans2026.filter(isValidQuotaPlan2026);
}

export function getPublicPlan2026BySchoolName(schoolName: string) {
  return matchByName(getValidatedPublicHighSchoolPlans2026(), schoolName);
}

export function getQuotaPlan2026BySchoolName(schoolName: string) {
  return matchByName(getValidatedQuotaPlans2026(), schoolName);
}

export {
  publicHighSchoolPlans2026,
  quotaPlans2026,
  privateHighSchoolPlans2026,
  vocationalPlans2026,
};

export type {
  PublicPlan,
  QuotaPlan,
};
