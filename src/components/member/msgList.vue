<template>
  <div id="loadmore" >
    <div class="msglist" >
      <div v-infinite-scroll="loadMore"
           infinite-scroll-disabled="loading"
           infinite-scroll-distance="10">
        <input type=button  value='返回上一页' @click="goMember" class="backGo">
        <!-- list -->
        <div class="item" v-for="(item,index) in pageList" :key="index">
          <div class="header">
            <a class="btn c-red" @click="delList(item.id,item.templateName)">删除</a>
            <router-link :to="{path:`/editMsg/1/${item.id}`}" class="btn c-blue">编辑</router-link>
            <!-- <span class="num">模板{{index+1}}</span> -->
            <span class="num">{{item.templateName}}</span>
          </div>
          <div class="content">{{item.templateContent}}</div>
        </div>
        <scroll-bottom :totalPage="totalPage" :loading="loading"></scroll-bottom>
        <!-- list -->
      </div>
      <no-data v-if="noDataStatus" :isAdd="true"></no-data>
    </div>
    <div class="addbtn-box">
      <div class="addbtn iconfont icon-gerenyetianjiajiaguanzhu" @click="addList"></div>
    </div>
  </div>
</template>
<script>
import { MessageBox,InfiniteScroll } from 'mint-ui';
import API from '../../http/api'
import noData from '../comm/noData'
import scrollBottom from '../comm/scrollBottom'
import common from '../../assets/js/public.js'
  export default{
    name:'msgList',
    components:{
        noData,
        scrollBottom
    },
    data(){
      return {
        searchCondition:{  //请求参数:分页属性
          rows:10,//每页条数
          page:0,//当前页
        },

        totalPage:1,// 请求总页数,判断可以上拉
        pageList:[],// 列表渲染
        loading:false,  // 是否继续加载，false代表还有数据，true为禁止加载
        noDataStatus:false, //暂无数据状态
        templateIds:[], // 删除的id数组
        guiderId123:''
      }
    },
    mounted(){
    },
    methods:{
      goMember() {
        this.$router.push({name:'Member'});
      },
      // ajax-list
      initPageList(){
        this.axios.get(API.MemberMsgList,{params:this.searchCondition})
          .then(res=>{
            console.log(res);
            console.log(this.searchCondition);
            this.pageList = this.pageList.concat(res.data.data.rows);
            if(this.pageList.length<1)  this.noDataStatus=true;
            else this.noDataStatus=false;
            this.totalPage = res.data.data.totalPage;
            this.isHaveMore();
          })
          .catch(error=>{
            console.log(error);
          })
      },
      // 分页查询
      loadMore(){
        this.searchCondition.page = parseInt(this.searchCondition.page) + 1;
        if(!this.loading){
          this.initPageList();  // 调用list加载
        }
      },
      // 检测是否可以上拉,true是禁止上拉加载
      isHaveMore(){
        this.loading = false;
        if(this.searchCondition.page >= this.totalPage) {
          this.loading = true;
        }
      },

      // 删除功能
      delList(id,name){
        console.log(this.pageList);
        MessageBox.confirm('', {
          message: `确定删除${name}模板？`
        }).then(action => {

          if (action == 'confirm') {
            this.templateIds.push(id);
            this.guiderId123 = id
            console.log(id)
            this.id=id
            this.axios.get(API.MemberDelMsg,{params: {id:this.id}})
              .then(res=>{
                console.log(this.guiderId123)
                console.log(res)
                if(res.data.code == 200 && res.data.success){
                  common.showToast(res.data.message,1000);
                  let newPagelist = this.pageList.filter((item,index)=>{
                      return item.id!=id;
                  })
                  this.pageList = newPagelist;
                  console.log(newPagelist)
                }else{
                  MessageBox.alert(res.message);
                }
            }).catch(err=>{});
          }
        }).catch(err => {if(err == 'cancel'){}});
      },
      // 新增功能
      addList(){
        this.$router.push({name:'EditMsg',params:{status:0,editcode:0}});
      },
    },
  }
</script>
<style scoped lang="scss">
  .msglist{
    width: 100%;
    padding: 0 0.5rem;
    box-sizing: border-box;
    .item{
      width:100%;
      border: 1px solid #e6e6e6;
      box-sizing: border-box;
      margin: 0.5rem 0;
      background: #fff;
      padding: 0 0.25rem;
      .header{
        position: relative;
        border-bottom: 1px solid #f0f0f0;
        padding: 0.35rem;
        text-align: right;
        .btn{
          display: inline-block;
          height: 1rem;
          width: 2.25rem;
          font-size: 0.55rem;
          text-align: center;
          line-height: 1rem;
          border-radius: 0.5rem;
          margin: 0 0.25rem;
        }
        .btn.c-blue{
          color: #529cff;
          border: 1px solid #529cff;
        }
        .btn.c-red{
          color: #fa5353;
          border: 1px solid #fa5353;
        }
        .num{
          display: block;
          height: 1rem;
          padding: 0 0.5rem;
          line-height: 1rem;
          color: #fff;
          font-size: 0.55rem;
          background: #7eb5ff;
          border-radius: 0 0.5rem 0.5rem 0;
          position: absolute;
          left:-0.25rem;
          top:50%;
          margin-top:-0.5rem;
          max-width: 7rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .content{
        padding: 0.5rem 0.25rem;
        color: #666;
        font-size: 0.6rem;
        line-height: 0.8rem;
      }
    }
  }
  .addbtn-box{
    height: 2.5rem;
    width: 100%;
    .addbtn{
      display: block;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      background: #ffab2e;
      color: #fff;
      position: fixed;
      left: 50%;
      margin-left: -1.125rem;
      bottom: 0.25rem;
      text-align: center;
      line-height:2.25rem;
      font-size: 1.2rem;
    }

  }
</style>
