import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import Navbar from '@/sections/Navbar';
import Footer from '@/sections/Footer';
import { schoolCatalog } from '@/data/schoolCatalog';
import {
  ADMISSION_PLAN_2026_DATA_NOTES,
  getAdmissionPlanCoverageSummary,
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
    const filterByTerm = <T extends { name: string }>(items: readonly T[]) =>
      items.filter((item) => !term || item.name.includes(term));

    if (activeTab === 'public') return filterByTerm(publicPlans);
    if (activeTab === 'quota') return filterByTerm(quotaPlans);
    if (activeTab === 'private') return filterByTerm(privateHighSchoolPlans2026);
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
                  2026 招生计划查询
                </div>
                <h1 className="mt-3 text-3xl font-bold text-slate-900">深圳 2026 录取计划数据库</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  已解析你新增的 4 份官方 PDF，当前可直接查询公办普高、名额分配、民办普高和中职技工计划。公办普高总计划和名额分配计划已开始用于推荐模型的计划修正与指标生推荐。
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
              当前公办学校库匹配覆盖：公办计划 <strong>{coverage.matchedPublic}</strong> 所，名额分配计划 <strong>{coverage.matchedQuota}</strong> / <strong>{coverage.eligibleQuotaSchools}</strong> 所。
            </div>

            <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 lg:grid-cols-3">
              <div>
                <div className="font-semibold text-slate-900">数据来源</div>
                <div className="mt-1 leading-6">{ADMISSION_PLAN_2026_DATA_NOTES.source}</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">修正策略</div>
                <div className="mt-1 leading-6">{ADMISSION_PLAN_2026_DATA_NOTES.runtimePolicy}</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">覆盖口径</div>
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
                  placeholder="按学校名称搜索"
                  className="w-56 bg-transparent outline-none placeholder:text-slate-400"
                />
              </label>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
              <div className="grid grid-cols-[96px,1.6fr,1fr,1fr,1fr] gap-3 bg-slate-900 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-100">
                <div>序号</div>
                <div>学校</div>
                <div>计划</div>
                <div>住宿/分类</div>
                <div>链接/说明</div>
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
                    return (
                      <div key={`${activeTab}-${planItem.serial}-${planItem.name}`} className="grid grid-cols-1 gap-3 px-4 py-4 text-sm text-slate-700 lg:grid-cols-[96px,1.6fr,1fr,1fr,1fr]">
                        <div className="font-semibold text-slate-900">{planItem.serial}</div>
                        <div>
                          <div className="font-semibold text-slate-900">{planItem.name}</div>
                          {planItem.level && <div className="mt-1 text-xs text-slate-500">{planItem.level}</div>}
                        </div>
                        <div>
                          <div>总计划 <strong>{planItem.totalPlan}</strong></div>
                          <div className="text-xs text-slate-500">住宿 {planItem.boardingPlan} / 走读 {planItem.dayPlan}</div>
                        </div>
                        <div>公办普高</div>
                        <div>
                          {schoolId ? (
                            <Link to={`/school/${schoolId}`} className="text-indigo-600 hover:text-indigo-800">
                              查看学校详情
                            </Link>
                          ) : (
                            <span className="text-slate-400">仅计划库收录</span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (activeTab === 'quota') {
                    const quotaItem = item as (typeof quotaPlans)[number];
                    return (
                      <div key={`${activeTab}-${quotaItem.serial}-${quotaItem.name}`} className="grid grid-cols-1 gap-3 px-4 py-4 text-sm text-slate-700 lg:grid-cols-[96px,1.6fr,1fr,1fr,1fr]">
                        <div className="font-semibold text-slate-900">{quotaItem.serial}</div>
                        <div>
                          <div className="font-semibold text-slate-900">{quotaItem.name}</div>
                        </div>
                        <div>
                          <div>AC <strong>{quotaItem.acQuota}</strong></div>
                          <div className="text-xs text-slate-500">D {quotaItem.dQuota}</div>
                        </div>
                        <div>名额分配</div>
                        <div>
                          {schoolId ? (
                            <Link to={`/school/${schoolId}`} className="text-indigo-600 hover:text-indigo-800">
                              查看学校详情
                            </Link>
                          ) : (
                            <span className="text-slate-400">仅计划库收录</span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (activeTab === 'private') {
                    const privateItem = item as (typeof privateHighSchoolPlans2026)[number];
                    return (
                      <div key={`${activeTab}-${privateItem.serial}-${privateItem.name}`} className="grid grid-cols-1 gap-3 px-4 py-4 text-sm text-slate-700 lg:grid-cols-[96px,1.6fr,1fr,1fr,1fr]">
                        <div className="font-semibold text-slate-900">{privateItem.serial}</div>
                        <div>
                          <div className="font-semibold text-slate-900">{privateItem.name}</div>
                          {privateItem.level && <div className="mt-1 text-xs text-slate-500">{privateItem.level}</div>}
                        </div>
                        <div>总计划 <strong>{privateItem.totalPlan}</strong></div>
                        <div>{privateItem.accommodation || '未注明'}</div>
                        <div className="text-slate-400">查询页展示</div>
                      </div>
                    );
                  }

                  const vocationalItem = item as (typeof vocationalPlans2026)[number];
                  return (
                    <div key={`${activeTab}-${vocationalItem.serial}-${vocationalItem.name}`} className="grid grid-cols-1 gap-3 px-4 py-4 text-sm text-slate-700 lg:grid-cols-[96px,1.6fr,1fr,1fr,1fr]">
                      <div className="font-semibold text-slate-900">{vocationalItem.serial}</div>
                      <div>
                        <div className="font-semibold text-slate-900">{vocationalItem.name}</div>
                        {vocationalItem.level && <div className="mt-1 text-xs text-slate-500">{vocationalItem.level}</div>}
                      </div>
                      <div>总计划 <strong>{vocationalItem.totalPlan}</strong></div>
                      <div>{vocationalItem.accommodation || vocationalItem.nature || '未注明'}</div>
                      <div className="text-slate-400">查询页展示</div>
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
