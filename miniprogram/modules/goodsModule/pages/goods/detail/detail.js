import { reqGoodsById } from '@/api/goods'
import { reqAddToCart, reqCartList } from '@/api/cart'
import { userBehavior } from '@/behaviors/userBehavior'

// pages/goods/detail/index.js
Page({
  behaviors: [userBehavior],

  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    allCount: 0, // 购物车商品总数量
    blessing: '', // 祝福语
    buyNow: '' // 是否立即购买
  },

  onLoad(options) {
    // console.log(options)
    this.goodsId = options.goodsId

    this.getGoodsById()
    this.getCartInfo()
  },

  // 请求商品详情
  async getGoodsById() {
    const {
      data: goodsInfo
    } = await reqGoodsById(this.goodsId)

    this.setData({
      goodsInfo
    })
  },

  // 获取购物车信息
  async getCartInfo() {
    if(!this.data.token) return

    const { data: cartList } = await reqCartList()
    // console.log(cartList);
    if(!cartList.length) return
    const allCount = cartList.reduce((prev, item) => prev + item.count, 0)
    // console.log(allCount);
    this.setData({
      allCount: allCount > 99 ? '99+' : allCount
    })
  },

  // 预览图片
  previewImg() {
    wx.previewImage({
      urls: this.data.goodsInfo.detailList
    })
  },

  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      buyNow: 0
    })
  },

  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true,
      buyNow: 1
    })
  },

  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({
      show: false
    })
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    console.log(event.detail)
    this.setData({
      count: event.detail
    })
  },

  // 弹框的确定事件
  async handleSubmit() {
    const { token, count, blessing, buyNow } = this.data
    const goodsId = this.goodsId

    // 用户未登录时，须先登录
    if(!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })

      return
    }

    // buyNow为 0， 加入购物车； buyNow为 1，立即购买
    if( !buyNow ) {
      const res = await reqAddToCart({ goodsId, count, blessing })
      // console.log(res);
      if(res.code === 200) {
        wx.toast({ title: '加入购物车成功' })
        this.getCartInfo()

        this.setData({
          show: false
        })
      }
    } else {
      console.log(1);
      wx.navigateTo({
        url: `/modules/orderPayModule/pages/order/detail/detail?goodsId=${goodsId}&blessing=${blessing}`
      })
    }
  },

  onShareAppMessage() {
    return {
      title: '猜猜看咯'
    }
  },
  onShareTimeline() {

  }
})