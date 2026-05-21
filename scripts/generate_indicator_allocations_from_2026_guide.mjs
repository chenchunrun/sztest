import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { schools } from '../src/data/schools.ts';

const ROOT_DIR = process.cwd();
const GUIDE_PDF_PATH = path.join(ROOT_DIR, '2026录取计划', '2026年深圳市高中阶段学校考生报考指导手册.pdf');
const GUIDE_XML_PATH = path.join('/tmp', 'guide-2026-quota.xml');
const INDEX_OUTPUT_PATH = path.join(ROOT_DIR, 'src/data/indicatorAllocationsIndex.ts');
const NAMES_OUTPUT_PATH = path.join(ROOT_DIR, 'src/data/juniorSchoolNames.ts');
const DISTRICT_OUTPUT_DIR = path.join(ROOT_DIR, 'src/data/indicator-allocations');

const DISTRICT_SLUG_MAP = {
  光明区: 'guangming',
  南山区: 'nanshan',
  坪山区: 'pingshan',
  大鹏新区: 'dapeng',
  宝安区: 'baoan',
  盐田区: 'yantian',
  福田区: 'futian',
  罗湖区: 'luohu',
  龙华区: 'longhua',
  龙岗区: 'longgang',
};

const DISTRICT_ORDER = Object.keys(DISTRICT_SLUG_MAP);
const CATEGORY_SUFFIXES = ['（一）', '（二）', '（三）', '(一)', '(二)', '(三)'];
const NAME_MAP = {
  深中: '深圳中学',
  深圳中学: '深圳中学',
  深圳中学科技高中: '深圳中学科技高中',
  深圳中学数理高中: '深圳中学数理高中',
  深圳中学实验高中: '深圳中学实验高中',
  '深圳实验学校（高中部）': '深圳实验学校（高中部）',
  '深圳实验学校（光明高中部）': '深圳实验学校光明高中部',
  深圳实验学校明理高中: '深圳实验学校明理高中',
  深圳实验学校崇文高中: '深圳实验学校崇文高中',
  深圳实验学校卓越高中: '深圳实验学校卓越高中',
  深圳实验学校至臻高中: '深圳实验学校至臻高中',
  深圳外国语学校: '深圳外国语学校',
  深圳外国语学校龙华高中部: '深圳外国语学校龙华高中部',
  深圳外国语学校致远高中: '深圳外国语学校致远高中',
  深圳外国语学校弘知高中: '深圳外国语学校弘知高中',
  深圳外国语学校博雅高中: '深圳外国语学校博雅高中',
  深圳外国语学校理工高中: '深圳外国语学校理工高中',
  深圳市高级中学中心校区: '深圳市高级中学中心校区',
  深圳市高级中学东校区: '深圳市高级中学东校区',
  深圳市高级中学创新高中: '深圳市高级中学创新高中',
  深圳市高级中学理慧高中: '深圳市高级中学理慧高中',
  深圳市高级中学有为高中: '深圳市高级中学有为高中',
  深圳市高级中学文博高中: '深圳市高级中学文博高中',
  红岭中学: '红岭中学',
  育才中学: '育才中学',
  育才一中: '育才中学蛇口校区',
  '宝安中学（集团）高中部': '宝安中学（集团）高中部',
  深圳大学附属中学中心校区: '深圳大学附属中学（深大附中）',
  '深圳大学附属中学中心校区（深大附中中心校区）': '深圳大学附属中学（深大附中）',
  深圳大学附属中学盐田校区: '深圳大学附属中学盐田校区（深大附中盐田校区）',
  '深圳大学附属中学盐田校区（深大附中盐田校区）': '深圳大学附属中学盐田校区（深大附中盐田校区）',
  北京师范大学南山附属学校: '北师大南山附属学校高中部',
  北师大南山附属学校: '北师大南山附属学校高中部',
  深圳科学高中: '深圳科学高中',
  '南山外国语学校（集团）高级中学': '深圳市南山外国语学校（集团）高级中学',
  深圳市第二高级中学: '深圳市第二高级中学',
  翠园中学: '翠园中学',
  龙城高级中学: '龙城高级中学',
  南方科技大学附属中学: '南方科技大学附属中学',
  龙华高级中学: '龙华高级中学',
  人大附中深圳学校: '人大附中深圳学校',
  深圳市第二实验学校: '深圳市第二实验学校',
  广东实验中学深圳学校: '广东实验中学深圳学校',
  '新安中学（集团）高中部': '新安中学（集团）高中部',
  深圳大学附属实验中学: '深圳大学附属实验中学',
  深圳科学高中龙岗分校: '深圳科学高中龙岗分校',
  华中师范大学龙岗附属中学: '华中师范大学龙岗附属中学',
  深圳北理莫斯科大学附属实验中学: '深圳北理莫斯科大学附属实验中学',
  中国科学院深圳理工大学附属实验高级中学: '中国科学院深圳理工大学附属实验高级中学',
  '中国科学院深圳理工大学附属实验高级中学（中科附高）': '中国科学院深圳理工大学附属实验高级中学',
  深圳理工大学附属中学: '中国科学院深圳理工大学附属实验高级中学',
  南头中学: '南头中学',
  东北师范大学附属中学深圳学校: '东北师范大学附属中学深圳学校',
  盐田高级中学: '盐田高级中学',
  深圳市红山中学: '深圳市红山中学',
  深圳市格致中学: '深圳市格致中学',
  华侨城高级中学: '华侨城高级中学',
  龙岗区实验高级中学: '深圳市龙岗区实验高级中学',
  '香港中文大学（深圳）附属明德高级中学': '香港中文大学(深圳)附属明德高级中学',
  罗湖外语学校: '罗湖外语学校',
  松岗中学: '松岗中学',
  福田中学: '福田中学',
  宝安第一外国语学校: '宝安第一外国语学校',
  深圳技术大学附属中学: '深圳技术大学附属中学',
  深圳第二外国语学校: '深圳第二外国语学校',
  深圳市龙津中学: '深圳市龙津中学',
  西交利物浦大学基础教育集团外国语高级中学: '西交利物浦大学基础教育集团外国语高级中学',
  深圳市第三高级中学: '深圳市第三高级中学（国内高考班）',
  '深圳市第三高级中学（国内高考班）': '深圳市第三高级中学（国内高考班）',
  罗湖高级中学: '罗湖高级中学',
  深圳市燕川中学: '深圳市燕川中学',
  红岭教育集团大鹏华侨中学: '深圳市红岭教育集团大鹏华侨中学',
  平冈中学: '平冈中学',
  西乡中学: '西乡中学',
  光明区高级中学: '光明区高级中学',
  光明中学: '光明中学',
  深圳市龙华外国语高级中学: '深圳市龙华外国语高级中学',
  深圳市福海中学: '深圳市福海中学',
  深圳市第七高级中学: '深圳市第七高级中学',
  深圳实验学校: '深圳实验学校（高中部）',
  深圳启元中学: '深圳启元中学',
  深圳益新中学: '深圳益新中学',
  '深圳市第一职业技术学校（综合高中）': '深圳市第一职业技术学校（综合高中班）',
  '深圳市盐港中学（综合高中）': '深圳市盐港中学（综合高中班）',
  '深圳市行知职业技术学校（综合高中）': '深圳市行知职业技术学校（综合高中班）',
  深圳市致理中学: '深圳市致理中学',
  北京大学附属中学深圳学校: '北京大学附属中学深圳学校',
  观澜中学: '观澜中学',
  坪山高级中学: '坪山高级中学',
  深圳市龙华科技实验高级中学: '深圳市龙华科技实验高级中学',
  深圳市聚龙科学中学: '深圳市聚龙科学中学',
  石岩外国语学校: '宝安中学（集团）石岩外国语学校',
  横岗高级中学: '横岗高级中学',
  龙华中学: '龙华中学',
  深圳市第二实验学校明远高中: '深圳市第二实验学校明远高中',
  布吉中学: '布吉高级中学',
  平湖外国语学校: '平湖外国语学校',
  深圳市第二高级中学深汕实验学校: '深圳市第二高级中学深汕实验学校',
  深圳市艺术高中: '深圳市艺术高中',
  深圳市美术学校: '深圳市美术学校',
  '深圳市第三高级中学（国家留学基金委自费出国留学班）': '深圳市第三高级中学（国家留学基金委自费出国留学班）',
  梅沙高中: '梅沙高中',
};

const SPECIAL_SCHOOL_NAME_MAP = {
  '龙岗区百外世纪初级中学': '百外世纪初级中学',
  '宝安区航星学校': '航星学校',
  '宝安区和一学校': '和一学校',
  '龙华区龙澜学校': '龙澜学校',
};

function normalizeKey(value) {
  return value.toLowerCase().replace(/[\s()（）\-]/g, '');
}

function cleanupText(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripCategorySuffix(name) {
  let value = name.trim();
  CATEGORY_SUFFIXES.forEach((suffix) => {
    if (value.endsWith(suffix)) value = value.slice(0, -suffix.length).trim();
  });
  return value;
}

function ensureGuideXml() {
  execFileSync('pdftohtml', ['-xml', GUIDE_PDF_PATH, GUIDE_XML_PATH], { stdio: 'ignore' });
  return fs.readFileSync(GUIDE_XML_PATH, 'utf8');
}

function parsePages(xmlContent) {
  const pages = [];
  const pageRegex = /<page number="(\d+)"[^>]*>([\s\S]*?)<\/page>/g;
  let match;
  while ((match = pageRegex.exec(xmlContent)) !== null) {
    const [, pageNumber, body] = match;
    const items = [...body.matchAll(/<text top="(\d+)" left="(\d+)" width="(\d+)" height="(\d+)" font="(\d+)">([\s\S]*?)<\/text>/g)]
      .map(([, top, left, width, height, font, text]) => ({
        top: Number(top),
        left: Number(left),
        width: Number(width),
        height: Number(height),
        font: Number(font),
        text: cleanupText(text.replace(/<[^>]+>/g, '')),
      }))
      .filter((item) => item.text);
    pages.push({ pageNumber: Number(pageNumber), items });
  }
  return pages;
}

function getCategoryFromPage(items) {
  const pageText = items.map((item) => item.text).join(' ');
  if (pageText.includes('名额分配招生计划分配情况表（1）AC 类')) return 'ac';
  if (pageText.includes('名额分配招生计划分配情况表（2）D 类')) return 'd';
  if (pageText.includes('名额分配招生计划分配情况表（3）ACD 类')) return 'acd';
  return null;
}

function isNumericRow(text) {
  return /^\d+(?: \d+)+$/.test(text);
}

function isDistrictLabel(text) {
  return DISTRICT_ORDER.includes(text);
}

const COMBINED_ROW_PATTERN = /^(.+?(?:学校|中学|书院|初中部))\s+(\d+(?:\s+\d+)+)$/;

function extractCombinedRow(text) {
  const match = text.match(COMBINED_ROW_PATTERN);
  if (!match) return null;
  return {
    juniorSchool: match[1].trim(),
    quotas: match[2].split(/\s+/).map((part) => Number(part)).filter((part) => Number.isFinite(part)),
  };
}

function inferDistrictFromJuniorSchoolName(name) {
  if (name.includes('大鹏')) return '大鹏新区';
  if (name.includes('光明')) return '光明区';
  if (name.includes('龙华')) return '龙华区';
  if (name.includes('龙岗')) return '龙岗区';
  if (name.includes('宝安')) return '宝安区';
  if (name.includes('南山')) return '南山区';
  if (name.includes('福田')) return '福田区';
  if (name.includes('罗湖')) return '罗湖区';
  if (name.includes('盐田')) return '盐田区';
  if (name.includes('坪山')) return '坪山区';
  return null;
}

function getReferenceSchoolNames() {
  return schools.map((school) => school.name);
}

function matchSchoolName(rawName, referenceNames) {
  const stripped = stripCategorySuffix(rawName)
    .replace(/\s+/g, '')
    .replace(/区（深大附中盐田校区）$/, '区（深大附中盐田校区）')
    .replace(/（深大附中中心校区）$/, '（深大附中中心校区）')
    .trim();

  if (NAME_MAP[stripped]) return NAME_MAP[stripped];

  const normalized = normalizeKey(stripped);
  const exact = referenceNames.find((name) => normalizeKey(name) === normalized);
  if (exact) return exact;

  const fuzzy = referenceNames.find((name) => normalizeKey(name).includes(normalized) || normalized.includes(normalizeKey(name)));
  return fuzzy || stripped;
}

function buildHeaderColumns(items, referenceNames) {
  const headerItems = items
    .filter((item) => item.left >= 261 && item.top <= 280 && !isNumericRow(item.text))
    .filter((item) => !['高中学校名称', '分配名额', '县区名称', '初中学校名称'].includes(item.text))
    .filter((item) => !item.text.includes('名额分配招生计划分配情况表'));

  const grouped = new Map();
  headerItems.forEach((item) => {
    const key = item.left;
    const current = grouped.get(key) || [];
    current.push(item);
    grouped.set(key, current);
  });

  return [...grouped.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([left, parts]) => {
      const rawName = parts
        .sort((a, b) => a.top - b.top)
        .map((item) => item.text)
        .join('')
        .replace(/\s+/g, '');
      return {
        left,
        rawName,
        schoolName: matchSchoolName(rawName, referenceNames),
      };
    })
    .filter((item) => item.rawName && item.rawName !== '（一）' && item.rawName !== '（二）' && item.rawName !== '（三）');
}

function buildRowsForPage(items, columns, inheritedDistrict = null) {
  const leftColumnItems = items.filter((item) => item.left >= 48 && item.left < 220 && item.top > 280 && !isDistrictLabel(item.text));
  const rowNameItems = leftColumnItems.filter((item) => !extractCombinedRow(item.text));
  const combinedRowItems = leftColumnItems.filter((item) => extractCombinedRow(item.text));
  const numericItems = items.filter((item) => item.left >= 259 && item.top > 280 && isNumericRow(item.text));
  const districtLabels = items.filter((item) => item.left <= 50 && isDistrictLabel(item.text)).sort((a, b) => a.top - b.top);

  const rows = [];
  let currentDistrict = inheritedDistrict;
  let districtIndex = 0;

  for (const numeric of numericItems.sort((a, b) => a.top - b.top)) {
    while (districtIndex < districtLabels.length && districtLabels[districtIndex].top <= numeric.top) {
      currentDistrict = districtLabels[districtIndex].text;
      districtIndex += 1;
    }
    const rowName = rowNameItems.find((item) => item.top === numeric.top)?.text;
    if (!rowName) continue;
    currentDistrict = inferDistrictFromJuniorSchoolName(rowName) || currentDistrict;
    if (!currentDistrict) continue;
    const quotas = numeric.text.split(' ').map((part) => Number(part)).filter((part) => Number.isFinite(part));
    if (quotas.length !== columns.length) continue;
    rows.push({
      district: currentDistrict,
      juniorSchool: SPECIAL_SCHOOL_NAME_MAP[rowName] || rowName,
      quotas,
    });
  }

  for (const combined of combinedRowItems.sort((a, b) => a.top - b.top)) {
    while (districtIndex < districtLabels.length && districtLabels[districtIndex].top <= combined.top) {
      currentDistrict = districtLabels[districtIndex].text;
      districtIndex += 1;
    }

    const parsed = extractCombinedRow(combined.text);
    if (!parsed || parsed.quotas.length !== columns.length) continue;

    currentDistrict = inferDistrictFromJuniorSchoolName(parsed.juniorSchool) || currentDistrict;
    if (!currentDistrict) continue;

    rows.push({
      district: currentDistrict,
      juniorSchool: SPECIAL_SCHOOL_NAME_MAP[parsed.juniorSchool] || parsed.juniorSchool,
      quotas: parsed.quotas,
    });
  }

  return { rows, lastDistrict: currentDistrict };
}

function groupByDistrict(allocations) {
  return allocations.reduce((acc, item) => {
    if (!acc[item.district]) acc[item.district] = [];
    acc[item.district].push(item);
    return acc;
  }, {});
}

function isSharedJuniorSchool(name) {
  return name.includes('未分配到名额的学校共享');
}

function writeDistrictModule(slug, districtAllocations) {
  const exportName = `${slug}IndicatorAllocations`;
  const content = `import type { JuniorSchoolIndicatorAllocation } from '../indicatorAllocations';\n\nexport const ${exportName}: JuniorSchoolIndicatorAllocation[] = ${JSON.stringify(districtAllocations, null, 2)};\n`;
  fs.writeFileSync(path.join(DISTRICT_OUTPUT_DIR, `${slug}.ts`), content, 'utf8');
}

function main() {
  const xmlContent = ensureGuideXml();
  const pages = parsePages(xmlContent);
  const referenceNames = getReferenceSchoolNames();
  const allocationsByKey = new Map();
  let currentCategory = null;
  const districtCarry = { ac: null, d: null, acd: null };

  pages.forEach((page) => {
    currentCategory = getCategoryFromPage(page.items) || currentCategory;
    if (!currentCategory) return;

    const columns = buildHeaderColumns(page.items, referenceNames);
    if (columns.length < 80) return;
    const { rows, lastDistrict } = buildRowsForPage(page.items, columns, districtCarry[currentCategory]);
    districtCarry[currentCategory] = lastDistrict;

    rows.forEach((row) => {
      const key = normalizeKey(row.juniorSchool);
      const entry = allocationsByKey.get(key) || {
        district: row.district,
        juniorSchool: row.juniorSchool,
        acQuotas: {},
        dQuotas: {},
        acdQuotas: {},
      };

      row.quotas.forEach((quota, index) => {
        if (quota <= 0) return;
        const schoolName = columns[index]?.schoolName;
        if (!schoolName) return;
        if (currentCategory === 'ac') entry.acQuotas[schoolName] = quota;
        else if (currentCategory === 'd') entry.dQuotas[schoolName] = quota;
        else entry.acdQuotas[schoolName] = quota;
      });

      allocationsByKey.set(key, entry);
    });
  });

  const allocations = [...allocationsByKey.values()]
    .sort((a, b) => DISTRICT_ORDER.indexOf(a.district) - DISTRICT_ORDER.indexOf(b.district) || a.juniorSchool.localeCompare(b.juniorSchool, 'zh-Hans-CN'));

  const grouped = groupByDistrict(allocations);
  Object.entries(DISTRICT_SLUG_MAP).forEach(([district, slug]) => {
    writeDistrictModule(slug, grouped[district] || []);
  });

  const indexContent = `export type IndicatorDistrictKey = ${Object.values(DISTRICT_SLUG_MAP).map((slug) => `'${slug}'`).join(' | ')};\n\nexport const DISTRICT_SLUG_MAP = ${JSON.stringify(DISTRICT_SLUG_MAP, null, 2)} as const;\n\nexport const juniorSchoolDistrictIndex = ${JSON.stringify(
    allocations.filter((item) => !isSharedJuniorSchool(item.juniorSchool)).map((item) => ({
      normalized: normalizeKey(item.juniorSchool),
      district: item.district,
      juniorSchool: item.juniorSchool,
    })),
    null,
    2
  )};\n`;
  fs.writeFileSync(INDEX_OUTPUT_PATH, indexContent, 'utf8');

  const namesContent = `export const juniorSchoolNames = ${JSON.stringify(allocations.filter((item) => !isSharedJuniorSchool(item.juniorSchool)).map((item) => item.juniorSchool), null, 2)};\n`;
  fs.writeFileSync(NAMES_OUTPUT_PATH, namesContent, 'utf8');

  console.log({
    juniorSchools: allocations.length,
    districts: Object.keys(grouped).length,
    sample: allocations.slice(0, 3).map((item) => ({
      district: item.district,
      juniorSchool: item.juniorSchool,
      ac: Object.keys(item.acQuotas).length,
      d: Object.keys(item.dQuotas).length,
      acd: Object.keys(item.acdQuotas).length,
    })),
  });
}

main();
