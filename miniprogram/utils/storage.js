
/* 同步get、set、remove、clear数据 --------------- START ------------- */
export const setStorage = (key, data) => {
  try {
    wx.setStorageSync(key, data)
  } catch (e) {
    console.error(`存储指定 ${key} 值数据错误`)
  }
}

export const getStorage = (key) => {
  try {
    const data = wx.getStorageSync(key)
    // console.log(data);
    if(data) {
      return data
    }
    //  else {
    //   console.error(`${key} 不存在`);
    // }
  } catch (e) {
    console.error(`获取指定 ${key} 值数据错误`)
  }
}

export const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    console.error(`清除 ${key} 及其数据错误`)
  }
}

export const clearStorage = () => {
  try {
    wx.clearStorage()
  } catch (e) {
    console.error(`清空数据错误`)
  }
}

/* 同步get、set、remove、clear数据 --------------- END ------------- */



/* 异步get、set、remove、clear数据 --------------- START ------------- */
export const asyncSetStorage = (key, data) => {
  return new Promise((resolve) => {
    wx.setStorage({
      key,
      data,
      complete: (res) => {
        // console.log(res);  // {errMsg: "setStorage:ok"}
        resolve(res)
      }
    })
  })
}

export const asyncGetStorage = (key) => {
  return new Promise(resolve => {
    wx.getStorage({
      key,
      complete: (res) => {
        // console.log(res)  // {errMsg: "getStorage:ok", data: "哈哈哈"}
        resolve(res)
      }
    })
  })
}

export const asyncRemoveStorage = (key) => {
  return new Promise(resolve => {
    wx.removeStorage({
      key,
      complete(res) {
        resolve(res)
      }
    })
  })
}

export const asyncClearStorage = () => {
  return new Promise(resolve => {
    wx.clearStorage({
      complete(res) {
        resolve(res)
      }
    })
  })
}
