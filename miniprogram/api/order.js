import http from '@/utils/http'

/**
 * @description 获取订单列表
 * @returns Promise
 */
export const reqOrderList = ({page, limit}) => {
  return http.get(`/order/order/${page}/${limit}`)
}