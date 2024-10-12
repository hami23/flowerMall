import { reqCategoryList } from '../../api/category'

Page({
  data: {
    categoryList: [], // 分类列表数据
    activeIndex: 0 //当前选中项的索引
  },

  onLoad() {
    this.getCategoryList()
  },

  // 获取列表数据
  async getCategoryList() {
    const res = await reqCategoryList()
    // console.log(res)

    this.setData({
      categoryList: res.data
    })
  },

  // 更新当前项索引
  updateActiveIndex(e) {
    console.log(e)
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
  }
})
