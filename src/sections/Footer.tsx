import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">Shenzhen High School Admission Application</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              基于2025年真实录取数据，为深圳中考考生提供科学、专业的志愿填报建议。
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">快速链接</h4>
            <div className="space-y-2">
              {['智能填报', '学校库', '填报规则'].map((link) => (
                <button
                  key={link}
                  onClick={() => document.getElementById(link === '智能填报' ? 'form' : link === '学校库' ? 'schools' : 'rules')?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-sm text-slate-400 hover:text-indigo-300 transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">重要声明</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              本网站数据来源于公开渠道，提供的学校信息、录取数据、志愿方案和概率测算仅供考生与家长参考，不构成任何录取承诺或正式填报依据。本网站不对考生最终录取结果负责，实际填报与录取结果请以深圳市招生考试办公室发布的官方信息、政策和投档结果为准。
            </p>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6 text-center text-xs text-slate-500">
          <p>Shenzhen High School Admission Application · 数据来源于公开渠道 · 仅供参考 · 不对最终录取结果负责 · 请以官方信息为准</p>
        </div>
      </div>
    </footer>
  );
}
