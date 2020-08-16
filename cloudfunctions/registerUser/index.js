// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  var sex,phone;

  var system = await cloud.callFunction({
    name: "getSystemSet"
  })
  system = system.result.res;

  if(!system.can_register){
    return {
      result: "FAIL",
      msg: "系统关闭注册"
    }
  }

  try {
    sex = event.userInfo.gender;
    phone = event.cloud.data.purePhoneNumber;
  } catch (error) {
    return {
      result: "FAIL",
      msg: "参数格式错误"
    }
  }
  
  //对数据进行处理
  if(phone == null){
    return {
      result: "FAIL",
      msg: "手机号为空"
    }
  }

  var res = await db.collection('user').where({
    phone: phone
  }).limit(1).get()

  console.log("筛查手机号",res)

  if(res.data.length == 0){
    //手机号未被注册，进入创建账号流程
    await db.collection('user').add({
      data: {
          openid: wxContext.OPENID,
          name: "",
          sex: sex==0 ? "其他":(sex == 1 ? "男":"女"),
          phone:phone,
          is_admin: false,
          is_vip: false,
          expire: db.serverDate(),
          point: 0,
          credit: 0
      }
    }).then( res => {
      console.log("注册",res);
    })

    var res = await db.collection('user').where({
      phone: phone
    }).limit(1).get()

    return {
      result: "SUCCESS",
      msg: "注册成功",
      data: res.data[0]
    }
  }else if(res.data[0].openid == ""){
    //已有历史数据，进入绑定流程
    await db.collection('user').where({
      phone: phone
    }).update({
      data: {
        sex: sex==0 ? "其他":(sex == 1 ? "男":"女"),
        openid: wxContext.OPENID
      }
    }).then( res => {
      console.log("绑定",res);
    })

    var res = await db.collection('user').where({
      phone: phone
    }).limit(1).get()

    return {
      result: "SUCCESS",
      msg: "绑定成功",
      data: res.data[0]
    }
  }else{
    //抛出异常
    return {
      result: "FAIL",
      msg: "该手机号已经被绑定或遇到其他错误"
    }
  }
}