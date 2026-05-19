import { DISTRICT_SLUG_MAP, juniorSchoolDistrictIndex, type IndicatorDistrictKey } from './indicatorAllocationsIndex.ts';

export interface JuniorSchoolIndicatorAllocation {
  district: string;
  juniorSchool: string;
  acQuotas: Record<string, number>;
  dQuotas: Record<string, number>;
}

type DistrictModule = {
  [key: string]: JuniorSchoolIndicatorAllocation[];
};

function normalizeJuniorSchool(value: string) {
  return value.toLowerCase().replace(/[\s()（）-]/g, '');
}

function getDistrictKeyByJuniorSchool(input: string): IndicatorDistrictKey | null {
  const normalizedInput = normalizeJuniorSchool(input.trim());
  if (!normalizedInput) return null;

  const matched = juniorSchoolDistrictIndex.find((item) => (
    item.normalized === normalizedInput
    || item.normalized.includes(normalizedInput)
    || normalizedInput.includes(item.normalized)
  ));

  if (!matched) return null;
  return DISTRICT_SLUG_MAP[matched.district as keyof typeof DISTRICT_SLUG_MAP] ?? null;
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
  const normalizedInput = normalizeJuniorSchool(input.trim());
  if (!normalizedInput) return undefined;

  const districtKey = getDistrictKeyByJuniorSchool(input);
  if (!districtKey) return undefined;

  const districtAllocations = await loadDistrictAllocations(districtKey);
  return districtAllocations.find((item) => {
    const normalizedName = normalizeJuniorSchool(item.juniorSchool);
    return normalizedName === normalizedInput || normalizedName.includes(normalizedInput) || normalizedInput.includes(normalizedName);
  });
}
