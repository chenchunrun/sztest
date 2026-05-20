// 考生类型
export type StudentType = 'AC' | 'D';

// 志愿填报风格
export type StrategyStyle = 'conservative' | 'balanced' | 'aggressive';
export type RiskPreference = StrategyStyle;

// 住宿需求
export type AccommodationNeed = 'boarding' | 'day' | 'any';

// 生物地理等级
export type BioGeoGrade = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';

// 学校类型
export type SchoolLevel = '四大名校' | '八大名校' | '区属重点' | '普通公办' | '民办';

// 策略类型
export type StrategyType = '冲一冲' | '稳一稳' | '保一保';
export type ProbabilityBucket = '冲' | '稳' | '保' | '强保';

// 区域
export type District = '福田' | '罗湖' | '南山' | '宝安' | '龙岗' | '龙华' | '光明' | '坪山' | '盐田' | '大鹏' | '深汕';

// 性别
export type Gender = '男' | '女';
export type ApplicantTrack = 'general' | 'art';

// 强势学科
export type Subject = '数学' | '物理' | '化学' | '语文' | '英语' | '历史' | '地理' | '生物';

// 通勤接受度
export type CommuteTolerance = 'near' | 'medium' | 'far';

// 学校特色标签
export type SchoolTrait = '竞赛强校' | '艺术特色' | '体育特色' | '外语特色' | '管理严格' | '管理自由' | '老牌名校' | '新兴学校' | '高进高出' | '低进高出';

// 文理属性
export type WenliType = '偏理' | '偏文' | '均衡' | '纯文';

export interface PreferenceWeights {
  district: number;
  schoolLevel: number;
  features: number;
  boarding: number;
  commute: number;
  tuition: number;
  management: number;
}

// 学校口碑
export interface SchoolReputation {
  count: number;
  overallSatisfaction?: number;
  teacherQuality?: number;
  teachingQuality?: number;
  managementEffect?: number;
  canteenSatisfaction?: number;
  dormSatisfaction?: number;
  activityRichness?: number;
  teacherAttention?: number;
  compositeScore?: number;
}

// 历年分数线
export interface HistoricalScores {
  [year: number]: {
    ac: number;
    d: number;
    rank?: number;
  };
}

export interface HistoricalScorePoint {
  year: number;
  raw: number;
  scaled630: number;
  rank?: number;
}

export interface SchoolLineForecast {
  muLine: number;
  sigmaLine: number;
  trendAdj: number;
  planAdj: number;
  popularityAdj: number;
  quotaBackAdj: number;
  weightedHistoricalLine: number;
  stabilityScore: number;
  tiePassProb: number;
  commonSensitivity: number;
}

export interface StudentScoreModel {
  muScore: number;
  sigmaScore: number;
  riskPreference: RiskPreference;
  tieBreakAdvantage: number;
}

export interface QuotaProfile {
  quotaPlan?: number;
  quotaToJuniorSchool: number;
  controlLine?: number;
}

// 学校数据
export interface School {
  id: string;
  name: string;
  district: District;
  type: '公办' | '民办';
  level: SchoolLevel;
  acScore2025: number; // 2025年AC类分数线（630分制）
  dScore2025: number;  // 2025年D类分数线（630分制）
  hasBoarding: boolean;
  hasDay: boolean;
  plan2026: number;    // 2026年招生计划人数（预估）
  description: string;
  features: string[];

  // ===== 增强字段（来自Excel数据） =====
  address?: string;               // 学校地址
  affiliation?: string;           // 归属（市直属/区属）
  historicalScores?: HistoricalScores; // 2021-2025历年分数线（原始610分制）
  acScore2025Raw?: number;        // 2025年AC类原始分数线（610分制）
  dScore2025Raw?: number;         // 2025年D类原始分数线（610分制）
  acBoarding2025?: number;        // 2025年AC类住宿生分数线（630分制）
  dBoarding2025?: number;         // 2025年D类住宿生分数线（630分制）
  acDay2025?: number;             // 2025年AC类走读生分数线（630分制）
  dDay2025?: number;              // 2025年D类走读生分数线（630分制）
  totalPlan2025?: number;         // 2025年总招生计划
  boardingPlan2025?: number;      // 2025年住宿生计划
  dayPlan2025?: number;           // 2025年走读生计划
  acPlan2025?: number;            // 2025年AC类计划
  dPlan2025?: number;             // 2025年D类计划
  boardingAc2025?: number;        // 2025年住宿生AC类计划
  boardingD2025?: number;         // 2025年住宿生D类计划
  dayAc2025?: number;             // 2025年走读生AC类计划
  dayD2025?: number;              // 2025年走读生D类计划
  indicatorAc2025?: number;       // 2025年AC类指标生计划
  indicatorD2025?: number;        // 2025年D类指标生计划
  indicatorLineAc?: number;       // 2025年AC类指标生控制线（610分制原始分）
  indicatorLineD?: number;        // 2025年D类指标生控制线（610分制原始分）
  quotaPlan2026?: number;         // 2026年名额分配计划（如缺失则按2025指标生计划近似）
  minSubjectRule?: boolean;       // 是否存在省一级/招生简章中的单科等级硬要求
  provinceLevel?: boolean;        // 是否属于省一级学校
  publicTuitionEstimate?: number; // 年学费预估（公办通常较低）
  privateTuitionEstimate?: number;// 年学费预估（民办）
  selfRecruitClass1?: string;     // 一类自主招生简章链接
  selfRecruitClass2?: string;     // 二类自主招生简章链接
  admissionGuide?: string;        // 官方招生简章链接
  classTypes?: string;            // 班型情况
  dormitory?: string;             // 宿舍情况

  // Phase 8: 人校精准匹配字段
  wenli?: WenliType;
  founded?: number;
  traits?: SchoolTrait[];
  phonePolicy?: string;
  reputation?: SchoolReputation;
}

// 考生信息
export interface StudentInfo {
  score: number;
  muScore?: number;
  sigmaScore?: number;
  studentType: StudentType;
  bioGeoGrade: BioGeoGrade;
  juniorSchool?: string;
  homeDistrict?: District;
  applicantTrack?: ApplicantTrack;
  isQuotaEligible?: boolean;
  subjectGradeOk?: boolean;
  preferredDistricts: District[];
  accommodation: AccommodationNeed;
  boardingNeed?: 'hard' | 'preferred' | 'none';
  preferredLevels: SchoolLevel[];
  acceptPrivate: boolean;
  strategyStyle: StrategyStyle;
  riskPreference?: RiskPreference;
  preferenceWeights?: Partial<PreferenceWeights>;

  // Phase 8: 新增字段
  gender?: Gender;
  strongSubjects?: Subject[];
  commuteTolerance?: CommuteTolerance;
  preferNewSchool?: boolean;
  preferStrictManagement?: boolean;
  preferArtSports?: boolean;
}

// 志愿项
export interface VolunteerItem {
  order: number;
  school: School;
  strategy: StrategyType;
  probability: number;
  bucket?: ProbabilityBucket;
  scoreDiff: number;
  forecastLine?: number;
  lineSigma?: number;
  finalAdmissionProbability?: number;
  matchScore?: number;
  matchReasons?: string[];
}

// 志愿方案
export interface VolunteerPlan {
  items: VolunteerItem[];
  studentInfo: StudentInfo;
  generatedAt: string;
  summary: {
    totalSchools: number;
    publicCount: number;
    privateCount: number;
    avgProbability: number;
    maxProbability: number;
    minProbability: number;
    firstBatchAdmissionProbability?: number;
    missRisk?: number;
  };
}

// 中考时间节点
export interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

// 高考增值性评价
export interface GaokaoValueAdded {
  schoolName: string;
  enrolled2020?: number;
  examTakers?: number;
  participationRate?: number;
  gaokaoStrength?: number;
  studentStrength?: number;
  changeValue?: number;
  progressValue?: number;
  regressValue?: number;
  maintainValue?: number;
  relativeProgressRate?: number;
}
