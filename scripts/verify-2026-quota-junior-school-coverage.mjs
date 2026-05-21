import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { juniorSchoolDistrictIndex } from '../src/data/indicatorAllocationsIndex.ts';
import { applyOfficialGuideJuniorSchoolAlias } from '../src/data/juniorSchoolAliasMap.ts';
import { officialGuideJuniorSchoolDistrictHints2026 } from '../src/data/officialGuideJuniorSchools2026.ts';

const ROOT_DIR = process.cwd();
const GUIDE_PDF_PATH = path.join(ROOT_DIR, '2026录取计划', '2026年深圳市高中阶段学校考生报考指导手册.pdf');
const GUIDE_XML_PATH = path.join('/tmp', 'guide-2026-quota-coverage.xml');
const DISTRICT_NAMES = ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '龙华区', '光明区', '坪山区', '盐田区', '大鹏新区', '深汕特别合作区'];
const COMBINED_ROW_PATTERN = /^(.+?(?:学校|中学|书院|初中部))\s+(\d+(?:\s+\d+)+)$/;

function normalizeName(value) {
  return applyOfficialGuideJuniorSchoolAlias(value)
    .replace(/^(福田区|罗湖区|南山区|宝安区|龙岗区|龙华区|光明区|坪山区|盐田区|大鹏新区|深汕特别合作区)+/g, '')
    .replace(/\s+/g, '')
    .replace(/[()（）-]/g, '')
    .replace(/集团/g, '')
    .replace(/深圳市教育科学研究院实验学校光明/g, '深圳市教育科学研究院实验学校（光明）')
    .replace(/深圳技术大学附属学校光明/g, '深圳技术大学附属学校（光明）')
    .replace(/深圳大学附属中学初中部/g, '深圳大学附属中学（初中部）')
    .toLowerCase();
}

function cleanupText(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
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

function isDistrictLabel(text) {
  return DISTRICT_NAMES.includes(text);
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

function extractCombinedRow(text) {
  const match = text.match(COMBINED_ROW_PATTERN);
  if (!match) return null;
  return {
    juniorSchool: match[1].trim(),
    quotas: match[2].split(/\s+/).map((part) => Number(part)).filter((part) => Number.isFinite(part)),
  };
}

function buildRowsForPage(items, inheritedDistrict = null) {
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
    rows.push({ district: currentDistrict, juniorSchool: rowName });
  }

  for (const combined of combinedRowItems.sort((a, b) => a.top - b.top)) {
    while (districtIndex < districtLabels.length && districtLabels[districtIndex].top <= combined.top) {
      currentDistrict = districtLabels[districtIndex].text;
      districtIndex += 1;
    }
    const parsed = extractCombinedRow(combined.text);
    if (!parsed) continue;
    currentDistrict = inferDistrictFromJuniorSchoolName(parsed.juniorSchool) || currentDistrict;
    if (!currentDistrict) continue;
    rows.push({ district: currentDistrict, juniorSchool: parsed.juniorSchool });
  }

  return { rows, lastDistrict: currentDistrict };
}

function parseGuideJuniorSchoolsFromXml(xmlContent) {
  const pages = parsePages(xmlContent);
  const extracted = new Set();
  const districtCarry = { ac: null, d: null, acd: null };
  let currentCategory = null;

  pages.forEach((page) => {
    currentCategory = getCategoryFromPage(page.items) || currentCategory;
    if (!currentCategory) return;

    const { rows, lastDistrict } = buildRowsForPage(page.items, districtCarry[currentCategory]);
    districtCarry[currentCategory] = lastDistrict;

    rows.forEach((row) => {
      if (!row.juniorSchool.includes('未分配到名额的学校共享')) {
        extracted.add(row.juniorSchool);
      }
    });
  });

  return [...extracted].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
}

execFileSync('pdftohtml', ['-xml', GUIDE_PDF_PATH, GUIDE_XML_PATH], { stdio: 'ignore' });
const xmlContent = fs.readFileSync(GUIDE_XML_PATH, 'utf8');
const guideJuniorSchools = parseGuideJuniorSchoolsFromXml(xmlContent);

const systemSchoolPool = [
  ...juniorSchoolDistrictIndex.map((item) => ({ juniorSchool: item.juniorSchool, district: item.district })),
  ...officialGuideJuniorSchoolDistrictHints2026.map((item) => ({ juniorSchool: item.name, district: item.district })),
];

const indexByNormalized = new Map(systemSchoolPool.map((item) => [normalizeName(item.juniorSchool), item]));

function matchSystemSchool(name) {
  const normalized = normalizeName(name);
  const exact = indexByNormalized.get(normalized);
  if (exact) return exact;

  return systemSchoolPool.find((item) => {
    const candidate = normalizeName(item.juniorSchool);
    return candidate.includes(normalized) || normalized.includes(candidate);
  });
}

const matched = [];
const unmatched = [];

for (const name of guideJuniorSchools) {
  const found = matchSystemSchool(name);
  if (found) {
    matched.push({ guideName: name, systemName: found.juniorSchool, district: found.district });
  } else {
    unmatched.push(name);
  }
}

const missingFromGuide = systemSchoolPool
  .filter((item, index, array) => array.findIndex((candidate) => normalizeName(candidate.juniorSchool) === normalizeName(item.juniorSchool)) === index)
  .filter((item) => !guideJuniorSchools.some((name) => {
    const normalizedGuide = normalizeName(name);
    const normalizedSystem = normalizeName(item.juniorSchool);
    return normalizedGuide === normalizedSystem
      || normalizedGuide.includes(normalizedSystem)
      || normalizedSystem.includes(normalizedGuide);
  }))
  .map((item) => item.juniorSchool);

console.log({
  guideJuniorSchools: guideJuniorSchools.length,
  systemJuniorSchools: systemSchoolPool.length,
  matched: matched.length,
  unmatched: unmatched.length,
  missingFromGuide: missingFromGuide.length,
});

if (unmatched.length > 0) {
  console.log('\n手册中提取到但未在系统指标生初中索引中命中的学校:');
  unmatched.slice(0, 40).forEach((name) => console.log(`- ${name}`));
}

if (missingFromGuide.length > 0) {
  console.log('\n系统指标生初中索引中存在但未在手册附件3提取结果里命中的学校:');
  missingFromGuide.slice(0, 40).forEach((name) => console.log(`- ${name}`));
}

if (unmatched.length === 0) {
  console.log('\n2026名额分配初中学校覆盖校验通过');
} else {
  console.log('\n2026名额分配初中学校覆盖校验已完成，以上差异建议继续核对手册提取或补充官方索引。');
}
