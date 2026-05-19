import { useState, useEffect } from 'react';
import { SchoolIcon, Target, Shield, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSection({ onStart }: { onStart: () => void }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const stats = [
    { icon: SchoolIcon, value: '102', label: '所高中数据' },
    { icon: Target, value: '630', label: '分总分参考' },
    { icon: Shield, value: '冲稳保', label: '科学策略' },
  ];

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-teal-50/50 to-emerald-50" />
      <div className="absolute inset-0 opacity-30">
        <img src="/hero-bg.png" alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Sparkles className="w-4 h-4" />
            2026 深圳中考 · 智能填报系统
          </div>

          {/* Title */}
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            科学填报志愿，<br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">精准锁定理想高中</span>
          </h1>

          {/* Subtitle */}
          <p className={`text-base sm:text-lg text-gray-600 mb-8 max-w-2xl leading-relaxed transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            基于近年录取数据、2026 招生计划和考生成绩偏好，智能生成符合深圳中考规则的 12 个公办普高志愿方案，让每一分都发挥最大价值。
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-wrap gap-4 mb-12 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95'}`}>
            <button
              onClick={onStart}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all duration-200 flex items-center gap-2 shadow-md"
            >
              立即开始填报
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => document.getElementById('schools')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
            >
              查看学校库
            </button>
          </div>

          {/* Stats */}
          <div className={`flex flex-wrap gap-6 sm:gap-10 transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {stats.map((stat, i) => (
              <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${800 + i * 100}ms` }}>
                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
