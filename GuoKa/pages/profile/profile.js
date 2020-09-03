const moment = require("../../utils/moment");
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    level: "未登录",
    expire: "未登录",
    login: false,
    is_admin: false
  },
  attached() {
    console.log("初始化")
    var userInfo = app.globalData.userInfo;
    var data = app.globalData.data;
    var system = app.globalData.system;

    if(userInfo != null && data != null){
      var name = data.name;
      var expiredate = moment(data.expire);
      var date = moment(data.activeTime);

      console.log("日期",date);

      //如果允许新开或续费，才能显示按钮
      if((data.is_vip && system.can_continue_vip) || (!data.is_vip && system.can_reg_vip)){
        this.showDepositBtn();
      }else{
        this.hideDepositBtn();
      }
    
      if(data.name == ""){
        name = "补充姓名"
      }

      this.setData({
        login: true,
        level: data.is_vip ? "黑卡会员":"普卡会员",
        depositVIPtag: data.is_vip ? "续费会员":"开通会员",
        name: name,
        expire: data.is_vip ? expiredate.format("yyyy年MM月DD日"):"长期有效",
        date: data.is_vip ? date.format("yyyy年MM月DD日"):"您还不是黑卡会员",
        phone: data.phone,
        is_admin: data.is_admin
      })
    }
  },
  methods: {
    hideDepositBtn(){
      this.setData({
        allowDepositVIP: false
      })
    },
    showDepositBtn(){
      this.setData({
        allowDepositVIP: true
      })
    },
    depositVIP(e) {
      const msgBox = this.selectComponent("#msgBox");
      var that = this;
      this.hideDepositBtn();

      wx.cloud.callFunction({
          name: "activateVIP",
          success: res =>{
            console.log("返回数据", res);
            var pres = res.result.payres.result.payment
            wx.requestPayment({
              timeStamp: pres.timeStamp,
              nonceStr: pres.nonceStr,
              package: pres.package,
              signType: 'MD5',
              paySign: pres.paySign,
              success (res) { 
                console.log("支付成功回调")
                msgBox.showMsg("您已支付成功，订单可能存在延迟，请稍等片刻后进入 “会员卡” 页面查看","hideModal")
                app.globalData.data = null;
              },
              fail (res) { 
                console.log("支付失败回调")
                msgBox.showMsg("您取消了支付","hideModal")
                that.showDepositBtn()
              }
            })
          },
          fail: err => {
            //提示注册失败 未知错误
            console.log("失败",err)
          }
        })
    },
    submitDeposit(e){
      const msgBox = this.selectComponent("#msgBox");
      const agreementBox = this.selectComponent("#agreementBox");

      var data = app.globalData.data;
      var system = app.globalData.system;
      var total;

      //this.hideDepositBtn();
      
      msgBox.showModal("您正在新开或续费黑卡会员服务，新开或续费时长为12个月，价格以实际支付为准。本会员卡仅在线下实体店内使用以享受权益。请您仔细阅读协议并拉到底部确定付款。以下为协议正文：欢迎使用亲爱的郭黑卡会员服务，为了保障您的权益，请在进行下一步操作前，详细阅读本协议的所有内容。当您点击“确定”按钮或其他具有类似含义的按钮并完成付款时，您的行为表示您同意并签署了本协议，并同意遵守本协议中的约定。该协议构成您与亲爱的郭达成的协议，具有法律效力。本协议内容包括协议正文、亲爱的郭已经发布的或将来可能发布的与黑卡会员服务相关的各类规则。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。一旦相关内容发生变动，亲爱的郭将会通过电子邮件或网站公告等方式提示您。如果您不同意对本协议内容所做的修改，则应立即停止使用本服务;如果您继续使用本服务的，则视为您同意对本协议内容所做的修改。定义1. 亲爱的郭黑卡会员:指在亲爱的郭的个人注册用户在签署本协议并根据亲爱的郭公布的收费标准支付相，应的费用后获取的特殊资格，具体资格名称以亲爱的郭公示的名称为准。以下简称“会员”。2.会员服务:指会员所享有的特殊服务，包括指定商品的优惠服务(即会员专享价) 、礼包和专属服务、及亲爱的郭不时提供的其他会员服务，具体以亲爱的郭公布的服务内容为准。使用规则1. 您申请开通会员时，需要提交您本人的手机号码、第三方支付账户等个人资料，并保证您提供的个人资料真实、准确、完整、合法有效，如有手机号码及第三方支付账户等个人资料.并保证您提供的个人资料真实、准确、完整、合法有效，如有变动，您应及时更新。如您提供的资料不合法、不真实、不准确、不详尽，由此引起的损失及法律责任将由您自行承担，给亲爱的郭造成损失的，亲爱的郭保留要求您赔偿的权利。2.您申请开通会员服务时，须按照亲爱的郭公布的收费标准支付相应的会员服务费用。亲爱的郭可能会基于业务发展，对收费标准进行调整，调整后的收费标准自公布之日起生效。如您在调整后的收费标准公布之前已开通会员服务的，您会员服务有效期内的会员服务费用将不受影响，当会员服务有效期届满后，若您需要续费，则需要按照调整后的收费标准支付相应的会员服务费用。3. 会员服务有效期分为月卡、季卡以及年卡，自您成功支付会员服务费用之日起算服务时间。若您希望在有效期届满后继续享受会员服务，则需要续费或重新申请。4.在使用会员服务过程中，您应当是具备完全民事权利能力和完全民事行为能力的自然人、法人或其他组织。若您不具备前述主体资格，则您及您的监护人应承担因此而导致的一切后果，亲爱的郭有权向您的监护人追偿。5.您知悉并同意， 亲爱的郭有权通过邮件、短信或电话等形式，向您发送会员活动相关信息。6.您确认会 员服务仅限您本人使用，同时，您保证,您将合理使用会员服务，不利用会员服务非法获利，不以任何形式转让您所享有的会员服务，不以任何形式将您所享有的会员服务借给他人使用，如亲爱的郭有合理理由怀疑您存在不当使用会员服务的行为时,亲爱的郭有权取消您的会员资格且不退还您支付的会员服务费用，因此产生的相关责任及损失均由您自行承担，给亲爱的郭造成损失的，亲爱的郭保留向您追偿的权利。7.亲 爱的郭保留在法律法规允许的范围内自行决定是否接受您的会员申请、调整会员服务内容、取消会员资格等相关权利。8.您理解并保证，您在使用会员服务过程中遵守诚实信用原则。如亲爱的郭发现或有合理理由怀疑您存在以下任一情形的:(a)通过任何不当手段或以违反诚实信用原则的方式开通会员服务的，包括但不限于通过恶意软件绕过亲爱的郭设定的正常流程开通会员服务;(b)您提供的资料不合法、不真实，包括但不限于盗用他人信息;(c)您通过亲爱的郭会员专区购买的商品并非用于个人消费或使用用途的;(d)亲爱的郭有合理理由怀疑您存在违反诚实信用，原则的其他行为。则，亲爱的郭有权拒绝您的会员服务开通需求;若已开通的，亲爱的郭有权单方面取消您的会员资格且不退还您支付的会员服务费用。会员服务售后1.您知悉并确认，开通会员服务后，若您中途主动取消服务或终止资格或被亲爱的郭根据《亲爱的郭服务协议》、本协议及相关规则注销账号、终止会员资格的，您已支付的会员服务费用将不予退还。2.如您有其他与会员服务售后相关的问题，可以通过亲爱的郭公布的联系方式联系客服进行反馈。","同意协议并确定付款","getUserInfo","hideModal");
    },
    changeName(e){
      var name = e.detail.value.name

      wx.cloud.callFunction({
        name: "changeName",
        data: {
          name: name
        },
        success: res=>{
          console.log(res)
          app.globalData.data.name = name;
          this.setData({
            name: name
          })
          this.hideChangeName();
        }
      })

      
    },
    showChangeName(){
      this.setData({
        showChangeName: true
      })
    },
    hideChangeName(){
      this.setData({
        showChangeName: false
      })
    }
  }
})