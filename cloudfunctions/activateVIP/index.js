// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  var goodname;
  var total;

  var res = await db.collection('user').where({
    openid: wxContext.OPENID
  }).limit(1).get()
  
  var system = await cloud.callFunction({
    name: "getSystemSet"
  })
  system = system.result.res;
  
  console.log(res);

  if(res.data.length == 0 || res.data[0].phone == null){
    //查无记录或手机号为空
    return {
      result: "FAIL",
      msg: "无法取得手机号"
    }
  }

  if(res.data[0].is_vip == true){
    //续费
    if(!system.can_continue_vip){
      return {result: "FAIL"}
    }
    goodname = "续费黑卡会员";
    total = Number(system.con_vip_price);
  }else{
    //新开
    if(!system.can_reg_vip){
      return {result: "FAIL"}
    }
    goodname = "开通黑卡会员";
    total = Number(system.first_vip_price);
  }

  var payres = await cloud.callFunction({
    // 要调用的云函数名称
    name: 'callWxPay',
    // 传递给云函数的参数
    data: {
      goodName: goodname,
      total: total,
      functionName: "VIPPayBack"
    }
  })

  return {
    res,
    payres
  }
}