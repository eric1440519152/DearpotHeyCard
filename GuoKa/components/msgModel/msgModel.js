// components/msgModel/msgModel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: {
      value: '',
      type: String
    },
    msg: {
      value: 'Error',
      type: String
    },
    title: {
      value: '提示',
      type: String
    },
    openType: {
      value: '',
      type: String
    },
    confirmAction: {
      value: 'hideModal',
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
    hideModal(){
      this.setData({
        showModal: ""
      })
    },
    showMsg(msg,confirmAction){
      this.setData({
        showModal: "Bottom",
        msg: msg,
        confirmAction: confirmAction
      })
    },
    showModal(msg,title,openType,confirmAction){
      this.setData({
        showModal: "Dialog",
        msg: msg,
        title: title,
        openType: openType,
        confirmAction: confirmAction
      })
    },
    callback(res){
      this.triggerEvent('callback', res);
    }
  }
})
