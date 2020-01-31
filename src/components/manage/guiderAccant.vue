<template>
  <div>
    <div class="title">
      <!-- <label for="checkAll">
        <input
          type="checkbox"
          @change="changeState"
          v-model="checkedAll"
          class="radio-input"
          id="checkAll"
        />
      <div class="radio-core"></div>-->
      <span>总人数：{{ totalNum }}人，其中成人{{audltNum}}人，儿童{{childNum}}</span>
      <!-- </label> -->
    </div>

    <keep-alive>
      <div class="scrollList">
        <div>
          <div
            class="vistor-list"
            v-for="(item,index) in list"
            :key="index"            
          >
            <!-- <label :for="index" class="label-box">
              <input
                type="checkbox"
                :value="item.id"
                v-model="checkModel"
                :id="index"
                class="radio-input"
            />-->

            <!-- <div class="radio-core"></div> -->
            <div class="vistor-right">
              <a class="info-more">
                <div class="top">
                  <span v-if="item.feeTypeName&&item.feeTypeName!=''">
                    {{item.feeTypeName}}：
                    <em>{{item.corpName}}</em>
                  </span>
                </div>
                <div class="info">
                  <p v-if="item.exceptPrice&&item.exceptPrice!=''">
                    <em>预计金额：</em>
                    {{item.exceptPrice}}
                  </p>
                  <!-- <p v-if="item.childPrice&&item.childPrice!=''">
                    <em>预计金额（儿童）：</em>
                    {{item.childPrice}}
                  </p> -->
                  <p>
                    <em>备注：</em>
                    {{item.remark?item.remark:'无'}}
                  </p>
                </div>
              </a>
              <div class="visitor-right-r">
                <div class="r-info">
                  <p>{{item.submitPrice}}</p>
                  <p class="edit-button" v-if="item.applyAccountStatus==''||item.applyAccountStatus=='E'">
                    <button @click="goToEdit(item.id)">修改</button>
                  </p>
                </div>
              </div>
            </div>
            <!-- </label> -->
          </div>
        </div>
      </div>
    </keep-alive>
    <div class="submit-acc">
      <div class="submit-acc-main">
        <p>总计：{{totalAmount}}</p>
        <button @click="goAccant" v-if="status">提交报账</button>
      </div>
      
    </div>
  </div>
</template>
<script>
import { MessageBox, InfiniteScroll } from "mint-ui";
import API from "../../http/api.js";

import common from "../../assets/js/public.js";
import validation from "../../assets/js/validation.js";
export default {
  data() {
    return {
      checkedAll: false, //全选按钮状态
      checkModel: [], //选中的数据的id
      mobiles: [],
      list: [],
      status: false,      
      childNum: 0,
      audltNum: 0,
      totalNum: 0
      // totalAmount: 0
    };
  },
  mounted() {
    
    this.axios
      .post(
        API.queryAccountDtlList,
        this.$qs.stringify({ ids: this.$route.query.ids })
      )
      .then(res => {
        if (res.data.success) {
          // this.list = res.data.accountDtlVoList;
          let totalNum = 0, audltNum = 0, childNum = 0, arr = [];
          // res.data.accountDtos.forEach((item,index)=>{
          //   let accountDtlVoList = item.accountDtlVoList;
          //   totalNum += item.totalNum
          //   audltNum += item.audltNum
          //   childNum += item.childNum
          //   accountDtlVoList.forEach((it, ind)=>{
          //     accountDtlVoList[index].applyAccountStatus = item.applyAccountStatus;
          //     arr.push(it);
          //   })
          // });
          for(let i = 0; i < res.data.accountDtos.length; i++){
            totalNum += res.data.accountDtos[i].totalNum
            audltNum += res.data.accountDtos[i].audltNum
            childNum += res.data.accountDtos[i].childNum
            for(let j = 0; j < res.data.accountDtos[i].accountDtlVoList.length; j++){
              res.data.accountDtos[i].accountDtlVoList[j].applyAccountStatus = res.data.accountDtos[i].applyAccountStatus;
              arr.push(res.data.accountDtos[i].accountDtlVoList[j]);
            } 
          }
          // console.log('arr', arr);
          this.list = arr;
          res.data.accountDtos.forEach(item => {
            if(item.applyAccountStatus == 'E' || item.applyAccountStatus == ''){
              this.status = true;
              return;
            }
          })
               
          console.log('vdvsdvsd',this.list);
          this.totalNum = totalNum
          this.audltNum = audltNum
          this.childNum = childNum        
        }
      });
  },
  methods: {
    //全选按钮
    changeState(item) {
      this.checkModel = [];
      // this.mobiles = [];
      if (this.checkedAll == true) {
        this.list.forEach(value => {
          this.checkModel.push(value.id);
        });
      }
    },
    goToEdit(id) {
      this.$router.push(
        "/accantEdit?id=" + id +"&fId=" + this.$route.query.ids
      );
    },

    //提交报账
    goAccant() {
      // if (validation.checkArrLen(this.checkModel)) {
      //   MessageBox.confirm("", {
      //     message: "确定报账嘛？"
      //   }).then(action => {
      //     if (action == "confirm") {
      //       this.axios
      //         .post(
      //           API.submitAccount,
      //           this.$qs.stringify({ guiderAmountId: this.$route.query.id })
      //         )
      //         .then(res => {
      //           if (res.data.success) {
      //             MessageBox.alert(res.data.message).then(action => {
      //               if (res.data.success == true) {
      //                 // this.$router.push('/guiderAccant?status='+this.$route.query.status+'&id='+this.$route.query.fId);
      //               }
      //             });
      //           }
      //         });
      //     }
      //   });
      // } else {
      //   common.showToast("请选择报账项!", 1500);
      // }
      this.axios
        .post(
          API.submitAccount,
          this.$qs.stringify({ ids: this.$route.query.ids })
        )
        .then(res => {
          if (res.data.success) {
            MessageBox.alert(res.data.message).then(action => {
              if (res.data.success == true) {
                this.$router.push('/');
              }
            });
          }
        });
    }
  },
  computed: {
    totalAmount() {
      let total = 0;
      this.list.forEach((item, index) => {
        total += item.submitPrice;
      });
      return total.toFixed(2);
    }
  },
  watch: {
    //监视选中的数据
    // checkModel: {
    //   handler() {
    //     if (this.checkModel.length == this.list.length) {
    //       this.checkedAll = true;
    //     } else {
    //       this.checkedAll = false;
    //     }
    //   }
    // },
    // totalAmount: {
    //   handler: function(val) {
    //     this.totalAmount = val;
    //   },
    //   immediate: true
    // }
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
  span {
    padding-left: 0.5rem;
  }
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
  width: 7.5rem;
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
.visitor-right-r {
  display: inline-block;
  vertical-align: top;
  margin-top: 1rem;
  margin-left: 1rem;
  width: 4.5rem;
  .r-info {
    p {
      font-size: 0.6rem;
      text-align: center;
    }
  }
  .edit-button {
    button {
      width: 2.5rem;
      height: 1rem;
      line-height: 1rem;
      background-color: #ffab2e;
      border: none;
      outline: none;
      color: #fff;
      margin-top: 0.5rem;
      border-radius: 0.15rem;
      cursor: pointer;
    }
  }
}
.submit-acc {  
  margin-top: 3rem;
  .submit-acc-main{
    text-align: right;
    position: fixed;
    bottom: 0;
    right: 0;
    height: 3rem;
    background-color: #fff;
    width: 100%;
    button {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      -webkit-appearance: none;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      -webkit-transition: 0.1s;
      transition: 0.1s;
      font-weight: 500;
      padding: 12px 20px;
      font-size: 14px;
      border-radius: 4px;
      background-color: #ffab2e;
      color: #fff;
      border: none;
      outline: none;
    }
    p {
      font-size: 0.6rem;
      text-align: right;
      padding-right: 0.25rem;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }
  }
  
}
</style>
