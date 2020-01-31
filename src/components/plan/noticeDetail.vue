<template>
  <div class="template">
      <h2 class="ntitle">{{result.title}}</h2>
      <div class="ntime" style="margin-top: 10px;">{{result.createTime}}</div>
      <div class="ncontent" v-html="result.messageInfo"></div>
      <el-button v-if="showCfBtn" style="margin-left: 15px;margin-top: 10px; background-color: whitesmoke"  round type="text" @click="confirm">确认</el-button>
  </div>
</template>
<script>

  import Api from '../../http/api';
  export default {
    name: 'noticeDetail',
    components:{
    },
    data(){
      return {
        id:'',
        showCfBtn:false,
        result:{}
      }
    },
    mounted(){
      this.id=this.$route.params.id;
      this.axios.get(Api.NoticeDetail,{params:{id:this.id}})
        .then(res=>{
            this.result = res.data.data;
            if (this.result.status){
              this.showCfBtn = 'CF' != this.result.status;
            }
        });
    },
    computed:{

    },methods: {
      confirm() {
        this.id=this.$route.params.id;
        this.axios.get(Api.NoticeDetail,{params:{id:this.id,status:1}})
          .then(res=>{
            this.result = res.data.data;
            this.showCfBtn = false;
          });
      }
    }
  }
</script>
<style lang="scss" scoped>
  .c-red{color: #fa5353!important;}
  .ntitle{
    color: #333;
    font-size: 0.7rem;
    text-align: center;
    line-height: 2rem;
    padding: 0 0.5rem;
  }
  .ntime{
    font-size: 0.55rem;
    color: #999;
    padding: 0 0.5rem;
  }
  .ncontent{
    color: #666;
    font-size: 0.6rem;
    line-height: 1.2rem;
    padding: 0 0.5rem;
  }
  .vistor-list{
    background: #fff;
    padding: 0 0.5rem;
    border-top:1px solid #f0f0f0;
    border-bottom:1px solid #f0f0f0;
    box-sizing: border-box;
    margin-bottom: 0.2rem;
    margin-top: 0.2rem;
    width:100%;
    .tripBox{
      font-size: 0.6rem;
      color: #666;
      border-bottom: 1px solid #f0f0f0;
      line-height: 1.8rem;
      span{
        float: right;
        font-size: 0.55rem;
        color: #999;
      }
    }
    .label-box{
      display: block;
      width:100%;
      height: 100%;
    }
    .top{
      line-height:1.35rem;
      font-size: 0.55rem;
      color: #333;
      border-bottom: 1px solid #f0f0f0;
      span{
        margin-right: 1.9rem;
        em{
          color: #999;
        }
      }
    }
    .info{
      padding: 0.3rem 0;
      p{
        color: #999;
        font-size: 0.6rem;
        line-height:0.95rem;
        i{
          color: #95c2ff;
          display: inline-block;
          width: 0.9rem;
          text-align: center;
          vertical-align: middle;
          font-size:0.65rem;
        }
        em{
          color: #333;
        }
      }
    }

  }
</style>
