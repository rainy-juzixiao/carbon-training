import request from '@/utils/request'

// 查询过往数据列表
export function listHistory(query) {
  return request({
    url: '/distribusion/history/list',
    method: 'get',
    params: query
  })
}

// 查询过往数据详细
export function getHistory(id) {
  return request({
    url: '/distribusion/history/' + id,
    method: 'get'
  })
}

// 新增过往数据
export function addHistory(data) {
  return request({
    url: '/distribusion/history',
    method: 'post',
    data: data
  })
}

// 修改过往数据
export function updateHistory(data) {
  return request({
    url: '/distribusion/history',
    method: 'put',
    data: data
  })
}

// 删除过往数据
export function delHistory(id) {
  return request({
    url: '/distribusion/history/' + id,
    method: 'delete'
  })
}

// 导出过往数据
export function exportHistory(query) {
  return request({
    url: '/distribusion/history/export',
    method: 'get',
    params: query
  })
}