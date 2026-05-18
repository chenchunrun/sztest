import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Target, Users, Star, BarChart3, Shield } from 'lucide-react';

export default function RulesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const rules = [
    {
      title: '录取批次与志愿数量',
      icon: BookOpen,
      content: '深圳中考录取分五个批次：①自主招生批（1个志愿）；②指标生批（1个志愿）；③第一批次（12个普高志愿 + 4个中职志愿）；④第二批次（18个中职志愿）；⑤第三批次（6个技校志愿）。其中第一批次是大多数考生的核心填报批次。',
    },
    {
      title: '投档录取规则',
      icon: Target,
      content: '深圳中考采用"分数优先，依照志愿顺序"的投档原则。所有考生按总分从高到低排序，依次检索每位考生的志愿。高分考生优先投档，同一考生则按志愿顺序依次检索。总分相同时，先比较生物与地理（合卷）分数，再比较语数英三科总分。',
    },
    {
      title: '指标生政策',
      icon: Users,
      content: '符合指标生资格的考生可填报1个指标生志愿。指标生录取控制线为该校前三年（不含当年）第一批录取分数线的平均值下降20分。指标生批次志愿与第一批次志愿相互独立。考生如在指标生批次被录取，不再参加后续批次投档。各公办普高未完成的指标生计划自动转为普通生计划。',
    },
    {
      title: '自主招生政策',
      icon: Star,
      content: '部分普通高中开展自主招生，招生比例原则上不超过学校年度招生计划的10%。拟报考自主招生的考生仍需正常填报中考志愿。若被自招录取，后续志愿自动失效。自主招生考核通过的考生须参加全市统一中考。',
    },
    {
      title: '同分比较规则',
      icon: BarChart3,
      content: '中考总分相同时，按以下顺序进行"同分比较"优先投档：①生物与地理（合卷）分数高的优先；②语、数、英三科总分高的优先。省一级公办普高所录取的考生，语文、数学、英语、物理与化学、历史与道法单科等级须在C+以上（含C+），体育单科等级为C以上（含C）。',
    },
    {
      title: '冲稳保填报策略',
      icon: Shield,
      content: '科学分配12个志愿：前3-4个"冲一冲"（填报分数线略高于自己水平的学校），中间4个"稳一稳"（填报与自己水平匹配的学校），最后4个"保一保"（填报分数线低于自己水平的学校保底）。建议志愿间拉开60分以上的总梯度，避免填报同分段学校造成滑档风险。',
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
