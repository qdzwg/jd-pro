<template>
  <div class="template">
    <div v-infinite-scroll="loadMore"
           infinite-scroll-disabled="loading"
           infinite-scroll-distance="10">
      <noticelist :data="list" :tripNo="params.tripNo" :noDataStatus="noDataStatus"></noticelist>
      <scroll-bottom :totalPage="totalPage" :loading="loading"></scroll-bottom>
    </div>
    <no-data v-if="noDataStatus" :isAdd="true"></no-data>
  </div>
</template>
<script>
  import { MessageBox,InfiniteScroll } from 'mint-ui';
  import noticelist from '../comm/notice';
  import Api from '../../http/api';
  import noData from '../comm/noData'
  import scrollBottom from '../comm/scrollBottom'
  export default {
    name: 'NewsList',
    components:{
      noticelist,
      noData,
      scrollBottom
    },
    data(){
        return {
          list:[],
          params:{
              rows:10,//每页条数
              page:0//当前页
          },
          notice:true,
          noDataStatus:false,//暂无数据
          loading:false,
          totalPage:1,// 请求总页数,判断可以上拉
        }
    },
    mounted(){
    },
    methods:{
      loadAjax(){
        this.axios.get(Api.NoticeList,{params:this.params})
          .then(response=>{
              console.log(response.data)
            this.list  = this.list.concat(response.data.data.items);
            if(this.list.length<1)  this.noDataStatus=true;
            else this.noDataStatus=false;
            this.totalPage = response.data.data.totalPage;
            this.isHaveMore();
          }).catch(error=>{
            console.log(error);
          })
      },
      loadMore(){
        this.params.page=parseInt(this.params.page)+1;
        if(!this.loading){
          this.loadAjax();
        }
      },
      // 检测是否可以上拉,true是禁止上拉加载
      isHaveMore(){
        this.loading = false;
        if(this.params.page >= this.totalPage) {
          this.loading = true;
        }
      },
    }
  }
</script>
<style>

</style>
