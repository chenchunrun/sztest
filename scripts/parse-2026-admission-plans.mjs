import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { PUBLIC_PLAN_ROW_REPLACEMENTS } from './admission-plan-2026-config.mjs';

const root = process.cwd();
const planDir = path.join(root, '2026录取计划');
const outFile = path.join(root, 'src/data/admissionPlans2026.ts');

function pdfText(filename) {
  const fullPath = path.join(planDir, filename);
  return execSync(`pdftotext -layout "${fullPath}" -`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
}

function cleanLines(text) {
  return text
    .split('\n')
    .map((line) => line.replace(/\f/g, '').trimEnd())
    .filter((line) => line.trim() !== '')
    .filter((line) => !/^附件\d+$/.test(line.trim()))
    .filter((line) => !/^第\s*\d+\s*页，共\s*\d+\s*页$/.test(line.trim()));
}

function chunkBySerial(lines) {
  const chunks = [];
  let current = [];

  for (const line of lines) {
    if (/^\d+\s+/.test(line.trim())) {
      if (current.length > 0) chunks.push(current);
      current = [line];
    } else if (current.length > 0) {
      current.push(line);
    }
  }

  if (current.length > 0) chunks.push(current);
  return chunks;
}

function normalizeSpace(text) {
  return text.replace(/\s+/g, ' ').replace(/\s+([）)])/, '$1').replace(/([(（])\s+/g, '$1').trim();
}

function parsePublicPlan() {
  const rawLines = pdfText('深圳市2026年公办普通高中学校招生计划表.pdf')
    .split('\n')
    .map((line) => line.replace(/\f/g, '').trimEnd());
  const serialIndexes = rawLines
    .map((line, index) => (/^\s*\d+\s+/.test(line) ? index : -1))
    .filter((index) => index >= 0);

  return serialIndexes.map((index) => {
    const line = rawLines[index].trim();
    const serial = Number((line.match(/^(\d+)/) || [])[1]);
    const nameBase = normalizeSpace(
      line
        .replace(/^\d+\s+/, '')
        .replace(/\s+(省一级|市一级)\s+公办.*$/, '')
        .replace(/\s+公办.*$/, '')
    );

    const hasInlinePlan = /公办\s+\d+\s+\d+\s+(—|\d+)/.test(line);
    const planLines = hasInlinePlan
      ? [line]
      : [rawLines[index - 1], rawLines[index + 1]].filter(Boolean).map((item) => item.trim()).filter((item) => /^公办\s+\d+/.test(item));
    const contextLines = [rawLines[index - 2], rawLines[index - 1], rawLines[index], rawLines[index + 1], rawLines[index + 2]]
      .filter(Boolean)
      .map((item) => item.trim())
      .filter((item) => item !== '');
    const numbers = planLines
      .flatMap((item) => [...item.matchAll(/公办\s+(\d+)\s+(\d+)\s+(—|\d+)/g)])
      .map((match) => ({
        total: Number(match[1]),
        boarding: Number(match[2]),
        day: match[3] === '—' ? 0 : Number(match[3]),
      }));
    const primaryPlan = numbers.sort((a, b) => b.total - a.total)[0] || { total: 0, boarding: 0, day: 0 };

    const levelMatch = contextLines.join(' ').match(/(省一级|市一级)/);
    const joined = normalizeSpace(contextLines.join(' '));

    return {
      serial,
      name: nameBase,
      level: levelMatch?.[1] || '',
      nature: '公办',
      totalPlan: primaryPlan.total,
      boardingPlan: primaryPlan.boarding,
      dayPlan: primaryPlan.day,
      rawText: joined,
    };
  });
}

function sanitizePublicPlans(rows) {
  const dropSerials = new Set(PUBLIC_PLAN_ROW_REPLACEMENTS.map((item) => item.serial));
  const kept = rows.filter((row) => !dropSerials.has(row.serial));
  return [...kept, ...PUBLIC_PLAN_ROW_REPLACEMENTS].sort((a, b) => a.serial - b.serial || a.name.localeCompare(b.name, 'zh-CN'));
}

function parseQuotaPlan() {
  const rawLines = pdfText('深圳市2026年公办普通高中名额分配招生计划表.pdf')
    .split('\n')
    .map((line) => line.replace(/\f/g, '').trimEnd());

  return rawLines
    .map((line) => line.trim())
    .filter((line) => /^\d+\s+/.test(line))
    .map((line) => {
      const serial = Number((line.match(/^(\d+)/) || [])[1]);
      const rest = line.replace(/^\d+\s+/, '');
      const match = rest.match(/^(.+?)\s+(\d+)(?:\s+(\d+))?(?:\s+(\d+))?$/);
      if (!serial || !match) return null;
      const nameSection = match[1];
      const quotaNumbers = [match[2], match[3], match[4]].filter(Boolean).map((item) => Number(item));
      const acQuota = quotaNumbers.length >= 2 ? quotaNumbers[0] : 0;
      const dQuota = quotaNumbers.length >= 2 ? quotaNumbers[1] : 0;
      const acdQuota = quotaNumbers.length === 1 ? quotaNumbers[0] : quotaNumbers.length === 3 ? quotaNumbers[2] : 0;
      return {
        serial,
        name: normalizeSpace(nameSection),
        acQuota,
        dQuota,
        acdQuota,
        rawText: normalizeSpace(line),
      };
    })
    .filter(Boolean);
}

function parsePrivatePlan() {
  const lines = cleanLines(pdfText('深圳市2026年民办普通高中学校招生计划表.pdf'));
  const chunks = chunkBySerial(lines);

  return chunks.map((chunk) => {
    const joined = normalizeSpace(chunk.join(' '));
    const serial = Number((joined.match(/^(\d+)/) || [])[1]);
    const planMatch = joined.match(/(\d+)\s+(全住宿|走读|提供\d+个床位)\s+面向全市招收/);
    const plan = planMatch ? Number(planMatch[1]) : 0;
    const accommodation = planMatch?.[2] || '';
    const prefix = joined.replace(/^\d+\s+/, '');
    const name = normalizeSpace(prefix.split(/\s+(省一级|市一级|民办（中外合作）|民办)\s+/)[0]);
    const levelMatch = joined.match(/(省一级|市一级)/);
    const notes = joined.includes('备注') ? '' : joined;
    return {
      serial,
      name,
      level: levelMatch?.[1] || '',
      nature: '民办',
      totalPlan: plan,
      accommodation,
      rawText: notes,
    };
  });
}

function parseVocationalPlan() {
  const lines = cleanLines(pdfText('深圳市2026年中职技工学校招生计划表.pdf'));
  const chunks = chunkBySerial(lines);

  return chunks.map((chunk) => {
    const joined = normalizeSpace(chunk.join(' '));
    const serial = Number((joined.match(/^(\d+)/) || [])[1]);
    const planMatch = joined.match(/(公办|民办)\s+(\d+)\s+(全住宿|走读|提供\d+个床位)\s+/);
    const prefix = joined.replace(/^\d+\s+/, '');
    const name = normalizeSpace(prefix.split(/\s+(国家中职教育改革发展示范校|国家级重点|省级重点|市一级|公办|民办)\s+/)[0]);
    const levelMatch = joined.match(/(国家中职教育改革发展示范校|国家级重点|省级重点|市一级)/);
    return {
      serial,
      name,
      level: levelMatch?.[1] || '',
      nature: planMatch?.[1] || '',
      totalPlan: planMatch ? Number(planMatch[2]) : 0,
      accommodation: planMatch?.[3] || '',
      rawText: joined,
    };
  });
}

const publicHighSchoolPlans2026 = sanitizePublicPlans(parsePublicPlan());
const quotaPlans2026 = parseQuotaPlan();
const privateHighSchoolPlans2026 = parsePrivatePlan();
const vocationalPlans2026 = parseVocationalPlan();

const content = `/* eslint-disable */
// Auto-generated by scripts/parse-2026-admission-plans.mjs
export const publicHighSchoolPlans2026 = ${JSON.stringify(publicHighSchoolPlans2026, null, 2)} as const;

export const quotaPlans2026 = ${JSON.stringify(quotaPlans2026, null, 2)} as const;

export const privateHighSchoolPlans2026 = ${JSON.stringify(privateHighSchoolPlans2026, null, 2)} as const;

export const vocationalPlans2026 = ${JSON.stringify(vocationalPlans2026, null, 2)} as const;
`;

fs.writeFileSync(outFile, content, 'utf8');
console.log(`generated ${path.relative(root, outFile)}`);
console.log({
  publicHighSchoolPlans2026: publicHighSchoolPlans2026.length,
  quotaPlans2026: quotaPlans2026.length,
  privateHighSchoolPlans2026: privateHighSchoolPlans2026.length,
  vocationalPlans2026: vocationalPlans2026.length,
});
