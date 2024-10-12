import {
  ComponentWithStore
} from 'mobx-miniprogram-bindings'
import {
  userStore
} from '@/stores/userStore'
import {
  reqCartList,
  reqUpdateChecked,
  reqCheckAllCart,
  reqAddToCart,
  reqDelCart
} from '@/api/cart'

import { debounce } from '@/utils/util'
import swipeBehavior from '@/behaviors/swipeCell'

const computedBehavior = require('miniprogram-computed').behavior

// pages/cart/component/cart.js
ComponentWithStore({
  behaviors: [computedBehavior, swipeBehavior],

  storeBindings: {
    store: userStore,
    fields: ['token']
  },

  // 组件的属性列表
  properties: {},

  computed: {
    // 实现全选、全不选
    allChecked(data) {
      return data.cartList.length && data.cartList.every(item => item.isChecked)
    },
    // 计算商品总额
    totalPrice(data) {
      return data.cartList.reduce((prev, item) => {
        if( item.isChecked ) return prev + (item.price*item.count)
        return prev
      }, 0)
    }
  },

  // 组件的初始数据
  data: {
    cartList: [],
    emptyDes: '还没有添加商品，快去添加吧～',
  },

  // 组件的方法列表
  methods: {
    onShow() {
      this.getCartList()
    },

    onHide() {
      this.onSwipeCellCommonClick()
    },

    // 获取购物车列表
    async getCartList() {
      console.log(this.data.token);
      if (!this.data.token) {
        this.setData({
          emptyDes: '您尚未登录，点击登录获取更多权益',
          cartList: []
        })
        return
      }

      const {
        data: cartList,
        code
      } = await reqCartList()
      // console.log(cartList);
      if (code === 200) {
        this.setData({
          cartList,
          emptyDes: cartList === 0 && '还没有添加商品，快去添加吧～'
        })
      }

    },

    // 更改选中状态
    async updateChecked(e) {
      console.log(e);
      const {
        id,
        index
      } = e.currentTarget.dataset
      const isChecked = e.detail ? 1 : 0
      // console.log(id, index, isChecked)

      // console.time();
      const res = await reqUpdateChecked(id, isChecked)
      // console.timeEnd();
      if (res.code === 200) {
        this.setData({
          [`cartList[${index}].isChecked`]: isChecked
        })
      }
    },

    // 点击全选或全不选
    async checkedAllOrNot(e) {
      console.log(e);
      const isCheckedAll = e.detail ? 1 : 0
      console.log(isCheckedAll);

      const res = await reqCheckAllCart(isCheckedAll)
      if (res.code === 200) {
        const newCartList = JSON.parse(JSON.stringify(this.data.cartList))
        newCartList.forEach(item => item.isChecked = !!isCheckedAll)

        this.setData({
          cartList: newCartList
        })
      }
    },

    // 改变购买数量，逻辑处理
    changeBuyNum: debounce(async function (e) {
      console.log(e)
      const {
        id: goodsId,
        index,
        oldBuyNum
      } = e.target.dataset
      const newBuyNum = e.detail > 200 ? 200 : e.detail

      // const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/
      // const valid = reg.test(newBuyNum)
      // console.log(valid);

      const disCount = newBuyNum - oldBuyNum
      if (disCount !== 0) {
        console.log(typeof id, typeof disCount);
        const res = await reqAddToCart({
          goodsId,
          count: disCount
        })
        console.log(res);

        this.setData({
          [`cartList[${index}].count`]: newBuyNum
        })
      }

    }, 500),

    // 删除当前商品
    async delCurrentGood(e) {
      const { id: goodsId } = e.target.dataset
      console.log(goodsId, e);
      const confirm = await wx.modal({ content: '确定删除该商品吗' })
      
      if(confirm) {
        const res = await reqDelCart(goodsId)
        console.log(res);
        if(res.code === 200) {
          wx.toast({ title: '删除成功' })
          this.getCartList()
        }
      }
      
    },

    // 去支付订单
    toPayOrder() {
      // const hasChecked = this.data.cartList.some(item => item.isChecked)
      // if(!hasChecked) {
      if(this.data.totalPrice === 0) {
        wx.toast({ title: '请先选择要结算的订单' })
        return 
      }

      wx.navigateTo({
        url: '/modules/orderPayModule/pages/order/detail/detail'
      })
    }

  }
})