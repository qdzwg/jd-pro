<template>
  <div class="template">
    <div class="travelBox"  v-for="(item,index) in travelList" :key="index">
      <div class="title"><span>Day{{ index+1 }}</span>{{ item.parkName }}<em>by{{ item.transportation }}</em></div>
      <div class="content">
        <div class="item import">
          <!-- <div class="time">06:40</div> -->
          <div class="item-info">
            <!-- <h4>{{ item.hotelName || '暂无' }}</h4> -->
            <div class="txt" v-html="item.oyomrtstuInfoId || '暂无行程安排'"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  import Api from '../../http/api';
  export default {
    name: 'travelInfo',
    data () {
      return {
        list:[],  // 行程列表
      }
    },
    mounted() {
      this.initTravelInfo();
    },
    methods:{
      initTravelInfo(){
        // let tripNo=this.$route.params.tripNo;
        this.axios.get(Api.TripDetail,{params:{tripNo:this.$route.params.tripNo}})
          .then(res=>{
            if(res.data.success){
              this.list = res.data.data;
            }else{
              MessageBox.alert(res.data.message);
            }
            console.log(res.data.data);
          })
      },
    },
    computed:{
      travelList:function() {
        this.list.map((item,index)=>{
          item.oyomrtstuInfoId = item.oyomrtstuInfoId.replace(/(\r\n)|(\n)/g,"<br>");
        })
        return this.list
      }
    }
  }
</script>

<style  lang="scss" scoped>
  .travelBox{
    background: #fff;
    margin-top: 2.25rem;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 0.5rem .2rem;
    .title{
      font-size: 0.7rem;
      color: #333;
      padding: 0.5rem 0;
      em{
        font-size: 0.6rem;
        margin-left: 0.4rem;
      }
      span{
        display: inline-block;
        padding: 0 0.6rem;
        height:1rem;
        border-radius: 0.5rem;
        line-height: 1rem;
        color: #fff;
        font-size: 0.5rem;
        background: #529cff;
        margin: 0 0.4rem 0 0.25rem;
      }
    }
    .content{
      margin-top: 0.6rem;
      .item{
        overflow: hidden;
        .time{
          float: left;
          width:21%;
          text-align: center;
          font-size: 0.55rem;
          color: #333;
        }
        .item-info{
          border-left: 2px solid #e6e6e6;
          box-sizing: border-box;
          // width:79%;
          // margin-left: 21%;
          width:90%;
          margin-left: 4%;
          padding: 0 0 0.8rem 0.75rem;
          position: relative;
          h4{
            color: #333;
            font-size: 0.6rem;
            font-weight: normal;
          }
          .txt{
            color: #999;
            font-size: 0.6rem;
            margin-top: 0.3rem;
            line-height: 1.4;
          }
        }
        .item-info:before{
          content:"";
          display: inline-block;
          background: #e6e6e6;
          width: 0.4rem;
          height: 0.4rem;
          position: absolute;
          left:-0.22rem;
          top:0;
          z-index:222;
          border-radius: 50%;
        }
      }
    }
    // .item:nth-last-child(1){
    //   .item-info{border-left: 2px solid #fff;}
    // }
    .item.import{
      .time{
        color: #529cff;
        font-size: 0.65rem;
      }
      .item-info{
        h4{
          color: #529cff;
          font-size: 0.7rem;
        }
      }
      .item-info:before{
        content:"";
        display: inline-block;
        background: #cbe1ff;
        width: 0.7rem;
        height: 0.7rem;
        position: absolute;
        left:-0.4rem;
        top:0;
        z-index:222;
        border-radius: 50%;
      }
      .item-info:after{
        content:"";
        display: inline-block;
        background: rgb(82,156,255);
        width: 0.4rem;
        height: 0.4rem;
        position: absolute;
        left:-0.24rem;
        top:0.15rem;
        z-index:222;
        border-radius: 50%;
      }
    }
  }
</style>
