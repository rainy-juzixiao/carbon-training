import request from '@/utils/request'

// 查询消息中心列表
export function listMessage(query) {
  return request({
    url: '/distribusion/message/list',
    method: 'get',
    params: query
  })
}

// 查询消息中心详细
export function getMessage(id) {
  return request({
    url: '/distribusion/message/' + id,
    method: 'get'
  })
}

// 新增消息中心
export function addMessage(data) {
  return request({
    url: '/distribusion/message',
    method: 'post',
    data: data
  })
}

// 修改消息中心
export function updateMessage(data) {
  return request({
    url: '/distribusion/message',
    method: 'put',
    data: data
  })
}

// 删除消息中心
export function delMessage(id) {
  return request({
    url: '/distribusion/message/' + id,
    method: 'delete'
  })
}

// 导出消息中心
export function exportMessage(query) {
  return request({
    url: '/distribusion/message/export',
    method: 'get',
    params: query
  })
}