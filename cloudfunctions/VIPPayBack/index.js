// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  const orderId = event.outTradeNo
  const openid = event.userInfo.openId
  const returnCode = event.returnCode
  const resultCode = event.resultCode
  const totalFee = event.totalFee

  var newExpire,activeTime,total;
  var nowTime = moment(db.serverDate())
  var expire;

  if(returnCode == 'SUCCESS' && resultCode == 'SUCCESS'){

    //首先判断是否是已经处理过的订单
    var res = await db.collection('paylog').where({
      orderId: orderId
    }).limit(1).get()

    var system = await cloud.callFunction({
      name: "getSystemSet"
    })
    system = system.result.res;

    if(res.data.length != 0){
      return {errcode:0,errmsg:'订单二次处理'}
    }else{
      //进入正常业务逻辑
      var res = await db.collection('user').where({
        openid: openid
      }).limit(1).get()
      expire = moment(res.data[0].expire)

      console.log(res);

      if(res.data.length == 0 || res.data[0].phone == null){
        //查无记录或手机号为空
        return {errcode:0,errmsg:'该用户不存在'}
      }

      if(res.data[0].is_vip == true && expire.isAfter(nowTime)){
        //续费
        newExpire = expire.add(1,'year').toISOString();
        activeTime = res.data[0].activeTime;
        total = system.con_vip_price;
      }else{
        //新开
        newExpire = nowTime.add(1,'year').toISOString();
        activeTime = moment(db.serverDate()).toISOString();
        total = system.first_vip_price;
      }

      //核验金额
      if(totalFee == total){
        //金额对的上
        db.collection("user").where({
          openid: openid
        }).update({
          data:{
            is_vip: true,
            expire: newExpire,
            activeTime: activeTime
          }
        })

        db.collection("paylog").add({
          data:{
            orderId: orderId,
            openId: openid,
            total: total,
            resultCode: resultCode,
            activeTime: moment(db.serverDate()).toISOString(),
            phone: res.data[0].phone
          }
        })

        return {
          errcode:0,
          errmsg:''
        }
      }

    }
  }

  return {
    errcode:0,
    errmsg:'未正常完成业务逻辑'
  }
}