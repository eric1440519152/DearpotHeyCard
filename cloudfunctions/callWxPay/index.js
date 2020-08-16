// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //预埋参数
  const wxContext = cloud.getWXContext();
  const goodName = event.goodName;
  const total = event.total;
  const functionName = event.functionName;

  var res = await cloud.cloudPay.unifiedOrder({
    subMchId : "1561492581",
    body : goodName,
    outTradeNo: Date.now().toString().slice(4),
    spbillCreateIp : "127.0.0.1",
    subAppid : "wxeb9e1cbce02faa82",
    totalFee : total,
    envId: "guoka",
    functionName: functionName
  })
  
  return {
    result: res.returnCode,
    returnMsg: res.returnMsg, 
    payment: res.payment,
    origin: res
  }
}