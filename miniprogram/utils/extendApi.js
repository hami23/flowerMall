export const toast = ({ title = "数据加载中……", icon = "none", duration = 2000, mask = true } = {}) => {
  wx.showToast({
    title,
    icon,
    duration,
    mask
  })
}

export const modal = (options = {}) => {
  return new Promise((resolve) => {

    const defaultOptions = {
      title: '提示',
      content: '您确定执行该操作吗?',
      confirmColor: '#f3514f'
    }

    const opts = Object.assign({}, defaultOptions, options)

    wx.showModal({
      ...opts,
      complete: ({ confirm, cancel }) => {
        // console.log(confirm, cancel);
        confirm && resolve(true)
        cancel && resolve(false)
      }
    })
  })
}

wx.toast = toast
wx.modal = modal