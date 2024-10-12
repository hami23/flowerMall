import { reqAddressList, reqDeleteAddress } from '../../../../../api/address'  
import swipecellBehavior from '../../../../../behaviors/swipeCell'

const app = getApp()

// pages/address/list/index.js
Page({
  behaviors: [swipecellBehavior],

  // 页面的初始数据
  data: {
    addressList: [],
  },

  changeGlobalAddress(e) {
    if(this.flag === '1') {
      const { id } = e.currentTarget.dataset
      const choosedAddress = this.data.addressList.find(item => item.id === id)
      // console.log(app);
      app.globalData.address = choosedAddress
      // this.setData({

      // })

      wx.navigateBack()
    }
  },

  onLoad(options) {
    this.flag = options.flag
  },

  onShow() {
    this.getAddressList()
  },

  async getAddressList() {
    const res = await reqAddressList()
    // console.log(res);
    this.setData({
      addressList: res.data
    })
  },
  
  // 去编辑页面
  toEdit(e) {
    const { id } = e.currentTarget.dataset

    wx.navigateTo({
      url: `/modules/settingModule/pages/address/add/index?id=${id}`
    })
  },

  // 删除地址
  async delAddress(e) {
    const { id } = e.currentTarget.dataset

    const confirm = await wx.modal({
      content: '确认删除该地址吗'
    })
    // console.log(res);
    if(confirm) {
      await reqDeleteAddress(id)
      wx.toast({ title: '删除地址成功' })
      this.getAddressList()
    } 
  },

})
