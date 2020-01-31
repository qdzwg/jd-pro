<template>
  <div>
    <transition name="fade">
      <div class="calendar-dialog" v-if="calendar4.show">
        <div class="calendar-dialog-mask" @click="closeByDialog"></div>

        <div class="calendar-dialog-body">
          <calendar :multi='calendar4.multi'
            :myLoadDay="calendar4.list"
            :range="calendar4.range"
            :zero="calendar4.zero"
            :lunar="calendar4.lunar"
            :begin="calendar4.begin"
            :end="calendar4.end"
            :todayWord = "todayWord"
            @select="calendar4.select"
            @selectYear="calendar4.selectYear"
            @setToday="calendar4.setToday"
            @next="calendar4.next"
          @prev="calendar4.prev">
            <transition name="slide-fade">
              <div class="thing-list" v-if="dayThingShow">
                <!--有行程安排-->
                <template v-if="dayThing.type==2">
                  <div class="travelBox">
                    <div class="title"><span>{{dayThing.data.parkName}}</span>{{dayThing.data.hotelName}}<em>by{{ dayThing.data.transportation }}</em></div>
                    <div class="content">
                      <div class="item import">
                        <!-- <div class="time">06:40</div> -->
                        <div class="item-info">
                          <div class="txt" v-html="dayTcontext"></div>
                          <!-- <h4>{{ item.hotelName || '暂无' }}</h4> -->
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else-if="dayThing.type==1">
                  <div class="tit">您已请假</div>
                </template>
                <template v-else-if="!dayThing.type">
                  <div class="tit">{{dayThing.message}}</div>
                </template>

              </div>
            </transition>
          </calendar>

        </div>

      </div>
    </transition>

    <footside-bar></footside-bar>
  </div>
</template>
<script>
  import FootsideBar from '../comm/FootsideBar';
  import Api from '../../http/api';
  import calendar from './components/calendarPage';
  import { MessageBox } from 'mint-ui';
  export default {
    name:'Manage',
    components:{
      FootsideBar,
      calendar
    },
    data(){
      return {
        todayWord:'今天',
        dayThingShow:false,//日程安排显示
        dayThing:{},//日程安排
        calendar4:{
          display:"2018/12/11 ~ 2018/12/30",
          multi:false,
          show:true,
          range:false,
          zero:true,
          begin:[],
          end:[],
          lunar:false, //显示农历
          list:{
            plans:[],
            vacation:[]
          },
          select:(begin,end)=>{
            //目前只判断了apply的状态
            let obj = event.target;
            if(obj.getAttribute('myon')){
              //请假的状态提示
              MessageBox.alert('已请假')
            }else if(obj.getAttribute('tripNo')){
                let tripNo = obj.getAttribute('tripNo');
                this.$router.push({path:`/planDetails/${tripNo}/1`})
            }

//            this.calendar4.show=true;
//            this.calendar4.value=[begin,end];
//            this.calendar4.display=begin.join("/")+" ~ "+end.join("/");
          },
          next:(m,y)=>{
            this.loadMore(y,m);
          },
          prev:(m,y)=>{
            this.loadMore(y,m);
          },
          selectYear:(m,y)=>{
            this.loadMore(y,m);
          },
          setToday:(d,m,y)=>{
              //动画
//            let table=document.querySelector('.calendar-table');
//            if($(table).hasClass('addToday')){
//              $(table).removeClass('addToday')
//            }else{
//              $(table).addClass('addToday');
//            }
            //跳到今天的页面
            this.loadToday();
            //点收起时不跳到今天的日历
            if(this.dayThingShow){
              this.loadMore(y,m);
            }
            //还缺个请求今天的日程
//            this.dayThingShow=!this.dayThingShow;
          },
        },

      }
    },
    methods:{
      closeByDialog(){
        this.calendar4.show=false;
      },
      loadMore(year,month){
          let params = {
              month:year+'-'+month
          }
          this.axios.get(Api.ManCalendar,{params:params})
            .then(res=>{
//                console.log(res);
                this.calendar4.list = res.data.data;
            })
      },
      dateChange(date){
        date = new Date(date);
        let year = date.getFullYear(),
          month = this.time(date.getMonth()+1),
          day =this.time(date.getDate());
        return year+'-'+month+'-'+day;
      },
      time(s){
        return (+s<10?('0'+s):s);
      },
      nextday(date){
        date = new Date(date);
        return this.dateChange(date.setDate(date.getDate()+1));
      },
      // 加载今天 事项
      loadToday(){
        if(!this.dayThingShow) {
          this.dayThingShow=true;
          this.todayWord = '收起';
          this.axios.get(Api.Today)
            .then(res=>{
              console.log(res);
              console.log(res.data);
              this.dayThing = res.data;
            })
        }else{
          this.dayThingShow=false;
          this.todayWord = '今天';
        }
      }
    },
    mounted(){
      let today = new Date(),
        year = today.getFullYear(),
        month = today.getMonth()+1,
        day = today.getDate();
      //日历能选择的开始时间和结束时间
      this.calendar4.begin = [year,month,day];
      this.calendar4.end = [year+10,11,31];
      this.loadMore(year,month);
    }
  }
</script>
<style scoped lang="scss">
  .slide-fade-enter-active {
    transition: all .3s ease 0.3s;

  }
  .slide-fade-leave-active {
    transition: all .3s ease ;
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {

    opacity: 0;
  }
  .thing-list{
    // position: absolute;
    // left:0;
    // top:6rem;
    width:100%;
    .tit{
      color: #333;
      font-size: 0.7rem;
      text-align: center;
    }
  }
  .thing{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    color: #333;
    font-size: 0.7rem;
    padding: 0.5rem 0;

    label{
      flex: 1;
      text-align: center;
    }
    span{
      flex: 4;
    }
  }
  .travelBox{
    background: #fff;
    margin-bottom: 0.25rem;
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
