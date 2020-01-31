<template>
    <div class="template">
      <div class="planlist">
        <div class="title">
          <span>行程编号：{{params.tripNo}}</span>
          <router-link  class="link-on" :to="{name:'travelInfo',params:params.tripNo}"></router-link>
        </div>
        <div class="content">
          <h4>{{routeInfo.routeName || load}}</h4>
          <ul>
            <li>出团单数：{{routeCon.orderNum}}单</li>
            <li>游玩天数：{{routeInfo.dayNum}}天</li>            
            <li>出团人数：{{routeCon.amount}}人</li>            
            <li>带团导游：{{routeCon.guiderName}}</li>
            
            <li v-if="routeCon.carInfo == null"></li>
            <li v-else>司机：{{routeCon.carInfo.driverName}}</li>

            <li v-if="routeCon.carInfo == null"></li>
            <li v-else>电话：{{routeCon.carInfo.driverTel}}</li>

            <li v-if="routeCon.carInfo == null"></li>
            <li v-else>车牌号：{{routeCon.carInfo.carNo}}</li>

            <li v-if="routeCon.carInfo == null"></li>
            <li v-else>用车时间：{{routeCon.carInfo.useTime}}</li>

            <li v-for="(item, index) in routeCon.tktInfo" :key="index">
              <span>{{item.tktName}}：{{item.amount}}</span>
            </li>
            <li>总代收：{{routeCon.replaceChargeSum}}</li>
            <!-- <li>总代退：{{routeCon.replaceRefundSum}}</li> -->
          </ul>
        </div>
      </div>
      <div class="planlist onetit">
        <router-link class="title" :to="{name:'Visitor',params:{tripNo: params.tripNo, guiderId: params.guiderId}}">
          <h4>游客信息</h4>
          <!--<span>{{routeInfo.totalNum}}</span>-->
          <i class="link-on"></i>
        </router-link>
      </div>
      <template v-if="type == 0">
        <div class="out-btn" @click="layerBox">超载提醒</div>
        <!--<foot-btn :text="footBtnText" :hideIndex="routeInfo.status" @firstCli="firstClick" @lastCli="lastClick"></foot-btn>-->
        <div class="footer-btn-box">
          <div class="footer-btn">
            <div class="btn tui-btn"  @click="firstClick">查看轨迹</div>
            <div class="btn send-btn" v-if="routeInfo.status==='fatuan'" @click="lastClick">报账</div>
          </div>
        </div>
      </template>
    </div>
</template>
<script>
  import FootBtn from '../comm/FootBtn';
  import Api from '../../http/api';
  import { MessageBox } from 'mint-ui';

  export default {
    name:'planDetails',
    data(){
        return {
          footBtnText:['查看轨迹','添加报账'],//底部按钮文字
          routeInfo:{
          },//信息
          routeCon:{
          },//信息
          params:{
            tripNo:''
          },
          type:'',
          load:'请求中',
          loaded: false
        }
    },
    components:{
      FootBtn
    },
    mounted(){
      this.params.tripNo=this.$route.params.tripNo;
      if(this.$route.query.guiderId){
        this.params.guiderId = this.$route.query.guiderId
      }
      this.type=this.$route.params.type;
      this.axios.get(Api.Detail,{params:this.params})
        .then(res=>{
          this.routeInfo = res.data.data;
          this.routeCon = res.data;
          this.loaded = true;
          console.log('数据',res);
          console.log('发团',this.routeInfo.fatuan);
        })
    },
    methods:{
      layerBox(){
        MessageBox.prompt('超载人数', {inputPlaceholder: '请输入超载人数',inputErrorMessage:'请输入数字'}).then(({ value, action }) => {
          let send = {};
          send.tripNo = this.params.tripNo;
          send.overloadNum = value;
          this.axios.post(Api.sendOverloadMessage,this.$qs.stringify(send))
            .then(res=>{
                console.log(res);
                MessageBox.alert(res.data.message);
            })
        })
      },
      firstClick(){
          this.$router.push({name: 'NewsList',params:this.params.tripNo});
      },
      lastClick(){
        this.$router.push({name: 'AccList',params:{tripNo:this.params.tripNo,finsh:'2'}});
        // this.$router.push({name: 'AccList',params:{tripNo:this.params.tripNo,finsh:'2'}});
      }
    }
  }
</script>
<style scoped lang="scss">
  .planlist{
    padding: 0 0.5rem;
    background: #fff;
    margin-top: 2.25rem;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    .title{
      border-bottom: 1px solid #f0f0f0;
      line-height:1.75rem;
      position: relative;
      span{
        color: #666;
        font-size: 0.6rem;
      }
      h4{
        font-size: 0.8rem;
        color: #333;
        font-weight: normal;
      }
    }
    .content{
      h4{font-size: 0.8rem;color:#333;font-weight: normal;line-height: 1.5rem;}
      ul{overflow: hidden;
        padding-bottom: 0.35rem;
        li{
          float: left;
          width:50%;
          color: #999;
          font-size: 0.6rem;
          line-height:1rem;
          padding-left: 0.5rem;
          box-sizing: border-box;
        }
      }
    }
    .travel{
      color: #999;
      font-size: 0.6rem;
      line-height: 2rem;
      text-align: right;
      .outbtn{
        width: 3.5rem;
        height:1.25rem;
        border: 1px solid #c2c2c2;
        font-size: 0.6rem;
        line-height:2;
        text-align: center;
        border-radius: 0.625rem;
        box-sizing: border-box;
        margin: 0.35rem 0;
        display: inline-block;
      }
      .outbtn.on{
        background: #ffab2e;
        color: #fff;
        border: 1px solid #ffab2e;
      }
    }
  }
  .planlist.onetit{
    height: 2rem;
    .title{
      border: 0;
      line-height: 2rem;
      display: block;
      h4{
        font-size: 0.7rem;
        display: inline-block;
      }
      span{
        float: right;
        margin-right: 15px;
        color: #529cff;
      }
    }
  }
  .out-btn{
    width:100%;
    height: 2rem;
    line-height:2rem;
    color: #fa5353;
    font-size: 0.7rem;
    text-align: center;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
    margin-top: 0.5rem;
  }
  .footer-btn-box{
    height: 2rem;
    width: 100%;
  }
  .footer-btn{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    overflow: hidden;
    position: fixed;
    bottom:0;
    left: 0;
    z-index:89;
    width:100%;
    .btn{
      height:2rem;
      display: block;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      font-size: 0.7rem;
      text-align: center;
      line-height:2rem;
      background: #fff;
      color: #529cff;
    }
    .send-btn.btn{
      background: #ffab2e;
      color: #fff;
    }
  }
</style>


