import { Calculator, SlidersHorizontal, ClipboardList } from 'lucide-react';

export default function StepsSection() {
  const steps = [
    {
      icon: Calculator,
      title: '输入成绩信息',
      desc: '填写中考预估成绩、考生类型（AC类/D类）、意向区域等基本信息',
      color: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50',
    },
    {
      icon: SlidersHorizontal,
      title: '设置偏好倾向',
      desc: '选择区域、学校层级、住宿需求、通勤接受度与填报风格等偏好',
      color: 'from-indigo-500 to-purple-500',
      bg: 'bg-indigo-50',
    },
    {
      icon: ClipboardList,
      title: '获取志愿方案',
      desc: '系统自动生成12个公办普高志愿，并按冲刺、匹配、保底梯度排序',
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 scroll-animate">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">三步完成志愿填报</h2>
          <p className="text-gray-500">简单操作，专业输出，让填报不再迷茫</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="scroll-animate group p-6 sm:p-8 rounded-2xl bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className={`w-14 h-14 rounded-xl ${step.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-7 h-7 text-indigo-600" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">步骤 {i + 1}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
