// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  const _id=event._id;
  const openid = event.openid;
  const name=event.name;
  const sex=event.sex;
  const phone=event.phone;
  const is_vip=event.is_vip;
  const expire=event.expire;
  const activeTime=event.activeTime;
  const point=event.point;
  const credit=event.credit;
  
  var perres = await cloud.callFunction({
    name:"getPremission",
    data:{
      openid: wxContext.OPENID
    }
  })
  
  if(!perres.result.res.edit_user){
    return {
      result: "FAIL",
      msg: "无权限"
    }
  }

  var res = await db.collection('user').where({
    _id: _id
  }).update({
    data:{
      is_vip: is_vip,
      openid:openid,
      name:name,
      sex:sex,
      phone:phone,
      expire:expire,
      activeTime:activeTime,
      point:point,
      credit:credit,
    }
  })

  return {
    result: "SUCCESS",
    msg: "已提交修改",
    res
  }
}