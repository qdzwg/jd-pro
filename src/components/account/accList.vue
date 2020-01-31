<template>
  <div class="list" id="loadmore">
    <div class="back-div">
      <input type="button" value="返回上一页" @click="$router.history.go(-1)" class="backGo" />
    </div>

    <header class="border-bottom">
      <!-- <section class="title border-bottom ">
                本次借款
                <em>{{ people.loanPrice||initNum }}元</em>
      </section>-->
      <section class="bd">
        <p class="bd-all">
          <span>{{ trip.totalNum }}</span>人
        </p>
        <div class="bd-items">
          <div class="items">
            <p>{{ trip.audltNum }}</p>
            <span>成人(人)</span>
          </div>
          <div class="items">
            <p>{{ trip.childNum }}</p>
            <span>儿童(人)</span>
          </div>
        </div>
      </section>
    </header>
    <!-- 列表 -->
    <div class="list-box">
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
      >
        <left-del v-for="(item,index) in list" :key="index">
          <div class="vistor-list">
            <label :for="index" class="label-box">
              <!-- <input type="checkbox" :value="item.itemId" v-model="checkModel" :id="index" class="radio-input">
              <div class="radio-core"></div>-->
              <div class="vistor-right">
                <div class="top">{{item.feeTypeName}}</div>
                <div class="price">
                  <span>
                    项目金额(元)：
                    <em>{{item.applyAudltAmount}}</em>
                  </span>
                  <router-link
                    v-if="account.applyAccountStatus == '' || account.applyAccountStatus == 'E'"
                    :to="{name:'addAccount',params:{tripNo:params.tripNo, finsh:params.finsh, id:item.id,add:'updata'}}"
                    class="pricelink"
                  >修改</router-link>
                </div>
                <div class="bottom-info">
                  <span>单价：{{item.audltPrice}}</span>
                  <span>数量：{{item.audltNum}}</span>
                </div>
                <div class="remark" @click="slideDown(index)">
                  备注：{{item.remark}}
                  <i class="link-on bottom"></i>
                </div>
              </div>
            </label>
          </div>
        </left-del>
        <!-- <no-data v-if="noDataStatus" :isAdd="true"></no-data> -->
        <!-- <scroll-bottom :totalPage="totalPage" :loading="loading"></scroll-bottom> -->
      </div>
    </div>
    <div class="checkallBox">
      <div class="checkall font999 border-top" :style="{bottom:account.applyAccountStatus == 'F' || account.applyAccountStatus == 'J'|| account.applyAccountStatus == 'C'?0:'2rem'}">
        <!-- <label for="checkAll">
                <input type="checkbox" @change="changeState" v-model="checkedAll" class="radio-input" id="checkAll">
                <div class="radio-core"></div>
        </label>全选-->
        <p class="total">
          合计：
          <em>{{ totalAmount }}</em>元
        </p>
      </div>
    </div>
    <foot-btn
      v-if="account.applyAccountStatus == '' || account.applyAccountStatus == 'E'"
      :text="footBtnText"
      @firstCli="firstClick"
      @lastCli="lastClick"
    ></foot-btn>
  </div>
</template>
<script>
import FootBtn from "../comm/FootBtn";
import LeftDel from "../comm/leftDel";
import { InfiniteScroll, Spinner } from "mint-ui";
import noData from "../comm/noData";
import { MessageBox } from "mint-ui";
import Api from "../../http/api";
import scrollBottom from "../comm/scrollBottom";
export default {
  name: "accList",
  components: {
    FootBtn,
    LeftDel,
    noData,
    scrollBottom
  },
  data() {
    return {
      initNum: 0,
      loading: false, // 是否继续加载，false代表还有数据，true为禁止加载
      totalPage: 1, // 请求总页数,判断可以上拉
      footBtnText: ["添加项目", "提交报账"], //底部按钮文字
      titlePrice: "15000.00", // 借款金额
      allPrice: 0, // 总价格
      noDataStatus: false, //暂无数据
      params: {
        rows: 10, //每页条数
        page: 0, //当前页
        tripNo: "",
        finsh: ""
      },
      account: {},
      trip:{},
      checkedAll: false, //全选按钮状态
      checkModel: [], //选中的数据的id
      list: [],
      postPay: [] //提交账单数据
    };
  },
  computed: {},
  methods: {
    loadAjax() {
      let params = {
        tripNo: this.$route.params.tripNo,
        guiderId: window.localStorage.getItem("guiderId")
      };
      this.axios
        .get(Api.AccList, { params: params })
        .then(response => {
          console.log(response);
          // this.list  = this.list.concat(response.data.accountDtls);
          this.list = response.data.accountDtls;
          this.account = response.data.account;
          this.trip = response.data.trip;
          if (this.list.length < 1) {
            this.noDataStatus = true;
          } else {
            this.noDataStatus = false;
          }
          // this.totalPage = response.data.data.list.totalPage;
          // this.isHaveMore();
        })
        .catch(error => {
          console.log(error);
        });
    },
    //全选按钮
    // changeState(item){
    //   this.checkModel=[];
    //   if(this.checkedAll==true){
    //     this.list.forEach(value=>{
    //       this.checkModel.push(value.itemId);
    //     })
    //   }
    // },
    loadMore() {
      this.params.page = parseInt(this.params.page) + 1;
      // if(!this.loading){
      //   this.loadAjax();
      // }
      this.loadAjax();
    },
    // isHaveMore(){
    //   this.loading = false;
    //   if(this.params.page >= this.totalPage){
    //     this.loading = true;
    //   }
    // },
    firstClick() {
      this.$router.push({
        name: "addAccount",
        params: { tripNo: this.params.tripNo, finsh: "0", add: "add" }
      });
    },
    //提交报账
    lastClick() {
      // if(this.postPay.length>0){
      //   let params = {
      //     tripNo:this.params.tripNo,
      //     proJson:JSON.stringify(this.postPay)
      //   }
      //   this.axios.post(Api.postAcc,this.$qs.stringify(params))
      //     .then(res=>{
      //         MessageBox.alert(res.data.message).then(action=>{
      //           if(res.data.success==true){
      //             this.list=[];
      //             this.params.page=1;
      //             this.loadAjax();
      //           }
      //         });
      //     })
      // }else{
      //   MessageBox.alert("请选中数据再提交");
      // }
      let params = {
        accountId: this.account.id
      };
      this.axios.post(Api.postAcc, this.$qs.stringify(params)).then(res => {
        MessageBox.alert(res.data.message).then(action => {
          if (res.data.success == true) {
            this.list = [];
            this.params.page = 1;
            this.loadAjax();
          }
        });
      });
    },
    //备注下拉
    slideDown(index) {
      this.preventDefault(event);
      let obj = document.querySelectorAll(".remark")[index];
      let linkon = obj.querySelector(".link-on");
      if ($(linkon).hasClass("checkon")) {
        $(linkon).removeClass("checkon");
        $(obj).removeClass("on");
      } else {
        $(obj).addClass("on");
        $(linkon).addClass("checkon");
      }
    },
    //删除按钮点击,子组键触发
    // delFun(id,item){
    //   let params={
    //       id:id,
    //       item:item
    //   }
    //   console.log(params)
    //   this.axios.post(Api.GuiderDel,this.$qs.stringify(params))
    //     .then(res=>{
    //       MessageBox.alert(res.data.message).then(action=>{
    //           console.log(res.data.success)
    //         if(res.data.success==true){
    //           this.list=[];
    //           this.params.page=1;
    //           this.loadAjax();
    //         }
    //       });
    //     })
    // },
    preventDefault(event) {
      const e = event;
      if (typeof e.preventDefault != "underfined") {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }
  },
  watch: {
    //监视选中的数据
    // checkModel:{
    //   handler(){
    //     //全选
    //     if(this.checkModel.length==this.list.length){
    //       this.checkedAll=true;
    //     }else{
    //       this.checkedAll=false
    //     }
    //     //计算总价格和提交报账的数据整合
    //     this.allPrice=0;
    //     this.postPay=[];
    //     this.checkModel.forEach(id=>{
    //         this.list.forEach(itemlist=>{
    //             if(id==itemlist.itemId){
    //               // let finalSum = itemlist.finalSum;
    //               let finalSum = itemlist.submitSum;
    //               this.allPrice+=finalSum;
    //               this.postPay.push({id:id,item:itemlist.item});
    //             }
    //         })
    //     })
    //     this.allPrice = this.allPrice.toFixed(2);
    //   }
    // }
  },
  computed: {
    totalAmount() {
      let total = 0;
      this.list.forEach((item, index) => {
        total += item.applyAudltAmount;
      });
      return total;
    }
  },
  mounted: function() {
    this.params.tripNo = this.$route.params.tripNo;
    this.params.finsh = this.$route.params.finsh;
  }
};
</script>
<style lang="scss" scoped>
.font999 {
  color: #999;
  font-size: 0.6rem;
}
$c333: #333;
$c-red: #fa5353;
$c-orange: #ffa018;
.list-box {
  // padding: 4rem 0 0.2rem;
  padding: 6rem 0 0.2rem;
}
.list {
  font-size: 0.6rem;
  color: $c333;

  header {
    height: 4rem;
    background: #fff;
    padding: 0.5rem;
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f0;
    position: fixed;
    width: 100%;
    top: 2rem;
    left: 0;
    z-index: 999;
    .title {
      padding-bottom: 0.5rem;
      overflow: hidden;

      em {
        float: right;
        font-size: 0.85rem;
        color: $c-orange;
      }
    }

    .bd {
      height: 1.5rem;
      line-height: 1.5rem;
      margin-top: 0.3rem;
      padding: 0 0.5rem;
      color: #333;
      font-size: 0.55rem;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;

      .bd-all {
        padding-right: 0.5rem;
        border-right: 1px solid #e1e1e1;
        span {
          font-size: 1rem;
          font-weight: 500;
        }
      }
      .bd-items {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;

        .items {
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
          text-align: center;
          line-height: 100%;
          p {
            padding: 0.1rem 0 0.25rem;
          }
          span {
            color: #999;
          }
        }
      }
    }
  }
  .checkallBox {
    width: 100%;
    height: 2rem;

    .checkall {
      height: 2rem;
      width: 100%;
      line-height: 2rem;
      background: #fff;
      padding: 0 0.5rem;
      box-sizing: border-box;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 2rem;
      border-top: 1px solid #f0f0f0;
      z-index: 999;

      .total {
        float: right;
        font-size: 0.6rem;
        color: $c333;

        em {
          color: $c-red;
          font-size: 0.7rem;
        }
      }
    }
  }
}
.right-content {
  display: inline-block;
  vertical-align: middle;
}
.vistor-list {
  background: #fff;
  padding: 0 0.5rem;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  box-sizing: border-box;
  margin-top: 0.2rem;
  width: 100%;
  .label-box {
    display: block;
    width: 100%;
    height: 100%;
  }
  .vistor-right {
    @extend .right-content;
    width: 89%;
    .top {
      color: #333;
      font-size: 0.6rem;
      line-height: 1.35rem;
    }
    .price {
      line-height: 2rem;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
      span {
        color: #999;
        font-size: 0.55rem;
        em {
          color: #fa5353;
          font-size: 0.7rem;
        }
      }
      .pricelink {
        width: 2.25rem;
        height: 1rem;
        color: #529cff;
        border: 1px solid #529cff;
        text-align: center;
        line-height: 1rem;
        font-size: 0.55rem;
        display: block;
        float: right;
        border-radius: 0.5rem;
        margin-top: 0.45rem;
      }
    }
    .bottom-info {
      line-height: 1.6rem;
      overflow: hidden;
      span {
        float: left;
        display: block;
        width: 50%;
        color: #999;
        font-size: 0.55rem;
      }
    }
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
.remark {
  font-size: 0.55rem;
  color: #999;
  border-top: 1px solid #f0f0f0;
  padding: 0.3rem 0.7rem 0.3rem 0;
  position: relative;
  line-height: 0.8rem;
  max-height: 0.8rem;
  overflow: hidden;
  transition: all 0.3s;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.remark.on {
  max-height: 10rem;
  text-overflow: inherit;
  white-space: inherit;
}
.link-on:after {
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  -ms-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}
.checkon:after {
  transform: rotate(-45deg);
}
</style>

