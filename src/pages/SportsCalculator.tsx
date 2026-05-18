import { useState, useEffect, useRef, useMemo } from 'react'
import type { ElementType } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  User,
  Timer,
  Dumbbell,
  Trophy,
  Sparkles,
  Activity,
  Waves,
  Flame,
  Gauge,
  RotateCcw,
  ChevronRight,
} from 'lucide-react'

// ===================== Types =====================
type Gender = 'male' | 'female'
type RequiredItem = 'run' | 'swim'
type OptionalItemId =
  | '100m-run'
  | '50m-swim'
  | 'shot-put'
  | 'rope-jump'
  | 'shuttlecock'
  | 'frog-jump'
  | 'shuttle-run'
  | 'football'
  | 'basketball'
  | 'volleyball'
  | 'table-tennis'
  | 'badminton'
  | 'tennis'

interface OptionalItemConfig {
  id: OptionalItemId
  name: string
  icon: ElementType
  unit: string
  inputType: 'time-short' | 'distance' | 'count'
  maleBase: number
  femaleBase: number
  step: number
  penaltyPerStep: number
  isLowerBetter: boolean
  minScore: number
}

// ===================== Config =====================
const OPTIONAL_ITEMS: OptionalItemConfig[] = [
  {
    id: '100m-run',
    name: '100米跑',
    icon: Flame,
    unit: '秒',
    inputType: 'time-short',
    maleBase: 13.2,
    femaleBase: 14.8,
    step: 0.1,
    penaltyPerStep: 2,
    isLowerBetter: true,
    minScore: 60,
  },
  {
    id: '50m-swim',
    name: '50米游泳',
    icon: Waves,
    unit: '秒',
    inputType: 'time-short',
    maleBase: 40,
    femaleBase: 45,
    step: 1,
    penaltyPerStep: 2,
    isLowerBetter: true,
    minScore: 60,
  },
  {
    id: 'shot-put',
    name: '投掷实心球',
    icon: Dumbbell,
    unit: '米',
    inputType: 'distance',
    maleBase: 9.4,
    femaleBase: 6.4,
    step: 0.1,
    penaltyPerStep: 2,
    isLowerBetter: false,
    minScore: 60,
  },
  {
    id: 'rope-jump',
    name: '1分钟跳绳',
    icon: Activity,
    unit: '次',
    inputType: 'count',
    maleBase: 164,
    femaleBase: 164,
    step: 1,
    penaltyPerStep: 1,
    isLowerBetter: false,
    minScore: 60,
  },
  {
    id: 'shuttlecock',
    name: '1分钟踢毽子',
    icon: Sparkles,
    unit: '次',
    inputType: 'count',
    maleBase: 70,
    femaleBase: 70,
    step: 1,
    penaltyPerStep: 1,
    isLowerBetter: false,
    minScore: 60,
  },
  {
    id: 'frog-jump',
    name: '二级蛙跳',
    icon: Gauge,
    unit: '米',
    inputType: 'distance',
    maleBase: 5.6,
    femaleBase: 4.4,
    step: 0.1,
    penaltyPerStep: 2,
    isLowerBetter: false,
    minScore: 60,
  },
  {
    id: 'shuttle-run',
    name: '10米×4折返跑',
    icon: Timer,
    unit: '秒',
    inputType: 'time-short',
    maleBase: 12.0,
    femaleBase: 13.5,
    step: 0.1,
    penaltyPerStep: 2,
    isLowerBetter: true,
    minScore: 60,
  },
  {
    id: 'basketball',
    name: '篮球',
    icon: Trophy,
    unit: '秒',
    inputType: 'time-short',
    maleBase: 38.5,
    femaleBase: 40.5,
    step: 0.5,
    penaltyPerStep: 2,
    isLowerBetter: true,
    minScore: 60,
  },
  {
    id: 'football',
    name: '足球',
    icon: Flame,
    unit: '秒',
    inputType: 'time-short',
    maleBase: 15.0,
    femaleBase: 17.0,
    step: 0.5,
    penaltyPerStep: 2,
    isLowerBetter: true,
    minScore: 60,
  },
  {
    id: 'volleyball',
    name: '排球',
    icon: Activity,
    unit: '次',
    inputType: 'count',
    maleBase: 40,
    femaleBase: 40,
    step: 1,
    penaltyPerStep: 1.5,
    isLowerBetter: false,
    minScore: 60,
  },
  {
    id: 'table-tennis',
    name: '乒乓球',
    icon: Gauge,
    unit: '板',
    inputType: 'count',
    maleBase: 60,
    femaleBase: 60,
    step: 1,
    penaltyPerStep: 1,
    isLowerBetter: false,
    minScore: 60,
  },
  {
    id: 'badminton',
    name: '羽毛球',
    icon: Sparkles,
    unit: '个',
    inputType: 'count',
    maleBase: 12,
    femaleBase: 12,
    step: 1,
    penaltyPerStep: 3,
    isLowerBetter: false,
    minScore: 60,
  },
  {
    id: 'tennis',
    name: '网球',
    icon: Trophy,
    unit: '个',
    inputType: 'count',
    maleBase: 12,
    femaleBase: 12,
    step: 1,
    penaltyPerStep: 3,
    isLowerBetter: false,
    minScore: 60,
  },
]

// ===================== Scoring Functions =====================
function calculateRunScore(minutes: number, seconds: number, isMale: boolean): number {
  const totalSeconds = minutes * 60 + seconds
  const baseTime = isMale ? 245 : 235 // 4:05 / 3:55
  const diff = totalSeconds - baseTime
  const raw = 100 - diff
  return Math.max(60, Math.min(100, Math.round(raw)))
}

function calculateSwimScore(minutes: number, seconds: number, isMale: boolean): number {
  const totalSeconds = minutes * 60 + seconds
  const baseTime = isMale ? 326 : 346 // 5:26 / 5:46
  const diff = totalSeconds - baseTime
  const raw = 100 - diff * 0.5
  return Math.max(60, Math.min(100, Math.round(raw)))
}

function calculateOptionalScore(
  value: number,
  config: OptionalItemConfig,
  isMale: boolean
): number {
  const base = isMale ? config.maleBase : config.femaleBase
  const diff = config.isLowerBetter ? value - base : base - value
  const steps = diff / config.step
  const raw = 100 - steps * config.penaltyPerStep
  return Math.max(config.minScore, Math.min(100, Math.round(raw)))
}

function getGrade(total: number): { grade: string; color: string; comment: string } {
  if (total >= 50) return { grade: 'A+', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', comment: '太棒了！体育满分，继续保持！' }
  if (total >= 45) return { grade: 'A', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', comment: '成绩优秀，再努力一点就能满分！' }
  if (total >= 40) return { grade: 'B+', color: 'text-blue-600 bg-blue-50 border-blue-200', comment: '成绩良好，还有提升空间！' }
  if (total >= 35) return { grade: 'B', color: 'text-sky-600 bg-sky-50 border-sky-200', comment: '成绩不错，继续加油训练！' }
  if (total >= 30) return { grade: 'C+', color: 'text-amber-600 bg-amber-50 border-amber-200', comment: '及格以上，制定计划提升弱项！' }
  if (total >= 20) return { grade: 'C', color: 'text-orange-600 bg-orange-50 border-orange-200', comment: '还有进步空间，坚持训练！' }
  return { grade: 'D', color: 'text-red-600 bg-red-50 border-red-200', comment: '不要气馁，科学训练一定能进步！' }
}

// ===================== Animated Score Hook =====================
function useAnimatedScore(target: number, duration = 600) {
  const [display, setDisplay] = useState(target)
  const currentRef = useRef(target)

  useEffect(() => {
    const start = currentRef.current
    const diff = target - start
    const startTime = performance.now()
    let raf: number

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const val = start + diff * eased
      currentRef.current = val
      setDisplay(Math.round(val * 10) / 10)
      if (progress < 1) {
        raf = requestAnimationFrame(animate)
      }
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return display
}

// ===================== Scroll Animation Hook =====================
function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el)
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('animate-in')
      }
    })
    return () => observer.disconnect()
  }, [])
}

// ===================== Time Input Component =====================
function TimeInput({
  minutes,
  seconds,
  onMinutesChange,
  onSecondsChange,
  label,
}: {
  minutes: number
  seconds: number
  onMinutesChange: (v: number) => void
  onSecondsChange: (v: number) => void
  label: string
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            type="number"
            min={0}
            max={59}
            value={minutes || ''}
            onChange={(e) => onMinutesChange(Math.max(0, parseInt(e.target.value) || 0))}
            placeholder="分"
            className="text-center"
          />
        </div>
        <span className="text-gray-400 font-medium">:</span>
        <div className="flex-1">
          <Input
            type="number"
            min={0}
            max={59}
            value={seconds || ''}
            onChange={(e) => onSecondsChange(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            placeholder="秒"
            className="text-center"
          />
        </div>
      </div>
    </div>
  )
}

// ===================== Score Ring Component =====================
function ScoreRing({ score, label, colorClass }: { score: number; label: string; colorClass: string }) {
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`transition-all duration-700 ease-out ${colorClass}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold ${colorClass}`}>{score}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  )
}

// ===================== Main Component =====================
export default function SportsCalculator() {
  const navigate = useNavigate()
  useScrollAnimation()

  const [gender, setGender] = useState<Gender>('male')
  const [requiredItem, setRequiredItem] = useState<RequiredItem>('run')
  const [reqMinutes, setReqMinutes] = useState(0)
  const [reqSeconds, setReqSeconds] = useState(0)
  const [optionalItemId, setOptionalItemId] = useState<OptionalItemId>('rope-jump')
  const [optionalValue, setOptionalValue] = useState('')

  const optionalConfig = useMemo(
    () => OPTIONAL_ITEMS.find((i) => i.id === optionalItemId)!,
    [optionalItemId]
  )

  // Calculate scores
  const requiredScore = useMemo(() => {
    if (reqMinutes === 0 && reqSeconds === 0) return 0
    if (requiredItem === 'run') {
      return calculateRunScore(reqMinutes, reqSeconds, gender === 'male')
    }
    return calculateSwimScore(reqMinutes, reqSeconds, gender === 'male')
  }, [reqMinutes, reqSeconds, requiredItem, gender])

  const optionalScore = useMemo(() => {
    const val = parseFloat(optionalValue)
    if (isNaN(val) || val <= 0) return 0
    return calculateOptionalScore(val, optionalConfig, gender === 'male')
  }, [optionalValue, optionalConfig, gender])

  const totalRaw = requiredScore + optionalScore
  const total50 = Math.round((totalRaw / 4) * 10) / 10
  const animatedTotal = useAnimatedScore(total50)

  const gradeInfo = getGrade(total50)

  // Reset optional value when item changes
  useEffect(() => {
    setOptionalValue('')
  }, [optionalItemId])

  const handleReset = () => {
    setGender('male')
    setRequiredItem('run')
    setReqMinutes(0)
    setReqSeconds(0)
    setOptionalItemId('rope-jump')
    setOptionalValue('')
  }

  const hasInput = (requiredScore > 0 && reqMinutes + reqSeconds > 0) || (optionalScore > 0 && optionalValue)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-emerald-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-indigo-600 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回首页
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm hidden sm:inline">体育成绩计算器</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-500 hover:text-indigo-600">
            <RotateCcw className="w-4 h-4 mr-1" />
            重置
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Title */}
        <div className="text-center scroll-animate">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            2026 深圳中考 · 体育成绩估算
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            2026中考体育成绩计算器
          </h1>
          <p className="text-gray-500 text-sm">估算您的体育得分（满分50分）· 数据仅供参考</p>
        </div>

        {/* Gender Selection */}
        <Card className="scroll-animate border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              选择性别
            </CardTitle>
            <CardDescription>不同性别的评分标准不同</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGender('male')}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  gender === 'male'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-200 text-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">♂</div>
                <div className="font-semibold text-sm">男生</div>
              </button>
              <button
                onClick={() => setGender('female')}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  gender === 'female'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-200 text-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">♀</div>
                <div className="font-semibold text-sm">女生</div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Required Item */}
        <Card className="scroll-animate border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              必考项目
            </CardTitle>
            <CardDescription>二选一，满分折算25分</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRequiredItem('run')}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  requiredItem === 'run'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Flame className={`w-4 h-4 ${requiredItem === 'run' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold text-sm ${requiredItem === 'run' ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {gender === 'male' ? '1000米跑' : '800米跑'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {gender === 'male' ? '满分：4\'05"' : '满分：3\'55"'}
                </div>
              </button>
              <button
                onClick={() => setRequiredItem('swim')}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  requiredItem === 'swim'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Waves className={`w-4 h-4 ${requiredItem === 'swim' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold text-sm ${requiredItem === 'swim' ? 'text-indigo-700' : 'text-gray-700'}`}>
                    200米游泳
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {gender === 'male' ? '满分：5\'26"' : '满分：5\'46"'}
                </div>
              </button>
            </div>

            <TimeInput
              label="输入成绩"
              minutes={reqMinutes}
              seconds={reqSeconds}
              onMinutesChange={setReqMinutes}
              onSecondsChange={setReqSeconds}
            />

            {requiredScore > 0 && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-gray-600">项目得分（百分制）</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${requiredScore}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-indigo-600 w-10 text-right">{requiredScore}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Optional Item */}
        <Card className="scroll-animate border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-purple-500" />
              选考项目
            </CardTitle>
            <CardDescription>任选一项，满分折算25分</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">选择项目</Label>
              <Select value={optionalItemId} onValueChange={(v) => setOptionalItemId(v as OptionalItemId)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="请选择选考项目" />
                </SelectTrigger>
                <SelectContent>
                  {OPTIONAL_ITEMS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-indigo-500" />
                        {item.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                输入成绩 <span className="text-gray-400 font-normal">（{optionalConfig.unit}）</span>
              </Label>
              {optionalConfig.inputType === 'time-short' && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step={optionalConfig.step}
                    min={0}
                    value={optionalValue}
                    onChange={(e) => setOptionalValue(e.target.value)}
                    placeholder={`例如：${optionalConfig.maleBase}`}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500 w-12">{optionalConfig.unit}</span>
                </div>
              )}
              {(optionalConfig.inputType === 'distance' || optionalConfig.inputType === 'count') && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step={optionalConfig.step}
                    min={0}
                    value={optionalValue}
                    onChange={(e) => setOptionalValue(e.target.value)}
                    placeholder={`例如：${gender === 'male' ? optionalConfig.maleBase : optionalConfig.femaleBase}`}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500 w-12">{optionalConfig.unit}</span>
                </div>
              )}
              <p className="text-xs text-gray-400">
                {gender === 'male'
                  ? `男生满分标准：${optionalConfig.maleBase}${optionalConfig.unit}`
                  : `女生满分标准：${optionalConfig.femaleBase}${optionalConfig.unit}`}
              </p>
            </div>

            {optionalScore > 0 && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-gray-600">项目得分（百分制）</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${optionalScore}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-purple-600 w-10 text-right">{optionalScore}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result Summary */}
        <div className={`scroll-animate transition-all duration-500 ${hasInput ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
          <Card className="border-indigo-200 shadow-md bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">成绩汇总</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  满分 50 分
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{animatedTotal.toFixed(1)}</span>
                  <span className="text-lg opacity-80">/ 50</span>
                </div>
                {total50 > 0 && (
                  <div className={`px-4 py-2 rounded-xl border-2 font-bold text-lg ${gradeInfo.color}`}>
                    等级 {gradeInfo.grade}
                  </div>
                )}
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Score Rings */}
              <div className="flex justify-around">
                <ScoreRing
                  score={requiredScore}
                  label="必考项目"
                  colorClass={requiredScore >= 80 ? 'text-indigo-600' : requiredScore >= 60 ? 'text-blue-500' : 'text-gray-400'}
                />
                <ScoreRing
                  score={optionalScore}
                  label="选考项目"
                  colorClass={optionalScore >= 80 ? 'text-purple-600' : optionalScore >= 60 ? 'text-pink-500' : 'text-gray-400'}
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="36" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 36}
                        strokeDashoffset={2 * Math.PI * 36 - (total50 / 50) * 2 * Math.PI * 36}
                        className="transition-all duration-700 ease-out text-emerald-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-emerald-600">{Math.round((total50 / 50) * 100)}%</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">得分率</span>
                </div>
              </div>

              {/* Grade Info */}
              {total50 > 0 && (
                <div className={`p-4 rounded-xl border ${gradeInfo.color} text-center`}>
                  <p className="text-sm font-medium">{gradeInfo.comment}</p>
                </div>
              )}

              {/* Grade Scale */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">等级对照表</p>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {[
                    { label: 'A+', range: '50', color: 'bg-emerald-100 text-emerald-700' },
                    { label: 'A', range: '45-49', color: 'bg-indigo-100 text-indigo-700' },
                    { label: 'B+', range: '40-44', color: 'bg-blue-100 text-blue-700' },
                    { label: 'B', range: '35-39', color: 'bg-sky-100 text-sky-700' },
                    { label: 'C+', range: '30-34', color: 'bg-amber-100 text-amber-700' },
                    { label: 'C', range: '20-29', color: 'bg-orange-100 text-orange-700' },
                    { label: 'D', range: '0-19', color: 'bg-red-100 text-red-700' },
                  ].map((g) => (
                    <div
                      key={g.label}
                      className={`py-1.5 rounded-lg ${g.color} ${gradeInfo.grade === g.label ? 'ring-2 ring-offset-1 ring-indigo-300 font-bold' : 'opacity-70'}`}
                    >
                      <div>{g.label}</div>
                      <div className="text-[10px] opacity-80">{g.range}分</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <div className="scroll-animate p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <Activity className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 space-y-1">
            <p className="font-medium">温馨提示</p>
            <p className="leading-relaxed opacity-90">
              本计算器采用简化评分算法，结果仅供参考。实际评分以深圳市教育局发布的官方标准为准。
              建议考生在正式考试前参考官方评分表进行精确对照。
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="scroll-animate flex justify-center pb-8">
          <Button
            onClick={() => navigate('/')}
            className="px-8 py-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-base hover:scale-[1.02] hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            返回志愿填报助手
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </main>
    </div>
  )
}
