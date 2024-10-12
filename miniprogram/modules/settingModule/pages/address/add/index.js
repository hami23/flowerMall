import QQMapWX from '../../../../../libs/qqmap-wx-jssdk.min'
import Schema from 'async-validator'
import { reqAddAddress, reqAddressDetail, reqUpdateAddress } from '../../../../../api/address'

Page({
  // 页面的初始数据
  data: {
    name: "", // 收货人
    phone: "", // 手机号码
    provinceName: "", // 省
    provinceCode: "", // 省编码
    cityName: "", // 市
    cityCode: "", // 市编码
    districtName: "", // 区
    districtCode: "", // 市县编码
    address: "", // 详细地址
    fullAddress: "", // 完整地址
    isDefault: false, // 1 默认设置， 0 默认不设置
  },

  onLoad: function (options) {

    // 实例化API核心类
    this.qqmapsdk = new QQMapWX({
      key: 'CVUBZ-RWB3H-FYBDH-W7Q5C-IVKLZ-UOFMM'
    })

    // console.log(options);
    // id不存在，新增收获地址
    // id存在，修改收货地址
    if(!options.id) return

    this.addressId = options.id
    this.updateAddressInfo(this.addressId)
  },

  // 修改收货地址信息
  async updateAddressInfo(id) {
    wx.setNavigationBarTitle({
      title: '修改收获地址',
    })
    console.log(id);
    const { data } = await reqAddressDetail(id)
    this.setData(data)
  },

  // 保存收货地址
  async saveAddrssForm(event) {
    const {
      provinceName,
      cityName,
      districtName,
      address
    } = this.data

    const params = {
      ...this.data,
      fullAddress: provinceName + cityName + districtName + address,
      isDefault: this.data.isDefault ? 1 : 0
    }

    console.log(params);
    const { valid } = await this.validateAddress(params)
    // console.log(valid);
    if(!valid) return
    console.log(this.addressId);
    const res = this.addressId ? await reqUpdateAddress(params) : await reqAddAddress(params)
    // console.log(res);
    if(res.code === 200) {
      wx.navigateBack({
        success: () => {
          console.log(this.addressId);
          wx.toast({ title: this.addressId ? '修改收获地址成功' : '新增收货地址成功' })
        }
      })
    }

  },

  // 收货地址信息验证
  validateAddress(addressInfo) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

    // 验证手机号
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'

    const rules = {
      name: [
        { required: true, message: '请输入收货人' },
        { min: 1, max: 15, message: '姓名长度不能过长' },
        { pattern: nameRegExp, message: '只能包含大小写字母、数字和中文字符' }
      ],
      phone: [
        { required: true, message: '请输入电话号码' },
        { pattern: phoneReg, message: '请输入正确的手机号码' }
      ],
      provinceName: { required: true, message: '请选择收货人所在地区' },
      address: { required: true, message: '请输入详细地址' }
    }

    const validator = new Schema(rules)
    return new Promise((resolve, reject) => {
      validator.validate(addressInfo, (errors, fields) => {
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

  // 省市区选择
  onAddressChange(event) {
    console.log(event);
    const [provinceName, cityName, districtName] = event.detail.value
    const [provinceCode, cityCode, districtCode] = event.detail.code

    this.setData({
      provinceName,
      provinceCode,
      cityName,
      cityCode,
      districtName,
      districtCode
    })
  },

  // 获取定位信息
  async getLocation() {
    // 获取授权信息
    const { authSetting } = await wx.getSetting()
    console.log(authSetting);

    // 判断用户是否进行了授权  
    // authSetting['scope.userLocation'] 值为：undefined / true / false
    if (authSetting['scope.userLocation'] !== undefined && !authSetting['scope.userLocation']) { // 没有授权时执行
      const res = await wx.modal({
        title: '授权提示',
        content: '需要获取您的地理位置信息，是否确认授权？'
      })
      console.log(res); // true / false

      // 用户取消了授权，直接退出，显示取消信息
      if (!res) return wx.toast({
        title: '您取消了授权'
      })

      // 点击 确认授权
      if (res) {
        const { authSetting } = await wx.openSetting()
        console.log(authSetting);

        // 如果用户没有更新授权信息，提示没有更新授权
        if (!authSetting['scope.userLocation'])
          return wx.toast({ title: '授权失败！' })

        try {
          // 如果用户更新授权信息，则调用 getLocation 获取用户地理位置信息
          const locationRes = await wx.getLocation()
          // 打印地理位置信息
          console.log(locationRes)
        } catch (err) {
          console.log(err)
        }
      }
    } else { // 已授权，返回相关信息
      try {
        // 如果是第一次调用 getLocation 或者之前授权过
        // 直接调用 getLocation 获取用户信息即可
        const locationRes = await wx.getLocation()
        console.log(locationRes)

        const chooseRes = await wx.chooseLocation()
        console.log(chooseRes);
        const { latitude, longitude, name } = chooseRes



        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude,
            longitude
          },
          success: (res) => {
            console.log(res);
            // 获取省市区、省市区编码
            const { adcode, province, city, district } = res.result.ad_info

            // 获取街道、门牌（街道、门牌 可能为空）
            const { street, street_number } = res.result.address_component

            // 获取标准地址
            const { standard_address } = res.result.formatted_addresses

            this.setData({
              provinceName: province,
              provinceCode: adcode.replace(adcode.substring(2,6), '0000'),

              cityName: city,
              cityCode: adcode.replace(adcode.substring(4, 6), '00'),

              districtName: district,
              districtCode: district && adcode,

              // 详细地址
              address: street + street_number + name,
              // 完整地址
              fullAddress: standard_address + name
            })
          }
        })

      } catch (error) {
        wx.toast({ title: '您已取消获取地理位置' })
      }
    }

  }
})