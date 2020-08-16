// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  const notice = event.notice;
  const first_vip_price = event.first_vip_price;
  const con_vip_price = event.con_vip_price;
  
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
  
  db.collection("system").where({
    sub: "main"
  }).update({
    data:{
      notice: notice,
      con_vip_price: Number(con_vip_price),
      first_vip_price: Number(first_vip_price)
    }
  })

  return {
    result: "SUCCESS",
    msg: "已提交修改"
  }
}