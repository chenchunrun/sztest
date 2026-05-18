import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  ArrowLeft, MapPin, Building2, BookOpen, ExternalLink,
  TrendingUp, Users, GraduationCap, SchoolIcon, Bed,
  ChevronRight, FileText, Star,
} from 'lucide-react';
import { getSchoolById } from '@/data/schools';
import { getGaokaoValueAdded } from '@/data/gaokaoValueAdded';
import type { School, SchoolLevel } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// ===================== Helpers =====================

function getLevelBadgeClass(level: SchoolLevel): string {
  switch (level) {
    case '四大名校': return 'bg-red-100 text-red-700';
    case '八大名校': return 'bg-orange-100 text-orange-700';
    case '区属重点': return 'bg-indigo-100 text-indigo-700';
    case '普通公办': return 'bg-slate-100 text-slate-600';
    case '民办': return 'bg-gray-100 text-gray-600';
    default: return 'bg-slate-100 text-slate-600';
  }
}

function parseLinks(text: string): { label: string; url: string }[] {
  const lines = text.split('\n').filter((l) => l.trim());
  const result: { label: string; url: string }[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(/^(.+?)[：:]\s*(https?:\/\/\S+)$/);
    if (match) {
      result.push({ label: match[1].trim(), url: match[2].trim() });
    } else if (/^https?:\/\//.test(trimmed)) {
      result.push({ label: '链接', url: trimmed });
    }
  }
  return result;
}

interface ChartRow {
  year: string;
  ac: number;
  d: number;
  rank?: number;
}

function buildChartData(school: School): ChartRow[] {
  if (!school.historicalScores) return [];
  const years = Object.keys(school.historicalScores)
    .map((y) => Number(y))
    .sort((a, b) => a - b);
  return years.map((year) => {
    const data = school.historicalScores![year];
    return {
      year: String(year),
      ac: data.ac,
      d: data.d,
      rank: data.rank,
    };
  });
}

// ===================== Components =====================

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
          <SchoolIcon className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">学校未找到</h1>
        <p className="text-gray-500 mb-6">抱歉，您查看的学校信息不存在或已被移除。</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:scale-[1.02] transition-transform duration-200 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; color: string; payload: ChartRow }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm">
      <div className="font-semibold text-gray-900 mb-1">{label} 年</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 py-0.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-600">{entry.dataKey === 'ac' ? 'AC类' : 'D类'}：</span>
          <span className="font-bold text-gray-900">{entry.value} 分</span>
        </div>
      ))}
      {typeof row.rank === 'number' && (
        <div className="mt-1 pt-1 border-t border-gray-100 text-xs text-gray-500">
          全市排名：第 {row.rank} 名
        </div>
      )}
    </div>
  );
}

function ScoreTrendChart({ school }: { school: School }) {
  const data = useMemo(() => buildChartData(school), [school]);
  if (data.length === 0) return null;

  return (
    <Card className="rounded-xl shadow-sm border border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <CardTitle className="text-base font-bold text-gray-900">历年录取分数线趋势（610分制原始分）</CardTitle>
        </div>
        <CardDescription className="text-xs text-gray-500">
          数据来源：2021-2025 年深圳中考第一批录取标准
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis
                domain={['dataMin - 10', 'dataMax + 5']}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(v: number) => `${v}分`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value: string) => (value === 'ac' ? 'AC类分数线' : 'D类分数线')}
              />
              <Line
                type="monotone"
                dataKey="ac"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="d"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: React.ReactNode }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-indigo-600" />
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }: { icon: typeof MapPin; title: string; children: React.ReactNode }) {
  if (!children) return null;
  // Check if children is an array and all items are null/undefined/false
  const isEmpty = Array.isArray(children) && children.every((c) => c === null || c === undefined || c === false);
  if (isEmpty) return null;
  return (
    <Card className="rounded-xl shadow-sm border border-gray-100">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-indigo-600" />
          <CardTitle className="text-base font-bold text-gray-900">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {children}
      </CardContent>
    </Card>
  );
}

// ===================== Main Page =====================

export default function SchoolDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const school = id ? getSchoolById(id) : undefined;
  const gaokao = school ? getGaokaoValueAdded(school.name) : undefined;

  if (!school) {
    return <NotFound />;
  }

  const hasEnrollmentData =
    school.totalPlan2025 !== undefined ||
    school.boardingPlan2025 !== undefined ||
    school.dayPlan2025 !== undefined ||
    school.acPlan2025 !== undefined ||
    school.dPlan2025 !== undefined ||
    school.boardingAc2025 !== undefined ||
    school.boardingD2025 !== undefined ||
    school.dayAc2025 !== undefined ||
    school.dayD2025 !== undefined ||
    school.indicatorAc2025 !== undefined ||
    school.indicatorD2025 !== undefined;

  const hasIndicatorLine = school.indicatorLineAc !== undefined || school.indicatorLineD !== undefined;

  const hasSelfRecruit =
    (school.selfRecruitClass1 && school.selfRecruitClass1.trim().length > 0) ||
    (school.selfRecruitClass2 && school.selfRecruitClass2.trim().length > 0);

  const selfRecruit1Links = school.selfRecruitClass1 ? parseLinks(school.selfRecruitClass1) : [];
  const selfRecruit2Links = school.selfRecruitClass2 ? parseLinks(school.selfRecruitClass2) : [];

  const hasClassDorm = school.classTypes || school.dormitory;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm sm:text-base">深圳中考志愿填报助手</span>
          </Link>
        </div>
      </nav>

      <main className="pt-14 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">首页</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-3.5 h-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/?#schools">学校库</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-3.5 h-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{school.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back Button */}
          <button
            onClick={() => navigate('/?#schools')}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            返回学校库
          </button>

          {/* Top Info Card */}
          <Card className="rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600" />
            <CardContent className="pt-5 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{school.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-50">
                      {school.district}
                    </Badge>
                    {school.affiliation && (
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-50">
                        {school.affiliation}
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className={`text-xs hover:bg-opacity-100 ${school.type === '公办' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {school.type}
                    </Badge>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getLevelBadgeClass(school.level)}`}>
                      {school.level}
                    </span>
                  </div>
                  {school.address && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {school.address}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 sm:text-right">
                  <div className="bg-indigo-50 rounded-xl px-4 py-3">
                    <div className="text-xs text-indigo-600 mb-0.5">AC类分数线</div>
                    <div className="text-xl font-bold text-indigo-700">{school.acScore2025}</div>
                    <div className="text-[10px] text-indigo-400">2025 · 630分制</div>
                  </div>
                  <div className="bg-amber-50 rounded-xl px-4 py-3">
                    <div className="text-xs text-amber-600 mb-0.5">D类分数线</div>
                    <div className="text-xl font-bold text-amber-700">{school.dScore2025}</div>
                    <div className="text-[10px] text-amber-400">2025 · 630分制</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* School Profile Card */}
          {(school.wenli || school.founded || school.traits) && (
            <Card className="rounded-xl shadow-sm border border-gray-100 mb-6">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-4">
                  <SchoolIcon className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-gray-900">学校画像</h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {school.wenli && (
                    <div className="bg-indigo-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-indigo-600 mb-1">文理属性</div>
                      <div className="text-lg font-bold text-indigo-700">{school.wenli}</div>
                    </div>
                  )}
                  {school.founded && (
                    <div className="bg-amber-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-amber-600 mb-1">创办年份</div>
                      <div className="text-lg font-bold text-amber-700">{school.founded}年</div>
                      <div className="text-[10px] text-amber-400">{new Date().getFullYear() - school.founded}年老校</div>
                    </div>
                  )}
                  {school.totalPlan2025 && (
                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-emerald-600 mb-1">招生规模</div>
                      <div className="text-lg font-bold text-emerald-700">{school.totalPlan2025}人</div>
                      <div className="text-[10px] text-emerald-400">
                        {school.totalPlan2025 >= 1000 ? '大规模' : school.totalPlan2025 >= 500 ? '中规模' : '小规模'}
                      </div>
                    </div>
                  )}
                  {school.reputation?.compositeScore && (
                    <div className="bg-purple-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-purple-600 mb-1">综合口碑</div>
                      <div className="text-lg font-bold text-purple-700">{school.reputation.compositeScore}分</div>
                      <div className="text-[10px] text-purple-400">
                        {'⭐'.repeat(Math.round(school.reputation.compositeScore / 20))}
                      </div>
                    </div>
                  )}
                </div>
                
                {school.traits && school.traits.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {school.traits.map((trait, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                        {trait}
                      </span>
                    ))}
                  </div>
                )}
                
                {school.phonePolicy && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs font-medium text-gray-600 mb-1">手机管理政策</div>
                    <p className="text-xs text-gray-500 leading-relaxed">{school.phonePolicy.substring(0, 120)}...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Score Chart */}
          <div className="mb-6">
            <ScoreTrendChart school={school} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* 2025 Enrollment */}
            {hasEnrollmentData && (
              <div className="lg:col-span-2">
                <SectionCard icon={Users} title="2025年招生详情">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {school.totalPlan2025 !== undefined && (
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500">总招生计划</div>
                        <div className="text-lg font-bold text-gray-900">{school.totalPlan2025} <span className="text-xs font-normal text-gray-400">人</span></div>
                      </div>
                    )}
                    {school.boardingPlan2025 !== undefined && (
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500">住宿生计划</div>
                        <div className="text-lg font-bold text-gray-900">{school.boardingPlan2025} <span className="text-xs font-normal text-gray-400">人</span></div>
                      </div>
                    )}
                    {school.dayPlan2025 !== undefined && (
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500">走读生计划</div>
                        <div className="text-lg font-bold text-gray-900">{school.dayPlan2025} <span className="text-xs font-normal text-gray-400">人</span></div>
                      </div>
                    )}
                    {school.acPlan2025 !== undefined && (
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500">AC类计划</div>
                        <div className="text-lg font-bold text-gray-900">{school.acPlan2025} <span className="text-xs font-normal text-gray-400">人</span></div>
                      </div>
                    )}
                    {school.dPlan2025 !== undefined && (
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500">D类计划</div>
                        <div className="text-lg font-bold text-gray-900">{school.dPlan2025} <span className="text-xs font-normal text-gray-400">人</span></div>
                      </div>
                    )}
                  </div>

                  {/* Detailed breakdown */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs font-semibold text-gray-700 mb-2">细分计划</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                      {school.boardingAc2025 !== undefined && (
                        <div className="flex justify-between bg-indigo-50/50 rounded-lg px-3 py-2">
                          <span className="text-gray-500">住宿AC</span>
                          <span className="font-medium text-gray-900">{school.boardingAc2025}</span>
                        </div>
                      )}
                      {school.boardingD2025 !== undefined && (
                        <div className="flex justify-between bg-indigo-50/50 rounded-lg px-3 py-2">
                          <span className="text-gray-500">住宿D</span>
                          <span className="font-medium text-gray-900">{school.boardingD2025}</span>
                        </div>
                      )}
                      {school.dayAc2025 !== undefined && (
                        <div className="flex justify-between bg-amber-50/50 rounded-lg px-3 py-2">
                          <span className="text-gray-500">走读AC</span>
                          <span className="font-medium text-gray-900">{school.dayAc2025}</span>
                        </div>
                      )}
                      {school.dayD2025 !== undefined && (
                        <div className="flex justify-between bg-amber-50/50 rounded-lg px-3 py-2">
                          <span className="text-gray-500">走读D</span>
                          <span className="font-medium text-gray-900">{school.dayD2025}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Indicator */}
                  {(school.indicatorAc2025 !== undefined || school.indicatorD2025 !== undefined) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-xs font-semibold text-gray-700 mb-2">指标生名额</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {school.indicatorAc2025 !== undefined && (
                          <div className="flex justify-between bg-purple-50/50 rounded-lg px-3 py-2">
                            <span className="text-gray-500">AC类指标生</span>
                            <span className="font-medium text-gray-900">{school.indicatorAc2025} 人</span>
                          </div>
                        )}
                        {school.indicatorD2025 !== undefined && (
                          <div className="flex justify-between bg-purple-50/50 rounded-lg px-3 py-2">
                            <span className="text-gray-500">D类指标生</span>
                            <span className="font-medium text-gray-900">{school.indicatorD2025} 人</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </SectionCard>
              </div>
            )}

            {/* Right Column */}
            <div className="space-y-6">
              {/* Indicator Control Line */}
              {hasIndicatorLine && (
                <Card className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
                  <CardContent className="pt-5">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <h3 className="text-base font-bold text-gray-900">指标生录取控制线</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {school.indicatorLineAc !== undefined && (
                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                          <div className="text-xs text-purple-600 mb-1">AC类控制线</div>
                          <div className="text-2xl font-bold text-purple-700">{school.indicatorLineAc}</div>
                          <div className="text-[10px] text-purple-400">610分制原始分</div>
                        </div>
                      )}
                      {school.indicatorLineD !== undefined && (
                        <div className="bg-indigo-50 rounded-xl p-4 text-center">
                          <div className="text-xs text-indigo-600 mb-1">D类控制线</div>
                          <div className="text-2xl font-bold text-indigo-700">{school.indicatorLineD}</div>
                          <div className="text-[10px] text-indigo-400">610分制原始分</div>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        指标生录取控制线为该校前三年（不含当年）第一批录取分数线的平均值<strong>下降20分</strong>。
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                        <li>达到控制线且填报该校指标生志愿的考生，<strong>按中考成绩从高到低录取</strong>，录满名额为止</li>
                        <li>指标生批次<strong>优先于</strong>第一批次（正取）录取</li>
                        <li>每位考生全市范围内只能填报<strong>1个</strong>指标生志愿</li>
                        <li>被指标生录取后，后续正取志愿<strong>自动失效</strong></li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reputation Card */}
              {school.reputation && (
                <Card className="rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-pink-500 to-rose-500" />
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-pink-600" />
                        <h3 className="text-base font-bold text-gray-900">在校生口碑</h3>
                      </div>
                      <span className="text-xs text-gray-400">样本量: {school.reputation.count}人</span>
                    </div>
                    
                    {/* 综合评分 */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-pink-50 rounded-xl">
                      <div className="text-3xl font-bold text-pink-700">{school.reputation.compositeScore || '-'}</div>
                      <div>
                        <div className="text-xs text-pink-600">综合口碑指数</div>
                        <div className="text-xs text-gray-400">满分100分</div>
                      </div>
                    </div>
                    
                    {/* 各维度评分条形图 */}
                    <div className="space-y-2">
                      {[
                        { label: '整体满意度', score: school.reputation.overallSatisfaction, color: 'bg-pink-500' },
                        { label: '师资配备', score: school.reputation.teacherQuality, color: 'bg-rose-500' },
                        { label: '授课质量', score: school.reputation.teachingQuality, color: 'bg-orange-500' },
                        { label: '管理制度', score: school.reputation.managementEffect, color: 'bg-amber-500' },
                        { label: '老师关注度', score: school.reputation.teacherAttention, color: 'bg-yellow-500' },
                        { label: '活动丰富度', score: school.reputation.activityRichness, color: 'bg-lime-500' },
                        { label: '食堂满意度', score: school.reputation.canteenSatisfaction, color: 'bg-green-500' },
                        { label: '宿舍满意度', score: school.reputation.dormSatisfaction, color: 'bg-emerald-500' },
                      ].filter(item => item.score !== undefined).map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-16 flex-shrink-0">{item.label}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                          </div>
                          <span className="text-xs font-medium text-gray-700 w-8 text-right">{item.score}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Class Types & Dormitory */}
              {hasClassDorm && (
                <SectionCard icon={Building2} title="班型与宿舍">
                  {school.classTypes && (
                    <InfoItem icon={SchoolIcon} label="班型设置" value={school.classTypes} />
                  )}
                  {school.dormitory && (
                    <InfoItem icon={Bed} label="宿舍情况" value={school.dormitory} />
                  )}
                </SectionCard>
              )}

              {/* Self Recruitment */}
              {hasSelfRecruit && (
                <SectionCard icon={BookOpen} title="自主招生">
                  {selfRecruit1Links.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 mb-1.5">一类自主招生</div>
                      <div className="space-y-1.5">
                        {selfRecruit1Links.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {selfRecruit2Links.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500 mb-1.5">二类自主招生</div>
                      <div className="space-y-1.5">
                        {selfRecruit2Links.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </SectionCard>
              )}

              {/* Official Admission Guide */}
              {school.admissionGuide && (
                <Card className="rounded-xl shadow-sm border border-gray-100">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-base font-bold text-gray-900">官方招生简章</h3>
                    </div>
                    <a
                      href={school.admissionGuide}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      查看官方招生简章
                    </a>
                  </CardContent>
                </Card>
              )}

              {/* Gaokao Value Added */}
              {gaokao && gaokao.relativeProgressRate !== undefined && (
                <SectionCard icon={TrendingUp} title="高考增值评价">
                  <div className="bg-emerald-50 rounded-xl p-4 text-center mb-3">
                    <div className="text-xs text-emerald-600 mb-1">相对进步率</div>
                    <div className="text-3xl font-bold text-emerald-700">{gaokao.relativeProgressRate}%</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {gaokao.gaokaoStrength !== undefined && (
                      <div className="flex justify-between bg-slate-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">高考实力</span>
                        <span className="font-medium text-gray-900">{gaokao.gaokaoStrength}</span>
                      </div>
                    )}
                    {gaokao.studentStrength !== undefined && (
                      <div className="flex justify-between bg-slate-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">生源实力</span>
                        <span className="font-medium text-gray-900">{gaokao.studentStrength}</span>
                      </div>
                    )}
                    {gaokao.changeValue !== undefined && (
                      <div className="flex justify-between bg-slate-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">变化值</span>
                        <span className={`font-medium ${gaokao.changeValue >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {gaokao.changeValue >= 0 ? '+' : ''}{gaokao.changeValue}
                        </span>
                      </div>
                    )}
                    {gaokao.progressValue !== undefined && (
                      <div className="flex justify-between bg-slate-50 rounded-lg px-3 py-2">
                        <span className="text-gray-500">进步值</span>
                        <span className="font-medium text-emerald-600">{gaokao.progressValue}</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                    数据来源：深圳市高考增值性评价报告。相对进步率反映学校对学生学业进步的贡献程度，数值越高说明学生在该校的相对进步越大。
                  </p>
                </SectionCard>
              )}
            </div>
          </div>

          {/* School Description */}
          {school.description && (
            <Card className="rounded-xl shadow-sm border border-gray-100 mb-6">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-gray-900">学校简介</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{school.description}</p>
                {school.features && school.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {school.features.map((f, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-lg font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Bottom CTA */}
          <div className="flex justify-center">
            <Link
              to="/?#schools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-medium border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              返回学校库
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
