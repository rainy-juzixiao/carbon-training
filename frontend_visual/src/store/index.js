/*
 * @Author: your name
 * @Date: 2021-07-26 09:32:49
 * @LastEditTime: 2022-04-26 09:12:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web-pc\src\pages\big-screen\store\index.js
 */
// import Vue from 'vue';

// const modulesFiles = require.context('./modules', true, /\.js$/)
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules[moduleName]=value.default
//   modules[moduleName].namespaced = true;   //打开命名空间
//   return modules
// }, {})
// export default new Vuex.Store({
//   modules,
//   state: {

//   },
//   mutations: {
//       setCollapsed(state,value){
//       },
//   },
//   actions: {
//     getUserdata({commit}){

//     },
    
//   },
  
// })


import { createStore } from 'vuex';

// 使用import.meta.globEager动态导入Vuex模块
const modulesFiles = import.meta.globEager('./modules/*.js')

const modules = Object.keys(modulesFiles).reduce((modules, path) => {
  // 获取模块名
  const moduleName = path.replace(/^\.\/modules\/(.*)\.js$/, '$1')
  // 获取模块默认导出
  const value = modulesFiles[path].default
  // 确保vuex模块namespaced为true
  modules[moduleName] = {
    ...value,
    namespaced: true,
  }
  return modules
}, {})

export default createStore({
  modules,
  state: {
    // ...
  },
  mutations: {
    setCollapsed(state, value) {
      // ...
    },
  },
  actions: {
    getUserdata({ commit }) {
      // ...
    },
  },
})
