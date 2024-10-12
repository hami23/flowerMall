import { reqOrderAddress, reqOrderInfo, reqToBuyNow, reqSubmitOrder, reqPrePayInfo } from '@/api/orderpay'
import { formatDateTime } from '@/utils/util'
import Schema from 'async-validator'
import { debounce } from '@/utils/util'

const app = getApp()

Page({
  data: {
    buyName: '', // 订购人姓名
    buyPhone: '', // 订购人手机号
    deliveryDate: '选择送达日期', // 期望送达日期
    blessing: '', // 祝福语
    show: false, // 期望送达日期弹框
    minDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    myAddress: {}, // 收货地址
    orderInfo: {}, // 订单信息
  },

  onLoad(options) {
    this.setData({
      ...options
    })
  },

  onShow() {
    this.getAddress()
    this.getOrderInfo()
  },

  // 获取收货人地址
  async getAddress() {
    console.log(app.globalData.address);
    if(app.globalData.address.id) {
      this.setData({
        myAddress: app.globalData.address
      })
      // app.globalData.address = {}
      return 
    }

    const { data: myAddress } = await reqOrderAddress()

    this.setData({
      myAddress
    })
  },

  // 获取订单信息
  async getOrderInfo() {
    const { goodsId, blessing } = this.data
    const { data: orderInfo } = goodsId ?  await reqToBuyNow({ goodsId, blessing }) : await reqOrderInfo()

    const firstFind = orderInfo.cartVoList.find(item => item.blessing !== '')
    // console.log(firstFind);
    this.setData({
      orderInfo,
      blessing: !firstFind ? '' : firstFind.blessing
    })
  },

  // 选择期望送达日期
  onShowDateTimerPopUp() {
    this.setData({
      show: true
    })
  },

  // 期望送达日期确定按钮
  onConfirmTimerPicker(event) {
    // console.log(event);
    // console.log(new Date(event.detail).toLocaleDateString());
    // console.log(formatDateTime(new Date(event.detail)))
    const deliveryDate = formatDateTime(new Date(event.detail))
    this.setData({
      show: false,
      deliveryDate
    })
  },

  // 期望送达日期取消按钮 以及 关闭弹框时触发
  onCancelTimePicker() {
    this.setData({
      show: false,
      minDate: new Date().getTime(),
      currentDate: new Date().getTime()
    })
  },

  // 跳转到收货地址
  toAddress() {
    wx.navigateTo({
      url: '/modules/settingModule/pages/address/list/index'
    })
  },

  // 提交订单
   toSubmitOrder: debounce(async function () {
    // 从 data 中结构数据
    const {
      buyName,
      buyPhone,
      deliveryDate,
      blessing,
      orderInfo,
      myAddress
    } = this.data

    // 组织请求参数
    const params = {
      buyName,
      buyPhone,
      cartList: orderInfo.cartVoList,
      deliveryDate,
      remarks: blessing,
      userAddressId: myAddress.id
    }

    const { valid } = await this.validateAddress(params)
    console.log(valid);

    if(!valid) return
    // console.log(params);
    const res = await reqSubmitOrder(params)

    if(res.code === 200) {
      // 保存返回的订单编号
      this.orderNo = res.data

      this.getAdvancePayInfo()
    }
    
  }, 500),

  // 获取微信预支付信息
  async getAdvancePayInfo() {
    try {
      const payParams = await reqPrePayInfo(this.orderNo)
      console.log(payParams);
      if(payParams.code === 200) {
        // const res = await wx.requestPayment(payParams.data)
        // console.log(res);

        // 到这一步，就没有权限 继续完成流程了
        // 模拟成功跳转
        wx.redirectTo({
          url: '/modules/orderPayModule/pages/order/list/list',
          success: () => {
            wx.toast({
              title: '支付成功',
              icon: 'success'
            })
          }
        })
      }
    } catch (error) {
      wx.toast({ title: '支付出错', icon: 'error' })
    }
    
  },

  // 订单信息验证
  validateAddress(orderInfo) {
    // 验证订购人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

    // 验证手机号
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'

    const rules = {
      buyName: [
        { required: true, message: '请输入订购人' },
        { min: 1, max: 15, message: '姓名长度不能过长' },
        { pattern: nameRegExp, message: '只能包含大小写字母、数字和中文字符' }
      ],
      buyPhone: [
        { required: true, message: '请输入电话号码' },
        { pattern: phoneReg, message: '请输入正确的手机号码' }
      ],
      deliveryDate: { required: true, message: '请选择送达时间' },
      userAddressId: [{ required: true, message: '请选择收货地址' }],
    }

    const validator = new Schema(rules)
    return new Promise((resolve, reject) => {
      validator.validate(orderInfo, (errors, fields) => {
        if(errors) {
          // console.log(errors);
          errors.length === 1 && wx.toast({ title: errors[0].message })
          errors.length > 1 && wx.toast({ title: '请先填写相关完整信息' })
          resolve({ valid: false })
        } else {
          resolve({ valid: true })
        }
      })
    })

  },
})
