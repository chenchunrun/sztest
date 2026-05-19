# Shenzhen High School Admission Application

基于 Vite + React + TypeScript 的深圳中考志愿填报站点，包含学校库、学校对比、体育分计算和志愿推荐能力。

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run data:verify
npm run hooks:install
```

## Data Verification

学校数据文件位于 [src/data/schools.ts](/Users/newmba/sztest/src/data/schools.ts:1)，来源于 `~/Downloads/2026中考数据库.xlsx`。

执行下面命令可把当前 `schools.ts` 和 Excel 重新生成结果做全量比对：

```bash
npm run data:verify
```

校验脚本位于 [scripts/verify_schools_data.py](/Users/newmba/sztest/scripts/verify_schools_data.py:1)，数据生成脚本位于 [generate_schools.py](/Users/newmba/sztest/generate_schools.py:1)。

## Local Hook

执行下面命令可启用仓库内置的 `pre-commit` hook：

```bash
npm run hooks:install
```

启用后，提交前会自动执行 `npm run lint` 和 `npm run data:verify`。

## CI Note

GitHub Actions 会始终执行 `lint`。如果仓库根目录存在 `2026中考数据库.xlsx`，还会额外执行一次学校数据全量校验；如果该文件未提交到仓库，则会跳过这一步。
```
