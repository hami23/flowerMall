import http from '../utils/http'

/**
 * @description 请求商品列表
 * @param { Object } 
 * @returns Promise
 */
export const reqGoodsList = ({ page, limit, ...args }) => {
  console.log(args);
  return http.get(`/goods/list/${page}/${limit}`, args)
}

/**
 * @description 根据 id 请求商品详情
 * @param {*} goodsId 
 * @returns Promise
 */
export const reqGoodsById = (goodsId) => {
  return http.get(`/goods/${goodsId}`)
}