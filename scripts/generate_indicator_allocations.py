import argparse
import json
import re
from pathlib import Path

import openpyxl

ROOT_DIR = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT_PATH = ROOT_DIR / 'src' / 'data' / 'indicatorAllocations.ts'
REFERENCE_SCHOOLS_PATH = ROOT_DIR / 'src' / 'data' / 'schools.ts'

NAME_MAP = {
    '深中': '深圳中学',
    '深圳中学': '深圳中学',
    '深圳中学科技高中': '深圳中学科技高中',
    '深圳中学数理高中': '深圳中学数理高中',
    '深圳中学实验高中': '深圳中学实验高中',
    '深圳实验学校（高中部）': '深圳实验学校（高中部）',
    '深圳实验学校（光明高中部）': '深圳实验学校光明高中部',
    '深圳实验学校明理高中': '深圳实验学校明理高中',
    '深圳实验学校崇文高中': '深圳实验学校崇文高中',
    '深圳实验学校卓越高中': '深圳实验学校卓越高中',
    '深圳实验学校至臻高中': '深圳实验学校至臻高中',
    '深圳外国语学校': '深圳外国语学校',
    '深圳外国语学校龙华高中部': '深圳外国语学校龙华高中部',
    '深圳外国语学校致远高中': '深圳外国语学校致远高中',
    '深圳外国语学校弘知高中': '深圳外国语学校弘知高中',
    '深圳外国语学校博雅高中': '深圳外国语学校博雅高中',
    '深圳外国语学校理工高中': '深圳外国语学校理工高中',
    '深圳市高级中学中心校区': '深圳市高级中学中心校区',
    '深圳市高级中学东校区': '深圳市高级中学东校区',
    '深圳市高级中学创新高中': '深圳市高级中学创新高中',
    '深圳市高级中学理慧高中': '深圳市高级中学理慧高中',
    '深圳市高级中学有为高中': '深圳市高级中学有为高中',
    '深圳市高级中学文博高中': '深圳市高级中学文博高中',
    '红岭中学': '红岭中学',
    '育才中学': '育才中学',
    '育才中学蛇口校区': '育才中学蛇口校区',
    '宝安中学（集团）高中部': '宝安中学（集团）高中部',
    '深圳大学附属中学': '深圳大学附属中学（深大附中）',
    '深圳大学附属中学（深大附中）': '深圳大学附属中学（深大附中）',
    '北京师范大学南山附属学校高中部': '北师大南山附属学校高中部',
    '北师大南山附属学校高中部': '北师大南山附属学校高中部',
    '深圳科学高中': '深圳科学高中',
    '深圳市南山外国语学校（集团）高级中学': '深圳市南山外国语学校（集团）高级中学',
    '深圳市第二高级中学': '深圳市第二高级中学',
    '翠园中学': '翠园中学',
    '龙城高级中学': '龙城高级中学',
    '南方科技大学附属中学': '南方科技大学附属中学',
    '龙华高级中学': '龙华高级中学',
    '人大附中深圳学校': '人大附中深圳学校',
    '深圳市第二实验学校': '深圳市第二实验学校',
    '广东实验中学深圳学校': '广东实验中学深圳学校',
    '新安中学（集团）高中部': '新安中学（集团）高中部',
    '深圳大学附属实验中学': '深圳大学附属实验中学',
    '深圳科学高中龙岗分校': '深圳科学高中龙岗分校',
    '华中师范大学龙岗附属中学': '华中师范大学龙岗附属中学',
    '深圳北理莫斯科大学附属实验中学': '深圳北理莫斯科大学附属实验中学',
    '中国科学院深圳理工大学附属实验高级中学': '中国科学院深圳理工大学附属实验高级中学',
    '南头中学': '南头中学',
    '东北师范大学附属中学深圳学校': '东北师范大学附属中学深圳学校',
    '盐田高级中学': '盐田高级中学',
    '深圳市红山中学': '深圳市红山中学',
    '深圳市格致中学': '深圳市格致中学',
    '华侨城高级中学': '华侨城高级中学',
    '深圳市龙岗区实验高级中学': '深圳市龙岗区实验高级中学',
    '香港中文大学(深圳)附属明德高级中学': '香港中文大学(深圳)附属明德高级中学（A等级和534）',
    '罗湖外语学校': '罗湖外语学校',
    '松岗中学': '松岗中学',
    '福田中学': '福田中学',
    '宝安第一外国语学校': '宝安第一外国语学校',
    '深圳技术大学附属中学': '深圳技术大学附属中学',
    '深圳第二外国语学校': '深圳第二外国语学校',
    '深圳市龙津中学': '深圳市龙津中学',
    '西交利物浦大学基础教育集团外国语高级中学': '西交利物浦大学基础教育集团外国语高级中学',
    '深圳市第三高级中学': '深圳市第三高级中学（国内高考班）',
    '罗湖高级中学': '罗湖高级中学',
    '深圳市燕川中学': '深圳市燕川中学',
    '红岭教育集团大鹏华侨中学': '深圳市红岭教育集团大鹏华侨中学',
    '平冈中学': '平冈中学',
    '西乡中学': '西乡中学',
    '光明区高级中学': '光明区高级中学',
    '深圳市龙华外国语高级中学': '深圳市龙华外国语高级中学',
    '深圳市福海中学': '深圳市福海中学',
    '深圳市第七高级中学': '深圳市第七高级中学',
    '深圳实验学校': '深圳实验学校（高中部）',
    '深圳市第一职业技术学校（综合高中）': '深圳市第一职业技术学校（综合高中）',
    '深圳市致理中学': '深圳市致理中学',
    '北京大学附属中学深圳学校': '北京大学附属中学深圳学校',
    '观澜中学': '观澜中学',
    '坪山高级中学': '坪山高级中学',
    '深圳市盐港中学（综合高中）': '深圳市盐港中学（综合高中）',
    '深圳市行知职业技术学校（综合高中）': '深圳市行知职业技术学校（综合高中）',
    '深圳市龙华科技实验高级中学': '深圳市龙华科技实验高级中学',
    '深圳市聚龙科学中学': '深圳市聚龙科学中学',
    '宝安中学（集团）石岩外国语学校': '宝安中学（集团）石岩外国语学校',
    '光明中学': '光明中学',
    '横岗高级中学': '横岗高级中学',
    '龙华中学': '龙华中学',
    '深圳市第二实验学校明远高中': '深圳市第二实验学校明远高中',
    '布吉高级中学': '布吉高级中学',
    '平湖外国语学校': '平湖外国语学校',
    '深圳市第二高级中学深汕实验学校': '深圳市第二高级中学深汕实验学校',
    '深圳市艺术高中': '深圳市艺术高中',
    '深圳市美术学校': '深圳市美术学校',
    '深圳市第三高级中学（国家留学基金委自费出国留学班）': '深圳市第三高级中学（国家留学基金委自费出国留学班）',
    '梅沙高中': '梅沙高中',
}


def normalize_text(value: str | None) -> str:
    if value is None:
        return ''
    return re.sub(r'\s+', ' ', str(value)).strip()


def normalize_key(value: str | None) -> str:
    text = normalize_text(value).lower()
    text = re.sub(r'[\s()（）\-\u3000]', '', text)
    return text


def extract_school_names(path: Path) -> list[str]:
    content = path.read_text(encoding='utf-8')
    return re.findall(r"name: '([^']+)'", content)


def match_school_name(raw_name: str, standard_names: list[str]) -> str | None:
    cleaned = normalize_text(raw_name)
    cleaned = re.sub(r'（[一二]）$', '', cleaned)
    cleaned = re.sub(r'\([一二]\)$', '', cleaned)
    cleaned = cleaned.strip()

    if cleaned in NAME_MAP:
        return NAME_MAP[cleaned]

    normalized = normalize_key(cleaned)
    for name in standard_names:
      if normalize_key(name) == normalized:
          return name

    for name in standard_names:
        if cleaned in name or name in cleaned:
            return name
    return None


def build_allocations(workbook_path: Path, reference_path: Path) -> list[dict]:
    standard_names = extract_school_names(reference_path)
    wb = openpyxl.load_workbook(workbook_path, read_only=True, data_only=True)

    allocations: dict[str, dict] = {}
    sheet_configs = [
        ('2025AC类指标分配表', 'acQuotas'),
        ('2025D类指标分配表', 'dQuotas'),
    ]

    for sheet_name, quota_key in sheet_configs:
        ws = wb[sheet_name]
        rows = ws.iter_rows(values_only=True)
        header_row = next(rows)
        headers = list(header_row[2:])
        school_names = [match_school_name(str(header or ''), standard_names) for header in headers]
        current_district = ''

        for row in rows:
            district = normalize_text(row[0])
            if district:
                current_district = district

            junior_school = normalize_text(row[1])
            if not junior_school or '共享' in junior_school:
                continue

            key = normalize_key(junior_school)
            entry = allocations.setdefault(
                key,
                {
                    'district': current_district,
                    'juniorSchool': junior_school,
                    'acQuotas': {},
                    'dQuotas': {},
                },
            )

            for offset, school_name in enumerate(school_names, start=2):
                if not school_name:
                    continue
                value = row[offset]
                if not isinstance(value, (int, float)) or int(value) <= 0:
                    continue
                entry[quota_key][school_name] = int(value)

    return sorted(allocations.values(), key=lambda item: (item['district'], item['juniorSchool']))


def write_output(output_path: Path, allocations: list[dict]) -> None:
    lines = [
        'export interface JuniorSchoolIndicatorAllocation {',
        '  district: string;',
        '  juniorSchool: string;',
        '  acQuotas: Record<string, number>;',
        '  dQuotas: Record<string, number>;',
        '}',
        '',
        'export const juniorSchoolIndicatorAllocations: JuniorSchoolIndicatorAllocation[] = ',
        json.dumps(allocations, ensure_ascii=False, indent=2),
        ';',
        '',
        'export const juniorSchoolNames = juniorSchoolIndicatorAllocations.map(item => item.juniorSchool);',
        '',
        "function normalizeJuniorSchool(value: string): string {",
        "  return value.toLowerCase().replace(/[\\s()（）-]/g, '');",
        '}',
        '',
        'export function findJuniorSchoolIndicatorAllocation(input: string): JuniorSchoolIndicatorAllocation | undefined {',
        '  const normalizedInput = normalizeJuniorSchool(input.trim());',
        '  if (!normalizedInput) return undefined;',
        '  return juniorSchoolIndicatorAllocations.find((item) => {',
        '    const normalizedName = normalizeJuniorSchool(item.juniorSchool);',
        '    return normalizedName === normalizedInput || normalizedName.includes(normalizedInput) || normalizedInput.includes(normalizedName);',
        '  });',
        '}',
        '',
    ]
    output_path.write_text('\n'.join(lines), encoding='utf-8')


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Generate indicator allocation data from the workbook.')
    parser.add_argument('excel_path', help='Path to the source Excel workbook.')
    parser.add_argument('--output', default=str(DEFAULT_OUTPUT_PATH), help='Path to the generated TypeScript file.')
    parser.add_argument('--reference', default=str(REFERENCE_SCHOOLS_PATH), help='Reference schools.ts used to normalize high school names.')
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    workbook_path = Path(args.excel_path).expanduser().resolve()
    output_path = Path(args.output).expanduser().resolve()
    reference_path = Path(args.reference).expanduser().resolve()

    allocations = build_allocations(workbook_path, reference_path)
    write_output(output_path, allocations)
    print(f'Generated {len(allocations)} junior school allocation records to {output_path}')


if __name__ == '__main__':
    main()
