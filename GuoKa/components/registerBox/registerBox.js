// components/registerBox/registerBox.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    reg(res){
      console.log(res)
      const msgBox = this.selectComponent("#msgBox");
      const userInfo = res.detail.userInfo;

      if(userInfo == null){
        //用户拒绝授权
        msgBox.showMsg("您必须同意获取您的信息才可以使用本服务，请您尝试重新登陆","hideModal");
      }else{
        if(app.globalData.data != null){
          //说明之前已经注册过了，只是没有授权获取信息
          app.globalData.userInfo = userInfo;
          //注册或绑定成功，调用条码框
          this.triggerEvent('callBarCode', "logined");
        }else{
          app.globalData.userInfo = userInfo;
          msgBox.showModal("请点击确定以同意我们获取您的手机号以登陆","手机号登陆","getPhoneNumber","hideModal");
        }
      }
    },
    msgCallback: function(e){
      console.log(e)
      const msgBox = this.selectComponent("#msgBox");
      const that = this;

      this.DisableRegBtn();

      wx.getUserInfo({
        success: function(res){

          if(e.detail.detail.cloudID == null){
            that.AbleRegBtn();
            msgBox.showMsg("您必须使用手机号登陆，请您尝试重新登陆","hideModal");
          }else{
            //已经获得授权并获得手机号码与openID
            wx.cloud.callFunction({
              name: 'registerUser',
              data: {
                userInfo: res.userInfo,
                cloud: wx.cloud.CloudID(e.detail.detail.cloudID) // 这个 CloudID 值到云函数端会被替换
              },
              success: res =>{
                console.log(res);
                if(res.result.result == "FAIL"){
                  that.AbleRegBtn();
                  msgBox.showMsg(res.result.msg,"hideModal");
                }else if(res.result.result == "SUCCESS"){
                  //注册或绑定成功，调用条码框
                  that.triggerEvent('callBarCode', res.result);
                }
              }
            });
            
          }
          
        },
        fail: function(e){
          msgBox.showMsg("您必须同意获取您的信息才可以使用本服务，请您尝试重新登陆","hideModal");
        }
      });
      
    },
    DisableRegBtn(){
      this.setData({
        regBtnDis: "disable"
      })
    },
    AbleRegBtn(){
      this.setData({
        regBtnDis: ""
      })
    }
  }
})
