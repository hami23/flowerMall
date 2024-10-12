import {
  reqIndexData
} from '../../api/index'

Page({
  data: {
    bannerList: [], // 轮播图数据
    categoryList: [], // 分类数据
    activeList: [], // 活动广告
    hotList: [], // 人气推荐
    guessList: [], // 猜你喜欢
    loading: true
  },

  onLoad() {
    this.getIndexData()
  },

  async getIndexData() {
    const res = await reqIndexData()
    // console.log(res)

    this.setData({
      bannerList: res[0].data,
      categoryList: res[1].data,
      activeList: res[2].data,
      hotList: res[3].data,
      guessList: res[4].data,
      loading: false
    })
  },

  onShareAppMessage() {
    return {
      title: '所有的怦然心动，都是你',
      path: '/pages/index/index',
      imageUrl: '../../assets/images/love.jpg'
    }
  },

  onShareTimeline() {
    return {}
  }
})