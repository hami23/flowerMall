import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '../../stores/userStore'

// pages/info/info.js
ComponentWithStore({
  storeBindings: {
    store: userStore,
    fields: ['token', 'userInfo'],
    actions: ['setToken', 'setUserInfo']
  },
  
  // 页面的初始数据
  data: {
    loading: true,
    // 初始化第二个面板数据
    initpanel: [
      {
        url: '/modules/orderPayModule/pages/order/list/list',
        title: '商品订单',
        iconfont: 'icon-dingdan'
      },
      {
        url: '/modules/orderPayModule/pages/order/list/list',
        title: '礼品卡订单',
        iconfont: 'icon-lipinka'
      },
      {
        url: '/modules/orderPayModule/pages/order/list/list',
        title: '退款/售后',
        iconfont: 'icon-tuikuan'
      }
    ]
  },

  methods: {
    onLoad() {
      this.setData({
        loading: false
      })
    },
    // 跳转到登录页面
    toLoginPage() {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
})
