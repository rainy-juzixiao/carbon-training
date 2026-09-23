import request from '@/utils/request'

// 查询配额管理列表
export function listTotalEmission(query) {
  return request({
    url: '/distribusion/totalEmission/list',
    method: 'get',
    params: query
  })
}

// 查询配额管理详细
export function getTotalEmission(id) {
  return request({
    url: '/distribusion/totalEmission/' + id,
    method: 'get'
  })
}

// 新增配额管理
export function addTotalEmission(data) {
  return request({
    url: '/distribusion/totalEmission',
    method: 'post',
    data: data
  })
}

// 修改配额管理
export function updateTotalEmission(data) {
  return request({
    url: '/distribusion/totalEmission',
    method: 'put',
    data: data
  })
}

// 删除配额管理
export function delTotalEmission(id) {
  return request({
    url: '/distribusion/totalEmission/' + id,
    method: 'delete'
  })
}

// 导出配额管理
export function exportTotalEmission(query) {
  return request({
    url: '/distribusion/totalEmission/export',
    method: 'get',
    params: query
  })
}