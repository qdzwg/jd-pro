<template>
    <div class="list" id="loadmore">
        <div class="list-hd border-bottom">
            <div class="search">
                <div class="search-hd">
                    <i class="icon iconfont icon-sousuo"  @click="searchKey()"></i>
                    <input class="sfrom" placeholder="请输入要搜索的内容" v-model="params.routeName" @keyup="key($event)"/>
                </div>
                <!--<router-link class="search-a iconfont icon-rili" :to="{path:'/PlanCalendar'}"></router-link>-->
            </div>
            <div class="screen">
                <div class="screen_item" id="Status" @click="toggleScreen('statusShow','daysShow')"  v-if="this.flag.status=='onWork'">
                    工作状态
                </div>
                <div class="screen_item" id="Days" @click="toggleScreen('daysShow','statusShow')" >
                    工作天数
                </div>
                <div class="screen_item" @click="openPickerEnd">
                    日期筛选
                </div>
            </div>
            <ul class="screen-dialog"  :class="search.statusShow?dialogActive:''">
                <li v-if="this.statusData.length < 1" class="no-data">暂无筛选内容</li>
                <li v-for="(item,index) in statusData" :key="index" class="lists border-bottom"
                    @click="select" logo="statusShow" :keyvalue="index">
                    {{ item }}
                </li>
            </ul>
            <ul class="screen-dialog "  :class="search.daysShow?dialogActive:''">
                <li v-if="this.daysData.length < 1" class="no-data">暂无筛选内容</li>
                <li v-for="(item,index) in daysData" :key="index"
                    @click="select" logo="daysShow"   class="lists border-bottom">
                  {{item}}
                </li>
            </ul>
        </div>
        <div class="panelList">
            <div v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"  infinite-scroll-distance="10">
            <card v-for="(item,index) in list" :key="index" :card="item" :link="`/planDetails/${item.tripNo}/0`"></card>
            <scroll-bottom :totalPage="totalPage" :loading="loading"></scroll-bottom>
            </div>
        </div>
        <no-data v-if="noDataStatus"></no-data>
        <div class="screen-mask" v-if="this.search.statusShow || this.search.daysShow"
            @click="closeMask()">
        </div>
        <mt-datetime-picker
          ref="pickerEnd"
          type="date"
          :startDate=startDate
          :endDate=endDate
          year-format="{value}"
          month-format="{value}"
          date-format="{value}"
          @confirm="endOver">
        </mt-datetime-picker>
        <footside-bar></footside-bar>
    </div>
</template>

<script>
import { InfiniteScroll,Spinner } from 'mint-ui';
import FootsideBar from '../comm/FootsideBar';
import card from '../comm/card';
import scrollBottom from '../comm/scrollBottom'
import noData from '../comm/noData';
import Api from '../../http/api';
export default {
    name:'PlanList',
    components:{
        FootsideBar,
        card,
        noData,
        scrollBottom
    },
    data(){
        return{
            flag:'',    // 标志，判断进行中和已完结页面
            totalPage:1,// 请求总页数,判断可以上拉
            startDate:new Date(new Date().getFullYear() - 2, 0, 1),
            endDate:new Date(new Date().getFullYear() + 10, 11, 31),
            params:{
              status : "",//状态
              dayNum:"",//天数
              planDateBegin:"",//发团日期
              routeName:"",//按线路名搜索
              rows:10,//每页条数
              page:0//当前页
            },
            list:[],//列表内容
            loading:false,  // 是否继续加载，false代表还有数据，true为禁止加载
            totalPage:1,// 请求总页数,判断可以上拉
            noDataStatus:false,
            search:{
                 statusShow:false,// 状态
                 daysShow:false// 日期
            },
            statusData:[],// 工作状态内容
            daysData:[ // 工作日期内容
               "全部",1,2,3,4,5
            ],
            dialogActive:'screen-dialog-active', //弹框状态
        }
    },
    mounted() {
        this.flag = this.$route.params;
        this.params.status = this.$route.params.status;
        //获取工作状态
        this.axios.get(Api.ListSearch)
          .then(res=>{
              this.statusData = res.data.data;
              this.$set(this.statusData,'','全部');
          })
        // this.loadAjax();
        // var wH = window.innerHeight > 0 ? window.innerHeight : document.documentElement.clientHeight;
        // document.getElementById('loadmore').style.height = wH + 'px';
    },
    methods:{
        loadAjax(){
          this.axios.post(Api.List,this.$qs.stringify(this.params))
            .then(response=>{
                this.list  = this.list.concat(response.data.data.items);
                if(this.list.length<1)  this.noDataStatus=true;
                else   this.noDataStatus=false;
                this.totalPage = response.data.data.totalPage;
                this.isHaveMore();
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
            if(this.params.page >= this.totalPage)
                this.loading = true;
        },

        // 重置筛选状态
        initScreen(){
            document.querySelectorAll('.screen_item').forEach((item,index) => {
                $(item).removeClass('screen_item-active');
            }, this);
        },
        // 展开筛选
        toggleScreen(left,right){
            this.search[left] = !this.search[left];
            if(this.search[left] && this.search[right])
                this.search[right] = !this.search[right];
            this.initScreen();
            if(this.search[left] || this.search[right]){
                let e = event.target;
                $(e).addClass('screen_item-active');
                $('body').css("overflow","hidden")
            }else{
                $('body').css("overflow","auto")
            }
        },
        //筛选状态
        select(){
            let e = event.target,
                text = e.innerText,
                logo = e.getAttribute("logo");
                this.logo = false;
            switch (logo) {
                case "statusShow":
                    this.toggleScreen('statusShow','daysShow');
                    document.getElementById('Status').innerHTML = text;
                    this.params.status = e.getAttribute('keyvalue');
                    this.list = [];
                    this.loadAjax();
                    break;
                case "daysShow":
                    this.toggleScreen('daysShow','statusShow');
                    document.getElementById('Days').innerHTML = text;
                    if(text == "全部")
                        this.params.dayNum = '';
                    else
                        this.params.dayNum = text;
                    this.list = [];
                    this.loadAjax();
                    break;
            }
        },
        // 关闭隔层
        closeMask(){
            this.search.statusShow = false;
            this.search.daysShow = false;
            this.initScreen();
            $('body').css("overflow","auto");
        },
        key(e){ // 回车事件：搜索
          if(e.keyCode=='13'){
            this.list = [];
            this.loadAjax();
          }
        },
        searchKey(){
          this.list = [];
          this.loadAjax();
        },
        //结束时间点击
        openPickerEnd() {
          this.$refs.pickerEnd.open();
        },
        time(s){
          return (+s<10?('0'+s):s);
        },
        dateChange(date){
          date = new Date(date);
          let year = date.getFullYear(),
            month = this.time(date.getMonth()+1),
            day = this.time(date.getDate());
          return year+'-'+month+'-'+day;
        },
        endOver(value){
          this.params.planDateBegin = this.dateChange(value);
          this.list = [];
          this.loadAjax();
        },
    },
}
</script>

<style lang="scss" scoped>
    $blue:#529cff;
    .list {
      position: relative;

    }
    .panelList{
        padding:3.7rem 0 2.8rem;
    }
    .screen-mask {
        position: fixed;
        z-index: 91;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
    }
    // dialog
    .screen-dialog {
        z-index:92;
        position: fixed;
        width: 100%;
        top: -20rem;
        background: #fff;
        // -webkit-transform:translate3d(0,-20rem,0);
            // transform:translate3d(0,-20rem,0);
        -webkit-transition:.5s linear;
            transition:.5s linear;
        .lists {
            padding: .5rem;
            color: #666;
            font-size: .6rem;
        }
    }
    .screen-dialog.screen-dialog-active {
        top: 3.5rem;
        // -webkit-transform:translate3d(0,0rem,0);
            // transform:translate3d(0,0rem,0);
    }
    .no-data {
        height: 2rem;
        color:#000;
        padding: .5rem;
        font-size: .6rem;
        text-align: center;
    }
    .list-hd {
        height: 3.5rem;
        background:#fff;
        width: 100%;
        z-index:95;
        position: fixed;
        width: 100%;

        .list-hd_h { position: relative; }
        .search {
            width: 100%;
            height: 1.6rem;
            margin: 0 auto ;
            background: #fff;
            position: relative;
            z-index: 95;
            padding: .25rem 1rem 0;
            box-sizing: border-box;


            .search-hd {
                width: 12.5rem;
                height: 1.25rem;
                border:1px solid $blue;
                border-radius: 1rem;
                padding:0 .6rem ;
                box-sizing: border-box;
                text-align: center;
                margin: 0 auto;

                i {
                    color: $blue;
                    font-size: 1rem;
                    margin-top: .15rem;
                    float: left;
                }
                .sfrom {
                    float: left;
                    height: 1rem;
                    width: 8rem;
                    margin-top: .1rem;
                    padding:0 .5rem;
                    color:#333;
                    font-size: .6rem;
                    background: transparent;
                    border:none;
                }
            }
            .search-a {
                color:$blue;
                font-size: 1rem;
                margin-left: .3rem;
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
                font-size: .7rem;
                color:#999;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            }
            .screen_item+.screen_item:after {
                content: "";
                position: absolute;
                left: 0;
                top: .45rem;
                width: 1px;
                height: 0.75rem;
                background: #f0f0f0;
            }
            .screen_item:before {
                content: "";
                position: absolute;
                display:inline-block;
                width:0;
                height:0;
                border-left:.2rem solid transparent;
                border-right:.2rem solid transparent;
                border-top:.2rem solid #999;
                right: .5rem;
                top: .75rem;
            }
            .screen_item-active {
                color:#ffab2e;
            }
            .screen_item.screen_item-active:before{
                border-top:.2rem solid #ffab2e;
                transform:rotate(180deg);
                -webkit-transform:rotate(180deg);
            }
            .screen_item:last-child:before {
                content: "";
                border-top:0rem solid transparent;
            }
        }
    }
    .list-bd {
        padding:3.8rem 0 3rem;
    }
</style>

