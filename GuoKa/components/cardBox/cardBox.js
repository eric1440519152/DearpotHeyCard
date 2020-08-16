// components/cardBox/cardBox.js
var wxbarcode = require('../../utils/index.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cardid: {
      value: '',
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    setBarcode: function(code,avatar,nickname,level,expire){
      this.setData({
        cardid: code,
        avatar: avatar,
        nickname: nickname,
        level: level,
        expire: expire
      });
      wxbarcode.barcode('barcode',this, code, 570, 165);
    }
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名

  }
  
})
