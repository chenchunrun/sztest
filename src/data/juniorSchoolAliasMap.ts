export const OFFICIAL_GUIDE_JUNIOR_SCHOOL_ALIASES: Record<string, string> = {
  '长育学校': '光明区长育学校',
  '和平中学': '宝安区和平中英文实验学校',
  '深圳市福田区红岭教育集团园岭中学': '福田区红岭中学（集团）园岭部',
};

export function applyOfficialGuideJuniorSchoolAlias(value: string) {
  const normalizedValue = value.replace(/\s+/g, ' ').trim();
  return OFFICIAL_GUIDE_JUNIOR_SCHOOL_ALIASES[normalizedValue] || normalizedValue;
}
