export const PUBLIC_PLAN_ROW_REPLACEMENTS = [
  { serial: 23, name: '深圳市第三高级中学（国内高考班）', level: '省一级', nature: '公办', totalPlan: 695, boardingPlan: 650, dayPlan: 45, rawText: 'manual-fix-23-domestic' },
  { serial: 23, name: '深圳市第三高级中学（国家留学基金委自费出国留学班）', level: '省一级', nature: '公办', totalPlan: 376, boardingPlan: 376, dayPlan: 0, rawText: 'manual-fix-23-overseas' },
  { serial: 26, name: '深圳大学附属中学（深大附中）', level: '', nature: '公办', totalPlan: 642, boardingPlan: 600, dayPlan: 42, rawText: 'manual-fix-26' },
  { serial: 27, name: '深圳大学附属中学盐田校区（深大附中盐田校区）', level: '省一级', nature: '公办', totalPlan: 330, boardingPlan: 300, dayPlan: 30, rawText: 'manual-fix-27' },
  { serial: 46, name: '深圳市第一职业技术学校（综合高中班）', level: '', nature: '公办', totalPlan: 120, boardingPlan: 120, dayPlan: 0, rawText: 'manual-fix-46' },
  { serial: 51, name: '西交利物浦大学基础教育集团外国语高级中学', level: '省一级', nature: '公办', totalPlan: 749, boardingPlan: 700, dayPlan: 49, rawText: 'manual-fix-51' },
  { serial: 52, name: '香港中文大学(深圳)附属明德高级中学', level: '', nature: '公办', totalPlan: 660, boardingPlan: 600, dayPlan: 60, rawText: 'manual-fix-52' },
  { serial: 58, name: '深圳市行知职业技术学校（综合高中班）', level: '', nature: '公办', totalPlan: 165, boardingPlan: 165, dayPlan: 0, rawText: 'manual-fix-58' },
  { serial: 80, name: '布吉中学', level: '省一级', nature: '公办', totalPlan: 460, boardingPlan: 0, dayPlan: 460, rawText: 'manual-fix-80' },
  { serial: 98, name: '中国科学院深圳理工大学附属实验高级中学（中科附高）', level: '', nature: '公办', totalPlan: 770, boardingPlan: 700, dayPlan: 70, rawText: 'manual-fix-98' },
];

export const ADMISSION_PLAN_2026_SOURCE_NOTES = {
  pdfCount: 4,
  publicPlanStrategy: '优先使用 PDF 解析结果；复杂跨行条目在解析阶段按已知规则修正，运行时不再重复兜底。',
  quotaPlanStrategy: '名额分配表按原始行直接解析，仅保留通过校验的有效记录。',
  coverageScope: '公办覆盖率只统计学校库中的公办普高；名额分配覆盖率只统计应参与名额分配的公办学校。',
};
