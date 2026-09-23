import { createApp } from 'vue'
// import Vuex from 'vuex';

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言

// import '@/assets/styles/index.scss' // global css
import '@/assets/css/public.scss'
import "@/assets/css/index.scss"

import App from './App'
import store from './store'
import router from './router'

// import * as DataV from '@dataview/datav-vue3';

import Echart from './components/echart/index.vue'
import ItemWrap from './components/item-wrap/item-wrap.vue'
import Message from './components/message/message.vue'
import Reacquire from './components/reacquire/reacquire.vue'
// import Messages from './components/message/message'



// 注册指令
// import { download } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'

// import './permission' // permission control

// import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'

// import * as filters from '@/directives/filters'

const app = createApp(App)

// app.use(DataV, { classNamePrefix: 'dv-' });

// 全局方法挂载
// app.config.globalProperties.useDict = useDict
// app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels
// app.config.globalProperties.$Message = Messages

// 全局组件挂载
app.component("Echart", Echart)
app.component("ItemWrap", ItemWrap)
app.component("Message", Message)
app.component("Reacquire", Reacquire)

app.use(router)
app.use(store)
// app.use(Vuex)

// 全局数据过滤器
// Object.keys(filters).forEach(k => app.filter(k, filters[k]));


// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default'
})

app.mount('#app')
