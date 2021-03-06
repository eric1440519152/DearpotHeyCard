// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  const name = event.name;

  var res = await db.collection("user").where({
    openid: wxContext.OPENID
  }).update({
    data:{
      name: name
    }
  })

  return {
    res,
    openid: wxContext.OPENID,
    name: name
  }
}