// pages/login/login.js
import http from '../../utils/http'
import { toast } from '../../utils/extendApi'
import { setStorage } from '../../utils/storage'
import { reqToken, reqUserInfo } from '../../api/user'

import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '../../stores/userStore'
import { debounce } from '@/utils/util'

ComponentWithStore({
  storeBindings: {
    store: userStore,
    fields: ['token', 'userInfo'],
    actions: ['setToken', 'setUserInfo']
  },

  methods: {
    login: debounce(function() {
      wx.login({  // 获取临时登录凭证
        success: async ({ code }) => {
          if(code) {
            // console.log(code)  // 临时登录凭证
    
            /* 获取 token */
            const res = await reqToken(code) 
            console.log(res);
            // 存储到本地缓存中（AppData）
            setStorage('token', res.data.token)
            // 存储到 store 中
            this.setToken(res.data.token)

            /* 获取用户信息 */
            this.getUserInfo()

            /* 跳转回主页 */
            wx.navigateBack({
              url: '/pages/my/my',
            })
          } else {
            toast({ title: '微信授权失败，请稍后再试~' })
          }
          
        },
      })
    }, 500),

    // 获取用户信息
    async getUserInfo() {
      const res = await reqUserInfo()
      console.log(res);
      setStorage('userInfo', res.data)
      this.setUserInfo(res.data)
    }
  }
  
})
