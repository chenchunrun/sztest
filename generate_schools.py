import openpyxl
import argparse
import re
from collections import defaultdict
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
DEFAULT_OUTPUT_PATH = ROOT_DIR / 'src' / 'data' / 'schools.ts'

NAME_MAP = {
    '深中': '深圳中学',
    '深实验': '深圳实验学校（高中部）',
    '深高级': '深圳市高级中学中心校区',
    '深外': '深圳外国语学校',
    '红岭中学': '红岭中学',
    '红岭': '红岭中学',
    '育才中学': '育才中学',
    '育才': '育才中学',
    '宝安中学': '宝安中学（集团）高中部',
    '宝中': '宝安中学（集团）高中部',
    '深大附中': '深圳大学附属中学（深大附中）',
    '北师大附中': '北师大南山附属学校高中部',
    '北师大南附': '北师大南山附属学校高中部',
    '科学高中': '深圳科学高中',
    '科高': '深圳科学高中',
    '南外高中': '深圳市南山外国语学校（集团）高级中学',
    '南外': '深圳市南山外国语学校（集团）高级中学',
    '二高': '深圳市第二高级中学',
    '翠园中学': '翠园中学',
    '翠园': '翠园中学',
    '龙城高级': '龙城高级中学',
    '龙城': '龙城高级中学',
    '南科大附中': '南方科技大学附属中学',
    '龙华高级': '龙华高级中学',
    '人附深': '人大附中深圳学校',
    '人大附中': '人大附中深圳学校',
    '深二实': '深圳市第二实验学校',
    '二实': '深圳市第二实验学校',
    '实验光明': '深圳实验学校光明高中部',
    '深外龙华': '深圳外国语学校龙华高中部',
    '省实深圳': '广东实验中学深圳学校',
    '育才蛇口': '育才中学蛇口校区',
    '高级东校区': '深圳市高级中学东校区',
    '新安中学': '新安中学（集团）高中部',
    '新安': '新安中学（集团）高中部',
    '深大实验': '深圳大学附属实验中学',
    '科高龙岗': '深圳科学高中龙岗分校',
    '华附': '华中师范大学龙岗附属中学',
    '深北莫附中': '深圳北理莫斯科大学附属实验中学',
    '中科附高': '中国科学院深圳理工大学附属实验高级中学',
    '南头中学': '南头中学',
    '东师附深': '东北师范大学附属中学深圳学校',
    '东师附': '东北师范大学附属中学深圳学校',
    '盐田高级': '盐田高级中学',
    '盐高': '盐田高级中学',
    '红山中学': '深圳市红山中学',
    '格致中学': '深圳市格致中学',
    '华侨城中学': '华侨城高级中学',
    '龙岗实验': '深圳市龙岗区实验高级中学',
    '港中深明德': '香港中文大学(深圳)附属明德高级中学（A等级和534）',
    '高级创新': '深圳市高级中学创新高中',
    '罗湖外语': '罗湖外语学校',
    '松岗中学': '松岗中学',
    '福田中学': '福田中学',
    '宝一外': '宝安第一外国语学校',
    '深技大附中': '深圳技术大学附属中学',
    '深二外': '深圳第二外国语学校',
    '龙津中学': '深圳市龙津中学',
    '西浦高中': '西交利物浦大学基础教育集团外国语高级中学',
    '三高': '深圳市第三高级中学（国内高考班）',
    '高级理慧': '深圳市高级中学理慧高中',
    '罗湖高级': '罗湖高级中学',
    '燕川中学': '深圳市燕川中学',
    '红岭大鹏': '深圳市红岭教育集团大鹏华侨中学',
    '平冈中学': '平冈中学',
    '高级有为': '深圳市高级中学有为高中',
    '深外弘知': '深圳外国语学校弘知高中',
    '西乡中学': '西乡中学',
    '高级文博': '深圳市高级中学文博高中',
    '实验明理': '深圳实验学校明理高中',
    '实验崇文': '深圳实验学校崇文高中',
    '光明高级': '光明区高级中学',
    '龙华外国语': '深圳市龙华外国语高级中学',
    '福海中学': '深圳市福海中学',
    '七高': '深圳市第七高级中学',
    '深一职\n(综合高中)': '深圳市第一职业技术学校（综合高中）',
    '实验卓越': '深圳实验学校卓越高中',
    '致理中学': '深圳市致理中学',
    '实验至臻': '深圳实验学校至臻高中',
    '深外博雅': '深圳外国语学校博雅高中',
    '北大附深': '北京大学附属中学深圳学校',
    '观澜中学': '观澜中学',
    '深外致远': '深圳外国语学校致远高中',
    '坪山高级': '坪山高级中学',
    '盐港中学\n(综合高中)': '深圳市盐港中学（综合高中）',
    '行知职校\n(综合高中)': '深圳市行知职业技术学校（综合高中）',
    '深外理工': '深圳外国语学校理工高中',
    '龙科高': '深圳市龙华科技实验高级中学',
    '聚龙科中': '深圳市聚龙科学中学（B+等级和485）',
    '石岩外国语': '宝安中学（集团）石岩外国语学校',
    '光明中学': '光明中学',
    '横岗高级': '横岗高级中学',
    '龙华中学': '龙华中学',
    '二实明远': '深圳市第二实验学校明远高中',
    '布吉高级': '布吉高级中学',
    '平湖外国语': '平湖外国语学校',
    '深中科技': '深圳中学科技高中',
    '沙井中学': '沙井中学',
    '深中数理': '深圳中学数理高中',
    '深中实验': '深圳中学实验高中',
    '二高深汕': '深圳市第二高级中学深汕实验学校',
    '艺术高中': '深圳市艺术高中',
    '布吉中学': '布吉中学',
    '美术学校': '深圳市美术学校',
    '三高留学班': '深圳市第三高级中学（国家留学基金委自费出国留学班）',
}

def normalize_name(name):
    if not name:
        return None
    name = str(name).strip()
    name = re.sub(r'（[^）]*等级[^）]*）', '', name)
    name = re.sub(r'\(A等级[^\)]*\)', '', name)
    name = re.sub(r'（B\+等级[^）]*）', '', name)
    name = name.strip()
    return name

def match_school_name(short_name, standard_names):
    short_name = str(short_name).strip() if short_name else ''
    if short_name in NAME_MAP:
        return NAME_MAP[short_name]
    for std_name in standard_names:
        if short_name == std_name:
            return std_name
        if short_name in std_name or std_name in short_name:
            return std_name
        for alias, full in NAME_MAP.items():
            if full == std_name and (alias in short_name or short_name in alias):
                return std_name
    return None

def extract_level_map(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = r"name: '([^']+)'.*?level: '([^']+)'"
    matches = re.findall(pattern, content, re.DOTALL)
    level_map = {}
    for name, level in matches:
        level_map[name] = level
    return level_map

def parse_args():
    parser = argparse.ArgumentParser(description='Generate schools.ts from the source workbook.')
    parser.add_argument('excel_path', help='Path to the source Excel workbook.')
    parser.add_argument(
        '--output',
        default=str(DEFAULT_OUTPUT_PATH),
        help='Path to the generated schools.ts file.',
    )
    parser.add_argument(
        '--reference',
        default=str(DEFAULT_OUTPUT_PATH),
        help='Reference schools.ts used to preserve existing school levels.',
    )
    return parser.parse_args()

args = parse_args()
excel_path = Path(args.excel_path).expanduser().resolve()
output_path = Path(args.output).expanduser().resolve()
reference_path = Path(args.reference).expanduser().resolve()

LEVEL_MAP = extract_level_map(reference_path)

wb = openpyxl.load_workbook(excel_path, data_only=True)
ws_main = wb['【公办】高中数据大数据']
main_rows = list(ws_main.iter_rows(values_only=True))
ws_scores = wb['2021-2025深圳中考录取分数线']
score_rows = list(ws_scores.iter_rows(values_only=True))
ws_basic = wb['高中学校基本情况汇总']
basic_rows = list(ws_basic.iter_rows(values_only=True))
ws_survey = wb['高中学校调查问卷表']
survey_rows = list(ws_survey.iter_rows(values_only=True))

standard_names = []
for i, row in enumerate(main_rows):
    if i >= 2 and row[1]:
        name = normalize_name(row[1])
        if name:
            standard_names.append(name)

schools_data = {}
for i, row in enumerate(main_rows):
    if i < 2 or not row[1]:
        continue
    name = normalize_name(row[1])
    if not name:
        continue
    schools_data[name] = {
        'name': name,
        'district': str(row[3]).replace('区', '').replace('深汕合作区', '深汕') if row[3] else '',
        'affiliation': str(row[2]) if row[2] else '区属',
        'address': str(row[4]).replace('\n', ' ') if row[4] else '',
        'acBoardingRaw': row[10],
        'acDayRaw': row[11],
        'dBoardingRaw': row[12],
        'dDayRaw': row[13],
        'rank2025': row[9],
        'hist2024': {'rank': row[14], 'ac': row[15], 'd': row[16]},
        'hist2023': {'rank': row[17], 'ac': row[18], 'd': row[19]},
        'hist2022': {'rank': row[20], 'ac': row[21], 'd': row[22]},
        'hist2021': {'rank': row[23], 'ac': row[24], 'd': row[25]},
        'totalPlan2025': row[26],
        'boardingPlan2025': row[27],
        'dayPlan2025': row[28],
        'acPlan2025': row[29],
        'dPlan2025': row[30],
        'boardingAc2025': row[31],
        'boardingD2025': row[32],
        'dayAc2025': row[33],
        'dayD2025': row[34],
        'indicatorAc2025': row[35],
        'indicatorD2025': row[36],
        'indicatorLineAc': row[37],
        'indicatorLineD': row[38],
        'selfRecruitClass1': str(row[39]).strip() if row[39] else '',
        'selfRecruitClass2': str(row[40]).strip() if row[40] else '',
        'admissionGuide': str(row[41]).strip() if row[41] else '',
        'classTypes': str(row[42]).replace('\n', ' ').strip() if row[42] else '',
        'dormitory': str(row[43]).replace('\n', ' ').strip() if row[43] else '',
    }

for i, row in enumerate(score_rows):
    if i < 4:
        continue
    short_name = row[0]
    if not short_name:
        continue
    matched = match_school_name(short_name, standard_names)
    if matched and matched in schools_data:
        ranks = {2025: row[1], 2024: row[6], 2023: row[9], 2022: row[12], 2021: row[15]}
        for year, rank in ranks.items():
            if rank is not None and isinstance(rank, (int, float)):
                key = f'hist{year}'
                if key in schools_data[matched] and schools_data[matched][key].get('rank') is None:
                    schools_data[matched][key]['rank'] = int(rank)

for i, row in enumerate(basic_rows):
    if i < 2 or not row[1]:
        continue
    short_name = row[1]
    matched = match_school_name(short_name, standard_names)
    if matched and matched in schools_data:
        schools_data[matched]['wenli'] = str(row[2]) if row[2] else '均衡'
        schools_data[matched]['founded'] = int(row[3]) if row[3] and isinstance(row[3], (int, float)) else None
        schools_data[matched]['feature_desc'] = str(row[5]).replace('\n', ' ').strip() if row[5] else ''
        schools_data[matched]['phonePolicy'] = str(row[6]).replace('\n', ' ').strip() if row[6] else ''

SURVEY_COLS = {
    'overallSatisfaction': 8,
    'teacherQuality': 10,
    'teachingQuality': 21,
    'managementEffect': 11,
    'canteenSatisfaction': 29,
    'dormSatisfaction': 31,
    'activityRichness': 25,
    'teacherAttention': 20,
}
SCORE_RULES = {
    'overallSatisfaction': {'非常满意': 100, '比较满意': 80, '一般': 50, '不满意': 20},
    'teacherQuality': {'师资力量雄厚，教师素质高': 100, '大部分老师都很好，但个别科目需要加强': 70, '师资水平一般，需要引进更多优秀教师': 30},
    'teachingQuality': {'非常好': 100, '一般': 50, '非常差': 10},
    'managementEffect': {'非常有助于维护秩序和提高学习效率': 100, '有一定帮助，但仍有改进空间': 70, '管理制度过于严格，影响学习体验': 40, '管理制度松散，缺乏约束力': 20, '管理不到位，很多没必要的内容': 10},
    'canteenSatisfaction': {'很满意': 100, '一般': 50, '待改善': 20},
    'dormSatisfaction': {'很满意': 100, '一般': 50},
    'activityRichness': {'经常': 100, '有时': 60, '很少': 20},
    'teacherAttention': {'关注度很高': 100, '关注度一般': 50, '关注度很低': 20},
}

survey_results = defaultdict(lambda: defaultdict(list))
for i, row in enumerate(survey_rows):
    if i < 2:
        continue
    school_name = row[1]
    if not school_name:
        continue
    matched = match_school_name(school_name, standard_names)
    if not matched:
        for std_name in standard_names:
            if school_name in std_name or std_name in school_name:
                matched = std_name
                break
    if not matched:
        continue
    for dim, col_idx in SURVEY_COLS.items():
        val = row[col_idx]
        if val and str(val).strip():
            score = SCORE_RULES[dim].get(str(val).strip())
            if score is not None:
                survey_results[matched][dim].append(score)

for name, dims in survey_results.items():
    if name not in schools_data:
        continue
    count = max(len(v) for v in dims.values()) if dims else 0
    if count < 5:
        continue
    avg_scores = {}
    for dim, scores in dims.items():
        if scores:
            avg_scores[dim] = round(sum(scores) / len(scores), 1)
    all_dims = list(SURVEY_COLS.keys())
    for dim in all_dims:
        if dim not in avg_scores:
            avg_scores[dim] = 60.0
    composite = round(sum(avg_scores[d] for d in all_dims) / len(all_dims), 1)
    avg_scores['compositeScore'] = composite
    avg_scores['count'] = count
    schools_data[name]['reputation'] = avg_scores

def generate_traits(data):
    traits = []
    feature_desc = data.get('feature_desc', '')
    phone_policy = data.get('phonePolicy', '')
    founded = data.get('founded')
    if '竞赛' in feature_desc or '奥赛' in feature_desc:
        traits.append('竞赛强校')
    if any(k in feature_desc for k in ['艺术', '美术', '音乐']):
        traits.append('艺术特色')
    if '体育' in feature_desc:
        traits.append('体育特色')
    if any(k in feature_desc for k in ['外语', '英语', '日语', '小语种']):
        traits.append('外语特色')
    if any(k in feature_desc for k in ['严格', '军事化', '精细化']) or any(k in phone_policy for k in ['严禁', '禁止携带']):
        traits.append('管理严格')
    if any(k in feature_desc for k in ['自由', '宽松', '自主']):
        traits.append('管理自由')
    if founded and founded <= 1990:
        traits.append('老牌名校')
    if founded and founded >= 2015:
        traits.append('新兴学校')
    return traits

def convert_score(raw):
    if raw is None or raw == '' or raw == '-':
        return None
    try:
        val = float(str(raw).replace('（', '(').split('(')[0].strip())
        if val <= 0:
            return None
        return round(val / 610 * 630)
    except:
        return None

def safe_int(val, default=None):
    if val is None or val == '' or val == '-':
        return default
    try:
        return int(float(str(val).strip()))
    except:
        return default

def ts_string(s):
    if s is None:
        return "''"
    s = str(s).replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ').replace('\r', ' ')
    return f"'{s}'"

def get_level(name):
    return LEVEL_MAP.get(name, '普通公办')

def sort_key(item):
    level = get_level(item['name'])
    rank = item.get('rank2025')
    return ({'四大名校': 0, '八大名校': 1, '区属重点': 2, '普通公办': 3, '民办': 4}.get(level, 99), safe_int(rank, 999))

school_list = []
for name, data in schools_data.items():
    ac_raw = safe_int(data.get('acBoardingRaw'))
    if ac_raw is None:
        continue
    school = {
        'name': name,
        'district': data['district'],
        'type': '公办',
        'level': get_level(name),
        'acScore2025': convert_score(data.get('acBoardingRaw')),
        'dScore2025': convert_score(data.get('dBoardingRaw')),
        'hasBoarding': safe_int(data.get('boardingPlan2025'), 0) > 0,
        'hasDay': safe_int(data.get('dayPlan2025'), 0) > 0,
        'plan2026': safe_int(data.get('totalPlan2025'), 0) or 0,
        'description': data.get('classTypes', ''),
        'features': [],
        'address': data['address'],
        'affiliation': data['affiliation'],
        'historicalScores': {},
        'acScore2025Raw': ac_raw,
        'dScore2025Raw': safe_int(data.get('dBoardingRaw')),
        'acBoarding2025': convert_score(data.get('acBoardingRaw')),
        'dBoarding2025': convert_score(data.get('dBoardingRaw')),
        'acDay2025': convert_score(data.get('acDayRaw')),
        'dDay2025': convert_score(data.get('dDayRaw')),
        'totalPlan2025': safe_int(data.get('totalPlan2025')),
        'boardingPlan2025': safe_int(data.get('boardingPlan2025')),
        'dayPlan2025': safe_int(data.get('dayPlan2025')),
        'acPlan2025': safe_int(data.get('acPlan2025')),
        'dPlan2025': safe_int(data.get('dPlan2025')),
        'boardingAc2025': safe_int(data.get('boardingAc2025')),
        'boardingD2025': safe_int(data.get('boardingD2025')),
        'dayAc2025': safe_int(data.get('dayAc2025')),
        'dayD2025': safe_int(data.get('dayD2025')),
        'indicatorAc2025': safe_int(data.get('indicatorAc2025')),
        'indicatorD2025': safe_int(data.get('indicatorD2025')),
        'indicatorLineAc': safe_int(data.get('indicatorLineAc')),
        'indicatorLineD': safe_int(data.get('indicatorLineD')),
        'selfRecruitClass1': data.get('selfRecruitClass1', ''),
        'selfRecruitClass2': data.get('selfRecruitClass2', ''),
        'admissionGuide': data.get('admissionGuide', ''),
        'classTypes': data.get('classTypes', ''),
        'dormitory': data.get('dormitory', ''),
        'wenli': data.get('wenli', '均衡'),
        'founded': data.get('founded'),
        'traits': generate_traits(data),
        'phonePolicy': data.get('phonePolicy', '')[:200],
        'rank2025': safe_int(data.get('rank2025')),
    }
    if data.get('reputation'):
        school['reputation'] = data['reputation']
    desc = school['description']
    if desc:
        parts = re.split(r'[、，,；;]', desc)
        school['features'] = [p.strip() for p in parts[:4] if p.strip()]
    hist = {}
    for year in [2021, 2022, 2023, 2024]:
        key = f'hist{year}'
        if key in data:
            d = data[key]
            entry = {}
            ac = safe_int(d.get('ac'))
            dc = safe_int(d.get('d'))
            rank = safe_int(d.get('rank'))
            if ac is not None:
                entry['ac'] = ac
            if dc is not None:
                entry['d'] = dc
            if rank is not None:
                entry['rank'] = rank
            if entry:
                hist[year] = entry
    if hist:
        school['historicalScores'] = hist
    school_list.append(school)

school_list.sort(key=lambda x: sort_key(x))

lines = []
lines.append("import type { School, District, StudentType, SchoolTrait, WenliType } from '@/types';")
lines.append("")
lines.append("export const schools: School[] = [")

for idx, s in enumerate(school_list):
    sid = f"s{idx + 1}"
    lines.append("  {")
    lines.append(f"    id: '{sid}',")
    lines.append(f"    name: {ts_string(s['name'])},")
    lines.append(f"    district: {ts_string(s['district'])} as District,")
    lines.append("    type: '公办',")
    lines.append(f"    level: {ts_string(s['level'])},")
    lines.append(f"    acScore2025: {s['acScore2025']},")
    lines.append(f"    dScore2025: {s['dScore2025']},")
    lines.append(f"    hasBoarding: {str(s['hasBoarding']).lower()},")
    lines.append(f"    hasDay: {str(s['hasDay']).lower()},")
    lines.append(f"    plan2026: {s['plan2026']},")
    lines.append(f"    description: {ts_string(s['description'])},")
    features_str = ', '.join(ts_string(f) for f in s['features'])
    lines.append(f"    features: [{features_str}],")
    lines.append(f"    address: {ts_string(s['address'])},")
    lines.append(f"    affiliation: {ts_string(s['affiliation'])},")
    
    if s.get('historicalScores'):
        lines.append("    historicalScores: {")
        for year in sorted(s['historicalScores'].keys()):
            entry = s['historicalScores'][year]
            parts = [f"ac: {entry['ac']}"]
            if 'd' in entry:
                parts.append(f"d: {entry['d']}")
            if 'rank' in entry:
                parts.append(f"rank: {entry['rank']}")
            lines.append(f"      {year}: {{ {', '.join(parts)} }},")
        lines.append("    },")
    
    if s.get('acScore2025Raw') is not None:
        lines.append(f"    acScore2025Raw: {s['acScore2025Raw']},")
    if s.get('dScore2025Raw') is not None:
        lines.append(f"    dScore2025Raw: {s['dScore2025Raw']},")
    if s.get('acBoarding2025') is not None:
        lines.append(f"    acBoarding2025: {s['acBoarding2025']},")
    if s.get('dBoarding2025') is not None:
        lines.append(f"    dBoarding2025: {s['dBoarding2025']},")
    if s.get('acDay2025') is not None:
        lines.append(f"    acDay2025: {s['acDay2025']},")
    if s.get('dDay2025') is not None:
        lines.append(f"    dDay2025: {s['dDay2025']},")
    if s.get('totalPlan2025') is not None:
        lines.append(f"    totalPlan2025: {s['totalPlan2025']},")
    if s.get('boardingPlan2025') is not None:
        lines.append(f"    boardingPlan2025: {s['boardingPlan2025']},")
    if s.get('dayPlan2025') is not None:
        lines.append(f"    dayPlan2025: {s['dayPlan2025']},")
    if s.get('acPlan2025') is not None:
        lines.append(f"    acPlan2025: {s['acPlan2025']},")
    if s.get('dPlan2025') is not None:
        lines.append(f"    dPlan2025: {s['dPlan2025']},")
    if s.get('boardingAc2025') is not None:
        lines.append(f"    boardingAc2025: {s['boardingAc2025']},")
    if s.get('boardingD2025') is not None:
        lines.append(f"    boardingD2025: {s['boardingD2025']},")
    if s.get('dayAc2025') is not None:
        lines.append(f"    dayAc2025: {s['dayAc2025']},")
    if s.get('dayD2025') is not None:
        lines.append(f"    dayD2025: {s['dayD2025']},")
    if s.get('indicatorAc2025') is not None:
        lines.append(f"    indicatorAc2025: {s['indicatorAc2025']},")
    if s.get('indicatorD2025') is not None:
        lines.append(f"    indicatorD2025: {s['indicatorD2025']},")
    if s.get('indicatorLineAc') is not None:
        lines.append(f"    indicatorLineAc: {s['indicatorLineAc']},")
    if s.get('indicatorLineD') is not None:
        lines.append(f"    indicatorLineD: {s['indicatorLineD']},")
    if s.get('selfRecruitClass1'):
        lines.append(f"    selfRecruitClass1: {ts_string(s['selfRecruitClass1'])},")
    if s.get('selfRecruitClass2'):
        lines.append(f"    selfRecruitClass2: {ts_string(s['selfRecruitClass2'])},")
    if s.get('admissionGuide'):
        lines.append(f"    admissionGuide: {ts_string(s['admissionGuide'])},")
    if s.get('classTypes'):
        lines.append(f"    classTypes: {ts_string(s['classTypes'])},")
    if s.get('dormitory'):
        lines.append(f"    dormitory: {ts_string(s['dormitory'])},")
    if s.get('wenli'):
        lines.append(f"    wenli: {ts_string(s['wenli'])} as WenliType,")
    if s.get('founded') is not None:
        lines.append(f"    founded: {s['founded']},")
    if s.get('traits'):
        traits_str = ', '.join(ts_string(t) for t in s['traits'])
        lines.append(f"    traits: [{traits_str}] as SchoolTrait[],")
    if s.get('phonePolicy'):
        lines.append(f"    phonePolicy: {ts_string(s['phonePolicy'])},")
    if s.get('reputation'):
        rep = s['reputation']
        lines.append("    reputation: {")
        lines.append(f"      count: {rep['count']},")
        for dim in ['overallSatisfaction', 'teacherQuality', 'teachingQuality', 'managementEffect', 'canteenSatisfaction', 'dormSatisfaction', 'activityRichness', 'teacherAttention']:
            if dim in rep:
                lines.append(f"      {dim}: {rep[dim]},")
        if 'compositeScore' in rep:
            lines.append(f"      compositeScore: {rep['compositeScore']},")
        lines.append("    },")
    lines.append("  },")

# Append private schools from damaged file
private_schools = [
  {
    'id': 's92',
    'name': '梅沙高中',
    'district': '盐田',
    'type': '民办',
    'level': '普通公办',
    'acScore2025': 510,
    'dScore2025': 518,
    'hasBoarding': True,
    'hasDay': False,
    'plan2026': 300,
    'description': '小班化精品高中',
    'features': ['小班化', '精品', '盐田'],
  },
  {
    'id': 's93',
    'name': '深圳市富源学校',
    'district': '宝安',
    'type': '民办',
    'level': '民办',
    'acScore2025': 429,
    'dScore2025': 429,
    'hasBoarding': True,
    'hasDay': False,
    'plan2026': 800,
    'description': '民办高中领头羊，军事化管理',
    'features': ['军事化管理', '宝安', '民办最强'],
  },
  {
    'id': 's94',
    'name': '桃源居中澳实验学校',
    'district': '宝安',
    'type': '民办',
    'level': '民办',
    'acScore2025': 413,
    'dScore2025': 413,
    'hasBoarding': True,
    'hasDay': False,
    'plan2026': 600,
    'description': '十二年一贯制，国际化办学',
    'features': ['国际化', '一贯制', '宝安'],
  },
  {
    'id': 's95',
    'name': '深圳市承翰学校',
    'district': '龙岗',
    'type': '民办',
    'level': '民办',
    'acScore2025': 389,
    'dScore2025': 389,
    'hasBoarding': True,
    'hasDay': False,
    'plan2026': 400,
    'description': '国际化课程，双轨升学',
    'features': ['国际课程', '双轨升学', '龙岗'],
  },
  {
    'id': 's96',
    'name': '华侨（康桥）书院',
    'district': '宝安',
    'type': '民办',
    'level': '民办',
    'acScore2025': 381,
    'dScore2025': 381,
    'hasBoarding': True,
    'hasDay': False,
    'plan2026': 500,
    'description': '十二年一贯制民办学校',
    'features': ['一贯制', '宝安'],
  },
  {
    'id': 's97',
    'name': '福桥高级中学',
    'district': '宝安',
    'type': '民办',
    'level': '民办',
    'acScore2025': 372,
    'dScore2025': 372,
    'hasBoarding': True,
    'hasDay': False,
    'plan2026': 500,
    'description': '新建民办高中',
    'features': ['新建校', '宝安'],
  },
  {
    'id': 's98',
    'name': '深圳市滨海高级中学',
    'district': '宝安',
    'type': '民办',
    'level': '民办',
    'acScore2025': 355,
    'dScore2025': 355,
    'hasBoarding': True,
    'hasDay': False,
    'plan2026': 400,
    'description': '艺术特色民办高中',
    'features': ['艺术特色', '宝安'],
  },
  {
    'id': 's99',
    'name': '深圳市格睿特高级中学',
    'district': '龙华',
    'type': '民办',
    'level': '民办',
    'acScore2025': 351,
    'dScore2025': 351,
    'hasBoarding': True,
    'hasDay': False,
    'plan2026': 400,
    'description': '龙华区民办高中',
    'features': ['龙华', '民办'],
  },
  {
    'id': 's100',
    'name': '深圳市明瑞高级中学',
    'district': '宝安',
    'type': '民办',
    'level': '民办',
    'acScore2025': 341,
    'dScore2025': 341,
    'hasBoarding': True,
    'hasDay': False,
    'plan2026': 400,
    'description': '宝安区民办高中',
    'features': ['宝安', '民办'],
  },
  {
    'id': 's101',
    'name': '深圳市立人高级中学',
    'district': '龙岗',
    'type': '民办',
    'level': '民办',
    'acScore2025': 345,
    'dScore2025': 345,
    'hasBoarding': True,
    'hasDay': False,
    'plan2026': 400,
    'description': '龙岗区民办高中',
    'features': ['龙岗', '民办'],
  },
  {
    'id': 's102',
    'name': '深圳杰仁高级中学',
    'district': '宝安',
    'type': '民办',
    'level': '民办',
    'acScore2025': 342,
    'dScore2025': 342,
    'hasBoarding': True,
    'hasDay': False,
    'plan2026': 400,
    'description': '宝安区民办高中',
    'features': ['宝安', '民办'],
  },
]

for ps in private_schools:
    lines.append("  {")
    for k, v in ps.items():
        if k in ['id', 'name', 'district', 'type', 'level', 'description']:
            lines.append(f"    {k}: {ts_string(v)},")
        elif k == 'features':
            features_str = ', '.join(ts_string(f) for f in v)
            lines.append(f"    {k}: [{features_str}],")
        elif k in ['hasBoarding', 'hasDay']:
            lines.append(f"    {k}: {str(v).lower()},")
        elif k == 'district':
            lines.append(f"    {k}: {ts_string(v)} as District,")
        else:
            lines.append(f"    {k}: {v},")
    lines.append("  },")

lines.append("];")
lines.append("")
lines.append("export function getSchoolScore(school: School, studentType: StudentType): number {")
lines.append("  return studentType === 'AC' ? school.acScore2025 : school.dScore2025;")
lines.append("}")
lines.append("")
lines.append("export function getSchoolById(id: string): School | undefined {")
lines.append("  return schools.find(s => s.id === id);")
lines.append("}")
lines.append("")

with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'Wrote {len(lines)} lines to {output_path}')
print(f'Total public schools: {len(school_list)}')
print(f'Total private schools: {len(private_schools)}')
