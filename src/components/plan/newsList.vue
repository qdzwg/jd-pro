<template>
  <div class="template">
    <div v-infinite-scroll="loadMore"
           infinite-scroll-disabled="loading"
           infinite-scroll-distance="10">
      <newslist :data="list" :tripNo="params.tripNo" :noDataStatus="noDataStatus"></newslist>
      <scroll-bottom :totalPage="totalPage" :loading="loading"></scroll-bottom>
    </div>
    <no-data v-if="noDataStatus" :isAdd="true"></no-data>
  </div>
</template>
<script>
  import { MessageBox,InfiniteScroll } from 'mint-ui';
  import newslist from '../comm/news';
  import Api from '../../http/api';
  import noData from '../comm/noData'
  import scrollBottom from '../comm/scrollBottom'
  export default {
    name: 'NewsList',
    components:{
      newslist,
      noData,
      scrollBottom
    },
    data(){
        return {
          list:[],
          params:{
              tripNo:'',
              rows:10,//每页条数
              page:0//当前页
          },
          noDataStatus:false,//暂无数据
          loading:false,
          totalPage:1,// 请求总页数,判断可以上拉
        }
    },
    mounted(){
      this.params.tripNo=this.$route.params.tripNo;
    },
    methods:{
      loadAjax(){
        this.axios.get(Api.NewsList,{params:this.params})
          .then(response=>{
            this.list  = this.list.concat(response.data.data.items);
            if(this.list.length<1)  this.noDataStatus=true;
            else this.noDataStatus=false;
            this.totalPage = response.data.data.totalPage;
            this.isHaveMore();
            console.log('轨迹数据列表',this.list)
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
