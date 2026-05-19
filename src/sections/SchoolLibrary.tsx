import { useState } from 'react';
import { Link } from 'react-router';
import type { District, SchoolTrait } from '@/types';
import { schools } from '@/data/schools';
import { getGaokaoValueAdded } from '@/data/gaokaoValueAdded';
import { Search, CheckCircle, X, ExternalLink, TrendingUp, Scale, LibraryBig } from 'lucide-react';

export default function SchoolLibrary() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'ac' | 'd' | 'progress'>('ac');
  const [filterWenli, setFilterWenli] = useState<string>('all');
  const [filterTrait, setFilterTrait] = useState<string>('all');
  const [filterReputation, setFilterReputation] = useState<string>('all');
  const [filterSize, setFilterSize] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const districts: District[] = ['福田', '罗湖', '南山', '宝安', '龙岗', '龙华', '光明', '坪山', '盐田', '大鹏', '深汕'];

  const filtered = schools
    .filter(s => {
      if (search && !s.name.includes(search)) return false;
      if (filterType !== 'all' && s.type !== filterType) return false;
      if (filterDistrict !== 'all' && s.district !== filterDistrict) return false;
      if (filterWenli !== 'all' && s.wenli !== filterWenli) return false;
      if (filterTrait !== 'all' && !s.traits?.includes(filterTrait as SchoolTrait)) return false;
      if (filterReputation !== 'all') {
        const score = s.reputation?.compositeScore || 0;
        if (filterReputation === 'high' && score < 75) return false;
        if (filterReputation === 'medium' && (score < 60 || score >= 75)) return false;
        if (filterReputation === 'low' && score >= 60) return false;
      }
      if (filterSize !== 'all') {
        const plan = s.totalPlan2025 || s.plan2026;
        if (filterSize === 'large' && plan < 1000) return false;
        if (filterSize === 'medium' && (plan < 500 || plan >= 1000)) return false;
        if (filterSize === 'small' && plan >= 500) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'ac') return b.acScore2025 - a.acScore2025;
      if (sortBy === 'd') return b.dScore2025 - a.dScore2025;
      // sortBy === 'progress'
      const progA = getGaokaoValueAdded(a.name)?.relativeProgressRate || 0;
      const progB = getGaokaoValueAdded(b.name)?.relativeProgressRate || 0;
      return progB - progA;
    });

  const getLevelBadge = (level: string) => {
    if (level === '四大名校') return 'bg-red-100 text-red-700';
    if (level === '八大名校') return 'bg-orange-100 text-orange-700';
    if (level === '区属重点') return 'bg-indigo-100 text-indigo-700';
    if (level === '民办') return 'bg-gray-100 text-gray-600';
    return 'bg-slate-100 text-slate-600';
  };

  const getHistoryRows = (school: typeof schools[number]) => {
    if (!school.historicalScores) return [];
    return Object.entries(school.historicalScores)
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
      .slice(0, 3)
      .map(([year, data]) => ({
        year,
        ac: data.ac,
        d: data.d,
      }));
  };

  return (
    <section id="schools" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 scroll-animate">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">深圳高中学校库</h2>
          <p className="text-gray-500">收录深圳102所普通高中2025年录取分数线，数据已换算为630分制</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 scroll-animate">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索学校名称..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm bg-white"
              >
                <option value="all">全部类型</option>
                <option value="公办">公办</option>
                <option value="民办">民办</option>
              </select>
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm bg-white"
              >
                <option value="all">全部区域</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'ac' | 'd')}
                className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm bg-white"
              >
                <option value="ac">按AC类排序</option>
                <option value="d">按D类排序</option>
                <option value="progress">按培养能力</option>
              </select>
              <select
                value={filterWenli}
                onChange={(e) => setFilterWenli(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm bg-white"
              >
                <option value="all">全部文理</option>
                <option value="偏理">偏理</option>
                <option value="偏文">偏文</option>
                <option value="均衡">均衡</option>
              </select>
              <select
                value={filterTrait}
                onChange={(e) => setFilterTrait(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm bg-white"
              >
                <option value="all">全部特色</option>
                <option value="竞赛强校">竞赛强校</option>
                <option value="艺术特色">艺术特色</option>
                <option value="体育特色">体育特色</option>
                <option value="外语特色">外语特色</option>
                <option value="管理严格">管理严格</option>
                <option value="管理自由">管理自由</option>
                <option value="老牌名校">老牌名校</option>
                <option value="新兴学校">新兴学校</option>
              </select>
              <select
                value={filterReputation}
                onChange={(e) => setFilterReputation(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm bg-white"
              >
                <option value="all">全部口碑</option>
                <option value="high">口碑优秀(75+)</option>
                <option value="medium">口碑良好(60-75)</option>
                <option value="low">口碑一般</option>
              </select>
              <select
                value={filterSize}
                onChange={(e) => setFilterSize(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm bg-white"
              >
                <option value="all">全部规模</option>
                <option value="large">大规模(1000+)</option>
                <option value="medium">中规模(500-1000)</option>
                <option value="small">小规模(&lt;500)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl border border-gray-100 px-4 py-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <LibraryBig className="w-4 h-4 text-indigo-500" />
              学校库结果
            </div>
            <p className="mt-1 text-sm text-gray-500">
              当前筛选得到 <span className="font-semibold text-gray-900">{filtered.length}</span> 所学校
              {selectedIds.size > 0 && (
                <>
                  ，已加入对比 <span className="font-semibold text-indigo-600">{selectedIds.size}</span> 所
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs px-3 py-1.5 text-gray-500 hover:text-gray-700 transition-colors"
              >
                清空已选
              </button>
            )}
            <Link
              to={selectedIds.size > 0 ? `/compare?ids=${Array.from(selectedIds).join(',')}` : '/compare'}
              className={`inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg transition-colors ${
                selectedIds.size > 0
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              {selectedIds.size > 0 ? '查看学校对比' : '先勾选学校再对比'}
            </Link>
          </div>
        </div>

        {/* School Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filtered.length === 0 && (
            <div className="px-6 py-14 text-center">
              <LibraryBig className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-gray-900 mb-2">当前筛选下没有匹配学校</h3>
              <p className="text-sm text-gray-500 mb-4">请放宽区域、类型、特色或规模条件后再查看学校库。</p>
              <button
                onClick={() => {
                  setSearch('');
                  setFilterType('all');
                  setFilterDistrict('all');
                  setSortBy('ac');
                  setFilterWenli('all');
                  setFilterTrait('all');
                  setFilterReputation('all');
                  setFilterSize('all');
                }}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm hover:bg-indigo-100 transition-colors"
              >
                重置筛选
              </button>
            </div>
          )}

          {/* Desktop Table */}
          {filtered.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 w-10">对比</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">排名</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">学校名称</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">区域</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">类型</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">层次</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">文理</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">历年参考</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">口碑</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">AC类分数</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">D类分数</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">住宿</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((school, idx) => (
                  <tr key={school.id} className="hover:bg-indigo-50/50 transition-colors duration-150">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(school.id)}
                        onChange={() => toggleSelect(school.id)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <Link to={`/school/${school.id}`} className="font-medium text-sm text-indigo-700 hover:text-indigo-900 hover:underline flex items-center gap-1">
                        {school.name}
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </Link>
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        {school.traits?.slice(0, 2).map((t, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">
                            {t}
                          </span>
                        ))}
                        {school.founded && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                            {school.founded}年
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{school.district}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${school.type === '公办' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {school.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelBadge(school.level)}`}>
                          {school.level}
                        </span>
                        {(() => {
                          const gaokao = getGaokaoValueAdded(school.name);
                          if (gaokao?.relativeProgressRate && gaokao.relativeProgressRate > 3) {
                            return (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 flex items-center gap-0.5" title={`高考相对进步率: ${gaokao.relativeProgressRate}%`}>
                                <TrendingUp className="w-3 h-3" />
                                {gaokao.relativeProgressRate}%
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{school.wenli || '-'}</td>
                    <td className="px-4 py-3">
                      {getHistoryRows(school).length > 0 ? (
                        <div className="space-y-1">
                          {getHistoryRows(school).map((row) => (
                            <div key={row.year} className="text-[11px] text-gray-500 whitespace-nowrap">
                              <span className="font-medium text-gray-700">{row.year}</span>
                              <span className="ml-2">AC {row.ac}</span>
                              <span className="ml-2">D {row.d}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-amber-500">
                      {school.reputation?.compositeScore ? '⭐'.repeat(Math.round(school.reputation.compositeScore / 20)) : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${school.acScore2025 >= 580 ? 'text-red-600' : school.acScore2025 >= 540 ? 'text-indigo-600' : 'text-gray-700'}`}>
                        {school.acScore2025}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${school.dScore2025 >= 580 ? 'text-red-600' : school.dScore2025 >= 540 ? 'text-indigo-600' : 'text-gray-700'}`}>
                        {school.dScore2025}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {school.hasBoarding ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          {/* Mobile Cards */}
          {filtered.length > 0 && (
          <div className="md:hidden divide-y divide-gray-50">
            {filtered.slice(0, 20).map((school, idx) => (
              <div key={school.id} className="p-4 hover:bg-indigo-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(school.id)}
                    onChange={() => toggleSelect(school.id)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelBadge(school.level)}`}>{school.level}</span>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">#{idx + 1}</span>
                      <Link to={`/school/${school.id}`} className="font-medium text-sm text-indigo-700 hover:underline">
                        {school.name}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{school.district}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {school.wenli && <span className="text-xs text-gray-500">{school.wenli}</span>}
                      {school.reputation?.compositeScore && (
                        <span className="text-xs text-amber-500">
                          {'⭐'.repeat(Math.round(school.reputation.compositeScore / 20))}
                        </span>
                      )}
                    </div>
                    {getHistoryRows(school).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {getHistoryRows(school).map((row) => (
                          <span key={row.year} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                            {row.year} AC {row.ac} / D {row.d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-indigo-600">{school.acScore2025}<span className="text-xs font-normal text-gray-400">/AC</span></div>
                    <div className="text-sm font-bold text-gray-600">{school.dScore2025}<span className="text-xs font-normal text-gray-400">/D</span></div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length > 20 && (
              <div className="p-4 text-center text-sm text-gray-400">还有 {filtered.length - 20} 所学校，请在桌面端查看完整列表</div>
            )}
          </div>
          )}
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">注：分数线已按 2026年630分制换算，数据来源于2025年深圳中考录取标准</p>
      </div>
    </section>
  );
}
