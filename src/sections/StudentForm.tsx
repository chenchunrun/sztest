import { useState } from 'react';
import type { StudentInfo, StrategyStyle, BioGeoGrade, District, SchoolLevel, Gender, Subject, CommuteTolerance, ApplicantTrack } from '@/types';
import { MapPin, Building2, Home, AlertCircle, Sparkles, ChevronDown, ChevronUp, User, BookOpen, Bus, School } from 'lucide-react';
import { juniorSchoolNames } from '@/data/indicatorAllocations';

export default function StudentForm({ onSubmit }: { onSubmit: (info: StudentInfo) => void }) {
  const [form, setForm] = useState<Partial<StudentInfo>>({
    studentType: 'AC',
    bioGeoGrade: 'A',
    applicantTrack: 'general',
    preferredDistricts: [],
    accommodation: 'any',
    preferredLevels: [],
    acceptPrivate: true,
    strategyStyle: 'balanced',
    gender: undefined,
    strongSubjects: [],
    commuteTolerance: 'medium',
    preferNewSchool: undefined,
    preferStrictManagement: undefined,
    preferArtSports: undefined,
  });
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState(false);

  const districts: District[] = ['福田', '罗湖', '南山', '宝安', '龙岗', '龙华', '光明', '坪山', '盐田', '大鹏'];
  const levels: SchoolLevel[] = ['四大名校', '八大名校', '区属重点', '普通公办', '民办'];

  const toggleDistrict = (d: District) => {
    setForm(prev => ({
      ...prev,
      preferredDistricts: prev.preferredDistricts?.includes(d)
        ? prev.preferredDistricts.filter(x => x !== d)
        : [...(prev.preferredDistricts || []), d],
    }));
  };

  const toggleLevel = (l: SchoolLevel) => {
    setForm(prev => ({
      ...prev,
      preferredLevels: prev.preferredLevels?.includes(l)
        ? prev.preferredLevels.filter(x => x !== l)
        : [...(prev.preferredLevels || []), l],
    }));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!form.score || form.score < 0 || form.score > 630) {
      newErrors.score = '请输入 0-630 之间的有效分数';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      return;
    }

    setErrors({});
    onSubmit(form as StudentInfo);
  };

  return (
    <section id="form" className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 scroll-animate">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">填写考生信息</h2>
          <p className="text-gray-500">请如实填写，系统将据此生成最适合的志愿方案</p>
        </div>

        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 scroll-animate ${shaking ? 'shake' : ''}`}>
          {/* Score */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              中考预估总分 <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-gray-400 ml-2">（2026年满分630分）</span>
            </label>
            <input
              type="number"
              min={0}
              max={630}
              value={form.score || ''}
              onChange={(e) => setForm(prev => ({ ...prev, score: Number(e.target.value) }))}
              placeholder="请输入预估分数"
              className={`w-full px-4 py-3 rounded-xl border ${errors.score ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 text-lg`}
            />
            {errors.score && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.score}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              初中学校
              <span className="text-xs font-normal text-gray-400 ml-2">（用于按实际指标生分配名额推荐，可输入或选择）</span>
            </label>
            <input
              type="text"
              list="junior-school-options"
              value={form.juniorSchool || ''}
              onChange={(e) => setForm(prev => ({ ...prev, juniorSchool: e.target.value }))}
              placeholder="请输入考生初中学校名称"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
            />
            <datalist id="junior-school-options">
              {juniorSchoolNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            <p className="mt-2 text-xs text-gray-400">
              不填写也能生成 12 个正取志愿，但系统将无法按您所在初中的指标名额给出指标生主推荐。
            </p>
          </div>

          {/* Student Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">考生类型</label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'AC', label: 'AC类（深户/政策优待）', desc: '录取分数线相对较低' },
                { value: 'D', label: 'D类（非深户）', desc: '符合划线录取条件' },
              ] as const).map((type) => (
                <button
                  key={type.value}
                  onClick={() => setForm(prev => ({ ...prev, studentType: type.value }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-150 ${form.studentType === type.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
                >
                  <div className="font-semibold text-sm">{type.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">报考方向</label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'general', label: '普通生', desc: '默认排除艺术高中、综合高中、留学班等特殊路径' },
                { value: 'art', label: '艺术生', desc: '允许进入艺术普高与艺术特色培养路径学校池' },
              ] as const).map((track) => (
                <button
                  key={track.value}
                  onClick={() => setForm(prev => ({ ...prev, applicantTrack: track.value as ApplicantTrack }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-150 ${form.applicantTrack === track.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
                >
                  <div className="font-semibold text-sm">{track.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{track.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* BioGeo Grade */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">生物地理等级</label>
            <div className="flex flex-wrap gap-2">
              {(['A+', 'A', 'B+', 'B', 'C+', 'C', 'D'] as BioGeoGrade[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setForm(prev => ({ ...prev, bioGeoGrade: g }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${form.bioGeoGrade === g ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-indigo-100'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Districts */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              意向区域
              <span className="text-xs font-normal text-gray-400 ml-2">（可多选；默认全市范围）</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setForm(prev => ({ ...prev, preferredDistricts: [] }))}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-150 flex items-center gap-1 ${
                  !form.preferredDistricts || form.preferredDistricts.length === 0
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-indigo-100'
                }`}
              >
                <School className="w-3 h-3" />
                全市范围
              </button>
              {districts.map((d) => (
                <button
                  key={d}
                  onClick={() => toggleDistrict(d)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-150 flex items-center gap-1 ${form.preferredDistricts?.includes(d) ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-indigo-100'}`}
                >
                  <MapPin className="w-3 h-3" />
                  {d}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              选择具体区域后，系统会优先从这些区域生成候选学校；仅在候选不足时，才会从全市补充。
            </p>
          </div>

          {/* Accommodation */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">住宿需求</label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'boarding', label: '必须住宿', icon: Home },
                { value: 'day', label: '可以走读', icon: Building2 },
                { value: 'any', label: '均可', icon: MapPin },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm(prev => ({ ...prev, accommodation: opt.value }))}
                  className={`p-3 rounded-xl border-2 text-center transition-all duration-150 ${form.accommodation === opt.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
                >
                  <opt.icon className={`w-5 h-5 mx-auto mb-1 ${form.accommodation === opt.value ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <div className="text-sm font-medium">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* School Levels */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">学校类型偏好 <span className="text-gray-400 text-xs">（可多选，不选则为全部）</span></label>
            <div className="flex flex-wrap gap-2">
              {levels.map((l) => (
                <button
                  key={l}
                  onClick={() => toggleLevel(l)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-150 ${form.preferredLevels?.includes(l) ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-indigo-100'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Accept Private */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">是否接受民办高中</label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: true, label: '接受', desc: '增加录取机会' },
                { value: false, label: '不接受', desc: '仅公办高中' },
              ] as const).map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => setForm(prev => ({ ...prev, acceptPrivate: opt.value }))}
                  className={`p-3 rounded-xl border-2 text-left transition-all duration-150 ${form.acceptPrivate === opt.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
                >
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className="text-xs text-gray-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Strategy Style */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">志愿填报风格</label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'conservative', label: '保守稳妥', desc: '偏保底', color: 'text-green-600' },
                { value: 'balanced', label: '均衡搭配', desc: '冲稳兼顾', color: 'text-indigo-600' },
                { value: 'aggressive', label: '激进冲刺', desc: '冲高为主', color: 'text-orange-600' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm(prev => ({ ...prev, strategyStyle: opt.value as StrategyStyle }))}
                  className={`p-3 rounded-xl border-2 text-center transition-all duration-150 ${form.strategyStyle === opt.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
                >
                  <div className={`font-semibold text-sm ${form.strategyStyle === opt.value ? opt.color : 'text-gray-700'}`}>{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Preferences */}
          <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-semibold text-gray-700">高级偏好（选填）</span>
                <span className="text-xs text-gray-400">帮助系统更精准地匹配适合您的学校</span>
              </div>
              {advancedOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {advancedOpen && (
              <div className="p-4 space-y-5">
                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-3.5 h-3.5 inline mr-1" />
                    学生性别
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['男', '女'] as Gender[]).map((g) => (
                      <button
                        key={g}
                        onClick={() => setForm(prev => ({ ...prev, gender: g }))}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-150 ${form.gender === g ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
                      >
                        <div className="font-medium text-sm">{g}</div>
                      </button>
                    ))}
                    <button
                      onClick={() => setForm(prev => ({ ...prev, gender: undefined }))}
                      className={`p-3 rounded-xl border-2 text-center transition-all duration-150 ${form.gender === undefined ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
                    >
                      <div className="font-medium text-sm text-gray-500">不透露</div>
                    </button>
                  </div>
                </div>

                {/* Strong Subjects */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <BookOpen className="w-3.5 h-3.5 inline mr-1" />
                    强势学科 <span className="text-xs font-normal text-gray-400">（可多选，按点击顺序排序）</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['数学', '物理', '化学', '语文', '英语', '历史', '地理', '生物'] as Subject[]).map((subj) => {
                      const idx = form.strongSubjects?.indexOf(subj);
                      const isSelected = idx !== undefined && idx !== -1;
                      return (
                        <button
                          key={subj}
                          onClick={() => {
                            setForm(prev => {
                              const current = prev.strongSubjects || [];
                              if (current.includes(subj)) {
                                return { ...prev, strongSubjects: current.filter(s => s !== subj) };
                              }
                              return { ...prev, strongSubjects: [...current, subj] };
                            });
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                            isSelected
                              ? 'bg-indigo-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-indigo-100'
                          }`}
                        >
                          {subj}
                          {isSelected && <span className="ml-1 text-xs opacity-70">{idx! + 1}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Commute Tolerance */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Bus className="w-3.5 h-3.5 inline mr-1" />
                    通勤接受度
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { value: 'near', label: '就近优先', desc: '本区为主' },
                      { value: 'medium', label: '可跨区', desc: '地铁1小时内' },
                      { value: 'far', label: '远距离也可', desc: '住宿或通勤' },
                    ] as const).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setForm(prev => ({ ...prev, commuteTolerance: opt.value as CommuteTolerance }))}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-150 ${form.commuteTolerance === opt.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}
                      >
                        <div className="font-medium text-sm">{opt.label}</div>
                        <div className="text-xs text-gray-500">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* School Preferences */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <School className="w-3.5 h-3.5 inline mr-1" />
                    学校偏好
                  </label>
                  <div className="space-y-2">
                    {([
                      { key: 'preferNewSchool', label: '接受新学校', desc: '2015年后创办的新校，设施新、理念新' },
                      { key: 'preferStrictManagement', label: '偏好严格管理', desc: '封闭式、作业多、测试频繁的管理风格' },
                      { key: 'preferArtSports', label: '关注艺体特长', desc: '重视艺术、体育、竞赛等特色培养' },
                    ] as const).map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setForm(prev => ({ ...prev, [opt.key]: prev[opt.key as keyof typeof prev] === true ? undefined : true }))}
                        className={`w-full p-3 rounded-xl border-2 text-left transition-all duration-150 flex items-center justify-between ${
                          form[opt.key as keyof typeof form] === true
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-200'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-sm">{opt.label}</div>
                          <div className="text-xs text-gray-500">{opt.desc}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          form[opt.key as keyof typeof form] === true
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-300'
                        }`}>
                          {form[opt.key as keyof typeof form] === true && <span className="text-white text-xs">✓</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:scale-[1.01] hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            生成志愿方案
          </button>
        </div>
      </div>
    </section>
  );
}
