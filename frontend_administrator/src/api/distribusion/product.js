import request from '@/utils/request'

// 查询交易列表
export function listProduct(query) {
  return request({
    url: '/distribusion/product/list',
    method: 'get',
    params: query
  })
}

// 查询交易详细
export function getProduct(id) {
  return request({
    url: '/distribusion/product/' + id,
    method: 'get'
  })
}

// 新增交易
export function addProduct(data) {
  return request({
    url: '/distribusion/product',
    method: 'post',
    data: data
  })
}

// 修改交易
export function updateProduct(data) {
  return request({
    url: '/distribusion/product',
    method: 'put',
    data: data
  })
}

// 删除交易
export function delProduct(id) {
  return request({
    url: '/distribusion/product/' + id,
    method: 'delete'
  })
}

// 导出交易
export function exportProduct(query) {
  return request({
    url: '/distribusion/product/export',
    method: 'get',
    params: query
  })
}