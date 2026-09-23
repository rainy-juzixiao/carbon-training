# 前端初始框架 · 组件 API 文档

---

## 1. 全局注册总览

### 1.1 全局组件

模板中可直接使用的，不需要import

| 组件名 | 源码路径 |
|--------|----------|
| `DictTag` | `src/components/DictTag/index.vue` |
| `Pagination` | `src/components/Pagination/index.vue` |
| `TreeSelect` | `src/components/TreeSelect/index.vue` |
| `FileUpload` | `src/components/FileUpload/index.vue` |
| `ImageUpload` | `src/components/ImageUpload/index.vue` |
| `ImagePreview` | `src/components/ImagePreview/index.vue` |
| `RightToolbar` | `src/components/RightToolbar/index.vue` |
| `Editor` | `src/components/Editor/index.vue` |
| `svg-icon` | `src/components/SvgIcon/index.vue` |

### 1.2 全局属性

如果使用vue2风格，就使用`this.xxx`；vue3风格直接使用 `proxy.xxx`，确保proxy存在就行。

| 名称 | 来源 | 说明 |
|------|------|------|
| `useDict(...types)` | `utils/dict.js` | 按字典类型加载字典数据 |
| `download(url)` | `utils/neu.js` | 按文件名请求下载 |
| `resetForm(refName)` | `utils/neu.js` | 重置表单，参数为 form 的 ref 名 |
| `parseTime(time, pattern?)` | `utils/neu.js` | 时间格式化 |
| `addDateRange(params, dateRange, propName?)` | `utils/neu.js` | 把日期范围写入查询 params |
| `handleTree(data, id?, parentId?, children?, rootId?)` | `utils/neu.js` | 平铺列表转树 |
| `selectDictLabel(datas, value)` | `utils/neu.js` | 按字典值取标签 |
| `selectDictLabels(datas, value, separator?)` | `utils/neu.js` | 多值字典标签，逗号拼接 |
| `getQueryData(...)` | `api/query/comQuery.js` | 通用查询取数 |
| `getBaseUrl()` | `utils/env.js` | 接口 base URL |
| `getDicts(type)` | `api/system/dict/data.js` | 拉取字典 |
| `$echarts` | echarts | ECharts 全量命名空间 |
| `msgSuccess(msg)` | `main.js` | 成功消息 |
| `$tab` | `plugins/tab.js` | 页签操作 |
| `$auth` | `plugins/auth.js` | 权限/角色判断 |
| `$cache` | `plugins/cache.js` | session/local 缓存 |
| `$modal` | `plugins/modal.js` | 消息、确认框、遮罩 |
| `$download` | `plugins/download.js` | 文件/zip 下载 |

### 1.3 全局指令

| 指令 | 用法 | 说明 |
|------|------|------|
| `v-hasPermi` | `v-hasPermi="['system:user:list']"` | 无任一权限则移除元素 |
| `v-hasRole` | `v-hasRole="['admin']"` | 无任一角色则移除元素 |

### 1.4 非全局组件

布局类、业务选择弹窗、Crontab、IconSelect 等，默认未挂到 `app.component`，均需要自己引入。

---

## 2. 通用业务组件

### 2.1 Pagination

分页。需要与 `queryParams.pageNum` / `queryParams.pageSize` 进行双向绑定。

**Props**

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `total` | Number | 必填 | 总条数 |
| `page` | Number | 1 | 当前页（`v-model:page`） |
| `limit` | Number | 20 | 每页条数（`v-model:limit`） |
| `pageSizes` | Number[] | `[10,20,30,50]` | 可选每页条数 |
| `layout` | String | `total, sizes, prev, pager, next, jumper` | el-pagination layout |
| `background` | Boolean | true | 背景样式 |
| `autoScroll` | Boolean | true | 翻页后滚动到顶 |
| `hidden` | Boolean | false | 隐藏 |

**Events**

| 事件 | 回调参数 |
|------|----------|
| `pagination` | `{ page, limit }` |
| `update:page` | 页码 |
| `update:limit` | 每页条数 |

**示例**

```vue
<pagination
  v-show="total > 0"
  :total="total"
  v-model:page="queryParams.pageNum"
  v-model:limit="queryParams.pageSize"
  @pagination="getList"
/>
```

`getList` 中：

```js
listTable(this.queryParams).then(res => {
  this.tableList = res.rows
  this.total = res.total
})
```

---

### 2.2 RightToolbar

表格右上角工具：显示/隐藏搜索、刷新、列显隐。

**Props**

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `showSearch` | Boolean | true | 是否显示检索区（`v-model:showSearch`） |
| `columns` | Array | — | 列配置 `[{ key, label, visible }]` |
| `search` | Boolean | true | 是否显示搜索图标 |
| `showColumnsType` | String | `checkbox` | `checkbox` 或 `transfer` |
| `gutter` | Number | 10 | 右外边距 |

**Events**

| 事件 | 时机 |
|------|------|
| `update:showSearch` | 切换搜索区显隐 |
| `queryTable` | 点击刷新 |

**示例**

```vue
<right-toolbar
  v-model:showSearch="showSearch"
  @queryTable="getList"
/>
```

---

### 2.3 Editor

富文本编辑器在全局已经注册过。直接使用就行

**Props**

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | String | — | 内容（`v-model`） |
| `height` | Number | null | 高度 |
| `minHeight` | Number | null | 最小高度 |
| `readOnly` | Boolean | false | 只读 |
| `fileSize` | Number | 5 | 上传大小上限（MB） |
| `type` | String | `url` | 图片回填格式：`url` / `base64` |

**Events**：`update:modelValue`

```vue
<editor v-model="form.content" :height="200" />
```

---

### 2.4 FileUpload

文件上传。全局已注册。接口：`{baseURL}/common/upload`。

**Props**

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `modelValue` | String/Object/Array | — | 已传文件（`v-model`），提交时为逗号分隔字符串 |
| `limit` | Number | 5 | 数量上限 |
| `fileSize` | Number | 5 | 单文件大小（MB） |
| `fileType` | String[] | `['doc','xls','ppt','txt','pdf']` | 扩展名白名单 |
| `isShowTip` | Boolean | true | 是否显示提示 |

```vue
<file-upload v-model="form.attachment" :limit="3" />
```

---

### 2.5 ImageUpload

图片上传。全局已注册。

**Props**：与 `FileUpload` 相同结构；`fileType` 默认 `['png','jpg','jpeg']`。

```vue
<image-upload v-model="form.image" :limit="1" />
```

---

### 2.6 ImagePreview

图片预览。全局已注册。

**Props**

| 名称 | 类型 | 默认 |
|------|------|------|
| `src` | String | `''` |
| `width` | Number/String | `''` |
| `height` | Number/String | `''` |

```vue
<image-preview :src="row.url" :width="80" :height="80" />
```

---

### 2.7 TreeSelect

树选择（基于 vue-treeselect 封装）。全局已注册。

**Props**

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `value` | String/Number | `''` | 选中值（`v-model:value`） |
| `options` | Array | `[]` | 树数据 |
| `objMap` | Object | `{ value:'id', label:'label', children:'children' }` | 字段映射 |
| `accordion` | Boolean | false | 手风琴 |
| `placeholder` | String | `''` | 占位文案 |

```vue
<tree-select
  v-model:value="form.deptId"
  :options="deptOptions"
  :objMap="{ value: 'id', label: 'deptName' }"
  placeholder="请选择上级部门"
/>
```

---

### 2.8 DictTag

字典标签渲染。全局已注册。

**Props**

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `options` | Array | null | 字典项 `[{ value, label }]` |
| `value` | Number/String/Array | — | 当前值 |
| `showValue` | Boolean | true | 无匹配时显示原始 value |
| `separator` | String | `,` | 多值分隔符 |

```vue
<dict-tag :options="status_dict" :value="row.status" />
```

字典加载：

```js
const { status_dict } = toRefs(useDict('status'))
// 或 proxy.useDict('status')
```

---

## 3. 布局与导航组件

以下组件按需在布局/页面中 import，非业务表单常用。

| 组件 | 路径 | Props / 行为 |
|------|------|----------------|
| `Breadcrumb` | `components/Breadcrumb/index.vue` | 无；按当前路由生成面包屑 |
| `Hamburger` | `components/Hamburger/index.vue` | `isActive: boolean`；事件 `toggleClick` |
| `Screenfull` | `components/Screenfull/index.vue` | 无；点击切换全屏 |
| `SizeSelect` | `components/SizeSelect/index.vue` | 无；切换组件尺寸 |
| `HeaderSearch` | `components/HeaderSearch/index.vue` | 无；菜单标题搜索 |
| `TopNav` | `components/TopNav/index.vue` | 无；顶部一级菜单 |
| `SvgIcon` | `components/SvgIcon/index.vue` | 全局名 `svg-icon`：`iconClass`（必填）、`className`、`color` |
| `ParentView` | `components/ParentView/index.vue` | 路由二级占位，无属性 |
| `iFrame` | `components/iFrame/index.vue` | `src: string`（必填） |
| `ThemePicker` | `components/ThemePicker/index.vue` | 事件 `change`，主题色变更 |
| `RightPanel` | `components/RightPanel/index.vue` | `clickNotClose`、`buttonTop`；打开设置抽屉 |
| `PanThumb` | `components/PanThumb/index.vue` | `image`（必填）、`zIndex`、`width`、`height` |

**SvgIcon 示例**

```vue
<svg-icon icon-class="user" />
```

图标放在 `src/assets/icons/svg/`，文件名即 `iconClass`。

**iFrame 示例**

```vue
<i-frame src="https://example.com/doc" />
```

---

## 4. 表单扩展组件

### 4.1 Crontab

Cron 表达式编辑。需 import：`import Crontab from '@/components/Crontab'`

**Props**

| 名称 | 类型 | 默认 |
|------|------|------|
| `expression` | String | `''` 当前表达式 |
| `hideComponent` | String[] | `[]` 隐藏的粒度，如 `['second','year']` |

**Events**

| 事件 | 参数 |
|------|------|
| `fill` | 完整 cron 字符串 |
| `hide` | 关闭 |

```vue
<crontab
  :expression="form.cronExpression"
  @fill="row => form.cronExpression = row"
  @hide="() => (visible = false)"
/>
```

### 4.2 IconSelect

图标选择。需 import。

**Props**：`activeIcon: string`  
**Events**：`selected(name)`  
**Methods**（`defineExpose`）：打开选择弹窗的方法（见源码 `defineExpose`）。

### 4.3 MyEditor

另一套富文本封装（Options API）。事件：`input`、`on-change`、`on-text-change`、`on-selection-change`、`on-editor-change`。  
一般的话，常规表单就优先使用全局 `Editor`。

---

## 5. 业务数据选择弹窗

均为 dialog 式选择器，路径在 `src/components/<域>/`。  
**通用 Props**

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `open` | Boolean | false | 控制弹窗（`v-model:open` 或受控） |
| `title` | String | 各组件默认标题 | 弹窗标题 |
| `isSingle` | Boolean | true | 单选/多选（部分组件有） |

**通用 Events**

| 事件 | 说明 |
|------|------|
| `onSelected` | 确认；参数多为选中行或数组 |
| `onCancel` | 取消（部分组件为 `onReturnSelected` / `onReturnCancel`） |

### 5.1 物料 Material

| 组件 | 默认 title | 选中事件 | 说明 |
|------|------------|----------|------|
| `MaterialSelect` | 选择物料档案 | `onSelected(list)` | `isSingle` |
| `MaterialInventorySelect` | 库存选择 | `onSelected(list)` | 按仓库/库区/库位筛选 |
| `MaterialDetailInventorySelect` | 库存明细 | `onSelected(row)` | 单行 |

### 5.2 销售 Sale

| 组件 | 默认 title | 选中事件 |
|------|------------|----------|
| `CustomerSelect` | 选择销售客户 | `onSelected(list)` |
| `OrderSelect` | 选择销售订单 | `onSelected(list)` |
| `DeliverySelect` | 选择发货单 | `onSelected(list)` |
| `ReturnSelect` | 选择退货单 | `onReturnSelected(list)` / `onReturnCancel` |

### 5.3 采购 Purchase

| 组件 | 默认 title | 选中事件 |
|------|------------|----------|
| `PlanSelect` | 采购计划 | `onSelected(list)` |
| `ContractSelect` | 选择采购合同 | `onSelected(list)` |
| `ApplySelect` | 采购申请 | `onSelected(list)` |
| `ArriveSelect` | 采购到货 | `onSelected(list)` |

### 5.4 生产 product

| 组件 | 默认 title | 选中事件 |
|------|------------|----------|
| `ProductPlanSelect` | 选择生产计划 | `onSelected(row)` |
| `ProductScheduleSelect` | 选择排产 | `onSelected(row)` |
| `ProductJobSelect` | 选择生产作业 | `onSelected(row)` |
| `ProductFinishSelect` | 选择完工 | `onSelected(row)` |
| `RequisitionSelect` | 选择领料单 | `onSelected(row)` |

### 5.5 检验 MesCheck

| 组件 | 额外 Props | 选中事件 |
|------|------------|----------|
| `StandardSelect` | `materialId`、`checkType` | `onStandardSelected(list)` / `onStandardCancel` |

### 5.6 运输 transportApply

| 组件 | 说明 | 选中事件 |
|------|------|----------|
| `SelectCarrierBill` | 承运单选择 | `onSelected(row)` |
| `SelectDispatchBill` | 调度单选择 | `onSelected(row)` / `onCancel` |
| `CarrierBillDetail` | 承运单详情展示（只读表单） | — |

### 5.7 使用示例

```vue
<template>
  <el-button @click="open = true">选择客户</el-button>
  <customer-select
    v-model:open="open"
    :is-single="true"
    @on-selected="onCustomer"
    @on-cancel="open = false"
  />
</template>

<script setup>
import CustomerSelect from '@/components/Sale/CustomerSelect'
import { ref } from 'vue'

const open = ref(false)
function onCustomer(rows) {
  const row = Array.isArray(rows) ? rows[0] : rows
  console.log(row.id, row.name)
  open.value = false
}
</script>
```

---

## 6. 全局插件 API

### 6.1 `$modal`（`plugins/modal.js`）

| 方法 | 作用 |
|------|------|
| `msg` / `msgError` / `msgSuccess` / `msgWarning` | 轻提示 |
| `alert` / `alertError` / `alertSuccess` / `alertWarning` | 警告框 |
| `notify` / `notifyError` / `notifySuccess` / `notifyWarning` | 通知 |
| `confirm(content)` | 确认框，返回 Promise |
| `prompt(content)` | 输入框，返回 Promise |
| `loading(text)` / `closeLoading()` | 全屏遮罩 |

```js
proxy.$modal.confirm('确认删除？').then(() => delTable(id))
proxy.$modal.msgSuccess('操作成功')
```

### 6.2 `$download`（`plugins/download.js`）

| 方法 | 说明 |
|------|------|
| `name(fileName, isDelete?)` | `/common/download` |
| `resource(path)` | `/common/download/resource` |
| `zip(url, fileName)` | GET `url`，按 blob 存 zip |

代码生成打包下载：

```js
proxy.$download.zip('/tool/gen/batchGenCode?tables=' + tableNames, 'code.zip')
```

### 6.3 `$auth`（`plugins/auth.js`）

| 方法 | 说明 |
|------|------|
| `hasPermi(permission)` | 是否具备权限 |
| `hasPermiOr(list)` / `hasPermiAnd(list)` | 任一 / 全部 |
| `hasRole(role)` / `hasRoleOr(list)` / `hasRoleAnd(list)` | 角色 |

`admin` 角色与 `*:*:*` 权限视为始终通过。

### 6.4 `$tab`（`plugins/tab.js`）

| 方法 | 说明 |
|------|------|
| `refreshPage()` | 刷新当前页签 |
| `closePage()` / `closeAllPage()` / `closeLeftPage()` / `closeRightPage()` / `closeOtherPage()` | 页签关闭 |
| `closeOpenPage(routerLocation)` | 关闭当前并打开新页 |
| `openPage(url)` | 打开路由 |
| `updatePage(view)` | 更新页签元数据 |

### 6.5 `$cache`（`plugins/cache.js`）

```js
proxy.$cache.session.set('k', 'v')
proxy.$cache.session.getJSON('k')
proxy.$cache.local.setJSON('cfg', { a: 1 })
proxy.$cache.local.remove('cfg')
```

---

## 7. 请求与权限工具

### 7.1 `utils/request.js`

- 默认导出 axios 实例：`baseURL = import.meta.env.VITE_APP_BASE_API`（开发为 `/dev-api`）
- 自动附加 `Authorization: Bearer <token>`
- GET 参数经 `tansParams` 拼进 URL
- 响应 `code !== 200` 时走错误提示；`401` 弹出重新登录

```js
import request from '@/utils/request'

export function listXxx(query) {
  return request({ url: '/xxx/list', method: 'get', params: query })
}
```

### 7.2 `utils/request.js` 导出 `download(url, params, filename, config)`

POST 表单下载为 blob（导出 Excel 常用）。

### 7.3 权限函数 `utils/permission.js`

| 函数 | 说明 |
|------|------|
| `checkPermi(permission)` | 是否有权限，用于 `v-if` |
| `checkRole(role)` | 是否有角色 |

---

## 8. 典型列表页模板

```vue
<template>
  <div class="app-container">
    <el-form :inline="true" v-show="showSearch">
      <el-form-item label="关键字">
        <el-input v-model="queryParams.keyword" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />

    <el-table v-loading="loading" :data="list">
      <el-table-column label="名称" prop="name" />
      <el-table-column label="状态">
        <template #default="scope">
          <dict-tag :options="status_dict" :value="scope.row.status" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script setup name="Demo">
import { listDemo } from '@/api/demo/demo'

const { proxy } = getCurrentInstance()
const { status_dict } = toRefs(proxy.useDict('sys_status'))

const loading = ref(false)
const showSearch = ref(true)
const list = ref([])
const total = ref(0)
const queryParams = ref({ pageNum: 1, pageSize: 10, keyword: undefined })
const dateRange = ref([])

function getList() {
  loading.value = true
  listDemo(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
    list.value = res.rows
    total.value = res.total
    loading.value = false
  })
}
function handleQuery() { queryParams.value.pageNum = 1; getList() }
function resetQuery() {
  dateRange.value = []
  proxy.resetForm('queryForm')
  handleQuery()
}
getList()
</script>
```

---

## 9. 组件选择速查

| 场景 | 使用 |
|------|------|
| 列表分页 | `Pagination` |
| 搜索区折叠 + 刷新 | `RightToolbar` |
| 字典展示 | `DictTag` + `useDict` |
| 富文本字段 | `Editor` |
| 附件/图片字段 | `FileUpload` / `ImageUpload` |
| 图片回显 | `ImagePreview` |
| 部门等树字段 | `TreeSelect` |
| 主数据挑选 | 对应 `*Select` 弹窗组件 |
| 权限按钮 | `v-hasPermi` / `$auth.hasPermi` |
| 确认删除 | `$modal.confirm` |
| 导出 | `download(...)` 或 `$download` |
| 打包下载 | `$download.zip` |

---

# 招投标网框架 · 组件 API

## 来源标注约定

| 标注 | 含义 |
|------|------|
| **来源：招投标网框架** | 仅招投标网框架有；管理前端（前端初始框架）没有 |
| **来源：管理前端** | 仅管理前端有；招投标网框架没有 |
| **两端共有** | 两边 `src/components` 下都有同名目录（实现可能有差异，以各自工程为准） |

管理前端已有、招投标网没有的业务组件目录：`Material`、`MesCheck`、`product`、`Purchase`、`Sale`、`transportApply`、`TreeSelect` → **来源：管理前端**。  
招投标网有、管理前端没有的组件目录：`CountDown`、`DragButton`、`Platform`、`SignBoard`、`SliderCaptcha` → **来源：招投标网框架**。

---

## 10. 全局注册总览（招投标网框架）

### 10.1 全局组件

模板可直接用，不需要 import。

| 组件名 | 源码路径 | 来源 |
|--------|----------|------|
| `DictTag` | `src/components/DictTag/index.vue` | 两端共有 |
| `Pagination` | `src/components/Pagination/index.vue` | 两端共有 |
| `FileUpload` | `src/components/FileUpload/index.vue` | 两端共有 |
| `ImagePreview` | `src/components/ImagePreview/index.vue` | 两端共有 |
| `RightToolbar` | `src/components/RightToolbar/index.vue` | 两端共有 |
| `svg-icon` | `src/components/SvgIcon/index.vue` | 两端共有 |

**与管理前端的差异：**

| 能力 | 管理前端 | 招投标网框架 |
|------|----------|--------------|
| 全局 `Editor` | 有 | **无**，需 `import Editor from '@/components/Editor'` |
| 全局 `ImageUpload` | 有 | **无**，需自行 import（组件文件两端共有） |
| 全局 `TreeSelect` | 有 | **无**（且招投标网 `components` 下无该目录）→ **来源：管理前端** |

### 10.2 全局属性

Vue2 风格用 `this.xxx`；Vue3 setup 用 `getCurrentInstance().proxy.xxx`。

| 名称 | 说明 | 来源 |
|------|------|------|
| `getDicts(type)` | 拉取字典 | 两端共有 |
| `getConfigKey(key)` | 读取 `sys_config` 配置项 | 两端共有；招投标网 `main.js` 挂载 |
| `parseTime` / `resetForm` / `addDateRange` / `selectDictLabel` / `selectDictLabels` / `download` / `handleTree` | 同管理前端 | 两端共有（`utils/neu.js`） |
| `getSysUserList()` | 系统用户列表 | 两端共有（`utils/neu.js`） |
| `getQueryData(...)` | 通用查询 | 两端共有 |
| `getBaseUrl()` | 接口 base URL | 两端共有 |
| `msgSuccess` / `msgError` / `msgInfo` | 轻提示 | 招投标网 `main.js` 三个都有 |
| `useDict(...types)` | 按类型加载字典 | **来源：管理前端**（招投标网未挂载；用 `getDicts`） |
| `$echarts` | ECharts 命名空间 | **来源：管理前端** |
| `$tab` / `$auth` / `$cache` / `$modal` / `$download` | 与管理前端相同 | 两端共有（`src/plugins/`） |

### 10.3 全局指令

| 指令 | 用法 | 来源 |
|------|------|------|
| `v-hasPermi` | `v-hasPermi="['bid:bidding:list']"` | 两端共有 |
| `v-hasRole` | `v-hasRole="['admin']"` | 两端共有 |

招投标网通过 `app.use(permission)` 注册（`src/directive/permission/`），不是管理前端的 `src/directive/index.js` 全量注册。行为一致：无权限则移除节点。

### 10.4 非全局组件

未挂到 `app.component`，需自行 import：布局类、`Editor`、`ImageUpload`、`Crontab`、`IconSelect`、招投标独有组件、业务页内组件等。

---

## 11. 两端共有组件（API 同管理前端）

下列组件在招投标网 `src/components` 下同样存在。Props / Events / 示例见上文 **第 2～5 节**；本节只标差异。

| 组件 | 来源 | 招投标网注意点 |
|------|------|----------------|
| `Pagination` | 两端共有 | 与第 2.1 节一致 |
| `RightToolbar` | 两端共有 | 与第 2.2 节一致 |
| `Editor` | 两端共有 | 招投标网**非全局**，需 import |
| `FileUpload` | 两端共有 | 全局；事件以组件内 `$emit` 为准 |
| `ImageUpload` | 两端共有 | 招投标网**非全局**，需 import |
| `ImagePreview` | 两端共有 | 全局 |
| `DictTag` | 两端共有 | 全局 |
| `Crontab` | 两端共有 | 需 import；API 见第 4.1 节 |
| `IconSelect` | 两端共有 | 需 import；API 见第 4.2 节 |
| `MyEditor` | 两端共有 | 需 import；API 见第 4.3 节 |
| `Breadcrumb` / `Hamburger` / `Screenfull` / `SizeSelect` / `HeaderSearch` / `TopNav` / `SvgIcon` / `ParentView` / `iFrame` / `ThemePicker` / `RightPanel` / `PanThumb` | 两端共有 | 见第 3 节 |
| `RuoYi/Doc` / `RuoYi/Git` | 两端共有 | 文档/仓库外链占位 |
| `Chat` | 目录两端都有 | **实现不同**：招投标网为单文件 `Chat/index.vue`（客服窗 + WebSocket）；管理前端为 `Chat/` 多子组件（Emoji、MessageList 等）→ 以各自工程为准 |

**业务选择弹窗** `Material` / `MesCheck` / `product` / `Purchase` / `Sale` / `transportApply`：**来源：管理前端**，招投标网无，API 见第 5 节。  
**`TreeSelect`**：**来源：管理前端**，招投标网无该组件。

---

## 12. 招投标网独有组件

下列组件**仅存在于招投标网框架**，管理前端没有 → **来源：招投标网框架**。  
均需自行 import。

### 12.1 CountDown

路径：`src/components/CountDown/CountDown.vue`

倒计时。`targetTime` 为剩余秒数，每秒减 1，格式 `X天X时X分X秒`；时间为 0 时文字变红并停止。

| 名称 | 类型 | 说明 |
|------|------|------|
| `targetTime` | Number/String | 剩余秒数 |

```vue
<CountDown :target-time="86400" />
```

### 12.2 DragButton

路径：`src/components/DragButton/index.vue`

可拖拽悬浮按钮；点击/抬起后打开内置 `Chat` 对话框。内部依赖 `Chat`、`vuex` 的 `userId`。

| 名称 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `position` | Object | `{ top:'auto', left:'auto', button:'20vh', right:'0' }` | 初始定位 |

```vue
<DragButton />
```

### 12.3 Chat（招投标网版）

路径：`src/components/Chat/index.vue`

在线客服窗：机器人问答（`api/chat/qa`）与 WebSocket（默认 `ws://localhost:9090/websocket`）。

**Events**

| 事件 | 说明 |
|------|------|
| `close` | 关闭 |
| `minimize` | 最小化 |

```vue
<Chat @close="onClose" @minimize="onMinimize" />
```

管理前端若要拆分子组件，见其 `components/Chat/`（**来源：管理前端** 的拆分方式）。

### 12.4 Platform/HomeCard

路径：`src/components/Platform/HomeCard.vue`

首页/门户信息卡片，列表项点击跳转 `/bid/detail?id=`。

| 名称 | 类型 | 说明 |
|------|------|------|
| `title` | String | 卡片标题 |
| `sourceData` | Array | 数据列表 |
| `category` | Any | 分类标识 |

```vue
<HomeCard title="最新招标" :source-data="list" :category="1" />
```

### 12.5 SignBoard

路径：`src/components/SignBoard/SignBoard.vue`

手写签名 canvas。组件内 `name` 误写为 `CountDown`，以文件路径为准。

| 名称 | 类型 | 默认 |
|------|------|------|
| `width` | Number | 420 |
| `height` | Number | 200 |

**Events**

| 事件 | 参数 |
|------|------|
| `confirm` | `{ canvas, context }` |

界面上提供「重签」「确定」。

### 12.6 SliderCaptcha

路径：`src/components/SliderCaptcha/SliderCaptcha.vue`

滑块校验。滑块与目标偏差小于 3px 触发通过。

| 事件 | 说明 |
|------|------|
| `pass` | 校验通过 |

```vue
<SliderCaptcha @pass="onPass" />
```

---

## 13. 来源对照总表

### 13.1 仅招投标网有（管理前端没有）

| 组件 | 路径（招投标网） |
|------|------------------|
| CountDown | `components/CountDown/CountDown.vue` |
| DragButton | `components/DragButton/index.vue` |
| Platform/HomeCard | `components/Platform/HomeCard.vue` |
| SignBoard | `components/SignBoard/SignBoard.vue` |
| SliderCaptcha | `components/SliderCaptcha/SliderCaptcha.vue` |

### 13.2 仅管理前端有（招投标网没有）

| 组件 / 目录 | 路径（管理前端） |
|-------------|------------------|
| TreeSelect | `components/TreeSelect/index.vue` |
| Material/*Select | `components/Material/` |
| MesCheck/StandardSelect | `components/MesCheck/` |
| product/*Select | `components/product/` |
| Purchase/*Select | `components/Purchase/` |
| Sale/*Select | `components/Sale/` |
| transportApply/* | `components/transportApply/` |
| 全局挂载的 `Editor`、`ImageUpload`、`useDict`、`$echarts` | `src/main.js` |

### 13.3 两端都有

`Breadcrumb`、`Chat`（结构不同）、`Crontab`、`DictTag`、`Editor`、`FileUpload`、`Hamburger`、`HeaderSearch`、`IconSelect`、`iFrame`、`ImagePreview`、`ImageUpload`、`MyEditor`、`Pagination`、`PanThumb`、`ParentView`、`RightPanel`、`RightToolbar`、`RuoYi`、`Screenfull`、`SizeSelect`、`SvgIcon`、`ThemePicker`、`TopNav`。

---

## 14. 招投标网 API 与页面入口（组件使用场景）

组件多挂在下列页面；接口封装在 `src/api/bid/`。

| 场景 | 前端 API 文件 | 典型路径 |
|------|---------------|----------|
| 招投标列表/详情 | `api/bid/bidding.js` | `/bid/bidding/front/list`、`/bid/bidding/front/{id}` |
| 企业投标 | `api/bid/enterpriseBidding.js` | `/bid/enterprise/bidding/front/list` |
| 投诉 | `api/bid/complaint.js` | `/bid/complaint/front/list` |
| 资讯/政策 | `api/bid/information.js`、`api/bid/policylaw.js` | `/bid/.../front/list` |
| 企业 | `api/bid/enterprise.js` | `/bid/enterprise/front/list` |
| 轮播 | `api/bid/banner.js` | `/bid/banner/list` |
| 订单 | `api/order/order.js` | `/bid/order/front/list` |

页面目录：`src/views/bid/`、`bidMessage/`、`complaint/`、`enterprise/`、`information/`、`policylaw/`。

请求封装 `src/utils/request.js`：与管理前端相同，自动带 `Authorization: Bearer`，`baseURL` 为 `VITE_APP_BASE_API`。
