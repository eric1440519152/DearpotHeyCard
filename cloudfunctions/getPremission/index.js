// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  var openid = event.openid;

  openid =  wxContext.OPENID != null ? wxContext.OPENID : openid

  var res = await db.collection("permission").where({
    openid: openid
  }).limit(1).get()

  console.log(res)
  return {
    res: res.data[0]
  }
}