import request from '@/utils/request'

// 查询企业信息列表
export function listInfo(query) {
  return request({
    url: '/distribusion/info/list',
    method: 'get',
    params: query
  })
}

// 查询企业信息详细
export function getInfo(id) {
  return request({
    url: '/distribusion/info/' + id,
    method: 'get'
  })
}

// 新增企业信息
export function addInfo(data) {
  return request({
    url: '/distribusion/info',
    method: 'post',
    data: data
  })
}

// 修改企业信息
export function updateInfo(data) {
  return request({
    url: '/distribusion/info',
    method: 'put',
    data: data
  })
}

// 删除企业信息
export function delInfo(id) {
  return request({
    url: '/distribusion/info/' + id,
    method: 'delete'
  })
}

// 导出企业信息
export function exportInfo(query) {
  return request({
    url: '/distribusion/info/export',
    method: 'get',
    params: query
  })
}