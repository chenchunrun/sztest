export const officialGuideJuniorSchoolDistrictHints2026 = [
  { name: '百外世纪初级中学', district: '龙岗区' },
  { name: '北京大学附属中学深圳学校（集团）黄埔学校', district: '福田区' },
  { name: '北京大学附属中学深圳学校（集团）外国语中学', district: '宝安区' },
  { name: '航星学校', district: '宝安区' },
  { name: '和一学校', district: '宝安区' },
  { name: '湖南师范大学附属深圳盐田山海学校', district: '盐田区' },
  { name: '龙澜学校', district: '龙华区' },
  { name: '深圳市罗湖区香港中文大学（深圳）附属礼文学校', district: '罗湖区' },
  { name: '深圳市南山实验教育集团白石洲学校', district: '南山区' },
  { name: '深圳市蛇口育才教育集团山海学校', district: '南山区' },
  { name: '深圳中学大鹏学校', district: '大鹏新区' },
] as const;

export const officialGuideJuniorSchoolNames2026 = officialGuideJuniorSchoolDistrictHints2026.map((item) => item.name);
