<template>
  <div class="add-box">
    <div class="item-box">
      <label>类型</label>
      <input class="info" type="text" v-model="accountDtlData.feeTypeName" readonly />
    </div>
    <div class="item-box">
      <label>线路</label>
      <input class="info" type="text" v-model="accountDtlData.routeName" readonly />
    </div>
    <div class="item-box">
      <label>项目</label>
      <input class="info" type="text" v-model="accountDtlData.corpName" readonly />
    </div>

    <div class="item-box">
      <label>成人单价</label>

      <input class="info" type="number" v-model="accountDtlData.audltPrice" readonly />
    </div>
    <div class="item-box">
      <label>成人数量</label>
      <input class="info" type="number" v-model="accountDtlData.audltNum" readonly />
    </div>
    <div class="item-box">
      <label>儿童单价</label>
      <input class="info" type="number" v-model="accountDtlData.childPrice" readonly />
    </div>
    <div class="item-box">
      <label>儿童数量</label>
      <input class="info" type="number" v-model="accountDtlData.childNum" readonly />
    </div>
    <div class="item-box">
      <label>预计金额</label>
      <input class="info" type="number" v-model="accountDtlData.exceptPrice" readonly />
    </div>
    <!-- <div class="item-box">
      <label>儿童预计金额</label>
      <input class="info" type="number" v-model="accountDtlData.childAmount" readonly />
    </div> -->
    <div class="item-box">
      <label>报账金额</label>
      <input class="info" type="number" v-model="accountDtlData.applyAudltAmount" />
    </div>
    <!-- <div class="item-box">
      <label>儿童报账金额</label>
      <input class="info" type="number" v-model="accountDtlData.applyChildAmount" />
    </div> -->
    <div class="item-box">
      <label>支付方式</label>
      <input class="info" type="text" v-model="accountDtlData.payType" readonly />
    </div>
    <div class="item-box">
      <label>备注</label>
      <textarea class="info textarea" :maxlength="200" v-model="accountDtlData.remark"></textarea>
    </div>

    <div class="big-blue-box">
      <mt-button type="primary" size="large" @click="submitForm">保存</mt-button>
    </div>
  </div>
</template>
<script>
import { Picker } from "mint-ui";
import { Button } from "mint-ui";
import { MessageBox } from "mint-ui";
import validation from "../../assets/js/validation.js";
import API from "../../http/api.js";
export default {
  data() {
    return {
      accountDtlData: {}
    };
  },
  methods: {
    submitForm() {
        let params = {
            id: this.accountDtlData.id,
            applyAudltAmount: this.accountDtlData.applyAudltAmount,
            // applyChildAmount: this.accountDtlData.applyChildAmount,
            remark: this.accountDtlData.remark
        }
      this.axios
        .post(API.updateAccountDtl, this.$qs.stringify(params))
        .then(res => {
          if (res.data.success) {
            MessageBox.alert(res.data.message).then(action=>{
                if(res.data.success==true){
                    this.$router.push('/guiderAccant?ids='+this.$route.query.fId);
                }
            });
          }
        });
    }
  },
  mounted() {
    let aId = this.$route.query.id;
    this.axios
      .post(API.queryAccountDtl, this.$qs.stringify({ accountDtlId: aId }))
      .then(res => {
        if (res.data.success) {
          this.accountDtlData = res.data.accountDtl;
          // this.list = res.data.accountDtlVoList;
          // this.account = res.data.account;
        }
      });
  }
};
</script>
<style lang="scss">
.add-box {
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
  margin-top: 2.2rem;
  .item-box {
    width: 100%;
    border: 1px solid #e5e7e7;
    background: #fff;
    padding: 0 0.4rem;
    box-sizing: border-box;
    margin-bottom: 0.4rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: relative;
    label {
      display: inline-block;
      width: 4rem;
      line-height: 1.75rem;
      color: #bbb;
      font-size: 0.6rem;
    }
    .info {
      box-sizing: border-box;
      flex: 1;
      border: 0;
      color: #333;
      font-size: 0.6rem;
      background: transparent;
      height: 1.75rem;
    }
    .info.textarea {
      padding: 0.4rem 0;
      min-height: 4rem;
    }
  }
}
.bottom-on:after {
  right: 0.5rem;
}
.big-blue-box {
  margin-top: 0.75rem;
}
.item-box .info[readonly] {
  color: #bbb !important;
}
</style>
