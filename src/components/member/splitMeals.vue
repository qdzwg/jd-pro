<template>
  <div class="splitMeals">
    <mt-header title="分车分餐" style="width:100%; background:#313131;position:fixed;top:0;left:0;z-index:10">
      <mt-button slot="left" icon="back" @click="routerBack">返回</mt-button>
    </mt-header>
    <div class="content" style="margin-top:2rem;">
      <mt-field :readonly="true" label="船号">
        <el-select size="small" v-model="form.shipNo" placeholder="请选择船号">
          <el-option
            v-for=" item in ui.shipList"
            :key="item.shipNo"
            :label="item.shipNo"
            :value="item.shipNo">
          </el-option>
        </el-select>
      </mt-field>
      <mt-field :readonly="true" label="班次">
        <el-select size="small" v-model="form.carSchedules" placeholder="请选择班次">
          <el-option
            v-for=" item in ui.timeList"
            :key="item.dictDetailCode"
            :label="item.dictDetailName"
            :value="item.dictDetailValue"
           >
          </el-option>
        </el-select>
      </mt-field>
      <mt-field :readonly="true" label="线路">
        <el-select size="small" v-model="form.routeId" placeholder="请选择线路">
          <el-option
            v-for=" item in ui.pdtList"
            :key="item.id"
            :label="item.productName"
            :value="item.id">
          </el-option>
        </el-select>
      </mt-field>
      <mt-field :readonly="true" label="日期">
        <el-date-picker
          v-model="form.useDate"  size="small"
          type="date"
          style="width: 200px;"
          placeholder="请选择日期">
        </el-date-picker>
      </mt-field>
    </div>
    <div class="title2">分餐</div>
    <div class="content content-bot">
      <mt-field :readonly="true" label="开始桌号">
        <el-input-number size="small" :min="1" placeholder="Please input" v-model="form.beginDesk"></el-input-number>
      </mt-field>
      <mt-field :readonly="true" label="结束桌号">
        <el-input-number size="small" :min="1" placeholder="Please input" v-model="form.endDesk"></el-input-number>
      </mt-field>
      <mt-field :readonly="true" label="每桌人数">
        <el-input-number size="small" :min="1" placeholder="Please input" v-model="form.customers"></el-input-number>
      </mt-field>
      <div class="con-diog" v-if="diogShow" v-for="(item,index) in tableNo2 " :key="index">
        <div class="btn-dell" @click="dell(index)">x</div>
        {{ item}}
      </div>
      <div class="clf"></div>
    </div>
    <div class="title2">分车</div>
    <div class="content content-bot">
      <mt-field label="车牌号" v-model="carNo"></mt-field>
      <mt-field label="座位数" v-model="seatings">
        <mt-button type="primary" size="small" @click="addCar">添加车</mt-button>
      </mt-field>
      <div class="con-diog" v-if="diogShow" v-for="(item,index) in carNo2 " :key="index">
        <div class="btn-dell" @click="dell2(index)">x</div>
        {{ item}}
      </div>
      <div class="clf"></div>
    </div>
    <div class="btn-con">
      <mt-button type="primary" @click="setShip" v-if="ui.assignAble">分车分餐</mt-button>
    </div>
  </div>
</template>

<script>
  import {MessageBox} from 'mint-ui'
  import BaseSelect from './baseSelect'
  import API from '../../http/api'

  export default {
    name: 'splitMeals',
    components: {
      BaseSelect
    },
    data() {
      return {
        form: {
          beginDesk: 1,
          endDesk: 10,
          customers: 12,
          shipNo:'',
          useDate: new Date(),
          routeId:"",
          carSchedules:"",
          carNo:"",
        },
        ui:{
          //船号
          shipList:[],
          //班次
          timeList:[],
          //线路产品
          pdtList:[],
          //是否可以分车分餐
          assignAble:true,
        },
        params:{
          status:0,
          pid:null,
        },
        reAssign:{
          parentAssign:{},
          yes:false,
        },

        shipNumber: "", //船号
        tableNo: "",    //输入桌号
        tableNo2: [],   //桌号总数
        customers: "",  //每桌人数
        carNo: "",      //输入车牌号
        carNo2: [],     //车牌号总数
        seatings: "",   //输入车座位数
        seatings2: [],  //对应车、座位总数
        diogShow: false,
        list: [],       //船班次{}
        projectName: {  //随子组件的选择值改变而改变的值
          key: "",
          value: ""
        },
        widthData: "100%",
        widthData2: "8.6rem",
      }
    },
    mounted() {
      this.onCreateResign();
      this.getdict();
    },
    methods: {
      routerBack() {
        this.$router.back(-1);
      },
      //监听select改变
      showProject() {
        console.log("下拉列表的值改变了");
        console.log("213122" + this.projectName.value);
        console.log("213122" + this.projectName.key);
      },
      //获取班次
      getdict() {
        let that = this;
        this.axios.get(API.SHIP).then(function (res) {
          that.ui.shipList = res.data.shipList;
          that.ui.timeList = res.data.shipTimeList;
          that.ui.pdtList = res.data.pdtList;
        })
      },
      //添加桌号
      addtableNo() {
        if (this.tableNo != '' && this.customers != '') {
          this.diogShow = true
          this.tableNo2.push(this.tableNo)
          this.tableNo = ''
        }
      },
      //添加车
      addCar() {
        if (this.carNo != '' && this.seatings != '') {
          this.diogShow = true
          this.carNo2.push(this.carNo)
          this.seatings2.push(this.seatings)
          this.carNo = ''
          this.seatings = ''
        }
      },
      carNosToParamCarNoStr(){
        let carNoStr = "";
        if (this.carNo2!=null && this.seatings2!=null){
          for (let i = 0; i < this.carNo2.length; i++) {
            let carN = this.carNo2[i];
            carNoStr += carN +"-" + this.seatings2[i] + ","
          }
        }
        this.form.carNo = carNoStr;
        return carNoStr;
      },
      //删除桌号
      dell(i) {
        this.tableNo2.splice(i, 1)
      },
      //删除车和对应座位号
      dell2(i) {
        this.carNo2.splice(i, 1)
        this.seatings2.splice(i, 1)
      },
      //分车分餐
      setShip() {
        let that = this;
        let params = this.form;
        params.carNo = this.carNosToParamCarNoStr();
        if (this.params.pid){
          // 如果上一个页面带来pid参数，则赋值给assignId
          params.assignId = this.params.pid;
        }
        console.log(params);
        this.axios.post(API.ASSIGN, this.$qs.stringify(params))
          .then(function (res) {
            if (res.data.code == 200 && res.data.success) {
              setTimeout(function () {
                that.$router.push({path: '/sendMsg', query: {status: 2}})
              }, 500)
            } else {
              MessageBox('提示', res.data.message);
            }
          })
      },
      onCreateResign(){
        this.params = this.$route.query;
        if (this.params && this.params.status==3 && this.params.pid){
          let that = this;
          this.axios.get(API.GET_ASSIGN,{params: {id: this.params.pid}}).then(function (res) {
            if (res.data.success) {that.reAssign.parentAssign=res.data.data}
            that.form.shipNo = that.reAssign.parentAssign.shipNo
            that.form.useDate = that.reAssign.parentAssign.useDate
            that.form.carSchedules = that.reAssign.parentAssign.carSchedules
            that.form.routeId = that.reAssign.parentAssign.routeId;
            if ("send"===that.reAssign.parentAssign.msgStatus){
              that.ui.assignAble = false;
              MessageBox('提示', "已发送过短信\n 无法重新分车分餐");
            }
          })
        }
      }
    }
  }
</script>


<style lang="scss">

  .splitMeals {
    width : 100%;

    .content {
      width       : 90%;
      min-height  : 5rem;
      padding-top : .5rem;
      margin      : 0 auto;
      color       : #333;
      .con-diog {
        // width:1rem;
        // height:.5rem;
        padding       : .3rem;
        float         : left;
        font-size     : 13px;
        margin        : .25rem 1rem 0 0;
        // line-height: .5rem;
        text-align    : center;
        border        : 1px solid #333;
        border-radius : 1rem;
        position      : relative;
        .btn-dell {
          position         : absolute;
          top              : -6px;
          right            : -6px;
          color            : #fff;
          width            : .8rem;
          height           : .8rem;
          line-height      : .65rem;
          text-align       : center;
          font-size        : 10px;
          border-radius    : 50%;
          background-color : #f40;
        }
      }
    }
    .content-bot {
      min-height : 7rem;
    }
    .title2 {
      width            : 100%;
      height           : 1.5rem;
      font-size        : .7rem;
      line-height      : 1.5rem;
      color            : #333;
      background-color : #ddd;
      text-align       : center;
    }
    .btn-con {
      width  : 90%;
      margin : .3rem auto;
      button {
        width : 100%;
      }
    }
  }

</style>


