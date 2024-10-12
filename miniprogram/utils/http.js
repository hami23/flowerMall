// import WxRequest from './request'
// import WxRequest from './test'
import WxRequest from 'http-wxmini'
import { getStorage, removeStorage, clearStorage } from './storage'
import { env } from './env'

const instance = new WxRequest({
  baseURL: env.baseURL,
  timeout: 15000,
  isLoading: false
})

// 请求拦截器
instance.interceptors.request = (config) => {
  // ……
  // console.log(config);

  const token = getStorage('token')
  if(token) {
    // config.header['token'] = `Bearer ${token}`
    config.header['token'] = token
  }

  return config
}

// 响应拦截器
instance.interceptors.response = async (response) => {
  // ……
  console.log(response);
  const { isSuccess, data } = response

  if(!isSuccess) {
    // wx.showToast({
    //   title: '网络超时了……',
    //   icon: 'error',
    //   duration: 2000
    // })
    wx.toast({ title: '网络超时了……' })
    return response
  }

  switch(data.code) {
    case 200:
      return data
    case 208:
      const confirm = await wx.modal({ content: "登录已过期，请重新登录！",  showCancel: false})
      if(confirm) {
        // removeStorage('token')
        clearStorage()
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
      return Promise.reject(response)
    default:
      wx.toast({ title: "额哦，程序出现异常了~" })
      return Promise.reject(response)
  }

  return data
}

export default instance