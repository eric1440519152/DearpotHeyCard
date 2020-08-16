// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();

  var system = await cloud.callFunction({
    name: "getSystemSet"
  })

  if(wxContext.OPENID == null){
    //取不出openid，说明未登录授权，直接返回失败
    return {
      result: "FAIL",
      msg: "无法取得openID",
      system: system.result.res,
    }
  }

  var res = await db.collection('user').where({
    openid: wxContext.OPENID
  }).limit(1).get()

  if(res.data.length == 0 || res.data[0].phone == null){
    //查无记录或手机号为空
    return {
      result: "FAIL",
      msg: "未绑定手机号或未注册",
      system: system.result.res,
    }
  }
  
  //检查会员有效期
  var expire = moment(res.data[0].expire);
  var nowTime = moment(db.serverDate());

  if(nowTime.isAfter(expire)){
    //过期
    res.data[0].is_vip = false;
    db.collection('user').where({
      openid: wxContext.OPENID
    }).update({
      data:{
        is_vip: false
      }
    })
  }

  var permission;
  if(res.data[0].is_admin){
    //是管理员 应该返回权限信息
    var perres = await cloud.callFunction({
      name:"getPremission",
      data:{
        openid: wxContext.OPENID
      }
    })
    console.log(res)
    permission = perres.result.res;
  }

  return {
    result: "SUCCESS",
    msg: "成功",
    res,
    permission,
    system: system.result.res,
    openid: wxContext.OPENID
  }
}