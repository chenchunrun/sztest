import { useState } from 'react';
import { timelineEvents } from '@/data/timeline';
import { ChevronDown, ChevronUp, CalendarDays, Flag } from 'lucide-react';

function getEventStatus(dateStr: string): 'past' | 'current' | 'future' {
  const now = new Date();
  // 简单判断：如果日期字符串包含月份，尝试解析
  // 由于数据格式不统一，我们使用一个简化的判断逻辑
  // 将事件按顺序分为 past/current/future，基于当前日期

  // 定义关键时间节点（2026年，基于2025年数据推后一年）
  const keyDates: Record<string, Date> = {
    '中考报名': new Date('2026-03-25'),
    '体育中考': new Date('2026-04-20'),
    '英语听说': new Date('2026-05-18'),
    '理化实验': new Date('2026-05-25'),
    '志愿填报': new Date('2026-05-28'),
    '中考': new Date('2026-06-26'),
    '成绩公布': new Date('2026-07-16'),
    '录取': new Date('2026-07-25'),
  };

  let eventDate: Date | null = null;
  for (const [key, d] of Object.entries(keyDates)) {
    if (dateStr.includes(key) || timelineEvents.find(e => e.title === dateStr)?.description?.includes(key)) {
      eventDate = d;
      break;
    }
  }

  // 如果找不到具体日期，根据事件在列表中的位置推断
  if (!eventDate) {
    // 默认未来
    return 'future';
  }

  const diffDays = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < -7) return 'past';
  if (diffDays <= 7) return 'current';
  return 'future';
}

export default function TimelineSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 合并同类事件
  const groupedEvents: { title: string; date: string; items: string[] }[] = [];
  let currentGroup: { title: string; date: string; items: string[] } | null = null;

  for (const event of timelineEvents) {
    if (event.title && event.title !== '事件' && !event.title.includes('http')) {
      if (currentGroup && currentGroup.title === event.title) {
        currentGroup.items.push(event.description);
      } else {
        currentGroup = { title: event.title, date: event.date, items: [event.description] };
        groupedEvents.push(currentGroup);
      }
    }
  }

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
            {groupedEvents.map((event, i) => {
              const status = getEventStatus(event.title);
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
                      <div className="mt-3 pt-3 border-t border-current border-opacity-10 space-y-2">
                        {event.items.map((item, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <Flag className="w-3 h-3 mt-0.5 opacity-50 flex-shrink-0" />
                            <p className="text-sm opacity-80 leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-400 text-center">
          注：时间节点参考2025年安排，2026年具体日期以深圳市招考办官方通知为准
        </p>
      </div>
    </section>
  );
}
