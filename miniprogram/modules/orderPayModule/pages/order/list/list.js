import { reqOrderList } from '@/api/order'

// pages/order/list/index.js
Page({
  // 页面的初始数据
  data: {
    orderList: [], // 订单列表
    queryParams: {
      page: 1,
      limit: 10
    }, // 查询参数
    total: 0, // 订单总条数
    isLoading: false, // 下拉数据是否加载中
  },
  onLoad() {
    this.getOrderList()
  },

  // 获取订单列表
  async getOrderList() {
    const { orderList, queryParams } = this.data
    this.data.isLoading = true

    const res = await reqOrderList({...queryParams})
    console.log(res);
    if(res.code !== 200) return wx.toast({ title: '获取订单列表失败!' })

    const { records, total } = res.data
    this.setData({
      orderList: orderList.length ? [ ...orderList , ...records] : records,
      total
    })

    this.data.isLoading = false
  },

  // 触底刷新，获取更多数据
  onReachBottom() {
    if(this.data.isLoading) return 

    const { orderList, queryParams, total } = this.data
    if(orderList.length === total) {
      return wx.toast({ title: '订单已全部加载！' })
    }

    this.setData({
      'queryParams.page': queryParams.page + 1
    })
    this.getOrderList()

  }
})
