import {
  reqGoodsList
} from '../../../../../api/goods'

// pages/goods/list/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    queryParams: {
      page: 1,
      limit: 10,
      category1Id: '',
      category2Id: '',
    },
    goodsList: [], // 商品列表数据
    total: 0, // 商品总数
    isFinish: false // 判断数据是否加载完毕
  },

  onLoad() {
    // console.log(this.data.isFinish);
    this.getGoodsList()
  },

  async getGoodsList() {
    this.isLoading = true

    const { data } = await reqGoodsList(this.data.queryParams)
    // console.log(data)

    this.isLoading = false

    this.setData({
      'goodsList': [...this.data.goodsList, ...data.records],
      total: data.total
    })
  },

  // 上拉加载
  onReachBottom() {
    // console.log(this.isLoading);
    if(this.isLoading) return

    const { goodsList, total } = this.data
    // console.log(goodsList.length && goodsList.length >= total);
    if(goodsList.length === total) {
      this.setData({
        isFinish: true
      })
      // console.log(this.data.isFinish);
      return
    }

    this.setData({
      'queryParams.page': ++this.data.queryParams.page
    })
    this.getGoodsList()
  },

  // 下拉加载
  onPullDownRefresh() {
    this.setData({
      isFinish: false,
      goodsList: [],
      total: 0,
      queryParams: { ...this.data.queryParams, page: 1 }
    })

    this.getGoodsList()
  },

  onShareTimeline() {
    
  },
  onShareAppMessage() {

  }
})