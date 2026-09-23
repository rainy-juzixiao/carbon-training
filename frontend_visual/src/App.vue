<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script setup>
// import useSettingsStore from '@/store/modules/settings'
// import { handleThemeStyle } from '@/utils/theme'

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    // handleThemeStyle(useSettingsStore().theme)
  })
})
</script>

<style lang="scss" scoped>
#app {
  width: 100vw;
  height: 100vh;
  background-color: #03050C;
  // overflow: hidden;
}
</style>
