import argparse
import difflib
import re
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent.parent
DEFAULT_TS_PATH = ROOT_DIR / "src" / "data" / "schools.ts"
DEFAULT_GENERATOR_PATH = ROOT_DIR / "generate_schools.py"
DEFAULT_XLSX_PATH = Path.home() / "Downloads" / "2026中考数据库.xlsx"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Verify src/data/schools.ts against the Excel workbook by regenerating it to a temp file."
    )
    parser.add_argument(
        "--excel",
        default=str(DEFAULT_XLSX_PATH),
        help="Path to the source Excel workbook.",
    )
    parser.add_argument(
        "--ts",
        default=str(DEFAULT_TS_PATH),
        help="Path to the checked-in schools.ts file.",
    )
    parser.add_argument(
        "--generator",
        default=str(DEFAULT_GENERATOR_PATH),
        help="Path to generate_schools.py.",
    )
    parser.add_argument(
        "--max-diff-lines",
        type=int,
        default=120,
        help="Maximum unified diff lines to print.",
    )
    return parser.parse_args()


def extract_school_names(text: str) -> list[str]:
    return re.findall(r"\n    name: '([^']+)'", text)


def main() -> int:
    args = parse_args()
    excel_path = Path(args.excel).expanduser().resolve()
    ts_path = Path(args.ts).expanduser().resolve()
    generator_path = Path(args.generator).expanduser().resolve()

    if not excel_path.exists():
        print(f"Excel file not found: {excel_path}", file=sys.stderr)
        return 2
    if not ts_path.exists():
        print(f"TypeScript file not found: {ts_path}", file=sys.stderr)
        return 2
    if not generator_path.exists():
        print(f"Generator script not found: {generator_path}", file=sys.stderr)
        return 2

    with tempfile.TemporaryDirectory() as temp_dir:
        generated_path = Path(temp_dir) / "schools.generated.ts"
        cmd = [
            sys.executable,
            str(generator_path),
            str(excel_path),
            "--output",
            str(generated_path),
            "--reference",
            str(ts_path),
        ]
        result = subprocess.run(
            cmd,
            cwd=ROOT_DIR,
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            print(result.stdout)
            print(result.stderr, file=sys.stderr)
            return result.returncode

        current_text = ts_path.read_text(encoding="utf-8")
        generated_text = generated_path.read_text(encoding="utf-8")

    current_names = extract_school_names(current_text)
    generated_names = extract_school_names(generated_text)
    current_set = set(current_names)
    generated_set = set(generated_names)

    print(f"Current schools.ts count: {len(current_names)}")
    print(f"Generated-from-Excel count: {len(generated_names)}")

    only_current = sorted(current_set - generated_set)
    only_generated = sorted(generated_set - current_set)

    if only_current:
        print("\nOnly in current schools.ts:")
        for name in only_current:
            print(f"- {name}")

    if only_generated:
        print("\nOnly in regenerated output:")
        for name in only_generated:
            print(f"- {name}")

    if current_text == generated_text:
        print("\nVerification passed: schools.ts matches regenerated Excel output exactly.")
        return 0

    print("\nVerification failed: schools.ts differs from regenerated Excel output.")
    diff_lines = list(
        difflib.unified_diff(
            current_text.splitlines(),
            generated_text.splitlines(),
            fromfile=str(ts_path),
            tofile="generated-from-excel",
            lineterm="",
        )
    )
    preview = diff_lines[: args.max_diff_lines]
    print("\n".join(preview))
    if len(diff_lines) > len(preview):
        print(f"\n... diff truncated, showing {len(preview)} of {len(diff_lines)} lines")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
