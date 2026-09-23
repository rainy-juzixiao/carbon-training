import request from '@/utils/request'

// 查询招标轮播图列表
export function listBanner(query) {
  return request({
    url: '/scm/banner/list',
    method: 'get',
    params: query
  })
}

// 查询招标轮播图详细
export function getBanner(id) {
  return request({
    url: '/scm/banner/' + id,
    method: 'get'
  })
}

// 新增招标轮播图
export function addBanner(data) {
  return request({
    url: '/scm/banner',
    method: 'post',
    data: data
  })
}

// 修改招标轮播图
export function updateBanner(data) {
  return request({
    url: '/scm/banner',
    method: 'put',
    data: data
  })
}

// 删除招标轮播图
export function delBanner(id) {
  return request({
    url: '/scm/banner/' + id,
    method: 'delete'
  })
}

// 导出招标轮播图
export function exportBanner(query) {
  return request({
    url: '/scm/banner/export',
    method: 'get',
    params: query
  })
}