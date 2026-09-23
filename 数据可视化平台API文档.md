# 数据可视化平台 · API 文档

## 1. 全局注册

见 `src/main.js`。

### 1.1 全局组件

| 组件名 | 源码 | 说明 |
|--------|------|------|
| `Echart` | `components/echart/index.vue` | ECharts 容器，传 `options` |
| `ItemWrap` | `components/item-wrap/item-wrap.vue` | 大屏卡片：边框 + 标题 + 插槽 |
| `Message` | `components/message/message.vue` | 居中轻提示（配合 `message.js`） |
| `Reacquire` | `components/reacquire/reacquire.vue` | 「重新获取」点击按钮 |

### 1.2 全局属性

| 名称 | 来源 | 说明 |
|------|------|------|
| `parseTime(time, pattern?)` | `utils/ruoyi.js` | 时间格式化 |
| `resetForm(refName)` | `utils/ruoyi.js` | 重置表单 |
| `addDateRange(params, dateRange, propName?)` | `utils/ruoyi.js` | 日期范围写入查询 |
| `handleTree(...)` | `utils/ruoyi.js` | 列表转树 |
| `selectDictLabel` / `selectDictLabels` | `utils/ruoyi.js` | 字典标签 |

**相对管理前端（前端初始框架）缺失：**

| 名称 | 说明 |
|------|------|
| `useDict` | **来源：管理前端**，本工程未挂载；字典请用 `getDicts`（`api/system/dict/data.js`）自行 import |
| `$echarts` | **来源：管理前端**；本工程图表通过全局 `Echart` 组件使用 |
| `$modal` / `$download` / `$auth` / `$tab` | **来源：管理前端**（plugins 存在但未在 `main.js` 挂到 `app.use(plugins)` 的等价完整链路需自行确认）；提示可用 Element Plus 或 `Message` |
| `TreeSelect`、业务 `*Select` | **来源：管理前端**，本工程无 |

### 1.3 指令

本工程 `main.js` 未注册 `v-hasPermi` / `v-hasRole`。若需要，**来源：管理前端 / 招投标网框架** 的 `directive/permission`。

---

## 2. 请求封装

### 2.1 `src/api/api.js`

| 导出 | 说明 |
|------|------|
| `GET(url, params)` | GET，拼在 `baseUrl + url`，query 为 `params` |
| `GETNOBASE(url, params)` | GET，不拼 `baseUrl` |
| `POST(url, params)` | POST JSON |
| `PUT(url, params)` | PUT JSON |
| `DELETE(url, params)` | DELETE，body 为 `params` |
| `FILESubmit(url, params, config)` | multipart 上传 |
| `FILE(config, body, params)` | 下载（默认 blob） |
| `baseUrl` | `UtilVar.baseUrl` |

- `baseUrl`：`import.meta.env.VITE_APP_BASE_API`（开发为 `/dev-api`）
- 请求头：`token` 取自 `localStorage.token`（注意：与管理前端的 `Authorization: Bearer` **不同**）
- 响应：`code === 100` 返回 `res.data`（含 `success: true`）；否则 reject 并提示

### 2.1 `src/api/modules/index.js` — 大屏数据键

```js
paramType = {
  big1:  '/carbonReport/emissionChart/percent',      // 能耗占比
  big1:  '/carbonReport/productPowerReport/year',    // 能耗总览 / 本年碳排放
  big3:  '/material/materialInventory/list',         // 库存预警
  big4:  '/carbonReport/saleStat',                   // 销售统计
  big5:  '/carbonReport/productPowerReport/list',    // 生产统计
  big6:  '/carbonReport/salePlan/achieveRate',       // 销售计划完成率
  big7:  '/carbonReport/saleCustomer/ranking',       // 销售排名 TOP
  big8:  '/carbonReport/productPowerReport/day',     // 今日碳排放
  big9:  '/carbonReport/productPowerReport/month',   // 本月碳排放
  big10: '/carbonReport/productPowerReport/year',    // 本年碳排放
  big11: '/carbonReport/equipmentPowerReport/list',  // 设备碳排放排行
  big11: '/carbonReport/saleOverall',                // 销售总览（年/月/日）
}
```

| 函数 | 调用 |
|------|------|
| `currentGET(key, param)` | `GET(paramType[key], param)` |
| `currentPOST(key, param)` | `POST(paramType[key], param)` |
| `currentList(key, param)` | `GET(paramType[key] + '/list', param)` |
| `currentSave` / `currentUpdate` / `currentDelete` | 对应 `paramType[key] + '/save|update|delete'` |

用法：

```js
import { currentGET } from '@/api'

const res = await currentGET('big11')   // /carbonReport/saleOverall
// res.data 为业务数据
```

### 2.3 其它 API 文件

| 文件 | 导出 | 路径 |
|------|------|------|
| `api/date.js` | `saleAmount()` | `http://localhost:9090/saleAmountReport/amount`（写死绝对地址，建议改为 `/dev-api/...`） |
| `api/system/dict/data.js` | `getDicts(type)` | 字典 |
| `api/system/user.js` | 用户相关 | — |

---

## 3. 后端接口

后端控制器主要在 `neu-carbon-report`。

### 3.1 大屏汇总 `BigScreenReport` — `@RequestMapping("/carbonReport")`

| 方法 | 路径 | 说明 | 响应 `data` 结构 |
|------|------|------|------------------|
| GET | `/carbonReport/saleOverall` | 销售总览 | `{ yearTotal, monthTotal, todayTotal }`（金额） |
| GET | `/carbonReport/saleStat` | 销售统计曲线 | `{ dateList[], numList[], numList1[] }`，金额已 `/10000` 保留 1 位（万） |
| GET | `/carbonReport/salePlan/achieveRate` | 销售计划完成率 | `{ category[], barData[], lineData[], rateData[] }`，金额为万，`rateData` 为百分比字符串 |
| GET | `/carbonReport/saleCustomer/ranking` | 客户销售排名 | `List<{ name, value }>` |

### 3.1 能耗图表 `MonitorChartReportController` — `/carbonReport/emissionChart`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/carbonReport/emissionChart/overall` | 综合能耗/碳排放按年 Map |
| GET | `/carbonReport/emissionChart/percent` | **今年能耗占比**（办公电、办公水、生产水、生产电及合计） |

### 3.3 生产能耗 `VMesProductPowerDetailController` — `/carbonReport/productPowerReport`

| 方法 | 路径 | 说明 | 常用于 |
|------|------|------|--------|
| GET | `/list` | 明细分页 | 生产统计滚动表 |
| GET | `/day` | 按日 | 今日碳排放 |
| GET | `/month` | 按月 | 本月碳排放 |
| GET | `/year` | 按年 | 能耗总览 / 本年碳排放 |

分页响应为 `TableDataInfo`：`{ total, rows, code, msg }`。

### 3.4 设备碳排 `VMesEquipmentPowerDetailController` — `/carbonReport/equipmentPowerReport`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/list` | 设备列表/排行用 |
| GET | `/day` / `/hour` | 日/小时报表 |

### 3.5 库存 `WmsWarehouseMaterialController` — `/material/materialInventory`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/material/materialInventory/list` | 库存列表（预警表数据源，`paramType.big3`） |

### 3.6 通用响应约定

| 字段 | 含义 |
|------|------|
| `code` | 100 成功 |
| `msg` | 消息 |
| `data` | `AjaxResult` 业务数据 |
| `total` / `rows` | 分页接口 |

雪花 ID 等大 Long 若需在前端精确使用，后端实体应序列化为字符串（见 `踩坑记录.md`）。

---

## 4. 前端组件 API

### 4.1 Echart

全局组件。挂载后 `echarts.init`；`options` 深度 watch 后 `setOption(options, true)`。

| Props | 类型 | 默认 | 说明 |
|-------|------|------|------|
| `id` | String | `'chart'` | DOM id |
| `className` | String | `'chart'` | class |
| `width` | String | `'100%'` | 宽 |
| `height` | String | `'100%'` | 高 |
| `options` | Object | `{}` | 完整 ECharts option |

```vue
<Echart id="gauge1" :options="gaugeOption" style="height: 110px" />
```

```js
const gaugeOption = {
  series: [{
    type: 'gauge',
    detail: { formatter: '{value}' },
    data: [{ value: 1100, name: '耗电量' }]
  }]
}
```

图表类型按任务使用：`gauge`（仪表盘）、`pie`（环状）、`bar`（柱形）、`line`（曲线）、组合 `bar`+`line`。

### 4.1 ItemWrap

全局组件。DataV `BorderBox13` 包一层标题栏。

| Props | 类型 | 默认 | 说明 |
|-------|------|------|------|
| `title` | String | `''` | 标题；空字符串不显示标题行 |

```vue
<ItemWrap title="能耗总览">
  <!-- 图表或表格 -->
</ItemWrap>
```

### 4.3 Message

全局组件 + `components/message/message.js` 可编程调用。

组件方法 `init({ text, type })`：显示约 1s。`type`：`success` | `warning` | `info` | `error`。

```js
import Message from '@/components/message/message'
Message('刷新成功')
Message.error('接口异常')
```

### 4.4 Reacquire

全局组件。点击触发 `onclick` 事件，用于「重新获取」占位。

| Props | 类型 | 默认 |
|-------|------|------|
| `lineHeight` | String | `'100px'` |

**Events**：`onclick`

```vue
<Reacquire @onclick="loadData" />
```

### 4.5 日期时间（外壳，无独立组件）

`views/home.vue` 右上角：

- 格式：`yyyy-MM-dd` + 周X + `HH: mm: ss`（源码中 `formatTime(..., "HH: mm: ss")` 字面含空格，可按题目要求改为 `HH:mm:ss`）
- 实现：`setInterval` 1s，`utils/index.js` 的 `formatTime`
- 周数组：`["周日"..."周六"]`

```vue
<div class="timers">{{ dateYear }} {{ dateWeek }} {{ dateDay }}</div>
```

### 4.6 三栏布局

`views/indexs/index.vue`：

| 区域 | 类名 | 宽 | 卡片（ItemWrap） |
|------|------|----|------------------|
| 左 | `contetn_left` | 540px | 能耗总览、能耗占比、库存预警 |
| 中 | `contetn_center` | 710px | 数据总览、销售计划完成率 |
| 右 | `contetn_right` | 540px | 销售统计、销售排名、生产统计 |

每侧上下均分三块，高度约 `310px`（`.contetn_lr_item`）。中间结构用 `flex` 上下排列。

### 4.7 滚动表格

依赖：`vue3-seamless-scroll`，工程内尚未封装独立组件，需在页内使用，例如：

```vue
<vue3-seamless-scroll :list="rows" :step="0.5" is-watch>
  <div v-for="row in rows" :key="row.id" class="scroll-row">
    {{ row.materialName }} {{ row.quantity }}
  </div>
</vue3-seamless-scroll>
```

或用 `el-table` + 定时 `setInterval` 改变高亮行实现滚动。

库存状态色（题目要求）：

| 状态 | 颜色 |
|------|------|
| 正常 | 白色 |
| 不足 | 绿色 |
| 溢出 | 红色 |

### 4.8 屏幕缩放

`utils/drawMixin.js`：按设计稿宽高 `scale` 整页；`home.vue` 已 `mixins: [drawMixin]`。

---

## 5. 本地联调

1. 启动后端 9090（含 `neu-carbon-report` 等模块）。  
2. `可视化平台框架` 下 `pnpm dev`（或 npm），确认 proxy → 9090。  
3. 登录态：接口带 `token` 头，需与后端鉴权一致；若后端为 `Authorization: Bearer`，需改 `api/api.js` 拦截器（与管理前端 `utils/request.js` 对齐）。  
4. 浏览器请求示例：`GET /dev-api/carbonReport/saleOverall`。  
5. 管理端改数据后刷新大屏或点「重新获取」。

---

## 6. 常用 option 形状

**仪表盘（能耗总览）**

```js
{
  series: [{
    type: 'gauge',
    data: [{ value: Number, name: '耗电量' }]
  }]
}
```

**环状图（能耗占比）**

```js
{
  title: { text: '能耗总数', center: ['50%','50%'], ... },
  series: [{
    type: 'pie',
    radius: ['55%', '75%'],
    data: [{ name: '办公耗电量', value: n }, ...]
  }]
}
```

**组合图（计划完成率）**

```js
{
  xAxis: { data: data.category },          // 1011-11 ...
  yAxis: [{ type: 'value', name: '销售数量' }, { type: 'value', name: '完成率' }],
  series: [
    { name: '已销售', type: 'bar', data: data.barData },
    { name: '计划销售', type: 'bar', data: data.lineData },
    { name: '完成率', type: 'line', yAxisIndex: 1, data: data.rateData }
  ],
  tooltip: { trigger: 'axis' }
}
```

**曲线（销售统计）**

```js
{
  xAxis: { data: data.dateList },
  yAxis: [{ name: '销售额' }],
  series: [
    { name: '总销售额', type: 'line', data: data.numList1 },
    { name: '合同额', type: 'line', data: data.numList }
  ],
  tooltip: { trigger: 'axis' }
}
```

字段名以实际接口返回为准；若题目要求「已销售数量/计划数量」而接口当前返回金额（万），需在后端 `salePlan/achieveRate` 或前端换算/改 SQL 对齐。
