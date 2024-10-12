import http from '../utils/http'

/**
 * @description 获取服务端返回的 token 令牌
 * @param {string} 临时登录凭证 code
 * @returns Promise
 */
export const reqToken = (code) => {
  return http.get(`/weixin/wxLogin/${code}`)
}

/**
 * @description 获取用户信息
 * @returns Promise 
 */
export const reqUserInfo = () => {
  return http.get('/weixin/getuserInfo')
}

/**
 * @description 上传用户头像
 * @returns Promise
 */
export const uploadAvatar = (filePath, name) => {
  return http.upload('/fileUpload', filePath, name)
}

/**
 * @description 更新用户信息
 * @param {*} 用户信息
 * @returns Promise
 */
export const reqUpdateUserInfo = (userInfo) => {
  return http.post('/weixin/updateUser', userInfo)
}