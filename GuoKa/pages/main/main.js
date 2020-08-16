// pages/main/main.js
const moment = require("../../utils/moment.js");
var app = getApp();

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
    reg: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    callRegister: function(){
      this.setData({
        reg: true
      })
    },
    showBarCode: function(){
      this.setData({
        reg: false
      })
    },

    Login: function(){
      var that = this;
      var userInfo = app.globalData.userInfo;
      var data = app.globalData.data;

      if(userInfo != null && data != null){
        //前端已经完成登录
        that.showBarCode();

        var date = moment(data.expire);
        const cardBox = that.selectComponent("#cardBox");

        //先设置下公告
        if(app.globalData.system.notice_1 != ""){
          that.setData({
            notice: app.globalData.system.notice_1
          })
        }

        cardBox.setBarcode(data._id.substr(0,11).toUpperCase(),userInfo.avatarUrl,userInfo.nickName,data.is_vip ? "黑卡会员":"普卡会员",data.is_vip ? date.format("有效期至：yyyy年MM月DD日"):"长期有效");
        
      }else{
        wx.getUserInfo({
          success: function(res){
            //console.log(res);
            
            wx.cloud.callFunction({
              name: 'loginIn',
              success: function(e){
                console.log(e)
                //登录接口是系统设置和用户信息回传的唯一接口
                app.globalData.system = e.result.system;
                app.globalData.permission = e.result.permission;
                //先设置下公告
                if(e.result.system.notice_1 != ""){
                  that.setData({
                    notice: e.result.system.notice_1
                  })
                }

                //进入正式的登录逻辑
                if(e.result.result=="SUCCESS"){
                  that.showBarCode();
  
                  console.log(e)
                  var back = e.result.res.data[0];
                  var date = moment(back.expire);
                  const cardBox = that.selectComponent("#cardBox");

                  app.globalData.userInfo = res.userInfo;
                  app.globalData.data = back;

                  cardBox.setBarcode(back._id.substr(0,11).toUpperCase(),res.userInfo.avatarUrl,res.userInfo.nickName,back.is_vip ? "黑卡会员":"普卡会员",back.is_vip ? date.format("有效期至：yyyy年MM月DD日"):"长期有效");
                }else{
                  that.callRegister()
                }
              }
            })
          },
          fail: function(){
            that.callRegister()
          }
        })
      }
      
    },
    callBarCode: function(e){
      console.log("收到完成注册回调")
      const that = this;

      wx.getUserInfo({
        success: function(res){
          console.log(e);
          
          that.showBarCode();

          var back = e.detail.data
          var date = moment(back.expire);
          const cardBox = that.selectComponent("#cardBox");

          app.globalData.userInfo = res.userInfo;
          app.globalData.data = back;

          cardBox.setBarcode(back._id.substr(0,11).toUpperCase(),res.userInfo.avatarUrl,res.userInfo.nickName,back.is_vip ? "黑卡会员":"普卡会员",back.is_vip ? date.format("有效期至：yyyy年MM月DD日"):"长期有效");
        },
        fail: function(){
          that.callRegister()
        }
      })
    }
  },

  lifetimes: {
    attached: function(){
      this.Login();
    }
  }
})
