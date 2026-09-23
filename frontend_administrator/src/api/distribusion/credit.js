import request from '@/utils/request'

// 查询额度列表
export function listCredit(query) {
  return request({
    url: '/distribusion/credit/list',
    method: 'get',
    params: query
  })
}

// 查询额度详细
export function getCredit(id) {
  return request({
    url: '/distribusion/credit/' + id,
    method: 'get'
  })
}

// 新增额度
export function addCredit(data) {
  return request({
    url: '/distribusion/credit',
    method: 'post',
    data: data
  })
}

// 修改额度
export function updateCredit(data) {
  return request({
    url: '/distribusion/credit',
    method: 'put',
    data: data
  })
}

// 删除额度
export function delCredit(id) {
  return request({
    url: '/distribusion/credit/' + id,
    method: 'delete'
  })
}

// 导出额度
export function exportCredit(query) {
  return request({
    url: '/distribusion/credit/export',
    method: 'get',
    params: query
  })
}