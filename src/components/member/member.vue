<template>
  <div>
    <div class="member-top">
      <router-link :to="{path:'/memberInfo'}">
        <div class="img-box"><img :src="urlImg"></div>
        <div class="member-info">
          <div class="name">{{user.loginName}}<span>{{phone||'暂无号码'}}</span></div>
        </div>
        <i class="link-on"></i>
      </router-link>
    </div>
    <div class="page-line"></div>
    <mt-cell title="带团线路" to="/" is-link>
      <span class="c-r f-12">{{tripNum}}</span>
      <i slot="icon" class="iconfont icon-xianlu"></i>
    </mt-cell>
    <mt-cell title="短信模板管理" to="/msgList" is-link>
      <i slot="icon" class="iconfont icon-duanxin"></i>
    </mt-cell>
    <mt-cell title="登录密码" is-link :to="{path:`editContact/${phone}`}">
      <span class="f-12">修改</span>
      <i slot="icon" class="iconfont icon-mima"></i>
    </mt-cell>
    <mt-cell title="安全中心">
      <i slot="icon" class="iconfont icon-anquan"></i>
    </mt-cell>
    <div class="page-line"></div>
    <mt-cell title="通用">
      <i slot="icon" class="iconfont icon-tongyongtubiao"></i>
    </mt-cell>
    <div @click="shipClick()">
      <mt-cell title="分车分餐">
        <i slot="icon" class="iconfont icon-bangding"></i>
      </mt-cell>
    </div> 
    <div @click="guiderInfo()">
      <mt-cell title="导游信息">
        <i slot="icon" class="iconfont icon-bangding"></i>
      </mt-cell>
    </div>   
    
    <div class="page-line"></div>
    <footside-bar></footside-bar>
  </div>
</template>
<script>
  import {MessageBox} from 'mint-ui';
  import FootsideBar from '../comm/FootsideBar'
  import API from '../../http/api'

  /**  无待分配行程    */
  const ASSIGN_STATUS_NONE = 0;
  /**  待分餐    */
  const ASSIGN_STATUS_WAIT = 1;
  /**  已分过  */
  const ASSIGN_STATUS_SIGNED = 2;
  /**  分过且已发过短信，无法重分    */
  const ASSIGN_STATUS_FINISH = 3;

  export default {
    name: 'Member',
    components: {
      FootsideBar
    },
    data() {
      return {
        user: {},  // 用户信息
        phone: '',
        tripNum: '',
        status: '', //分车分餐状态
        urlImg: '../../../static/a1.png'
      }
    },
    mounted() {
      this.initUserInfo();
      if (this.$store.state.user)
        this.user = this.$store.state.user;
    },
    methods: {
      initUserInfo() {
        this.axios.get(API.MemberInfo)
          .then(res => {
            if (res.data.success) {
              this.phone = res.data.data.mobile.trim();
              this.tripNum = res.data.tripNum;
            }
          })
          .catch(err => {
            MessageBox.alert(err);
          })
      },
      //分车分餐跳转不同的页面
      shipClick() {
        let that = this
        this.axios.get(API.AssignInfo)
          .then(res => {              
            if (res.data.success) {
              that.status = res.data.status;
              switch (res.data.status) {
                case ASSIGN_STATUS_SIGNED:
                case ASSIGN_STATUS_FINISH:
                  that.$router.push({path: '/sendMsg', query: {status: that.status}})
                  break;
                case ASSIGN_STATUS_WAIT:
                  that.$router.push({path: '/splitMeals'});
                  break;
                case ASSIGN_STATUS_NONE:
                default:
                  MessageBox('提示', res.data.message ? res.data.message : "系统异常")
              }
            } else {
              MessageBox('错误', res.data.message ? res.data.message : "系统异常");
            }
          })
          .catch(err => {
            MessageBox.alert(err);
          })
      },
      guiderInfo() {
        this.axios.get(API.GuiderInfo)
          .then(res => {            
            if (res.data.success) {
              this.$router.push({path: '/guiderInfo'});            
            } else {
              MessageBox('错误', res.data.message ? res.data.message : "系统异常");
            }
          })
          .catch(err => {
            MessageBox.alert(err);
          })
      }
    }


  }
</script>
<style scoped lang="scss">
  .c-r {color : #fa5353;}
  .f-12 {font-size : 0.55rem;}
  .member-top {
    height             : 4.5rem;
    background         : #fff;
    padding            : 0.6rem 18px;
    -webkit-box-sizing : border-box;
    -moz-box-sizing    : border-box;
    box-sizing         : border-box;
    position           : relative;
    margin-top: 2rem;
    a {
      display  : block;
      position : relative;
    }
    .img-box {
      display        : inline-block;
      vertical-align : middle;
      width          : 3rem;
      height         : 3rem;
      border-radius  : 50%;
      overflow       : hidden;
      background     : #f0f0f0;
      img {
        width  : 100%;
        height : 100%;
      }
    }
    .member-info {
      display        : inline-block;
      vertical-align : middle;
      .name {
        font-size   : 0.7rem;
        line-height : 1rem;
        margin-left : 0.5rem;
        span {
          color     : #999;
          font-size : 0.6rem;
          display   : block;
        }
      }
    }
  }
  .mint-cell-title {
    i, span {
      display        : inline-block;
      vertical-align : middle;
    }
    i {
      color        : #67a8ff;
      font-size    : 0.8rem;
      margin-right : 0.4rem;
    }
    span {
      font-size : 0.7rem;
    }
  }
</style>
