import http from '../utils/http'

/**
 * @description 获取分类栏列表
 * @returns { Promise }
 */
export const reqCategoryList = () => {
  return http.get('/index/findCategoryTree')
}