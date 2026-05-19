import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router';
import { schoolCatalog } from '@/data/schoolCatalog';
import { getGaokaoValueAdded } from '@/data/gaokaoValueAdded';
import { ArrowLeft, MapPin, TrendingUp, Scale } from 'lucide-react';

export default function ComparePage() {
  const [searchParams] = useSearchParams();

  const selected = useMemo(() => {
    const ids = searchParams.get('ids')?.split(',') || [];
    return ids.map(id => schoolCatalog.find(s => s.id === id)).filter(Boolean) as typeof schoolCatalog;
  }, [searchParams]);

  if (selected.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">还没有加入对比的学校</p>
          <p className="text-sm text-gray-500 mb-4">请先到学校库勾选学校，再进入学校对比页面查看结果。</p>
          <Link to="/#schools" className="text-indigo-600 hover:underline">前往学校库</Link>
        </div>
      </div>
    );
  }

  const maxScore = Math.max(...selected.map(s => Math.max(s.acScore2025, s.dScore2025)));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="font-bold text-gray-900">学校对比</h1>
          <span className="text-xs text-gray-400 ml-auto">{selected.length}所学校</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Score Comparison Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">分数线对比</h2>
          <div className="space-y-3">
            {selected.map(s => (
              <div key={s.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{s.name}</span>
                  <span className="text-xs text-gray-400">AC {s.acScore2025} / D {s.dScore2025}</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(s.acScore2025 / maxScore) * 100}%` }}
                    />
                  </div>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(s.dScore2025 / maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500" />AC类</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-500" />D类</span>
          </div>
        </div>

        {/* Detail Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selected.map(s => {
            const gaokao = getGaokaoValueAdded(s.name);
            return (
              <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50">
                  <Link to={`/school/${s.id}`} className="font-bold text-indigo-700 hover:underline text-sm">
                    {s.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{s.district}</span>
                    <span>{s.level}</span>
                    <span>{s.type}</span>
                  </div>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">AC类分数线</span>
                    <span className="font-medium text-gray-900">{s.acScore2025}分</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">D类分数线</span>
                    <span className="font-medium text-gray-900">{s.dScore2025}分</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">招生计划</span>
                    <span className="font-medium text-gray-900">{s.plan2026}人</span>
                  </div>
                  {s.totalPlan2025 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">2025年计划</span>
                      <span className="font-medium text-gray-900">{s.totalPlan2025}人</span>
                    </div>
                  )}
                  {s.wenli && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">文理属性</span>
                      <span className="font-medium text-gray-900">{s.wenli}</span>
                    </div>
                  )}
                  {s.founded && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">创办年份</span>
                      <span className="font-medium text-gray-900">{s.founded}年</span>
                    </div>
                  )}
                  {s.reputation?.compositeScore && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">综合口碑</span>
                      <span className="font-medium text-amber-600">
                        {'⭐'.repeat(Math.round(s.reputation.compositeScore / 20))} {s.reputation.compositeScore}分
                      </span>
                    </div>
                  )}
                  {gaokao && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />高考增值
                      </span>
                      <span className="font-medium text-emerald-600">{gaokao.relativeProgressRate}%</span>
                    </div>
                  )}
                  {s.traits && s.traits.length > 0 && (
                    <div className="pt-2 border-t border-gray-50">
                      <div className="flex flex-wrap gap-1">
                        {s.traits.map((t, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
