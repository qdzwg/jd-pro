<template>
  <div class="template">
    <div class="com-box" v-for="item in data">
      <div class="time">{{item.createTime}}</div>
      <div class="newbox">
        <div class="title" >
            <span>{{item.title}}</span>
            <em :class="item.status=='未读'?'unread':''">{{item.status}}</em>
        </div>
        <div class="txt">{{item.messageInfo}}</div>
        <router-link :to="{name:'NoticeDetail',params:{id:item.id}}" class="btn">查看详情&gt;</router-link>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'news',
    props:['data'],
    data(){
      return {

      }
    },
    mounted(){
    }
  }
</script>
<style scoped lang="scss">
  .com-box{
    padding: 0 0.5rem;
  }
  .time{
    // text-align: center;
    line-height: 1rem;
    color: #acacac;
    font-size: 0.55rem;
    margin-top: 0.25rem;
  }
  .newbox{
    width:100%;
    border: 1px solid #f0f0f0;
    // padding: 0 0.75rem;
    padding: 0;
    box-sizing: border-box;
    background: #fff;
    .title{
      color: #333;
      font-size: 0.7rem;
      line-height: 1.3rem;
      margin-top: 0.3rem;
      // text-align: center;
      i{
        color: #6baafd;
        font-size: 0.9rem;
        display: inline-block;
        vertical-align: middle;
      }
      span{
        display: inline-block;
        vertical-align: middle;
      }
      em{
        float: right;
        font-size: 0.55rem;
        color: #999;
      }
      em.unread{color: red;}
    }
    .txt{
      color: #999;
      font-size: 0.6rem;
      line-height: 0.8rem;
      padding: 0.15rem 0 0.4rem;
    }
    .btn{
      // text-align: center;
      line-height: 1.6rem;
      display: block;
      // text-align: center;
      border-top: 1px solid #f0f0f0;
      color: #acacac;
      font-size: 0.7rem;
    }
  }
</style>
