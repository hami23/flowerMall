import toast from './utils/extendApi'
import { setStorage, getStorage, removeStorage, clearStorage } from './utils/storage'
import { asyncSetStorage, asyncGetStorage, asyncRemoveStorage, asyncClearStorage } from './utils/storage'

App({

  globalData: {
    address: {}
  },

  async onShow() {
    // wx.toast()

    // wx.toast({ title: "哈哈哈哈哈哈", icon: "success"})

    // console.log(await wx.showModal({
    //   title: '你猜',
    //   content: '哈哈哈哈哈哈',
    // }))

    // console.log(await wx.showModal({
    //   title: '你猜',
    //   content: '哈哈哈哈哈哈',
    //   complete: (res) => {
    //     console.log(res)
    //     // console.log(res.confirm, res.cancel)
    //     // res.cancel && console.log(res.cancel)
    //     // res.confirm && console.log(res.confirm)
    //   },
    // }))

    //  console.log(await wx.modal({ showCancel: false }))
    //  console.log(await wx.modal())
    //  const res = await wx.modal()
    //  const res = await wx.modal({ title: '你猜' })
    //  console.log(res);

    // setStorage("name", "zhangsan")
    // setStorage("age", "19")

    // const res = getStorage("name")
    // // console.log(res);

    // // removeStorage("name")

    // clearStorage()

    // console.log(typeof wx.getStorageSync('key'))
    // console.log(wx.getStorageSync('key') == false)


  // wx.setStorage({key: "name", data: "哈哈哈"})
  // asyncSetStorage("name","哈哈哈")
  // asyncSetStorage("name","哈哈哈").then(res => {
  //   console.log(res);
  // })

  // const res = await asyncGetStorage("name")
  // console.log(res);

  // asyncRemoveStorage("name").then(res => {
  //   console.log(res);  // {errMsg: "removeStorage:ok"}
  // })
  // asyncClearStorage().then(res => {
  //   console.log(res);  // {errMsg: "clearStorage:ok"}
  // })

  }

})
