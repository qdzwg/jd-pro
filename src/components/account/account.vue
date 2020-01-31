<template>
    <div class="template">
      <div class="screen">
        <template >
          <div v-for="(name,index) in tagName" :key="index" class="screen_item"
              :class="[tagOn==index?'on':'']" @click="typeChange(index,name.type,name.status)">
            {{name.name}}
          </div>
        </template>
      </div>
      <div v-infinite-scroll="loadMore"
           infinite-scroll-disabled="loading"
           infinite-scroll-distance="10">
          <card  v-for="(item,index) in pageList"
                :key="index" :card="item"
                :link="`/planDetails/${item.tripNo}/0`">
          </card>
          <scroll-bottom :totalPage="totalPage" :loading="loading"></scroll-bottom>
      </div>
      <no-data v-if="noDataStatus"></no-data>
      <footside-bar></footside-bar>
    </div>
</template>
<script>
import { InfiniteScroll,Spinner } from 'mint-ui';
import FootsideBar from '../comm/FootsideBar';
import card from '../comm/card';
import noData from '../comm/noData';
import scrollBottom from '../comm/scrollBottom'
import Api from '../../http/api';
export default {
    name:'Account',
    data(){
        return {
          params:{
            rows:10,//每页条数
            page:0,//当前页
            finsh:'E',
            status:"onBz"
          },
          // params: {
          //   guiderId: '',
          //   status: '',
          //   dayNum: '',
          //   planDateBegin: '',
          //   routeName: ''
          // },
          totalPage:1,// 请求总页数,判断可以上拉
          pageList:[],// 列表渲染
          loading:false,  // 是否继续加载，false代表还有数据，true为禁止加载
          noDataStatus:false,//暂无数据
          tagName:[{name:'未报账',type:'E',status:"onBz"},{name:'已报账',type:'F',status:'endwork'}],
          tagOn:0,
        }
    },
    components:{
        FootsideBar,
        card,
        noData,scrollBottom
    },
    mounted(){
    },
    methods:{
      loadAjax(){
        this.axios.get(Api.List,{params:this.params})
          .then(response=>{
            console.log(response)
            console.log(this.params)
            this.pageList  = this.pageList.concat(response.data.data.items);
            if(this.pageList.length<1)  this.noDataStatus=true;
            else  this.noDataStatus=false;
            this.totalPage = response.data.data.totalPage;
            this.isHaveMore();

          }).catch(error=>{
            console.log(error);
          })
      },
      typeChange(onindex,type,status){
          this.tagOn = onindex;
          this.params.finsh = type;
          this.params.status=status;
        this.params.page = 1;
          console.log("params:",this.params);
          this.pageList = [];
          this.loadAjax();
      },
      // 分页查询
      loadMore(){
        this.params.page = parseInt(this.params.page) + 1;
        if(!this.loading){
          this.loadAjax();
        }
      },
      // 检测是否可以上拉,true是禁止上拉加载
      isHaveMore(){
        this.loading = false;
        if(this.params.page >= this.totalPage)
          this.loading = true;
      },
    },
}
</script>
<style scoped lang="scss">
  .template{
    width:100%;height:100%;overflow:hidden;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;
    -webkit-box-orient:vertical;-webkit-box-direction:normal;-moz-box-orient:vertical;-moz-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;margin-top:2rem;
    .mint-loadmore{
      display:block;-webkit-box-flex:1;-moz-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;overflow:hidden;position:relative;
    }
  }
  .screen {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    z-index: 500;
    width: 100%;
    height: 2.2rem;
    line-height: 2.2rem;
    position: relative;
    background: #fff;
    .screen_item {
      position: relative;
      display: block;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      text-align: center;
      font-size: .7rem;
      color:#999;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      border-bottom: 1px solid #f0f0f0;
    }
    .screen_item.on:before{
      content: "";
      height:3px;
      background: #529cff;
      width: 60%;
      position: absolute;
      bottom:-1px;
      left:50%;
      margin-left:-30%;
    }
    .screen_item.on{
      color: #529cff;
    }
    .screen_item+.screen_item:after {
      content: "";
      position: absolute;
      left: 0;
      top: .8rem;
      width: 1px;
      height: 0.75rem;
      background: #f0f0f0;
    }
    .screen_item-active {
      color:#ffab2e;
    }
    .screen_item.screen_item-active:before{
      border-top:.2rem solid #ffab2e;
      transform:rotate(180deg);
      -webkit-transform:rotate(180deg);
    }
  }
</style>
