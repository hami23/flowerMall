class WxRequest {
  // 默认配置
  defaults = {
    baseURL: '', // 基准路径
    url: '',
    method: 'get',
    header: {}, // 请求头
    data: null,
    header: {},
    timeout: 600000 // 默认超时时间
  }
  // 默认拦截器
  interceptors = {
    request: (config) => config,
    response: (response) => response
  }
  // 请求队列
  queue = []

  constructor(config = {}) {
    // 构建实例时，合并 实例默认配置
    this.defaults = Object.assign({}, this.defaults, config)
  }

  // 发起网络请求
  request(config = {}) {
    this.timer && clearTimeout(this.timer)

    // 处理 一个参数 和 两个参数 的情况
    if (typeof config === 'string') {
      config = arguments[1] || {}
      config.url = arguments[0]
    } else {
      config = config || {}
    }
    // 拼接 完整url
    config.url = this.defaults.baseURL + config.url

    config = { ...this.defaults, ...config }

    // 发起请求前加个 loading效果
    if (config.isLoading && options.method !== 'UPLOAD') {
      this.queue.length === 0 &&
        wx.showToast({
          title: '加载中...',
          duration: 2000,
          icon: 'loading',
          mask: true
        })
      this.queue.push('aRequest')
    }

    // 发起请求时，调用请求拦截器，对 config 做统一处理
    config = this.interceptors.request(config)

    return new Promise((resolve, reject) => {
      if (config.method === 'UPLOAD') {
        wx.uploadFile({
          ...config,
          success: (res) => {
            res.data = JSON.parse(res.data)
            const mergedRes = Object.assign(
              {},
              { config, isSuccess: true },
              res
            )
            resolve(this.interceptors.response(mergedRes))
          },
          fail: (err) => {
            const mergedErr = Object.assign(
              {},
              { config, isSuccess: false },
              err
            )
            reject(this.interceptors.response(mergedErr))
          }
        })
      } else {
        wx.request({
          ...config,
          success: (res) => {
            const mergedRes = Object.assign(
              {},
              { config, isSuccess: true },
              res
            )
            resolve(this.interceptors.response(mergedRes))
          },
          fail: (err) => {
            const mergedErr = Object.assign(
              {},
              { config, isSuccess: false },
              err
            )
            reject(this.interceptors.response(mergedErr))
          },
          complete: () => {
            if (config.isLoading) {
              this.queue.pop()
              this.queue.length === 0 && this.queue.push('aRequest')

              this.timer = setTimeout(() => {
                this.queue.pop()
                this.queue.length === 0 && wx.hideLoading()
                clearTimeout(this.timer)
              }, 100)
            }
          }
        })
      }
    })
  }

  // get请求
  get(url, data = {}, config = {}) {
    return this.request({ ...config, url, data, method: 'GET' })
  }

  // post请求
  post(url, data = {}, config = {}) {
    return this.request({ ...config, url, data, method: 'POST' })
  }

  // put请求
  put(url, data = {}, config = {}) {
    return this.request({ ...config, url, data, method: 'PUT' })
  }

  // delete请求
  delete(url, data = {}, config = {}) {
    return this.request({ ...config, url, data, method: 'DELETE' })
  }

  // 同时发起多个请求
  all(...promise) {
    return Promise.all([...promise])
  }

  // 发起文件上传请求
  upload(url, filePath, name = 'file', config) {
    return this.request({ url, filePath, name, method: 'UPLOAD', ...config })
  }
}

export default WxRequest
