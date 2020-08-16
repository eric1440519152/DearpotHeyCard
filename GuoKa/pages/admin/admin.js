// GuoKa/pages/admin/admin.js
const app = getApp();
var msg;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    edit_system:false,
    is_vip: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var permission = app.globalData.permission;
    var system = app.globalData.system;

    msg = this.selectComponent("#msgBox")

    console.log(system.con_vip_price)

    this.setData({
      edit_system: permission.edit_system,
      check_user: permission.check_user,
      edit_user: permission.edit_user,
      can_register: system.can_register,
      can_reg_vip: system.can_reg_vip,
      can_continue_vip: system.can_continue_vip,
      notice: system.notice_1,
      con_vip_price: system.con_vip_price,
      first_vip_price: system.first_vip_price
    })
  
  },
  checkPhone: function(e){
    const that  = this;
    const phone = e.detail.value.phone;

    wx.cloud.callFunction({
      name:"getUserInfo",
      data:{
        where: "phone",
        phone: phone
      },
      success: res =>{
        console.log("用户数据",res.result.res)
        if(res.result.res == null){
          msg.showMsg("未找到该用户","hideModal");
        }else{
          that.setData({
            showChangeUser: true,
            openid:res.result.res.openid,
            _id:res.result.res._id,
            name:res.result.res.name,
            sex:res.result.res.sex,
            phone:res.result.res.phone,
            is_admin:res.result.res.is_admin,
            is_vip:res.result.res.is_vip,
            expire:res.result.res.expire,
            activeTime:res.result.res.activeTime,
            point:res.result.res.point,
            credit:res.result.res.credit
          })
        }
        
      }
    })
  },
  hideChangeUser: function(e){
    this.setData({
      showChangeUser: false
    })
  },
  is_vip_change: function(e){
    this.is_vip = e.detail.value;
    console.log(this.is_vip)
  },
  changeUser: function(e){
    const that = this;
    console.log(e.detail.value)
    const openid= e.detail.value.openid;
    const _id= e.detail.value._id;
    const name= e.detail.value.name;
    const sex= e.detail.value.sex;
    const phone= e.detail.value.phone;
    const is_vip= this.is_vip;
    const expire= e.detail.value.expire;
    const activeTime= e.detail.value.activeTime;
    const point= e.detail.value.point;
    const credit= e.detail.value.credit;
    
    wx.cloud.callFunction({
      name: "updateUser",
      data:{
        openid:openid,
        _id:_id,
        name:name,
        sex:sex,
        phone:phone,
        is_vip:is_vip,
        expire:expire,
        activeTime:activeTime,
        point:point,
        credit:credit
      },
      success: res =>{
        console.log(res)
        if(res.result.result ="SUCCESS"){
          that.hideChangeUser();
          msg.showMsg("成功保存","hideModal");
        }else{
          msg.showMsg(res.result.msg,"hideModal");
        }
      }
    })
  },
  scanQR: function(e){
    const that  = this;

    wx.scanCode({
      success (res) {
        
        var code = res.result.toLowerCase()
        wx.cloud.callFunction({
          name:"getUserInfo",
          data:{
            where: "cardid",
            cardid: code
          },
          success: res =>{
            console.log("用户数据",res.result.res)
            if(res.result.res == null){
              msg.showMsg("未找到该用户","hideModal");
            }else{
              that.setData({
                showChangeUser: true,
                openid:res.result.res.openid,
                _id:res.result.res._id,
                name:res.result.res.name,
                sex:res.result.res.sex,
                phone:res.result.res.phone,
                is_admin:res.result.res.is_admin,
                is_vip:res.result.res.is_vip,
                expire:res.result.res.expire,
                activeTime:res.result.res.activeTime,
                point:res.result.res.point,
                credit:res.result.res.credit
              })
            }
          }
        })
        
      }
    })
  },

  can_register_change: function(e){
    console.log(e)
    wx.cloud.callFunction({
      name: "changeSwitch",
      data: {
        key: "can_register",
        value: e.detail.value 
      }
    })
  },
  can_reg_vip_change: function(e){
    console.log(e)
    wx.cloud.callFunction({
      name: "changeSwitch",
      data: {
        key: "can_reg_vip",
        value: e.detail.value 
      }
    })
  },
  can_continue_vip_change: function(e){
    console.log(e)
    wx.cloud.callFunction({
      name: "changeSwitch",
      data: {
        key: "can_continue_vip",
        value: e.detail.value 
      }
    })
  },
  changeSystem: function(e){
    console.log(e)
    wx.cloud.callFunction({
      name: "changeSystem",
      data: {
        notice: e.detail.value.notice,
        con_vip_price: e.detail.value.con_vip_price,
        first_vip_price: e.detail.value.first_vip_price
      },
      success: function(e){
        wx.cloud.callFunction({
          name: "getSystemSet",
          success: res =>{
            console.log(res.result.res);
            if(res.result.result ="SUCCESS"){
              msg.showMsg("成功保存","hideModal");
              app.globalData.system = res.result.res;
            }else{
              msg.showMsg(res.result.msg,"hideModal");
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})