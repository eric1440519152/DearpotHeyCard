// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  const cardid = event.cardid;
  const phone = event.phone;
  const where = event.where;

  var res;

  var perres = await cloud.callFunction({
    name:"getPremission",
    data:{
      openid: wxContext.OPENID
    }
  })
  
  if(!perres.result.res.check_user && !perres.result.res.edit_user){
    return {
      result: "FAIL",
      msg: "无权限"
    }
  }

  if(where == "cardid"){
    res = await db.collection('user').where({
      _id: {
        $regex: cardid + ".*"
      }
    }).limit(1).get()
  }else if(where == "phone"){
    res = await db.collection('user').where({
      phone: phone
    }).limit(1).get()
  }

  return {
    res: res.data[0]
  }
}