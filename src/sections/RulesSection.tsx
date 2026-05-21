import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Target, Users, Star, BarChart3, Shield, AlertTriangle } from 'lucide-react';

export default function RulesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const rules = [
    {
      title: '录取批次与志愿数量',
      icon: BookOpen,
      content: '深圳中考录取分五个批次：①自主招生批；②名额分配批；③第一批次统一招生；④第二批次中职学校录取；⑤第三批次部、省属（含跨市）中职类学校录取。2026 年统一招生志愿填报时间为 5 月 23 日 10:00 至 6 月 1 日 18:00，其中第一批次最多可填 16 个志愿，含不超过 12 个普通高中志愿和 4 个中职、技工志愿；第二批次可填 18 个中职志愿。',
    },
    {
      title: '投档录取规则',
      icon: Target,
      content: '深圳中考采用"分数优先，依照志愿顺序"的投档原则。所有考生按总分从高到低排序，依次检索每位考生的志愿。高分考生优先投档，同一考生则按志愿顺序依次检索。总分相同时，先比较生物与地理（合卷）分数，再比较语数英三科总分。',
    },
    {
      title: '指标生政策',
      icon: Users,
      content: '符合名额分配资格的考生可填报 1 个名额分配志愿。名额分配录取控制线为招生学校近三年相应类别第一批录取分数线折算到满分 630 分后的平均分下浮 20 分。名额分配批次先于第一批正取录取，被录取后后续 12 个正取志愿自动失效；如考生想同时参加该校第一批统招，仍需在第一批志愿中再次填报该校。各公办普高未完成的名额分配计划自动转为普通生计划。',
    },
    {
      title: '自主招生政策',
      icon: Star,
      content: '部分普通高中开展自主招生，招生比例原则上不超过学校年度招生计划的10%。拟报考自主招生的考生仍需正常填报中考志愿。若被自招录取，后续志愿自动失效。自主招生考核通过的考生须参加全市统一中考。',
    },
    {
      title: '同分比较规则',
      icon: BarChart3,
      content: '中考总分相同时，按以下顺序进行同分比较：①生物学与地理（合卷）分数高的优先；②语文、数学、英语三科总分高的优先。报考省一级公办普通高中时，综合素质评价须达到达标等级，语文、数学、英语、物理与化学、历史、道德与法治单科等级须达到 C+ 及以上，体育须达到 C 及以上。',
    },
    {
      title: '走读调剂规则',
      icon: BarChart3,
      content: '2026 年第一批统一招生的公办普通高中志愿中，最多只有 4 所学校可以勾选“接受走读调剂”。被学校按走读调剂录取后，不再参加后续志愿投档，也不能在录取后要求学校改为住宿。本系统会在生成结果后，按通勤、区域和梯度给出最多 4 所走读调剂建议，最终是否勾选仍需在官方志愿填报系统中确认。',
    },
    {
      title: '冲稳保填报策略',
      icon: Shield,
      content: '12个志愿的核心不是简单按学校名气堆叠，而是拉开梯度并把最好的可达学校尽量往前放。系统支持“4冲4稳4保”和“3冲6稳3保”两种结构模式；两种模式都遵循同一套推荐算法，只调整冲、稳、保三类志愿的数量配比。中高分段会严格保持所选结构，低分尾部则优先补足公办学校密度，同时尽量避免学校过度扎堆在同一小分段。',
    },
    {
      title: '志愿确认与修改次数',
      icon: BookOpen,
      content: '2026 年网上志愿填报期间，考生在规定时间内可以修改志愿，但确认机会只有 3 次，用完后不能再改。填报结束后，须按学校要求打印并在 6 月 8 日前交回《志愿确认回执》。本系统给出的结果仅作预填参考，正式提交前请务必再核对学校代码、志愿顺序和走读调剂勾选情况。',
    },
    {
      title: '补录与第二次划线',
      icon: AlertTriangle,
      content: '若第一批未被录取，后续仍可能进入补录或第二次划线阶段，但按官方历年口径，第二次划线时公办普通高中通常已无计划，主要以民办普高补录和中职注册入学为主。因此对公办目标明确的考生来说，第一批的公办志愿梯度必须尽量做实，不能把补录当成常规保底路径。',
    },
    {
      title: '资助与费用提醒',
      icon: Users,
      content: '报考时除分数和梯度外，还应同步考虑学费、住宿费和资助政策。公办普高学费通常较低，民办和特色班费用差异较大。官方手册同时列有普通高中和中职学校的学生资助政策，家庭对费用敏感时，建议在正式填报前一并核对学校收费标准与可申请资助项目。',
    },
  ];

  return (
    <section id="rules" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 scroll-animate">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">深圳中考志愿填报规则</h2>
          <p className="text-gray-500">掌握规则，科学填报，避免踩坑</p>
        </div>

        <div className="space-y-3">
          {rules.map((rule, i) => (
            <div
              key={i}
              className="scroll-animate border border-gray-100 rounded-xl overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors duration-150"
              >
                <rule.icon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="flex-1 font-semibold text-gray-900 text-sm">{rule.title}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 pt-0 border-t border-gray-50">
                  <p className="text-sm text-gray-600 leading-relaxed pl-8">{rule.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
