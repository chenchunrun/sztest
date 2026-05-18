import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function calculateTimeLeft(targetDate: Date) {
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
    expired: false,
  };
}

export default function CountdownSection() {
  // 2026年深圳中考预计日期：6月26日
  const targetDate = new Date('2026-06-26T09:00:00+08:00');
  const timeLeft = useCountdown(targetDate);

  const units = [
    { value: timeLeft.days, label: '天' },
    { value: timeLeft.hours, label: '时' },
    { value: timeLeft.minutes, label: '分' },
    { value: timeLeft.seconds, label: '秒' },
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">2026年深圳中考倒计时</span>
          </div>
          <p className="text-indigo-100 text-sm">预计考试时间：2026年6月26日-28日</p>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto">
          {units.map((unit, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
            >
              <div className="text-3xl sm:text-4xl font-bold tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm text-indigo-200 mt-1">{unit.label}</div>
            </div>
          ))}
        </div>

        {timeLeft.expired && (
          <div className="text-center mt-4 text-sm text-indigo-200">
            2026年深圳中考已结束，祝各位考生金榜题名！
          </div>
        )}
      </div>
    </section>
  );
}
