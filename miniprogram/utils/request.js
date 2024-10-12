class WxRequest {

  // 默认配置
  defaults = {
    baseURL: '',
    url: '',
    method: 'GET',
    data: null,
    header: {
      'Content-type': 'application/json'
    },
    timeout: 60000,
    isLoading: false
  }

  // 默认拦截器
  interceptors = {
    request: (config) => config,
    
    response: (response) => response
  }

  // 请求队列
  queue = []

  constructor(params = {}) {
    this.defaults = Object.assign({}, this.defaults, params)
  }
  // 执行wx.request({}) 请求，并返回数据
  request(options) {
    // 清空定时器
    this.timerId && clearTimeout(this.timerId)

    // 拼接请求地址
    options.url = this.defaults.baseURL + options.url
    options = {
      ...this.defaults,
      ...options
    }

    // 在请求前，添加一个 loading 效果
    if(options.isLoading && options.method !== 'UPLOAD') {
      // wx.showLoading({ title: '加载中……' })
      this.queue.length === 0 && wx.showLoading({ title: '加载中……' })
      this.queue.push('aRequest')
    }

    // 调用请求拦截器
    options = this.interceptors.request(options)
    // console.log(options);

    return new Promise((resolve, reject) => {
      if ( options.method === 'UPLOAD' ) {
        console.log(options);
        wx.uploadFile({
          // url: options.url,
          // filePath: options.filePath,
          // name: options.name,
          ...options,
          success: (res) => {
            console.log(res);
            res.data = JSON.parse(res.data)
            // console.log(res);
            const mergedRes = Object.assign({}, res, {
              isSuccess: true,
              config: options
            })
            
            resolve(this.interceptors.response(mergedRes))
          },
          fail: (err) => {
            const mergedErr = Object.assign({}, err, {
              isSuccess: false,
              config: options
            })

            reject(this.interceptors.response(mergedErr))
          }
        })
      } else {
        // 发起请求
        wx.request({
          ...options,

          success: (res) => {
            // 获得服务器响应后
            // 调用响应拦截器
            const mergeRes = Object.assign({}, res, { config: options, isSuccess: true })
            resolve(this.interceptors.response(mergeRes))
          },

          fail: (err) => {
            // 获得服务器响应后
            // 调用响应拦截器
            const mergeErr = Object.assign({}, err, { config: options, isSuccess: false })
            reject(this.interceptors.response(mergeErr))
          },

          // 不管请求成功还是失败，都要处理的逻辑
          complete: () => {
            if(options.isLoading) {
              this.queue.pop()

              this.queue.length === 0 && this.queue.push('aRequest')

              this.timerId = setTimeout(() => {
                this.queue.pop()
                this.queue.length === 0 && wx.hideLoading()
                clearTimeout(this.timerId)
              }, 100)
            }
          }
        })
      }
    })
  }

  get(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'GET' }, config ))
  }

  post(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'POST' }, config ))
  }

  put(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'PUT' }, config ))
  }

  delete(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'DELETE' }, config ))
  }

  // 封装处理并发请求的 all 方法
  all(...promise) {
    console.log(promise);
    return Promise.all(promise)
  }

  // 封装文件上传方法
  upload(url, filePath, name = 'file', config = {}) {
    return this.request(Object.assign({ url, filePath, name, method: 'UPLOAD' }, config))
  }
}

export default WxRequest