<template>
  <div class="card shadow" v-if="card">
    <div class="card_hd">
        <span class="title" :class="card.status=='filed'?titleClassEnd:''">{{ card.routeName }}</span>
        <!-- <span class="bubble">{{ card.guideNum }}人</span> -->
        <span class="bubble">{{ card.totalNum }}人</span>
        <span class="state" v-if="card.status == 'zutuan'">组团中</span>
        <span class="state " v-if="card.status == 'chengtuan'">成团</span>
        <span class="state load" v-if="card.status == 'fatuan'">发团</span>
        <span class="state " v-if="card.status == 'init'">新建</span>
        <span class="state " v-if="card.status == 'confirm'">已确认</span>
        <span class="state " v-if="card.status == 'cancel'">取消</span>
        <span class="state " v-if="card.status == 'audited'">已审核</span>
        <span class="state end" v-if="card.status == 'finish'">结束</span>
        <span class="state end" v-if="card.status == 'filed'">已归档</span>
        <span class="state " v-if="card.status == 'toAudit'">送审</span>
    </div>
    <div class="card_bd">
        <p>团号：<span>{{ card.tripNo }}</span></p>
        <p>发团时间：<span>{{ beginTime }}</span></p>
        <div class="ztc_iinfo" v-if="card.routeType == 'ztc'">
          <p >司机姓名：<span>{{ card.driverName }}</span></p>
          <p>车号：<span>{{ card.carNo }}</span></p>
          <p>手机号：<span>{{ card.driverTel }}</span></p>
        </div>
        <div class="link_ft" :class="card.status=='filed' || card.status=='audited' ?linkeClassBtn:''">
            <router-link class="link link-on" :to="{ path:link}">
            </router-link>
            <!--<a v-if="card.status=='1' || card.status=='audited' " class="link link-end">报账</a>-->
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'card',
  props: {
    card:{},// card
    link:''// 路由跳转
  },
  data(){
      return{
          titleClassEnd:'end',// 已经完成的类
          linkeClassBtn:'link_btn',// 链接按钮，报账
      }
  },
  mounted() {

  },
  computed:{
      beginTime() {
        return this.card.planDateBegin.slice(0,10);
      }
  }
}
</script>
<style scoped lang="scss">
    .card {
        background: #fff;
        width: 100%;
        margin:.5rem auto;
        border-radius: 4px;

        .card_hd {
            position: relative;
            padding: .5rem 0 .5rem .5rem;

            &:after {
                content: " ";
                position: absolute;
                left: 0;
                bottom: 0;
                right: 0;
                height: 1px;
                border-bottom: 1px solid #E5E5E5;
                color: #E5E5E5;
                -webkit-transform-origin: 0 100%;
                transform-origin: 0 100%;
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
                left: .5rem;
            }

            span.title {
                color:#529cff;
                // font-weight: bold;
                font-size: .8rem;
                margin-right:.25rem;
            }
            span.title.end {
                color:#95c2ff;
            }

            .bubble {
                display: inline-block;
                background: #fdefde;
                color:#ffa018;
                font-weight: bold;
                font-size: .5rem;
                text-align: center;
                padding: .2rem .3rem;
                border-radius: .4rem;
            }
            .state {
                float: right;
                color:#3ed167;
                font-size: .6rem;
                line-height: 2;
                margin-right: .6rem;
            }
            .state.end { color:#999; }
            .state.load { color:#fa5353; }

        }

        .card_bd {
            position: relative;
            padding: .5rem 0 .5rem .5rem;
          .ztc_iinfo{
            p{
              line-height: 1rem;
            }
          }

            p {
                color:#333;
                font-size:.6rem;
                line-height: 1rem;
                span { color: #999; }
            }
            .link_ft {
                position: absolute;
                right: 1rem;
                top: 1.5rem;

                .link {
                    position: relative;
                }
                .link-on {
                    text-align: right;
                    color: #999999;

                    &:after {
                        content: " ";
                        display: inline-block;
                        height: 6px;
                        width: 6px;
                        border-width: 2px 2px 0 0;
                        border-color: #C8C8CD;
                        border-style: solid;
                        -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                        position: relative;
                        top: -2px;
                        position: absolute;
                        top: 50%;
                        margin-top: -4px;
                        right: 2px;
                    }
                }

                .link-end {
                    width: 3rem;
                    height: 1rem;
                    line-height: 1rem;
                    background:#ffab2e;
                    color: #fff;
                    display: inline-block;
                    font-size: .6rem;
                    text-align: center;
                    border-radius: .5rem;
                }

            }
            .link_ft.link_btn {
                top: 0.7rem;
            }

        }
    }
</style>


