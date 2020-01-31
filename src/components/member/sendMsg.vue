<template>
  <div class="send-msg">
    <mt-header title="分车分餐" style="width:100%; background:#313131;position:fixed;top:0;left:0;z-index:10">
      <mt-button slot="left" icon="back" @click="routerBack">返回</mt-button>
      <mt-button slot="right" @click="reAssign">重新分配</mt-button>
    </mt-header>
    <div class="text-content">
      <div class="text-title clf">
        <label for="checkAll" v-if="dataMsg.length>0" style="margin-left:0.5rem;">
          <input type="checkbox" @change="changeState" v-model="checkedAll" class="radio-input" id="checkAll">
          <div class="radio-core"></div>
          <span style="display:inline-block; vertical-align:middle;">船号:{{shipNo}}</span>
          <span style="display:inline-block; vertical-align:middle;">班次:{{carSchedulesName}}</span>
        </label>
      </div>
      <div class="text" v-for="(xitem,xindex) in dataMsg" :key="xindex">
        <label :for="xindex" class="label-box">
          <input type="checkbox" :value="xitem.orderId" v-model="checkModel" :id="xindex" class="radio-input">
          <div class="radio-core"></div>
          <div class="fcfc-right">
            <p>订单: <span>{{xitem.linkName}} 人数: {{xitem.orderNum }}</span></p>
            <p>订单号: <span>{{xitem.orderNo}}</span></p>
            <!-- <p>分车分餐: <span>{{xitem.itemType}} {{xitem.itemValue}}</span></p> -->
            <p>分车分餐: <span>{{xitem.carInfoDetail}} {{xitem.restInfoDetail}}</span></p>
            <span class="msg-state" style="color:#3ed167" v-if="xitem.msgStatus=='send'">已发送</span>
            <span class="msg-state" style="color:#3ed167" v-if="xitem.msgStatus=='resend'">重发成功</span>
            <span class="msg-state" style="color:#fb7e7e" v-if="xitem.msgStatus=='resend_fail'">重发失败</span>
            <span class="msg-state" @click="sendAgin(xindex)" style="color:#fb7e7e" v-if="xitem.msgStatus=='fail'">重发</span>
          </div>          
        </label>
      </div>
    </div>
    <button class="btn-send" @click="sendMsgBatch()">发送短信</button>

    <!-- 短信模板 -->
    <div class="msg_dialog" v-show="MsgDialogShow">
        <div class="msg-mask" @click="closeMsgDialog"></div>
        <div class="msg-dialog">
            <div class="msg-dialog__hd">信息发送</div>
            <div class="msg-dialog__bd" v-if="MsgList.length<1">
                <p>暂无可以使用的短信模板</p>
                <p>试试添加新的短信模板</p>
            </div>
            <div class="msg-dialog__bd" v-else>
                <div class="msg-list" v-for="(item,index) in MsgList" :key="index"  >
                  <label :for="'msg_'+index" class="label-box">
                    <input type="radio" :value="item.id" :id="'msg_'+index"  v-model="MsgParams.templateId" class="radio-input">
                    <div class="radio-core"></div>
                    <div class="content">{{item.templateContent}}</div>
                  </label>
                </div>
            </div>
            <div class="msg-dialog__ft" v-if="MsgList.length<1">
                <a class="msg-dialog__btn" @click="closeMsgDialog">取消</a>
                <a @click="AddMsg(0,0)" class="msg-dialog__btn msg-dialog__btn_primary">新增</a>
            </div>
            <div class="msg-dialog__ft" v-else>
                <a @click="EditMsg" class="msg-dialog__btn">编辑</a>
                <a @click="SendMsg" class="msg-dialog__btn msg-dialog__btn_primary">发送</a>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
  import {MessageBox} from 'mint-ui'
  import API from '../../http/api'
  import validation from '../../assets/js/validation.js'
  import noData from '../comm/noData';
  import scrollBottom from '../comm/scrollBottom'
  import common from '../../assets/js/public.js'
  export default {
    name: "sendMsg",
    data() {
      return {
        dataMsg: [],//页面数据
        shipNo: '', //船号
        carSchedulesName: '', //班次
        parentAssign: {},
        status: 2,
        checkedAll:false,//全选按钮状态           
        orderId: [],
        checkModel: [],
        MsgParams:{       // 一键发送短信
          visitors:[],    // 游客手机号
          templateId:'',  // 短信模板id
          mobiles: [],     // 手机号
          orderIds: ''
        },
        MsgDialogShow:false,  // 短信列表 显示状态
        MsgList:[], // 短信列表
        editcode:0, // 选中的短信编码 默认是0
      }
    },
    mounted() {
      //获取信息
      let that = this;
      this.status = this.$route.query.status;      
      if (this.$route.query.status >= 2) {
        that.getsendMsg()
      } else {
        //个人信息中assignStatus==1时路由带过了数据
        that.dataMsg = this.$route.query.data
      }
    },
    methods: {
      routerBack() {
        this.$router.back(-1);
      },
      reAssign() {
        let pid = this.parentAssign.id;
        if (pid) {
          this.$router.push({path: '/splitMeals', query: {status: this.status, pid: pid}});
        }
      },
      //获取信息
      getsendMsg() {
        let that = this
        this.axios.get(API.SENDMSG).then(function (res) {
          if (res.data.success && res.data.status>=2) {
            console.log(res.data)
            let cisTripShip = res.data.ship;
            that.carSchedulesName = cisTripShip.shipTime;
            that.shipNo = cisTripShip.shipNo;
            // that.dataMsg = res.data.data.items;
            that.dataMsg = res.data.data;
            that.parentAssign = res.data.assign;
          } else {
            MessageBox('提示', res.data.message);
          }
        })
      },
      //重发
      sendAgin(i) {
        let that = this
        let params = {}
        params.id = this.dataMsg[i].id,
          params.linkName = this.dataMsg[i].linkName,
          params.linkTel = this.dataMsg[i].linkTel,
          params.audltNum = this.dataMsg[i].audltNum,
          params.tableNo = this.dataMsg[i].tableNo,
          params.carNo = this.dataMsg[i].tableNo
        this.axios.get(API.SENDAGIN, {params: params})
          .then(function (res) {
            if (res.data.success) {
              MessageBox('提示', res.data.message);
              that.getsendMsg()
            }
          })
      },
      // //发送短信
      // sendMsgBatch() {
      //   let pid = this.parentAssign.id;
      //   if (pid) {
      //     this.axios.get(API.SENDBATCH, {params: {pid: pid}}).then(function (res) {
      //       MessageBox('提示', res.data.message ? res.data.message : "系统异常")
      //     })
      //   } else {
      //     alert("未知错误")
      //   }

      // },
      sendMsgBatch(){
        if(validation.checkArrLen(this.checkModel)){          
          this.DialogControl(true);
          // 加载短信列表
          this.axios.get(API.MemberMsgList,{rows:100})
          .then(res=>{
            console.log('短信列表',res.data);
            if(res.data.success) {
              this.MsgList = res.data.data.rows;            
            }else{
              MessageBox.alert(res.data.message);
            }
          })
          .catch(error=>{
            console.log(error);
          });
        }else{
          common.showToast("请选择订单!",1500);
        }
      },
       // 发送短信
      SendMsg(){
        if(this.MsgParams.templateId==""){
          common.showToast("请选择一个短信模板",1000);
        }else{
          let pid = this.parentAssign.id;
          // this.MsgParams.orderIds = this.checkModel.join(',');
          // this.MsgParams.mobiles = this.mobiles;
          let params = {};
          params.pid = pid;
          params.orderIds=this.checkModel.join(',');
          // params.mobiles = this.MsgParams.mobiles;
          params.templateId=this.MsgParams.templateId;
          // params.tripNo=this.$route.params.tripNo;
          console.log('params',params);
          this.axios.post(API.SendMsgBatch,this.$qs.stringify(params))
            .then(res=>{
              if(res.data.success && res.data.code == 200){
                common.showToast("发送成功，请查收",2000);                
                this.DialogControl(false);
              }else{
                MessageBox.alert(res.data.message);
              }
            })
            .catch(res=>{
              console.log(res);
            })
        }
      },
      // 关闭信息弹窗
      closeMsgDialog(){        
        this.DialogControl(false);
      },
      // 弹框操作
      DialogControl(flag){
        var obj = document.querySelector("body");
        console.log(obj, flag);
        if(flag){ //打开弹框
          this.MsgDialogShow = true;
          obj.style.cssText = "overflow:hidden";
        }else{    //关闭弹框
          this.MsgDialogShow = false;
          obj.style.cssText = "overflow:auto";
        }
      },
      // 新增短信，成功后跳回该页面
      AddMsg(status,code){
        this.$router.push({ path:`/editMsg/${status}/${code}`,query:{redirect:this.$router.currentRoute.fullPath}});
      },
      // 编辑
      EditMsg(){
        if(this.MsgParams.templateId==""){
          common.showToast("请选择一个短信模板",1000);
        }else{
          this.$router.push({ path:`/editMsg/1/${this.MsgParams.templateId}`,query:{redirect:this.$router.currentRoute.fullPath}});
        }
      },
      changeState(){
        this.checkModel=[];
        if(this.checkedAll==true){
            this.dataMsg.forEach(value=>{                
              this.checkModel.push(value.orderId);
            })
        }
      }
    },
    watch:{
        //监视选中的数据
        checkModel:{
            handler(){
                if(this.checkModel.length==this.dataMsg.length){
                  this.checkedAll=true;
                }else{
                  this.checkedAll=false
                }
            }
        }
    }
  }
</script>

<style lang="scss">
  .send-msg {
    width : 100%;
    .text-content {
      width     : 100%;
      font-size : .8rem;
      margin    : 2rem auto;
      .text-title {
        width            : 100%;
        height           : 2rem;
        line-height      : 2rem;
        color            : #afafaf;
        background-color : #f8f8f8;
      }
      .text {
        // padding    : .2rem 1rem;
        padding: .2rem 0.5rem;
        box-shadow : 0px 1px 2px #ccc;
        position   : relative;
        color      : #333;
        p {
          margin : .5rem 0;
          span {
            color : #999;
          }
        }
        .msg-state {
          position : absolute;
          top      : 50%;
          right    : 1rem;
        }
      }
    }
    .btn-send {
      width       : 100%;
      height      : 2.5rem;
      border      : none;
      text-align  : center;
      line-height : 2.5rem;
      font-size   : .8rem;
      outline     : 0;
      background  : #ffab2e;
      color       : #fff;
      position    : fixed;
      bottom      : 0;
      left        : 0;
    }

    .radio-core {
    display: inline-block;
    background-color:transparent;
    height: 0.7rem;
    width: 0.7rem;
    position: relative;
    border:1px solid #818494;
    border-radius: 100%;
    vertical-align: middle;
    margin-right: 0.3rem;
  }
  .radio-core:after{
    content: "";
    position: absolute;
    width: 0.4rem;
    height: 0.2rem;
    top:0.16rem;
    left:0.11rem;
    transform:rotate(-45deg);
    -webkit-transform:rotate(-45deg);
  }
  .radio-input{
    display: none;
    
  }
  .radio-input:checked +.radio-core {
    background-color: #ffab2e;
    border-color:#ffab2e;
  }
  .radio-input:checked +.radio-core:after {
    border-style:solid;
    border-width: 0 0 2px 2px;
    border-radius: 0;
    border-color:#fff;
  }
  .fcfc-right{
    width: 89%;
    position: relative;
    display: inline-block;
    vertical-align: middle;
  }
  .label-box{
    display: block;
    width: 100%;
    height: 100%;
  }

  .msg-mask {
    position: fixed;
    z-index: 99;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .msg-dialog{
    position: fixed;
    z-index: 100;
    width: 80%;
    // max-width: 300px;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: #FFFFFF;
    border-radius: 3px;
    overflow: hidden;

    .msg-dialog__hd{
      background:#f5f5f5;
      text-align: center;
      padding: .5rem 0 .5rem;
      color:#666;
      font-size: .7rem;
    }
    .msg-dialog__bd{
      max-height: 12rem;
      padding: .5rem 0;
      overflow: auto;

      p { color:#999; font-size: .7rem;
        &:first-child { padding-bottom: .5rem;}
      }
    }
    .msg-dialog__ft{
      position: relative;
      line-height: 48px;
      font-size: .7rem;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      text-align: center;

      &:after {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #D5D5D6;
        color: #D5D5D6;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
      .msg-dialog__btn{
        display: block;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        color: #666;
        text-decoration: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        position: relative;

        &:after{
          content: " ";
          position: absolute;
          left: 0;
          top: 0;
          width: 1px;
          bottom: 0;
          border-left: 1px solid #D5D5D6;
          color: #D5D5D6;
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleX(0.5);
          transform: scaleX(0.5);
        }
      }
      .msg-dialog__btn:first-child:after {display: none;}
      .msg-dialog__btn_primary { color:#529cff; }
    }
  }
  .msg-list{
    padding: .5rem 0;
    label{
          display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      .radio-input{
        display: none;
      }
      .radio-core {
          display: inline-block;
          background-color: transparent;
          height: 0.7rem;
          width: 0.7rem;
          position: relative;
          border: 1px solid #818494;
          border-radius: 100%;
          vertical-align: middle;
          margin-right: 0.3rem;
          margin-left: .5rem;
      }
      .radio-core:after {
        content: "";
        position: absolute;
        width: 0.4rem;
        height: 0.2rem;
        top: 0.16rem;
        left: 0.11rem;
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
    }
    .radio-input:checked + .radio-core:after {
          border-style: solid;
          border-width: 0 0 2px 2px;
          border-radius: 0;
          border-color: #fff;
      }
    }
   div.content{
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    color: #666;
    font-size: .7rem;
    line-height: 1.4;
}
  }
  .msg-list:last-child{
        border-bottom: 0 none;
  }
  }
</style>

