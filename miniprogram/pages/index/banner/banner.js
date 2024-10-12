// pages/index/banner/banner.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 轮播图数据
    bannerList: {
      type: Array,
      value: [
        // '../../../assets/banner/banner-1.jpg',
        // '../../../assets/banner/banner-2.jpg',
        // '../../../assets/banner/banner-3.jpg'
      ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getSwiperIndex(e) {
      // console.log(e);
      let { current } = e.detail
      this.setData({
        activeIndex: current
      })
    }
  }
})
