import request from '@/utils/request'

// 查询招标轮播图列表
export function saleAmount(query) {
    return request({
        url: 'http://localhost:9090/saleAmountReport/amount',
        method: 'get',
    })
}
