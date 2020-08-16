// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  const key = event.key;
  const value = event.value;
  
  var perres = await cloud.callFunction({
    name:"getPremission",
    data:{
      openid: wxContext.OPENID
    }
  })
  
  if(!perres.result.res.edit_system){
    return {
      result: "FAIL",
      msg: "无权限"
    }
  }
  
  if(key == "can_register"){
    db.collection("system").where({
      sub: "main"
    }).update({
      data:{
        can_register: value
      }
    })
  }else if(key == "can_reg_vip"){
    db.collection("system").where({
      sub: "main"
    }).update({
      data:{
        can_reg_vip: value
      }
    })
  }else if(key == "can_continue_vip"){
    db.collection("system").where({
      sub: "main"
    }).update({
      data:{
        can_continue_vip: value
      }
    })
  }

  return {
    result: "SUCCESS",
    msg: "已提交修改"
  }
}