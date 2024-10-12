export default Behavior({

  data: {
    swipeCellQueue: []
  },

  methods: {
    // 滑块打开事件
    onSwipeCellOpen(e) {
      // console.log(e);
      const instance = this.selectComponent(`#${e.target.id}`)
      this.data.swipeCellQueue.push(instance)
    },

    // 点击滑块事件
    onSwipeCellClick() {
      this.onSwipeCellCommonClick()
    },

    // 点击页面事件
    onSwipeCellPageTap() {
      this.onSwipeCellCommonClick()
    },

    // 点击时，关闭滑块右侧内容
    onSwipeCellCommonClick() {
      this.data.swipeCellQueue.forEach(item => item.close())

      this.data.swipeCellQueue = []
    }
  }

})