import request from '@/utils/request'

// 查询额度列表
export function listCal(query) {
  return request({
    url: '/distribusion/cal/list',
    method: 'get',
    params: query
  })
}

// 查询额度详细
export function getCal(id) {
  return request({
    url: '/distribusion/cal/' + id,
    method: 'get'
  })
}

// 新增额度
export function addCal(data) {
  return request({
    url: '/distribusion/cal',
    method: 'post',
    data: data
  })
}

// 修改额度
export function updateCal(data) {
  return request({
    url: '/distribusion/cal',
    method: 'put',
    data: data
  })
}

// 删除额度
export function delCal(id) {
  return request({
    url: '/distribusion/cal/' + id,
    method: 'delete'
  })
}

// 导出额度
export function exportCal(query) {
  return request({
    url: '/distribusion/cal/export',
    method: 'get',
    params: query
  })
}

export function checkPass(id){
  return request({
    url:'/distribusion/api/checkPass/' + id,
    method: 'PUT'
  })
}

export function checkNoPass(id){
  return request({
    url:'/distribusion/api/checkNoPass/' + id,
    method: 'PUT'
  })
}
