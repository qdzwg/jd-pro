<template>
    <div>
        <div class="reply">
          <div v-infinite-scroll="loadMore"
               infinite-scroll-disabled="loading"
               infinite-scroll-distance="10">
               <p v-for="(item,index) in list" :key="index" class="reply-con">
                  <span style="display:block">回复时间：<em>{{item.sendTime}}</em></span>
                  <span style="display:block;margin-top:0.5rem;">{{item.messageContent}}</span>                  
              </p>
          </div>
        </div>
    </div>
</template>
<script>
  import API from '../../http/api.js';
  import noData from '../comm/noData';
  import scrollBottom from '../comm/scrollBottom'
  export default{
    name:'visitorDetail',
    components:{
      noData,scrollBottom
    },
    data(){
      return {
        noDataStatus:false,//暂无数据
        loading:false,
        list:[],
        totalPage:1,
        params:{  // 列表参数
          tripNo:'',
          rows:10,//每页条数
          page:0//当前页
        }
      }
    },
    methods:{
      loadAjax(){
        this.axios.get(API.VisitorReply,{params:{id:this.$route.params.id}})
          .then(response=>{
            this.list = this.list.concat(response.data.data);
            console.log("数据",this.list);
            if(this.list.length<1)  this.noDataStatus=true;
            else this.noDataStatus=false;
            this.totalPage = response.data.data.totalPage;
            this.isHaveMore();
          })
          .catch(error=>{
            console.log(error);
          })
      },
      // 分页查询
      loadMore(){
        this.params.page = parseInt(this.params.page) + 1;
        if(!this.loading){
          this.loadAjax();  // 调用list加载
        }
      },
      // 检测是否可以上拉,true是禁止上拉加载
      isHaveMore(){
        this.loading = false;
        if(this.params.page >= this.totalPage) {
          this.loading = true;
        }
      }
    },
  }
</script>
<style scoped lang="scss">
  .reply-con{
    font-size: 0.7rem;
    padding: 0.5rem .5rem;
    color: #999;
    border-bottom: 1px solid #eee;
    background: #fff;
    margin-top: 2rem;
  }

</style>
