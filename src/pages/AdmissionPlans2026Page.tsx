import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import Navbar from '@/sections/Navbar';
import Footer from '@/sections/Footer';
import { schoolCatalog } from '@/data/schoolCatalog';
import {
  ADMISSION_PLAN_2026_DATA_NOTES,
  getAdmissionPlanCoverageSummary,
  getPrivateGuideMeta2026BySchoolName,
  getPublicGuideMeta2026BySchoolName,
  getValidatedPublicHighSchoolPlans2026,
  getValidatedQuotaPlans2026,
  normalizeAdmissionPlanSchoolName,
  privateHighSchoolPlans2026,
  vocationalPlans2026,
} from '@/data/admissionPlans2026Utils';
import { Search, Database, Building2, GraduationCap, ShieldCheck, Briefcase } from 'lucide-react';

type TabKey = 'public' | 'quota' | 'private' | 'vocational';

const tabs: Array<{ key: TabKey; label: string; icon: typeof Building2 }> = [
  { key: 'public', label: '公办普高计划', icon: Building2 },
  { key: 'quota', label: '名额分配计划', icon: ShieldCheck },
  { key: 'private', label: '民办普高计划', icon: GraduationCap },
  { key: 'vocational', label: '中职技工计划', icon: Briefcase },
];

function findSchoolIdByPlanName(planName: string) {
  const normalized = normalizeAdmissionPlanSchoolName(planName);
  return schoolCatalog.find((school) => normalizeAdmissionPlanSchoolName(school.name) === normalized)?.id;
}

export default function AdmissionPlans2026Page() {
  const [activeTab, setActiveTab] = useState<TabKey>('public');
  const [keyword, setKeyword] = useState('');
  const publicPlans = useMemo(() => getValidatedPublicHighSchoolPlans2026(), []);
  const quotaPlans = useMemo(() => getValidatedQuotaPlans2026(), []);
  const coverage = useMemo(
    () => getAdmissionPlanCoverageSummary(schoolCatalog.filter((school) => school.type === '公办').map((school) => school.name)),
    []
  );

  const filteredItems = useMemo(() => {
    const term = keyword.trim();
    const filterByTerm = <T extends { name: string }>(
      items: readonly T[],
      getMeta?: (name: string) => { schoolCodes?: readonly string[] } | undefined
    ) =>
      items.filter((item) => {
        if (!term) return true;
        const codes = getMeta?.(item.name)?.schoolCodes?.join(' ') || '';
        return item.name.includes(term) || codes.includes(term);
      });

    if (activeTab === 'public') return filterByTerm(publicPlans, getPublicGuideMeta2026BySchoolName);
    if (activeTab === 'quota') return filterByTerm(quotaPlans, getPublicGuideMeta2026BySchoolName);
    if (activeTab === 'private') return filterByTerm(privateHighSchoolPlans2026, getPrivateGuideMeta2026BySchoolName);
    return filterByTerm(vocationalPlans2026);
  }, [activeTab, keyword, publicPlans, quotaPlans]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar onNavigate={() => undefined} />

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <section className="rounded-[32px] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  <Database className="h-3.5 w-3.5" />
                  2026 年招生计划查询
                </div>
                <h1 className="mt-3 text-3xl font-bold text-slate-900">深圳市 2026 年高中阶段学校招生计划查询</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  本页汇总展示 2026 年公办普通高中招生计划、名额分配计划、民办普通高中招生计划和中等职业学校、技工院校招生计划，供考生和家长查询参考。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 sm:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="text-lg font-bold text-slate-900">{publicPlans.length}</div>
                  <div>公办普高条目</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="text-lg font-bold text-slate-900">{quotaPlans.length}</div>
                  <div>名额分配条目</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="text-lg font-bold text-slate-900">{privateHighSchoolPlans2026.length}</div>
                  <div>民办普高条目</div>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="text-lg font-bold text-slate-900">{vocationalPlans2026.length}</div>
                  <div>中职技工条目</div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              当前页面已收录并校验的学校计划中，公办普通高中计划对应 <strong>{coverage.matchedPublic}</strong> 所学校，名额分配计划对应 <strong>{coverage.matchedQuota}</strong> / <strong>{coverage.eligibleQuotaSchools}</strong> 所应参与名额分配的公办学校。
            </div>

            <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 lg:grid-cols-3">
              <div>
                <div className="font-semibold text-slate-900">数据来源</div>
                <div className="mt-1 leading-6">{ADMISSION_PLAN_2026_DATA_NOTES.source}</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">数据口径</div>
                <div className="mt-1 leading-6">{ADMISSION_PLAN_2026_DATA_NOTES.runtimePolicy}</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">统计口径</div>
                <div className="mt-1 leading-6">{ADMISSION_PLAN_2026_DATA_NOTES.coveragePolicy}</div>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[32px] border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                        active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
                <Search className="h-4 w-4" />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="按学校名称或学校代码搜索"
                  className="w-56 bg-transparent outline-none placeholder:text-slate-400"
                />
              </label>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
              <div className="grid grid-cols-[96px,1.6fr,1fr,1fr,1.3fr] gap-3 bg-slate-900 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-100">
                <div>序号</div>
                <div>学校</div>
                <div>计划</div>
                <div>代码/范围</div>
                <div>详情</div>
              </div>

              <div className="divide-y divide-slate-200">
                {filteredItems.length === 0 && (
                  <div className="px-4 py-12 text-center text-sm text-slate-500">
                    当前筛选下没有匹配结果，请更换学校名称关键词后再试。
                  </div>
                )}
                {filteredItems.map((item) => {
                  const schoolId = findSchoolIdByPlanName(item.name);

                  if (activeTab === 'public') {
                    const planItem = item as (typeof publicPlans)[number];
                    const guideMeta = getPublicGuideMeta2026BySchoolName(planItem.name);
                    return (
                      <div key={`${activeTab}-${planItem.serial}-${planItem.name}`} className="grid grid-cols-1 gap-3 px-4 py-4 text-sm text-slate-700 lg:grid-cols-[96px,1.6fr,1fr,1fr,1.3fr]">
                        <div className="font-semibold text-slate-900">{planItem.serial}</div>
                        <div>
                          <div className="font-semibold text-slate-900">{planItem.name}</div>
                          {planItem.level && <div className="mt-1 text-xs text-slate-500">{planItem.level}</div>}
                        </div>
                        <div>
                          <div>总计划 <strong>{planItem.totalPlan}</strong></div>
                          <div className="text-xs text-slate-500">住宿 {planItem.boardingPlan} / 走读 {planItem.dayPlan}</div>
                        </div>
                        <div>
                          <div>{guideMeta?.schoolCodes.join(' / ') || '未注明'}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {guideMeta?.recruitRanges.join('；') || '面向范围以官方计划表为准'}
                          </div>
                        </div>
                        <div>
                          {guideMeta?.remarks.length ? (
                            <div className="mb-1 text-xs leading-5 text-slate-500">{guideMeta.remarks.join('；')}</div>
                          ) : null}
                          {schoolId ? (
                            <Link to={`/school/${schoolId}`} className="text-indigo-600 hover:text-indigo-800">
                              查看学校详情
                            </Link>
                          ) : (
                            <span className="text-slate-400">暂无学校详情页</span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (activeTab === 'quota') {
                    const quotaItem = item as (typeof quotaPlans)[number];
                    const guideMeta = getPublicGuideMeta2026BySchoolName(quotaItem.name);
                    return (
                      <div key={`${activeTab}-${quotaItem.serial}-${quotaItem.name}`} className="grid grid-cols-1 gap-3 px-4 py-4 text-sm text-slate-700 lg:grid-cols-[96px,1.6fr,1fr,1fr,1.3fr]">
                        <div className="font-semibold text-slate-900">{quotaItem.serial}</div>
                        <div>
                          <div className="font-semibold text-slate-900">{quotaItem.name}</div>
                        </div>
                        <div>
                          <div>AC <strong>{quotaItem.acQuota}</strong></div>
                          <div className="text-xs text-slate-500">D {quotaItem.dQuota} / ACD {quotaItem.acdQuota}</div>
                        </div>
                        <div>
                          <div>{guideMeta?.schoolCodes.join(' / ') || '未注明'}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {guideMeta?.recruitRanges.join('；') || '面向范围以官方计划表为准'}
                          </div>
                        </div>
                        <div>
                          {guideMeta?.remarks.length ? (
                            <div className="mb-1 text-xs leading-5 text-slate-500">{guideMeta.remarks.join('；')}</div>
                          ) : null}
                          {schoolId ? (
                            <Link to={`/school/${schoolId}`} className="text-indigo-600 hover:text-indigo-800">
                              查看学校详情
                            </Link>
                          ) : (
                            <span className="text-slate-400">暂无学校详情页</span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (activeTab === 'private') {
                    const privateItem = item as (typeof privateHighSchoolPlans2026)[number];
                    const guideMeta = getPrivateGuideMeta2026BySchoolName(privateItem.name);
                    return (
                      <div key={`${activeTab}-${privateItem.serial}-${privateItem.name}`} className="grid grid-cols-1 gap-3 px-4 py-4 text-sm text-slate-700 lg:grid-cols-[96px,1.6fr,1fr,1fr,1.3fr]">
                        <div className="font-semibold text-slate-900">{privateItem.serial}</div>
                        <div>
                          <div className="font-semibold text-slate-900">{privateItem.name}</div>
                          {privateItem.level && <div className="mt-1 text-xs text-slate-500">{privateItem.level}</div>}
                        </div>
                        <div>总计划 <strong>{privateItem.totalPlan}</strong></div>
                        <div>
                          <div>{guideMeta?.schoolCodes.join(' / ') || '未注明'}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {guideMeta?.recruitRanges.join('；') || privateItem.accommodation || '未注明'}
                          </div>
                        </div>
                        <div>
                          {guideMeta?.remarks.length ? (
                            <div className="text-xs leading-5 text-slate-500">{guideMeta.remarks.join('；')}</div>
                          ) : (
                            <div className="text-slate-400">计划信息展示</div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  const vocationalItem = item as (typeof vocationalPlans2026)[number];
                  return (
                    <div key={`${activeTab}-${vocationalItem.serial}-${vocationalItem.name}`} className="grid grid-cols-1 gap-3 px-4 py-4 text-sm text-slate-700 lg:grid-cols-[96px,1.6fr,1fr,1fr,1.3fr]">
                      <div className="font-semibold text-slate-900">{vocationalItem.serial}</div>
                      <div>
                        <div className="font-semibold text-slate-900">{vocationalItem.name}</div>
                        {vocationalItem.level && <div className="mt-1 text-xs text-slate-500">{vocationalItem.level}</div>}
                      </div>
                      <div>总计划 <strong>{vocationalItem.totalPlan}</strong></div>
                      <div>{vocationalItem.accommodation || vocationalItem.nature || '未注明'}</div>
                      <div className="text-slate-400">计划信息展示</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
