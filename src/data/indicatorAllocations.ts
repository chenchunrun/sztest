import { DISTRICT_SLUG_MAP, juniorSchoolDistrictIndex, type IndicatorDistrictKey } from './indicatorAllocationsIndex.ts';
import { applyOfficialGuideJuniorSchoolAlias } from './juniorSchoolAliasMap.ts';
import { officialGuideJuniorSchoolDistrictHints2026 } from './officialGuideJuniorSchools2026.ts';

export interface JuniorSchoolIndicatorAllocation {
  district: string;
  juniorSchool: string;
  acQuotas: Record<string, number>;
  dQuotas: Record<string, number>;
  acdQuotas?: Record<string, number>;
}

type DistrictModule = {
  [key: string]: JuniorSchoolIndicatorAllocation[];
};

function normalizeJuniorSchool(value: string) {
  return applyOfficialGuideJuniorSchoolAlias(value).toLowerCase().replace(/[\s()（）-]/g, '');
}

function hasPositiveQuotaMap(map: Record<string, number> | undefined) {
  return !!map && Object.values(map).some((quota) => quota > 0);
}

function getDistrictKeyByJuniorSchool(input: string): IndicatorDistrictKey | null {
  const normalizedInput = normalizeJuniorSchool(input.trim());
  if (!normalizedInput) return null;

  const matched = juniorSchoolDistrictIndex.find((item) => (
    item.normalized === normalizedInput
    || item.normalized.includes(normalizedInput)
    || normalizedInput.includes(item.normalized)
  ));

  if (matched) return DISTRICT_SLUG_MAP[matched.district as keyof typeof DISTRICT_SLUG_MAP] ?? null;

  const guideHint = officialGuideJuniorSchoolDistrictHints2026.find((item) => normalizeJuniorSchool(item.name) === normalizedInput);
  if (!guideHint) return null;
  return DISTRICT_SLUG_MAP[guideHint.district as keyof typeof DISTRICT_SLUG_MAP] ?? null;
}

async function loadDistrictAllocations(districtKey: IndicatorDistrictKey): Promise<JuniorSchoolIndicatorAllocation[]> {
  let module: DistrictModule;

  if (districtKey === 'guangming') module = await import('./indicator-allocations/guangming.ts');
  else if (districtKey === 'nanshan') module = await import('./indicator-allocations/nanshan.ts');
  else if (districtKey === 'pingshan') module = await import('./indicator-allocations/pingshan.ts');
  else if (districtKey === 'dapeng') module = await import('./indicator-allocations/dapeng.ts');
  else if (districtKey === 'baoan') module = await import('./indicator-allocations/baoan.ts');
  else if (districtKey === 'yantian') module = await import('./indicator-allocations/yantian.ts');
  else if (districtKey === 'futian') module = await import('./indicator-allocations/futian.ts');
  else if (districtKey === 'luohu') module = await import('./indicator-allocations/luohu.ts');
  else if (districtKey === 'longhua') module = await import('./indicator-allocations/longhua.ts');
  else module = await import('./indicator-allocations/longgang.ts');

  const exportName = `${districtKey}IndicatorAllocations`;
  return module[exportName] || [];
}

export async function findJuniorSchoolIndicatorAllocation(input: string): Promise<JuniorSchoolIndicatorAllocation | undefined> {
  const officialInput = applyOfficialGuideJuniorSchoolAlias(input.trim());
  const normalizedInput = normalizeJuniorSchool(officialInput);
  if (!normalizedInput) return undefined;

  const districtKey = getDistrictKeyByJuniorSchool(input);
  if (!districtKey) return undefined;

  const districtAllocations = await loadDistrictAllocations(districtKey);
  const matched = districtAllocations.find((item) => {
    const normalizedName = normalizeJuniorSchool(item.juniorSchool);
    return normalizedName === normalizedInput || normalizedName.includes(normalizedInput) || normalizedInput.includes(normalizedName);
  });

  const shared = districtAllocations.find((item) => item.juniorSchool.includes('未分配到名额的学校共享'));
  if (!matched) {
    if (!shared) return undefined;
    return {
      district: shared.district,
      juniorSchool: officialInput,
      acQuotas: shared.acQuotas || {},
      dQuotas: shared.dQuotas || {},
      acdQuotas: shared.acdQuotas || {},
    };
  }

  if (!shared || matched.juniorSchool.includes('未分配到名额的学校共享')) return matched;

  return {
    ...matched,
    acQuotas: hasPositiveQuotaMap(matched.acQuotas) ? matched.acQuotas : (shared.acQuotas || {}),
    dQuotas: hasPositiveQuotaMap(matched.dQuotas) ? matched.dQuotas : (shared.dQuotas || {}),
    acdQuotas: hasPositiveQuotaMap(matched.acdQuotas) ? matched.acdQuotas : (shared.acdQuotas || {}),
  };
}
