<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <!-- <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside"/> -->
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar @setLayout="setLayout" />
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        <!-- <tags-view v-if="needTagsView" /> -->
      </div>
      <app-main />
      <settings ref="settingRef" />
    </div>
    <div class="title">健康颐养平台（星海大观社区）后台管理系统</div>
  </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import Sidebar from './components/Sidebar/index.vue'
import { AppMain, Navbar, Settings, TagsView } from './components'
import defaultSettings from '@/settings'
import Breadcrumb from '@/components/Breadcrumb'

import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'

const settingsStore = useSettingsStore()
const theme = computed(() => settingsStore.theme);
const sideTheme = computed(() => settingsStore.sideTheme);
const sidebar = computed(() => useAppStore().sidebar);
const device = computed(() => useAppStore().device);
const needTagsView = true;
const fixedHeader = true;

const classObj = computed(() => ({
  hideSidebar: false,
  openSidebar: true,
  withoutAnimation: false,
  mobile: device.value === 'mobile'
}))

const { width, height } = useWindowSize();
const WIDTH = 992; // refer to Bootstrap's responsive design

// watchEffect(() => {
//   if (device.value === 'mobile' && sidebar.value.opened) {
//     useAppStore().closeSideBar({ withoutAnimation: false })
//   }
//   if (width.value - 1 < WIDTH) {
//     useAppStore().toggleDevice('mobile')
//     useAppStore().closeSideBar({ withoutAnimation: true })
//   } else {
//     useAppStore().toggleDevice('desktop')
//   }
// })

// function handleClickOutside() {
//   useAppStore().closeSideBar({ withoutAnimation: false })
// }

const settingRef = ref(null);
function setLayout() {
  settingRef.value.openSetting();
}
</script>

<style lang="scss" scoped>
  @import "@/assets/styles/mixin.scss";
  @import "@/assets/styles/variables.module.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  .title{
    position: fixed;
    top: 0;
    left: 90px;
    line-height: 64px;
    z-index: 99999;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}

.breadcrumb-container{
  padding-left: 20px !important;
  background: #FAFAFA;
  width: 100% !important;
}
.navbar{
  box-shadow: none !important;
}
.sidebar-container{
  box-shadow: none !important;
}
</style>
