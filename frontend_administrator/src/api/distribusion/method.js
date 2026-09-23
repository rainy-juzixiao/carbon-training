import request from '@/utils/request'

// 查询method列表
export function listMethod(query) {
  return request({
    url: '/distribusion/method/list',
    method: 'get',
    params: query
  })
}

// 查询method详细
export function getMethod(id) {
  return request({
    url: '/distribusion/method/' + id,
    method: 'get'
  })
}

// 新增method
export function addMethod(data) {
  return request({
    url: '/distribusion/method',
    method: 'post',
    data: data
  })
}

// 修改method
export function updateMethod(data) {
  return request({
    url: '/distribusion/method',
    method: 'put',
    data: data
  })
}

// 删除method
export function delMethod(id) {
  return request({
    url: '/distribusion/method/' + id,
    method: 'delete'
  })
}

// 导出method
export function exportMethod(query) {
  return request({
    url: '/distribusion/method/export',
    method: 'get',
    params: query
  })
}