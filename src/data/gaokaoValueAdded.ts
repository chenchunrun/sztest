import type { GaokaoValueAdded } from '@/types';

export const gaokaoValueAddedData: GaokaoValueAdded[] = [
  { schoolName: '北京师范大学南山附属学校', relativeProgressRate: 5.38, gaokaoStrength: 64.89, studentStrength: 62.19, changeValue: 2.7, progressValue: 24.28 },
  { schoolName: '深圳明德实验学校（集团）高级中学（香蜜校区）', relativeProgressRate: 4.73, gaokaoStrength: 52.89, studentStrength: 49.51, changeValue: 3.38, progressValue: 22.65 },
  { schoolName: '深圳外国语学校龙华高中部', relativeProgressRate: 3.79, gaokaoStrength: 59.68, studentStrength: 57.99, changeValue: 1.68, progressValue: 21.78 },
  { schoolName: '育才中学', relativeProgressRate: 3.72, gaokaoStrength: 70.06, studentStrength: 70.49, changeValue: -0.42, progressValue: 20.47 },
  { schoolName: '深圳中学', relativeProgressRate: 3.62, gaokaoStrength: 80.84, studentStrength: 85.03, changeValue: -4.19, progressValue: 9.9 },
  { schoolName: '深圳实验学校（高中部）', relativeProgressRate: 3.54, gaokaoStrength: 80.06, studentStrength: 84.08, changeValue: -4.02, progressValue: 10.73 },
  { schoolName: '深圳大学附属实验中学', relativeProgressRate: 3.41, gaokaoStrength: 54.43, studentStrength: 52.23, changeValue: 2.2, progressValue: 21.05 },
  { schoolName: '深圳科学高中', relativeProgressRate: 3.41, gaokaoStrength: 67.09, studentStrength: 67.33, changeValue: -0.24, progressValue: 20.14 },
  { schoolName: '人大附中深圳学校', relativeProgressRate: 3.35, gaokaoStrength: 60.66, studentStrength: 59.79, changeValue: 0.86, progressValue: 21.19 },
  { schoolName: '深圳市高级中学东校区', relativeProgressRate: 3.29, gaokaoStrength: 59.34, studentStrength: 58.09, changeValue: 1.25, progressValue: 21.82 },
  { schoolName: '2023年增值性评价中相对进步率较高的10所公办学校(人数>135人)' },
  { schoolName: '北京师范大学南山附属学校', relativeProgressRate: 5.42, gaokaoStrength: 65.0, studentStrength: 61.64, changeValue: 3.36, progressValue: 26.63 },
  { schoolName: '深圳实验学校高中部', relativeProgressRate: 3.8, gaokaoStrength: 77.73, studentStrength: 80.83, changeValue: -3.1, progressValue: 17.58 },
  { schoolName: '深圳外国语学校龙华高中部', relativeProgressRate: 3.76, gaokaoStrength: 56.04, studentStrength: 53.65, changeValue: 2.39, progressValue: 23.62 },
  { schoolName: '深圳市育才中学', relativeProgressRate: 3.59, gaokaoStrength: 68.65, studentStrength: 68.5, changeValue: 0.15, progressValue: 21.62 },
  { schoolName: '深圳科学高中', relativeProgressRate: 3.48, gaokaoStrength: 65.86, studentStrength: 65.08, changeValue: 0.78, progressValue: 25.41 },
  { schoolName: '华中师范大学龙岗附属中学', relativeProgressRate: 3.29, gaokaoStrength: 54.36, studentStrength: 51.62, changeValue: 2.74, progressValue: 21.94 },
  { schoolName: '深圳科学高中龙岗分校', relativeProgressRate: 3.19, gaokaoStrength: 47.25, studentStrength: 43.55, changeValue: 3.7, progressValue: 23.01 },
  { schoolName: '人大附中深圳学校', relativeProgressRate: 3.19, gaokaoStrength: 60.92, studentStrength: 60.19, changeValue: 0.73, progressValue: 21.37 },
  { schoolName: '深圳第二外国语学校', relativeProgressRate: 2.86, gaokaoStrength: 49.07, studentStrength: 46.38, changeValue: 2.69, progressValue: 21.7 },
  { schoolName: '深圳实验学校光明部', relativeProgressRate: 2.85, gaokaoStrength: 56.81, studentStrength: 55.72, changeValue: 1.1, progressValue: 21.77 },
  { schoolName: '2022年增值性评价中相对进步率较高的10所公办学校(人数>135人)' },
  { schoolName: '深圳市龙华高级中学教育集团', gaokaoStrength: 59.84, studentStrength: 0.97, changeValue: 20.04, progressValue: 10.72 },
  { schoolName: '深圳科学高中', gaokaoStrength: 65.71, studentStrength: 0.77, changeValue: 22.8, progressValue: 12.15 },
  { schoolName: '深圳市盐田高级中学', gaokaoStrength: 54.68, studentStrength: 2.14, changeValue: 23.05, progressValue: 12.82 },
  { schoolName: '深圳市深圳中学(高中部)', gaokaoStrength: 86.75, studentStrength: -4.95, changeValue: 8.54, progressValue: 11.65 },
  { schoolName: '深圳市松岗中学', gaokaoStrength: 54.43, studentStrength: 1.26, changeValue: 20.64, progressValue: 12.6 },
  { schoolName: '深圳市福田区福田中学', gaokaoStrength: 46.19, studentStrength: 3.6, changeValue: 24.27, progressValue: 12.67 },
  { schoolName: '深圳实验学校光明高中部', gaokaoStrength: 61.42, studentStrength: 0.33, changeValue: 19.9, progressValue: 13.08 },
  { schoolName: '北京师范大学南山附属学校', gaokaoStrength: 62.33, studentStrength: 0.89, changeValue: 23.53, progressValue: 13.76 },
  { schoolName: '深圳外国语学校龙华高中部', gaokaoStrength: 55.35, studentStrength: 1.33, changeValue: 21.97, progressValue: 13.2 },
  { schoolName: '深圳实验学校高中部', gaokaoStrength: 85.01, studentStrength: -5.22, changeValue: 11.11, progressValue: 12.93 },
];

export function getGaokaoValueAdded(schoolName: string): GaokaoValueAdded | undefined {
  return gaokaoValueAddedData.find(g => schoolName.includes(g.schoolName) || g.schoolName.includes(schoolName));
}
