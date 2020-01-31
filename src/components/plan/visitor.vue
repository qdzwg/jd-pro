<template>
  <div>
    <div class="title">
      <label for="checkAll" v-if="list.length>0">
        <input
          type="checkbox"
          @change="changeState"
          v-model="checkedAll"
          class="radio-input"
          id="checkAll"
        />
        <div class="radio-core"></div>
        <span>行程编号：{{ $route.params.tripNo }}</span>
        <em class="order-sum">总单数：{{totalNum}}</em>
      </label>
    </div>

    <keep-alive>
      <div class="scrollList">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
        >
          <div
            class="vistor-list"
            v-for="(item,index) in list"
            :key="index"
            :class="item.status == 'out'?'vistor-leave':''"
          >
            <label :for="index" class="label-box">
              <!-- <input type="checkbox" :value="item.id" v-model="checkModel" :id="index" class="radio-input"> -->
              <input
                v-if="item.messageStatus=='F'"
                type="checkbox"
                :value="index"
                v-model="mobiles"
                :id="index"
                class="radio-input"
              />
              <!-- <input type="checkbox" v-if="item.status == 'in'" :value="item.id" v-model="checkModel" :id="index" class="radio-input"> -->
              <!-- <input type="checkbox" v-if="item.status == 'out'"  class="radio-input"> -->
              <div class="radio-core" v-if="item.messageStatus=='F'"></div>
              <div class="vistor-right">
                <a class="info-more" @click.stop="govisitDetail(item)">
                  <!-- {{mobiles}}    -->
                  <div class="top">
                    <span>
                      联系方式：
                      <em>{{item.tel}}</em>
                      <em v-if="item.messageStatus == 'T'" class="sended-message">短信已发</em>
                    </span>
                    <span v-if="item.sex&&item.sex!=''">
                      性别：
                      <em>{{item.sex=='female'?'女':'男'}}</em>
                    </span>
                  </div>
                  <div class="info">
                    <p>
                      <i class="iconfont icon-geren"></i>
                      <em>姓名：</em>
                      {{item.name}}
                    </p>
                    <p>
                      <i class="iconfont icon-shenfenzheng"></i>
                      <em>证件号码：</em>
                      {{item.certNo}}
                    </p>
                    <p>
                      <i class="iconfont icon-dizhi1"></i>
                      <em>接站地址：</em>
                      {{item.meetAddr}}
                    </p>
                    <p>
                      <i class="iconfont icon-dizhi1"></i>
                      <em>送站地址：</em>
                      {{item.deliverAddr}}
                    </p>
                    <p>
                      <i class="iconfont icon-dizhi1"></i>
                      <em>家庭人数：</em>
                      {{item.ticketNum}}{{item.famailyNum}}
                      (
                      <span v-for="(it, ind) in item.list" :key="ind">{{it.tktName}}{{it.amount}}</span>)
                    </p>
                    <!-- <p v-if="item.adultNum"><i class="iconfont icon-dizhi1"></i><em>成人：</em>{{item.adultNum}}</p>
                    <p v-if="item.childNum"><i class="iconfont icon-dizhi1"></i><em>儿童：</em>{{item.childNum}}</p>-->
                    <p>
                      <i class="iconfont icon-dizhi1"></i>
                      <em>代收金额：</em>
                      {{item.replaceCharge}}
                      <span
                        @click.stop="collection(item)"
                        class="collection"
                        v-if="item.replaceFlag == 'T'"
                      >代收</span>
                    </p>
                    <!-- <p v-else-if="item.replaceCharge > 0 && item.replaceFlag == 'T'"><i class="iconfont icon-dizhi1"></i><em>代收金额：</em>{{item.replaceCharge}}</p> -->
                    <p>
                      <i class="iconfont icon-remark"></i>
                      <em>导游备注：</em>
                      {{item.guiderRemark}}
                    </p>
                  </div>
                </a>
                <router-link
                  v-if="item.isReply == 'T'"
                  class="look-content"
                  :to="{name:'VisitorReply',params:{id:item.id}}"
                >查看回复内容</router-link>
              </div>
            </label>
            <img
              v-if="item.status == 'out'"
              class="outGroup"
              src="../../assets/images/comm/leaveGroupBg.png"
            />
          </div>
          <scroll-bottom :totalPage="totalPage" :loading="loading"></scroll-bottom>
        </div>
      </div>
    </keep-alive>

    <no-data v-if="noDataStatus" :isAdd="true"></no-data>

    <!--<foot-btn v-if="list.length>0" :text="footBtnText" @firstCli="LeaveGroup" @lastCli="SendMsgBtn"></foot-btn>-->
    <foot-btn v-if="list.length>0" :text="footBtnText" @firstCli="SendMsgBtn"></foot-btn>
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
          <div class="msg-list" v-for="(item,index) in MsgList" :key="index">
            <label :for="'msg_'+index" class="label-box">
              <input
                type="radio"
                :value="item.id"
                :id="'msg_'+index"
                v-model="MsgParams.templateId"
                class="radio-input"
              />
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
import { MessageBox, InfiniteScroll } from "mint-ui";
import API from "../../http/api.js";
import FootBtn from "../comm/FootBtn";
import noData from "../comm/noData";
import scrollBottom from "../comm/scrollBottom";
import common from "../../assets/js/public.js";
import validation from "../../assets/js/validation.js";
export default {
  inject: ["reload"],
  name: "Visitor",
  components: {
    FootBtn,
    noData,
    scrollBottom
  },
  data() {
    return {
      checkedAll: false, //全选按钮状态
      checkModel: [], //选中的数据的id
      mobiles: [],     
      
      // footBtnText:['退团申请','发送短信'],//底部按钮文字
      footBtnText: ["发送短信"], //底部按钮文字
      noDataStatus: false, //暂无数据
      loading: false,
      list: [],
      totalPage: 1,
      params: {
        // 列表参数
        tripNo: "",
        rows: 10, //每页条数
        page: 0 //当前页
      },
      leaveParams: {
        // 退团申请
        visitors: [], // 游客id
        tripNo: "" // 团号
      },
      MsgParams: {
        // 一键发送短信
        visitors: [], // 游客手机号
        templateId: "", // 短信模板id
        mobiles: [], // 手机号
        orderIds: [] //订单号
      },
      MsgDialogShow: false, // 短信列表 显示状态
      MsgList: [], // 短信列表
      editcode: 0, // 选中的短信编码 默认是0
      totalNum: 0, //总单数
      orderDetail: "",
      dFlag: true //判断是否显示代收的其中一个字段
    };
  },
  mounted: function() {
    this.params.tripNo = this.$route.params.tripNo;
    this.params.guiderId = this.$route.params.guiderId;
    this.leaveParams.tripNo = this.$route.params.tripNo;
    // this.loadAjax();
  },
  methods: {
    reloadPage() {
      this.reload();
    },
    loadAjax() {
      this.axios
        .get(API.Visitor, { params: this.params })
        .then(response => {
          this.list = this.list.concat(response.data.data.items);
          
          console.log("数据", this.list);
          if (this.list.length < 1) this.noDataStatus = true;
          else this.noDataStatus = false;
          this.totalPage = response.data.data.totalPage;
          // this.isHaveMore();
          this.totalNum = response.data.data.numRows;

          for (let i = 0; i < this.list.length; i++) {
            let oD = "";
            for (let j = 0; j < this.list[i].list.length; j++) {
              if (this.list[i].list[j].tktName) {
                oD +=
                  this.list[i].list[j].tktName +
                  (this.list[i].list[j].amount + "人") +
                  " ";
              }
            }
            this.list[i].oD = oD;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 分页查询
    loadMore() {
      this.params.page = parseInt(this.params.page) + 1;
      if (!this.loading) {
        this.loadAjax(); // 调用list加载
        if (this.params.page >= this.totalPage) {
          this.loading = true;
        }
      }
    },
    // 检测是否可以上拉,true是禁止上拉加载
    isHaveMore() {
      this.loading = false;
      if (this.params.page >= this.totalPage) {
        this.loading = true;
      }
    },
    //全选按钮
    changeState() {
      // this.checkModel=[];
      this.mobiles = [];
      if (this.checkedAll == true) {
        this.list.forEach((item, index) => {
          // this.checkModel.push(value.id);          
          this.mobiles.push(index);          
        });
      }
    },
    // 退团申请
    LeaveGroup() {
      if (validation.checkArrLen(this.checkModel)) {
        console.log("退团申请", this.checkModel);
        MessageBox.confirm("", {
          message: "确定将选中的游客退团嘛？"
        })
          .then(action => {
            if (action == "confirm") {
              this.leaveParams.visitors = this.checkModel;
              let params = {};
              params.visitors = this.leaveParams.visitors;
              params.tripNo = this.$route.params.tripNo;
              console.log("LeaveGroup", params);
              this.axios
                .post(API.LeaveGroup, this.$qs.stringify(params))
                .then(res => {
                  if (res.data.success) {
                    common.showToast("退团成功", 1000);
                    this.list = [];
                    this.params.page = 1;
                    this.loadAjax();
                  } else {
                    MessageBox.alert(res.data.message);
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }
          })
          .catch(err => {
            if (err == "cancel") {
            }
          });
      } else {
        common.showToast("请选择游客!", 1500);
      }
    },
    // 一键发送
    SendMsgBtn() {
      if (validation.checkArrLen(this.mobiles)) {
        // this.MsgDialogShow = true;
        this.DialogControl(true);
        // 加载短信列表
        this.axios
          .get(API.MemberMsgList, { rows: 100 })
          .then(res => {
            console.log("短信列表", res.data);
            if (res.data.success) {
              this.MsgList = res.data.data.rows;
              console.log("短信列表123", res.data.data);
              console.log(1234567);
            } else {
              MessageBox.alert(res.data.message);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        common.showToast("请选择游客!", 1500);
      }
    },
    // 新增短信，成功后跳回该页面
    AddMsg(status, code) {
      this.$router.push({
        path: `/editMsg/${status}/${code}`,
        query: { redirect: this.$router.currentRoute.fullPath }
      });
    },
    // 编辑
    EditMsg() {
      if (this.MsgParams.templateId == "") {
        common.showToast("请选择一个短信模板", 1000);
      } else {
        this.$router.push({
          path: `/editMsg/1/${this.MsgParams.templateId}`,
          query: { redirect: this.$router.currentRoute.fullPath }
        });
      }
    },
    // 发送短信
    SendMsg() {
      if (this.MsgParams.templateId == "") {
        common.showToast("请选择一个短信模板", 1000);
      } else {
        // this.MsgParams.visitors = this.checkModel;
        // this.MsgParams.mobiles = this.mobiles;        
        let params = {};
        // params.visitors=this.MsgParams.visitors;
        // params.mobiles = this.MsgParams.mobiles;        
        params.templateId = this.MsgParams.templateId;
        params.tripNo = this.$route.params.tripNo;
        let fMobiles = [], fOrderId = [];
        this.mobiles.forEach(item =>{
          fMobiles.push(this.list[item].tel);
          fOrderId.push(this.list[item].sourceId);
        })
        // this.MsgParams.mobiles = fMobiles;
        // this.MsgParams.orderId = fOrderId;        
        params.mobiles = fMobiles;
        params.orderIds = fOrderId;
        console.log("params", params);
        this.axios
          .post(API.SendMsgBatch, this.$qs.stringify(params))
          .then(res => {
            if (res.data.success && res.data.code == 200) {
              common.showToast("发送成功，请查收", 2000);
              // this.MsgDialogShow = false;
              this.DialogControl(false);
            } else {
              MessageBox.alert(res.data.message);
            }
          })
          .catch(res => {
            console.log(res);
          });
      }
    },
    // 关闭信息弹窗
    closeMsgDialog() {
      // this.MsgDialogShow = false;
      this.DialogControl(false);
    },
    // 弹框操作
    DialogControl(flag) {
      var obj = document.querySelector("body");
      console.log(obj);
      if (flag) {
        //打开弹框
        this.MsgDialogShow = true;
        obj.style.cssText = "overflow:hidden";
      } else {
        //关闭弹框
        this.MsgDialogShow = false;
        obj.style.cssText = "overflow:auto";
      }
    },
    //代收金额
    collection(item) {
      MessageBox.confirm("", {
        message: "确定要代收嘛？"
      })
        .then(action => {
          if (action == "confirm") {
            this.axios
              .get(API.updateReplaceFlag, {
                params: { sourceId: item.sourceId, tripId: item.tripId }
              })
              .then(res => {
                if (res.data.success && res.data.code == 200) {
                  common.showToast("代收成功！", 2000);
                  this.dFlag = false;
                  this.reloadPage();
                  console.log("32326562312");
                } else {
                  MessageBox.alert(res.data.message);
                }
              });
          }
        })
        .catch(err => {
          if (err == "cancel") {
          }
        });
    },
    govisitDetail(item) {
      this.$router.push({
        name: "VisitorDetail",
        params: { sourceId: item.sourceId, tripId: item.tripId }
      });
    }
  },
  watch: {
    //监视选中的数据
    mobiles: {
      handler() {
        if (this.mobiles.length == this.list.length) {
          this.checkedAll = true;
        } else {
          this.checkedAll = false;
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
.msg-mask {
  position: fixed;
  z-index: 99;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}
.msg-dialog {
  position: fixed;
  z-index: 100;
  width: 80%;
  // max-width: 300px;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border-radius: 3px;
  overflow: hidden;

  .msg-dialog__hd {
    background: #f5f5f5;
    text-align: center;
    padding: 0.5rem 0 0.5rem;
    color: #666;
    font-size: 0.7rem;
  }
  .msg-dialog__bd {
    max-height: 12rem;
    padding: 0.5rem 0;
    overflow: auto;

    p {
      color: #999;
      font-size: 0.7rem;
      &:first-child {
        padding-bottom: 0.5rem;
      }
    }
  }
  .msg-dialog__ft {
    position: relative;
    line-height: 48px;
    font-size: 0.7rem;
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
      border-top: 1px solid #d5d5d6;
      color: #d5d5d6;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .msg-dialog__btn {
      display: block;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      color: #666;
      text-decoration: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      position: relative;

      &:after {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        width: 1px;
        bottom: 0;
        border-left: 1px solid #d5d5d6;
        color: #d5d5d6;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleX(0.5);
        transform: scaleX(0.5);
      }
    }
    .msg-dialog__btn:first-child:after {
      display: none;
    }
    .msg-dialog__btn_primary {
      color: #529cff;
    }
  }
}
$padding: 0 0.5rem;
.title {
  position: fixed;
  height: 1.75rem;
  width: 100%;
  color: #666;
  font-size: 0.6rem;
  line-height: 1.75rem;
  // padding: $padding;
  background: #f8f8f8;
  z-index: 89;
  top: 2rem;
  left: 0;
  label {
    margin-left: 0.5rem;
  }
  .order-sum {
    float: right;
    margin-right: 0.5rem;
  }
}
.scrollList {
  // padding:2rem 0 2.2rem;
  padding: 3.75rem 0 2.2rem;
}
.right-content {
  display: inline-block;
  vertical-align: middle;
}
.choose-btn {
  display: inline-block;
  vertical-align: middle;
  color: #818494;
  font-size: 1.2rem;
  width: 9%;
  input {
    display: none;
  }
}
.vistor-list {
  background: #fff;
  padding: $padding;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  box-sizing: border-box;
  margin-bottom: 0.2rem;
  width: 100%;
  .label-box {
    display: block;
    width: 100%;
    height: 100%;
  }
  .vistor-right {
    @extend .right-content;
    width: 89%;
    position: relative;
  }
  .top {
    line-height: 1.35rem;
    font-size: 0.55rem;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    span {
      margin-right: 1.9rem;
      em {
        color: #999;
      }
      em.sended-message{
        padding: 0.15rem 0.5rem;
        background-color: #ffab2e;
        color: #fff;
        border-radius: 0.5rem;
        font-size: 0.6rem;
        margin-left:0.5rem;
        // display: inline-block;
      }
    }
  }
  .info {
    padding: 0.3rem 0;
    p {
      color: #999;
      font-size: 0.6rem;
      line-height: 0.95rem;
      i {
        color: #95c2ff;
        display: inline-block;
        width: 0.9rem;
        text-align: center;
        vertical-align: middle;
        font-size: 0.65rem;
      }
      em {
        color: #333;
      }
      span.collection {
        margin-left: 1rem;
        display: inline-block;
        padding: 0.1rem 0.5rem;
        background-color: #ffab2e;
        color: #fff;
        border-radius: 0.5rem;
        font-size: 0.6rem;
      }
    }
  }
}
.vistor-leave {
  position: relative;

  .top,
  .info p em,
  .info p i {
    color: #999;
  }

  .outGroup {
    width: 3.75rem;
    height: 2.75rem;
    position: absolute;
    right: 0.5rem;
    bottom: 1rem;
    z-index: 99;
  }
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
.radio-input {
  display: none;
}
.radio-input:checked + .radio-core {
  background-color: #ffab2e;
  border-color: #ffab2e;
}
.radio-input:checked + .radio-core:after {
  border-style: solid;
  border-width: 0 0 2px 2px;
  border-radius: 0;
  border-color: #fff;
}

.msg-list {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: 0 none;
  }
  label {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    align-items: center;
  }
  div.content {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    color: #666;
    font-size: 0.7rem;
    line-height: 1.4;
  }
  .radio-core {
    margin-left: 0.5rem;
  }
}
.info-more {
  display: inline-block;
}
.look-content {
  font-size: 0.6rem;
  color: #ffab2e;
  text-align: center;
  display: block;
  height: 1.5rem;
  line-height: 1.5rem;
  border-top: 1px solid #f0f0f0;
}
</style>
