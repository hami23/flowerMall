import instance from '../../utils/http'
import { getSwipperData } from '../../api/index'

Page({
  data: {
    avatarUrl: '../../assets/images/friend.jpg'
  },

  async chooseAvatar(e) {
    console.log(e);
    const res = await instance.upload('/fileUpload', e.detail.avatarUrl, 'file')
    console.log(res);

    this.setData({
      avatarUrl: res.data
    })
  },

  async handler1() {
    // instance.request({
    //   url: '/index/findBanner',
    //   method: 'get'
    // }).then(res => {
    //   console.log(res);
    // })

    // const res = await instance.get('/index/findBanner', {
    //   search: '金瓶梅'
    // }, {
    //   timeout: 10000
    // })
    const res = await getSwipperData()
    console.log(res);
    // const res = await instance.get('/cart/getCartList')
  },

  async handler2() {
    const res = await instance.get('/index/findBanner', {
      id: '666'
    }, {
      timeout: 5000,
      isLoading: true
    })
    console.log(res);
  },

  async handleAll() {
    // instance.get('/index/findBanner')
    // instance.get('/index/findBanner')
    // instance.get('/index/findBanner')
    // instance.get('/index/findBanner')
    // instance.get('/index/findBanner')
    // Promise.all([
    //   instance.get('/index/findBanner'),
    //   instance.get('/index/findBanner'),
    //   instance.get('/index/findBanner'),
    //   instance.get('/index/findBanner'),
    //   instance.get('/index/findBanner')
    // ])
    const res = await instance.all(
        instance.get('/index/findBanner'),
        instance.get('/index/findBanner'),
        instance.get('/index/findBanner'),
        instance.get('/index/findBanner'),
        instance.get('/index/findBanner')
    )
    console.log(res);
  },


  
})