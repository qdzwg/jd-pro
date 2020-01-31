<template>
    <div class="plan">
      <!--<section class="adminNews shadow" >-->
        <!--<section class="news-panel"  v-if="results.unread>0">-->
          <!--<router-link tag="div" class="tit" :to="{ name: 'NoticeList'}">-->
            <!--<i class="iconfont icon-xiaoxi"></i>系统消息-->
            <!--<span>{{results.unread || 0}}</span>-->
          <!--</router-link>-->
          <!--<ul v-if="results.msgs" style="margin-top: 10px;">-->
            <!--<li v-for="(item,index) in results.msgs"  :key="index" class="new-list border-bottom">-->
                <!--<div class="title" >-->
                  <!--<span>{{item.title }}</span>-->
                  <!--<span style="font-size: 10px">{{ item.createTime }}</span>-->
                <!--</div>-->
                <!--<router-link :to="{name:'NoticeDetail',params:{id:item.id} }" class="btn">查看详情&gt;</router-link>-->
            <!--</li>-->
          <!--</ul>-->
          <!--<div class="no-data" v-else>暂无数据</div>-->
        <!--</section>-->
      <!--</section>-->

      <section class="title">
          <span class="pop">未完结</span>
          <router-link  tag="a" :to="{ name: 'PlanList', params: { status: 'onWork' }}">
              <i class="icon iconfont icon-gengduo"></i>
          </router-link>
      </section>

        <card :card="results.onWork[0]" :link="`/planDetails/${results.onWork[0].tripNo}/0`" v-if="results.onWork&&results.onWork.length>0"></card>
        <span class="no-data" v-else>暂无数据</span>
        <section class="title">
            <span class="pop end">已完结</span>
            <router-link  tag="a" :to="{ name: 'PlanList', params: { status: 'endWork' }}">
                <i class="icon iconfont icon-gengduo"></i>
            </router-link>
        </section>
        <card :card="results.endWork[0]" :link="`/planDetails/${results.endWork[0].tripNo}/0`" v-if="results.endWork&&results.endWork.length>0"></card>
        <span class="no-data" v-else>暂无数据</span>

        <section class="news shadow">
          <section class="news-panel">
            <section class="title">
                <span style="font-weight: bolder">最新消息</span>
              <el-badge :value="results.unread" v-if="results.unread>0" class="item"></el-badge>
              <router-link  tag="a" :to="{ name: 'NoticeList', params: ''}">
                <i class="icon iconfont icon-gengduo"></i>
              </router-link>
            </section>
              <ul v-if="results.msgs">
                <li v-for="(item,index) in results.msgs"  :key="index" class="new-list border-bottom">
                  <router-link  :to="{ name: 'NoticeDetail', params: { id: item.id }}">
                    <span>{{ item.createTime }}</span>
                    <span :class="item.status=='未读'?'unread':''">{{item.status}}</span>
                    <label class="ovr-hid">{{ item.title }}</label>
                  </router-link>
                </li>
              </ul>
              <div class="no-data" v-else>暂无数据</div>

          </section>
        </section>

        <footside-bar></footside-bar>
    </div>
</template>
<script>
import FootsideBar from '../comm/FootsideBar'
import card from '../comm/card'
import Api from '../../http/api';
export default {
    name:'Plan',
    components:{
        FootsideBar,
        card
    },
    data(){
        return{
            results:{}
        }
    },
    mounted(){        
        this.axios.get(Api.Index)
          .then(res=>{
              console.log(res);
            let msgs = res.data.msgs;
            if(msgs instanceof Array) {
              msgs.forEach((item,index)=>{
                if (item && item.createTime)
                  item.createTime=item.createTime.substr(5,11)
              });
            }
            console.log(res.data,'122');
            this.results = res.data;
          });
        console.log("首页：",this.$store.state);
    }
}
</script>
<style scoped lang="scss">
    .plan {
        padding: .5rem;
        .adminNews{
            background: #fff;
            border-radius: 0.4rem;
            padding: .5rem .5rem 0;
            margin-bottom: .5rem;

            .tit{
                overflow: hidden;
                font-size: 0.6rem;
                color: #000;
                line-height: 1.15rem;
                i{
                    display: inline-block;
                    vertical-align: middle;
                    background: #ffab2e;
                    color: #fff;
                    border-radius: 50%;
                    width: 1.15rem;
                    text-align: center;
                    margin-right: 0.4rem;
                    font-size: 0.55rem;
                }
                span{
                    float: right;
                    color: #fff;
                    font-size: 0.55rem;
                    width: 0.75rem;
                    height: 0.75rem;
                    text-align: center;
                    line-height:0.75rem;
                    background: #fa5353;
                    border-radius: 50%;
                    margin-top: 0.15rem;
                }
            }
            .content{
              overflow: hidden;
              font-size: 0.6rem;
              color: #666;
              border-bottom: 1px solid #f0f0f0;
              line-height: 1.3rem;
              margin-top: 0.3rem;
              em{
                float: right;
                font-size: 0.55rem;
              }
            }
            .btn{
              display: block;
              line-height: 1.5rem;
              color: #999;
              font-size: 0.6rem;
              position: relative;
            }
        }

        .title {
            height: 1rem;
            overflow: hidden;
            font-size: .6rem;

            .pop {
               display: inline-block;
               width: 3.25rem;
               height: 1rem;
               line-height: 1rem;
               text-align: center;
               color:#fff;
               background:#529cff;
               border-radius: .4rem;
               position: relative;
               text-indent: 8px;

               &:after {
                   content:"";
                   position: absolute;
                   top: .35rem;
                   left: 0.5rem;
                   width: 8px;
                   height: 8px;
                   background: #fff;
                   border-radius: 50%;
               }
            }
            .pop.end {background:#95c2ff;}

            i {
                float: right;
                color:#529cff;
                font-size: 1.1rem;
            }
        }

        .news {
            width: 100%;
            background:#fff;
            font-size: .6rem;
            border-radius: 4px;

            .news-panel{
                padding: .6rem 0 .1rem .5rem;

                .new-hd {
                    padding-bottom:.5rem;
                }
                .new-list {
                    height: 2rem;
                    line-height: 2rem;
                    span.unread{color: red;}
                    &:last-child {background-image: none;}
                    p {
                        color:#666;
                        display: inline-block;
                        width: 60%;
                    }
                    span{
                        color:#999;
                        float: right;
                        margin-right: .7rem;
                    }
                    .ovr-hid{
                        width: 7rem;
                        display: inline-block
                    }
                }
            }
        }
    }
  .no-data{
    background:#fff;
    display: block;
    margin: .5rem auto;
    border-radius: 4px;
    font-size: 0.6rem;
    line-height: 2rem;
    text-align: center;
  }
</style>
