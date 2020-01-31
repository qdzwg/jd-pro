<template>
  <div class="template">
    <div class="planlist">
      <div class="screen">
        <div class="screen_item" @click="openPickerEnd">
          <input type="text" placeholder="请选择日期" v-model="guiderDate" class="screen-date" />
        </div>
        <div class="screen_item">
          <!-- <select v-model="classTime" @change="selectBc">
            <option v-for="(item, index) in shipTimeList" :key="index">{{item.dictDetailValue}}</option>
          </select>  -->
          <select v-model="classTime">
            <option v-for="(item, index) in shipTimeList" :key="index">{{item.dictDetailValue}}</option>
          </select>            
        </div>
        <div class="screen_item">
          <!-- <select @change="selectSxs">
            <option v-for="(item, index) in tripTypeList" :key="index">{{item.value}}</option>
          </select> -->
          <select v-model="tripType">
            <option v-for="(item, index) in tripTypeList" :key="index">{{item.value}}</option>
          </select>
        </div>
      </div>
      <div class="content">
        <div class="ship-name" v-if="ship.shipName">{{ship.shipName}}</div>
        <ul v-if="guiderInfoArr&&guiderInfoArr.length&&guiderInfoArr.length>0">
          <li v-for="(item, index) in guiderInfoArr" :key="index" @click="gotoDetail(item.tripNo,item.guiderId)">
            <h4>{{item.guiderName}}</h4>
            <p>所带线路：{{item.routeName}}</p>
            <p>
              票类信息：
              <span
                v-for="(it, ind) in item.visitorTktInfoVos"
                :key="ind"
              >{{it.tktName}}：{{it.amount}}</span>
            </p>
            <p>总代收：{{item.dsFee}}元</p>
          </li>
        </ul>
        <div v-else class="no-data">暂无导游信息</div>
     
      </div>
    </div>
    <!--日期选择-->
    <mt-datetime-picker
      ref="pickerEnd"
      type="date"
      :startDate=startDate
      :endDate=endDate
      year-format="{value}"
      month-format="{value}"
      date-format="{value}"
      @confirm="endOver"
    ></mt-datetime-picker>

    <div class="accant-btn" v-if="accounts.length">
      <el-button v-if="applyAccountStatus" @click="goToAccant()">报账</el-button>
      <el-button v-else @click="goToAccant()">查看报账</el-button>
    </div>
  </div>
</template>
<script>
import Api from "../../http/api";
import { MessageBox } from "mint-ui";
import { InfiniteScroll, Spinner } from "mint-ui";
export default {
  name: "planDetails",
  data() {
    return {
      guiderInfoArr: [],
      guiderDate: "",
      classTime: "",
      tripType: "",
      month: "",
      day: "",
      startDate: new Date(new Date().getFullYear() - 10, new Date().getMonth(), new Date().getDate()),
      endDate: new Date(new Date().getFullYear() + 10, 11, 31),
      tripTypeList: [
        {
          key: "up",
          value: "上水"
        },
        {
          key: "down",
          value: "下水"
        }
      ],
      shipTimeList: [],
      account: {},
      ship: {},
      accounts: [],
      applyAccountStatus: false,
      ids: []
    };
  },
  mounted() {
    let _date = new Date(), _year = _date.getFullYear(), _month = (_date.getMonth()+1) < 10 ? '0' + (_date.getMonth()+1) : _date.getMonth()+1, _day = _date.getDate();
    
    this.guiderDate = _year + '-' + _month + '-' + _day;
    this.axios
      .get(Api.GuiderInfo, {})
      .then(res => {
        if (res.data.success) {         
          this.shipTimeList = res.data.shipTimeList;
        } else {
          MessageBox("错误", res.data.message ? res.data.message : "系统异常");
        }
      })
      .catch(err => {
        MessageBox.alert(err);
      });
  },
  watch: {
    classTime() {
      if(this.tripType!=''&&this.guiderDate!=''){
        this.getData();
      }      
    },
    tripType() {
      if(this.classTime!=''&&this.guiderDate!=''){
        this.getData();
      }      
    }
  },
  methods: {
    getData() {
      let params = {
        useDate: this.guiderDate,
        classTime: this.classTime,
        tripType: this.tripType == '上水' ? 'up' : 'down',
        guiderId: window.localStorage.getItem('guiderId')
      };
      this.axios
        .post(Api.queryAccount, this.$qs.stringify(params))
        .then(res => {
          if (res.data.success) {
            this.guiderInfoArr = res.data.guiders;
            this.ship = res.data.ship;
            this.accounts = res.data.accounts;
            let ids = [];
            this.accounts.forEach(item=> {
              ids.push(item.id);
              if(item.applyAccountStatus == 'E' || item.applyAccountStatus == ''){
                this.applyAccountStatus = true;
                return;
              }
            });
            this.ids = ids.join(',');
            console.log(this.ids);
          } else {
            MessageBox(
              "错误",
              res.data.message ? res.data.message : "系统异常"
            );
          }
        })
        .catch(err => {
          MessageBox.alert(err);
        });
    },
    openPickerEnd() {
      this.$refs.pickerEnd.open();
    },
    time(s) {
      return +s < 10 ? "0" + s : s;
    },
    dateChange(date) {
      date = new Date(date);
      let year = date.getFullYear(),
        month = this.time(date.getMonth() + 1),
        day = this.time(date.getDate());
      return year + "-" + month + "-" + day;
    },
    endOver(value) {
      this.guiderDate = this.dateChange(value);
      if(this.classTime!=''&&this.tripType!=''){
        this.getData();
      }     
      // this.getData();
    },
    goToAccant() {
      this.$router.push('/guiderAccant?ids='+this.ids);
    },
    gotoDetail(tripNo,guiderId) {
      this.$router.push('/planDetails/'+tripNo+'/0?guiderId='+guiderId);
    }
    // selectBc(val) {
    //   this.classTime = val.target.value;
    //   this.getData();
    // },
    // selectSxs(val) {
    //   this.tripType = val.target.value == '上水' ? 'up' :'down';
    //   this.getData();
    //   console.log(val);
    // }
  }
};
</script>
<style scoped lang="scss">
.planlist {
  padding: 0 0.5rem;
  background: #fff;
  margin-top: 0.25rem;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-top: 2rem;
  .title {
    border-bottom: 1px solid #f0f0f0;
    line-height: 1.75rem;
    position: relative;
    span {
      color: #666;
      font-size: 0.6rem;
    }
    h4 {
      font-size: 0.8rem;
      color: #333;
      font-weight: normal;
    }
  }
  .content {
    .no-data {
      padding: 1rem 0;
      font-size: 0.6rem;
      text-align: center;
    }
    h4 {
      font-size: 0.6rem;
      color: #333;
      font-weight: normal;
      // line-height: 1.5rem;
    }
    ul {
      overflow: hidden;
      padding-bottom: 0.35rem;
      li {
        //   float: left;
        //   width:50%;
        color: #999;
        font-size: 0.4rem;
        line-height: 1rem;
        padding-left: 0.5rem;
        box-sizing: border-box;
      }
    }
    .ship-name{
      text-align: center;
      font-size: 0.75rem;
      margin: 0.5rem 0;
    }
  }
  .travel {
    color: #999;
    font-size: 0.6rem;
    line-height: 2rem;
    text-align: right;
    .outbtn {
      width: 3.5rem;
      height: 1.25rem;
      border: 1px solid #c2c2c2;
      font-size: 0.6rem;
      line-height: 2;
      text-align: center;
      border-radius: 0.625rem;
      box-sizing: border-box;
      margin: 0.35rem 0;
      display: inline-block;
    }
    .outbtn.on {
      background: #ffab2e;
      color: #fff;
      border: 1px solid #ffab2e;
    }
  }
}
.planlist.onetit {
  height: 2rem;
  .title {
    border: 0;
    line-height: 2rem;
    display: block;
    h4 {
      font-size: 0.7rem;
      display: inline-block;
    }
    span {
      float: right;
      margin-right: 15px;
      color: #529cff;
    }
  }
}
.out-btn {
  width: 100%;
  height: 2rem;
  line-height: 2rem;
  color: #fa5353;
  font-size: 0.7rem;
  text-align: center;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  margin-top: 0.5rem;
}
.footer-btn-box {
  height: 2rem;
  width: 100%;
}
.footer-btn {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 89;
  width: 100%;
  .btn {
    height: 2rem;
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    font-size: 0.7rem;
    text-align: center;
    line-height: 2rem;
    background: #fff;
    color: #529cff;
  }
  .send-btn.btn {
    background: #ffab2e;
    color: #fff;
  }
}
.screen {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  z-index: 500;
  width: 100%;
  height: 1.6rem;
  line-height: 1.6rem;
  position: relative;
  background: #fff;

  .screen_item {
    position: relative;
    display: block;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: center;
    font-size: 0.7rem;
    color: #999;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .screen_item + .screen_item:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0.45rem;
    width: 1px;
    height: 0.75rem;
    background: #f0f0f0;
  }
  .screen_item:before {
    content: "";
    position: absolute;
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 0.2rem solid transparent;
    border-right: 0.2rem solid transparent;
    border-top: 0.2rem solid #999;
    right: 0.5rem;
    top: 0.75rem;
  }
  .screen_item-active {
    color: #ffab2e;
  }
  .screen_item.screen_item-active:before {
    border-top: 0.2rem solid #ffab2e;
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
  }
  .screen_item:first-child:before {
    content: "";
    border-top: 0rem solid transparent;
  }
  .screen-date {
    // border: 1px solid #eee;
    line-height: 0.75rem;
    width: 5rem;
    padding: 0 0.5rem;
    margin-right: 1rem;
  }
  select {
    outline: none;
    border: none;
    text-align: center;
    width: 2.5rem;
    option {
      outline: none;
      border: none;
      line-height: 0.5rem;
      text-align: center;
    }
  }
}
.accant-btn{
  position: absolute;
  bottom: 0;
  right: 0;
  button{
    background-color: #ffab2e;
    color: #fff;
    border: none;
    outline: none;
  }
}
</style>


