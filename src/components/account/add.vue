<template>
  <div class="add-box">
    <div class="item-box link-on bottom bottom-on" v-if="cz=='add'">
      <label>项目</label>
      <input class="info" type="text" @click="showLayer" v-model="change.changeValue" readonly />
    </div>
    <div class="item-box" v-if="cz=='updata'">
      <label>项目</label>
      <input class="info" type="text" v-model="change.changeValue" readonly />
    </div>
    <div class="item-box" v-if="cz=='add'">
      <label>名称</label>
      <input class="info" type="text" v-model="form['corpName']" />
    </div>
    <div class="item-box" v-if="cz=='updata'">
      <label>名称</label>
      <input class="info" type="text" v-model="form['corpName']" readonly/>
    </div>
    <div class="item-box">
      <label>单价</label>
      <input class="info" type="number" v-model="form['audltPrice']" />
    </div>
    <div class="item-box">
      <label>数量</label>

      <input
        class="info"
        type="number"
        v-model="form['audltNum']"
        onkeyup="this.value=this.value.replace(/\D/g,'')"
        onafterpaste="this.value=this.value.replace(/\D/g,'')"
      />
    </div>
    <div class="item-box">
      <label>备注</label>
      <textarea class="info textarea" :maxlength="200" v-model="form['remark']"></textarea>
    </div>
    <div class="big-blue-box" v-if="$route.params.add=='add'" @click="addFun">
      <mt-button type="primary" size="large">添加</mt-button>
    </div>
    <div class="big-blue-box" v-if="$route.params.add=='updata'" @click="addFun">
      <mt-button type="primary" size="large">保存</mt-button>
    </div>
    <transition name="slide">
      <mt-picker
        :slots="slots"
        :showToolbar="showToolbar"
        @change="onValuesChange"
        valueKey="feeTypeName"
        class="changeItem"
        v-if="layerShow"
      >
        <div class="btn-box">
          <div @click="yesClick" class="sureBtn layerBtn">确定</div>
          <div @click="layerShow=!layerShow" class="sacleBtn layerBtn">取消</div>
        </div>
      </mt-picker>
    </transition>
    <div class="mask" v-if="layerShow" @click="layerShow=!layerShow"></div>
  </div>
</template>
<script>
import { Picker } from "mint-ui";
import { Button } from "mint-ui";
import { MessageBox } from "mint-ui";
import validation from "../../assets/js/validation.js";
import Api from "../../http/api";

export default {
  name: "addAccount",
  data() {
    return {
      layerShow: false, //下拉框是否显示
      showToolbar: true, //下拉框头部按钮
      slots: [{ values: [] }], //下拉框数据
      finsh: 0,
      cz: '',
      change: {
        name: "",
        changeValue: "",
        corpName: '',
        feeType: "",
        audltNum: "",
        audltPrice: "",
        remark: ""
      },
      form: {
        tripNo: "",
        corpId: "",
        feeType: "",
        audltNum: "1",
        audltPrice: "",
        remark: "",
        corpName: "",
        guiderId: window.localStorage.getItem("guiderId")
      }
    };
  },
  methods: {
    showLayer() {
      this.layerShow = !this.layerShow;
      let e = event.target;
      e.blur();
    },
    onValuesChange(picker, values) {
      //选择项目时记录值
      this.change.changeValue = values[0].feeTypeName;
      this.change.corpName = values[0].corpName;
      this.change.feeType = values[0].feeType;
      this.change.corpId = values[0].corpId;
      this.change.audltNum = values[0].audltNum;
      this.change.audltPrice = values[0].audltPrice;
      this.change.remark = values[0].remark;
      // console.log(this.change.item);
    },
    yesClick() {
      //确定按钮的点击
      this.form["corpName"] = this.change.corpName;
      this.form["corpId"] = this.change.corpId;
      this.form["feeType"] = this.change.feeType;
      this.form["audltNum"] = this.change.audltNum;
      this.form["audltPrice"] = this.change.audltPrice;
      this.form["remark"] = this.change.remark;
      this.layerShow = !this.layerShow;
    },
    Validate() {
      let audltPrice =
        this.form["audltPrice"] == undefined
          ? ""
          : this.form["audltPrice"].toString();
      let audltNum =
        this.form["audltNum"] == undefined
          ? ""
          : this.form["audltNum"].toString();
      if (validation.isEmpty(this.form["corpName"])) {
        MessageBox.alert("请输入名称");
        return false;
      } else if (validation.isEmpty(audltPrice)) {
        MessageBox.alert("请输入价格");
        return false;
      } else if (validation.isEmpty(audltNum)) {
        MessageBox.alert("请输入数量");
        return false;
      } else {
        return true;
      }
    },
    addFun() {
      //添加按钮点击
      if (this.Validate()) {
        if(this.cz == 'add'){
          this.axios
          .post(Api.GuiderPay, this.$qs.stringify(this.form))
          .then(res => {
            console.log(res);
            MessageBox.alert(res.data.message).then(action => {
              if (res.data.success == true) {
                this.$router.push({
                  name: "AccList",
                  params: { tripNo: this.form.tripNo, finsh: "2" }
                });
              }
            });
          });
        }else{
          this.form = Object.assign(this.form, {id: this.$route.params.id})
          this.axios
          .post(Api.GuiderEdit, this.$qs.stringify(this.form))
          .then(res => {
            // console.log(res);
            MessageBox.alert(res.data.message).then(action => {
              if (res.data.success == true) {
                this.$router.push({
                  name: "AccList",
                  params: { tripNo: this.form.tripNo, finsh: "2" }
                });
              }
            });
          });
        }
        // console.log(this.form);        
      }
    }
  },
  mounted() {
    let tripNo = this.$route.params.tripNo;
    let finsh = this.$route.params.finsh;
    this.form.tripNo = tripNo;
    this.finsh = finsh;
    this.cz = this.$route.params.add;
    if (this.$route.params.add == "add") {
      let params = {
        tripNo: tripNo,
        finsh: finsh,
        guiderId: localStorage.getItem("guiderId")
      };
      this.axios.post(Api.proList, this.$qs.stringify(params)).then(res => {
        this.slots[0].values = res.data.accountProjects;
       
      });
    } else {
      let accountDtlId = this.$route.params.id;
      let params = {
        accountDtlId: accountDtlId
      };
      this.axios.post(Api.eidtList, this.$qs.stringify(params)).then(res => {
        console.log("res", res);
        let accountDtl = res.data.accountDtl;
        this.change.changeValue = accountDtl.feeTypeName;
        this.form['corpName'] = accountDtl.corpName;
        this.form['audltPrice'] = accountDtl.audltPrice;
        this.form['audltNum'] = accountDtl.audltNum;
        this.form['remark'] = accountDtl.remark;
        // this.slots[0].values = res.data.accountDtl;
        // let list = res.data.accountDtl;
        // if (list) {
        //   for (let i = 0; i < list.length; i++) {
            
        //     if (accountDtlId === list[i].itemId && itemId) {
        //       //初始化第一个选项的值;
        //       this.change.changeValue = list[i].itemName;
        //       this.form["itemName"] = list[i].itemName;
        //       this.form["itemId"] = list[i].itemId;
        //       this.form["item"] = list[i].item;
        //       this.form["billSum"] = list[i].billSum - list[i].freeNum;
        //       // this.form['billSum'] = list[i].billSum;
        //       this.form["price"] = list[i].price;
        //       this.form["remarks"] = list[i].remarks;
        //       // console.log('1',this.form);
        //     }
        //   }
        // }
      });
    }
  }
};
</script>
<style lang="scss">
.add-box {
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
  margin-top: 0.75rem;
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
      width: 2rem;
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
// .item-box + .item-box .info[readonly] {
//   color: #bbb !important;
// }
.item-box .info[readonly] {
  color: #bbb !important;
}
</style>
