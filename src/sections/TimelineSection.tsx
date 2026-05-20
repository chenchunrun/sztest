import { useState } from 'react';
import { timelineEvents } from '@/data/timeline';
import { ChevronDown, ChevronUp, CalendarDays, Flag } from 'lucide-react';

function getEventStatus(event: (typeof timelineEvents)[number]): 'past' | 'current' | 'future' {
  if (!event.startDate) return 'future';

  const now = new Date();
  const start = new Date(`${event.startDate}T00:00:00+08:00`);
  const end = new Date(`${event.endDate ?? event.startDate}T23:59:59+08:00`);

  if (now > end) return 'past';
  if (now >= start && now <= end) return 'current';
  return 'future';
}

export default function TimelineSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'past':
        return 'bg-gray-100 text-gray-400 border-gray-200';
      case 'current':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300 ring-2 ring-indigo-200';
      default:
        return 'bg-white text-gray-700 border-gray-200';
    }
  };

  const getDotStyle = (status: string) => {
    switch (status) {
      case 'past':
        return 'bg-gray-300';
      case 'current':
        return 'bg-indigo-500 animate-pulse';
      default:
        return 'bg-indigo-300';
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 scroll-animate">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-4">
            <CalendarDays className="w-4 h-4" />
            2026年中考大事记
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">中考全流程时间轴</h2>
          <p className="text-gray-500">关键节点不错过，提前规划每一步</p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gray-100" />

        <div className="space-y-4">
            {timelineEvents.map((event, i) => {
              const status = getEventStatus(event);
              const isOpen = openIndex === i;

              return (
                <div
                  key={i}
                  className={`relative pl-12 sm:pl-16 scroll-animate`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Dot */}
                  <div
                    className={`absolute left-2.5 sm:left-4.5 top-4 w-3 h-3 rounded-full ${getDotStyle(status)} border-2 border-white shadow-sm`}
                  />

                  {/* Card */}
                  <div
                    className={`rounded-xl border p-4 transition-all duration-200 cursor-pointer ${getStatusStyle(status)} ${
                      isOpen ? 'shadow-md' : 'hover:shadow-sm'
                    }`}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{event.title}</span>
                          <span className="text-xs opacity-70">{event.date}</span>
                        </div>
                        {status === 'current' && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-xs font-medium">
                            进行中
                          </span>
                        )}
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 opacity-50" />
                      ) : (
                        <ChevronDown className="w-4 h-4 opacity-50" />
                      )}
                    </div>

                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-current border-opacity-10">
                        <div className="flex items-start gap-2">
                          <Flag className="w-3 h-3 mt-0.5 opacity-50 flex-shrink-0" />
                          <p className="text-sm opacity-80 leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-400 text-center">
          注：以上时间轴按截至2026年5月19日深圳市教育局、深圳市招考办已公开发布的信息整理；尚未公布的后续节点以官方后续通知为准。
        </p>
      </div>
    </section>
  );
}
