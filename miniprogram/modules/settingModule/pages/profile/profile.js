// /modules/settingModule/pages/address/list/index.js
import { behaviorStore } from './behavior' 

import { uploadAvatar, reqUpdateUserInfo } from '../../../../api/user'
import { setStorage } from '../../../../utils/storage'
import { toast } from '../../../../utils/extendApi'

Page({
  behaviors: [behaviorStore],

  // 页面的初始数据
  data: {
    isShowPopup: false // 控制更新用户昵称的弹框显示与否
  },

  // 显示修改昵称弹框
  onUpdateNickName() {
    this.setData({
      isShowPopup: true,
      'userInfo.nickname': this.data.userInfo.nickname
    })
  },

  // 弹框取消按钮
  cancelForm() {
    this.setData({
      isShowPopup: false
    })
  },

  // 选择头像、并上传至服务器
  async handleChooseAvatar(e) {
    // console.log(e);
    const { avatarUrl } = e.detail
    /* 将头像上传至服务器 */
    const res = await uploadAvatar(avatarUrl, 'file')
    // console.log(res);

    this.setData({
      'userInfo.headimgurl': res.data
    })
  },

  // 修改昵称
  submitNickname(e) {
    console.log(e);
    const { nickname } = e.detail.value
    this.setData({
      'userInfo.nickname': nickname,
      isShowPopup: false
    })
  },

  // 更新用户信息
  async updateUserInfo() {
    const res = await reqUpdateUserInfo(this.data.userInfo)
    if(res.code === 200) {
      setStorage('userInfo', this.data.userInfo)

      this.setUserInfo(this.data.userInfo)

      toast({ title: '用户信息更新成功' })
    }
  }
})
