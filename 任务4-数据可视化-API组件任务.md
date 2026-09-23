# 任务4：数据可视化（8分）— 接口 / 组件 / 任务拆解

范围：选手自写 pojo、mapper、service、controller + 管理前台维护数据 + `可视化平台框架` 大屏展示。  
组件与接口总表见 `数据可视化平台API文档.md`。

---

## 0. 总体布局

| 区域 | 模块 |
|------|------|
| 左 | 能耗总览、能耗占比、库存预警 |
| 中 | 数据总览、销售计划完成率 |
| 右 | 销售统计、销售排名（TOP8）、生产统计 |
| 右上角 | 系统日期、星期、时间 |

外壳：`views/home.vue`（标题 + 时间）。  
内容：`views/indexs/index.vue`（三栏 `ItemWrap`）。  
框架组件：全局 `ItemWrap`、`Echart`；滚动表用 `vue3-seamless-scroll` 或定时滚动。

---

## 1. 后端任务（选手编写）

按题目自建分析接口时的建议分层（可复用 `neu-carbon-report` 已有类）：

| 层 | 职责 | 建议 |
|----|------|------|
| pojo / VO | 图表点、预警行、总览数字 | 如 `EnergyGaugeVO`、`EnergyPercentVO`、`StockWarnVO`、`SaleOverviewVO`、`SalePlanRateVO`、`SaleStatVO`、`SaleRankVO`、`ProdStatVO`、`EmissionRankVO` |
| mapper | SQL 聚合 | sum/group by 年月、按库存上下限判状态、TOP8 limit |
| service | 计算完成率、占比、状态色枚举 | 完成率 = 已售/计划；占比 = 分项/总数 |
| controller | 暴露 GET | 统一 `AjaxResult` 或分页 `TableDataInfo` |

**管理前台写入后要能带动大屏**：增删改销售合同/计划、库存、能耗/碳排、生产数据的接口接在管理前端既有 CRUD 上；大屏查询接口只读聚合。

已有可对接路径（与 `api/modules` 的 `paramType` 一致）：

| 键 | 路径 | Controller（已有参考） |
|----|------|------------------------|
| big1 | GET `/carbonReport/emissionChart/percent` | `MonitorChartReportController` |
| big3 | GET `/material/materialInventory/list` | `WmsWarehouseMaterialController` |
| big4 | GET `/carbonReport/saleStat` | `BigScreenReport` |
| big5 | GET `/carbonReport/productPowerReport/list` | `VMesProductPowerDetailController` |
| big6 | GET `/carbonReport/salePlan/achieveRate` | `BigScreenReport` |
| big7 | GET `/carbonReport/saleCustomer/ranking` | `BigScreenReport` |
| big8/9/10 | GET `/carbonReport/productPowerReport/day|month|year` | 同上 |
| big11 | GET `/carbonReport/equipmentPowerReport/list` | `VMesEquipmentPowerDetailController` |
| big12 | GET `/carbonReport/saleOverall` | `BigScreenReport` |

自写接口时路径风格建议保持 `/carbonReport/...` 或独立 `/bigScreen/...`，并在 `paramType` 中登记。

---

## 2. 分项：要求 → API → 组件

### 2.1 右上角日期时间

| 项 | 内容 |
|----|------|
| 要求 | 动态显示当前系统日期、星期、时间 |
| 前端 | `views/home.vue`：`dateYear` / `dateWeek` / `dateDay`，1s `setInterval` |
| 工具 | `utils/index.js` → `formatTime` |
| API | 无（纯前端） |
| 组件 | 无独立组件；模板 `.timers` |
| 任务 | 确认格式与题目一致（建议 `HH:mm:ss`，去掉源码里 `HH: mm: ss` 的空格） |

### 2.2 左 · 能耗总览（仪表盘）

| 项 | 内容 |
|----|------|
| 要求 | 耗电量、耗水量、碳排放量三只仪表盘，不同颜色；环/表中心显示数值 |
| API | 建议：`GET /carbonReport/emissionChart/overall` 或 `paramType.big2` = `/carbonReport/productPowerReport/year`；也可自写汇总接口一次返回三项总数 |
| 调用 | `currentGET('big2')` 或 `GET('/carbonReport/emissionChart/overall')` |
| 组件 | `ItemWrap title="能耗总览"` + **三个 `Echart`**，`series.type = 'gauge'` |
| 后端 | pojo：耗电、耗水、碳排 total；mapper sum；service 汇总；controller GET |
| 任务 | ① 出三项 total 的接口 ② 三只 gauge、不同 `color` ③ `detail`/中心显示数值 |

### 2.3 左 · 能耗占比（环状图）

| 项 | 内容 |
|----|------|
| 要求 | 办公耗电、办公用水、生产用水、生产耗电的数量与占总数比例；不同颜色；中心显示能耗总数 |
| API | **`GET /carbonReport/emissionChart/percent`**（`paramType.big1`） |
| 调用 | `currentGET('big1')` |
| 组件 | `ItemWrap title="能耗占比"`（`index.vue` 已挂 `LeftCenter` 占位）+ `Echart` `type: 'pie'`，`radius` 内外圈；中心 `title` 或 `graphic` 显示总数 |
| 后端 | 已有 percent 聚合四类能耗；不足则补 mapper 四字段 sum |
| 任务 | ① 绑定 percent 接口 ② pie 四扇区颜色 ③ 中心总数 ④ tooltip 显示数量+百分比 |

### 2.4 左 · 库存预警（滚动表格）

| 项 | 内容 |
|----|------|
| 要求 | 列：编号、物料及名称、仓库及名称、当前库存及数量、状态；正常白 / 不足绿 / 溢出红；自动滚动 |
| API | **`GET /material/materialInventory/list`**（`paramType.big3`）；状态可由上下限在前端或后端计算 |
| 调用 | `currentGET('big3', { pageNum, pageSize })` |
| 组件 | `ItemWrap title="库存预警"` + `el-table` 或 `vue3-seamless-scroll`；状态用行内 `style/color` |
| 后端 | 若状态未返回：在 service 比较 `quantity` 与 `minStock`/`maxStock` 输出 `status: 0/1/2` |
| 任务 | ① 拉列表 ② 三色状态 ③ 滚动（seamless-scroll 或定时轮播） ④ 管理端改库存后刷新 |

### 2.5 中 · 数据总览（上：销售额/碳排；下：碳排排行榜）

**上半部分**

| 指标 | API | 键 |
|------|-----|-----|
| 今年/本月/今日累计销售额 | **`GET /carbonReport/saleOverall`** | `big12` → `yearTotal` / `monthTotal` / `todayTotal` |
| 本年/本月/今日累计碳排放 | **`GET /carbonReport/productPowerReport/year|month|day`** | `big10` / `big9` / `big8` |

组件：两行数字卡片（`ItemWrap` 内自写 `div` 卡片，或 `Echart` 不适用时用 HTML）。  
任务：六个数字字段对齐接口；管理端新增销售/生产后接口数值变化。

**下半部分 · 碳排放排行榜 TOP8**

| 项 | 内容 |
|----|------|
| 要求 | 表：编号、设备、生产数量、碳排放；按碳排放降序 8 条 |
| API | **`GET /carbonReport/equipmentPowerReport/list`**（`big11`）或 `productPowerReport/list` 后前端排序截断；自写则 SQL `ORDER BY carbon DESC LIMIT 8` |
| 组件 | `Echart`（`bar` 纵向/横向）或 `el-table` |
| 后端 | controller 接收 `limit=8` 或固定 8；pojo 含 equipmentName、produceQty、emission |
| 任务 | ① 接口返回 8 条降序 ② 四列展示 |

### 2.6 中 · 销售计划完成率（组合图）

| 项 | 内容 |
|----|------|
| 要求 | x：年月；左 y：销售数量；右 y：完成率；柱：已销售 vs 计划销售（异色）；线：完成率；悬停显示年月、已销售及额、计划及额、完成率% |
| API | **`GET /carbonReport/salePlan/achieveRate`**（`big6`） |
| 响应 | `{ category[], barData[], lineData[], rateData[] }`（当前实现金额为万；若要求数量需后端改字段） |
| 组件 | `ItemWrap title="销售计划完成率"` + `Echart`：两 `bar` + 一 `line y2`；`tooltip.trigger='axis'` 自定义 `formatter` 拼题目字段 |
| 后端 | service：`rate = 已售/计划`；`BigScreenReport.salePlanAchieveRate` 已算 12 个月 |
| 任务 | ① 双色柱 ② 右轴完成率 ③ tooltip 四类信息 ④ 与「数量/金额」口径和题目一致 |

### 2.7 右 · 销售统计（曲线图）

| 项 | 内容 |
|----|------|
| 要求 | x 年月；左 y 销售额；两条曲线：总销售额、合同额；悬停显示年月、总销售额(万)、合同额(万) |
| API | **`GET /carbonReport/saleStat`**（`big4`） |
| 响应 | `{ dateList, numList, numList2 }`（万） |
| 组件 | `ItemWrap title="销售统计"` + `Echart` `type:'line'` ×2；`tooltip` axis |
| 对应关系 | 需确认 `numList`/`numList2` 与「总销售额/合同额」一致（后端为 contractTotal、orderTotal，按题意核对命名） |
| 任务 | ① 双线异色 ② 单位万 ③ tooltip 字段 |

### 2.8 右 · 销售排名 TOP8（柱形图）

| 项 | 内容 |
|----|------|
| 要求 | 左侧公司名、底部销售额、不同颜色柱、右侧数值、从高到低 8 名 |
| API | **`GET /carbonReport/saleCustomer/ranking`**（`big7`）→ `List<{name,value}>` |
| 组件 | `ItemWrap title="销售排名"` + `Echart`：`yAxis` 类目为公司名（或 `xAxis` 反向 `bar`），`label.position:'right'`，`sort` 降序取 8 |
| 后端 | SQL `GROUP BY customer ORDER BY sum(value) DESC LIMIT 8` |
| 任务 | ① TOP8 ② 右侧 label ③ 多色 `color` 数组 ④ 降序 |

### 2.9 右 · 生产统计（滚动表格）

| 项 | 内容 |
|----|------|
| 要求 | 列：编号、产品及名称、型号、规格、单位、库存、已生产、待生产、碳排放；自动滚动 |
| API | **`GET /carbonReport/productPowerReport/list`**（`big5`） |
| 组件 | `ItemWrap title="生产统计"` + 同 2.4 滚动表实现 |
| 后端 | 视图/表含 productName、model、spec、unit、stock、produced、toProduce、emission |
| 任务 | ① 九列字段 ② 滚动 ③ 管理端生产数据变更后刷新 |

---

## 3. 组件—任务对照表

| 任务块 | ItemWrap | Echart 类型 | 滚动表 | 日期时间 | Reacquire | 主要 API 键 |
|--------|----------|-------------|--------|----------|-----------|-------------|
| 右上角时间 | — | — | — | ✓ home.vue | — | — |
| 能耗总览 | ✓ | gauge ×3 | — | — | 可选 | big2 / overall |
| 能耗占比 | ✓ | pie | — | — | 可选 | **big1** |
| 库存预警 | ✓ | — | ✓ | — | 可选 | **big3** |
| 数据总览-数字 | ✓ | — | — | — | 可选 | **big12** + big8/9/10 |
| 数据总览-排行 | ✓ | bar 或 table | — | — | 可选 | **big11** |
| 销售计划完成率 | ✓ | bar+line+line | — | — | 可选 | **big6** |
| 销售统计 | ✓ | line ×2 | — | — | 可选 | **big4** |
| 销售排名 TOP8 | ✓ | bar | — | — | 可选 | **big7** |
| 生产统计 | ✓ | — | ✓ | — | 可选 | **big5** |

---

## 4. 管理前台改动如何反映到大屏

| 管理端操作 | 影响大屏 | 接口 |
|------------|----------|------|
| 新增/修改销售合同、发货 | 销售总览、销售统计、排名、完成率 | big12、big4、big7、big6 |
| 新增销售计划 | 完成率计划柱 | big6 |
| 出入库、改库存 | 库存预警 | big3 |
| 生产报工/完工 | 生产统计、碳排日月年、能耗总览 | big5、big8/9/10、big2 |
| 能耗/碳排配置或抄表 | 能耗占比、总览 | big1、big2 |

刷新方式：进入 `/index` 时拉取；或 `Reacquire` 的 `@onclick` 重新 `currentGET`；或 30–60s 轮询。

管理前端写入口沿用既有 `src/api/**` CRUD；可视化只读。两边同库。

---

## 5. 后端交付清单（对照题目）

- [ ] pojo：图表/总览/预警/排行等 VO 或复用现有 domain  
- [ ] mapper：聚合 SQL（sum、group by 年月、limit 8、库存状态）  
- [ ] service：完成率、占比、状态判定  
- [ ] controller：上述 GET；路径与 `paramType` 或题解文档一致  
- [ ] 管理前台：能维护销售、库存、生产、能耗相关数据  
- [ ] 大屏：三栏布局 + 8 类展示 + 右上角时间  
- [ ] 管理端添加数据 → 大屏数值变化（联调一次）  
- [ ] 权限：大屏接口若需登录，`api/api.js` 的 `token` 头与后端一致  

---

## 6. 前端交付清单

- [ ] `home.vue` 日期/星期/时间  
- [ ] `indexs/index.vue` 左中右七块 `ItemWrap` 标题齐全  
- [ ] 能耗总览 3×gauge  
- [ ] 能耗占比 pie + 中心总数  
- [ ] 库存预警表 + 三色 + 滚动  
- [ ] 数据总览 6 数字 + 碳排 TOP8 表/图  
- [ ] 完成率组合图 + tooltip  
- [ ] 销售统计双线 + tooltip  
- [ ] 销售排名 TOP8 横/纵柱 + 右侧数值  
- [ ] 生产统计九列 + 滚动  
- [ ] 每块数据来自 `paramType` 或文档中的路径，禁止写死无关外网地址（`api/date.js` 绝对 URL 应改为相对路径）  

---

## 7. 推荐实现顺序

1. 后端补齐/核对 12 个 `paramType` 对应接口，curl 各测一次。  
2. `home.vue` 时间。  
3. `index.vue` 七块空 `ItemWrap` 铺满布局。  
4. 由简到繁：数字总览 → 排名 bar → 曲线 → 组合图 → 仪表盘 → 环状 → 两个滚动表。  
5. 管理端各写一条数据，刷新大屏核对。  
6. 核对 tooltip 字段、颜色、TOP8、三色状态是否与题目一致。
