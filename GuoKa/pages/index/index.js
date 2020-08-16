//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    page: 'main'
  },
  NavChange(e) {
    this.setData({
      page: e.currentTarget.dataset.cur
    })
  },
  onLoad: function () {
    
  },
  
})
