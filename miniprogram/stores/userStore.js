import { observable, action } from 'mobx-miniprogram'
import { getStorage } from '../utils/storage'

export const userStore = observable({

  // token 令牌
  token: getStorage('token') || '',
  // 用户信息
  userInfo: getStorage('userInfo') || '',

  setToken: action(function(token) {
    this.token = token
  }),

  setUserInfo: action(function(userInfo) {
    this.userInfo = userInfo
  })

})