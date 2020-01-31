<template>
  <div>
    <div class="page-line"></div>
    <mt-cell title="姓名" :value="user.guiderName"></mt-cell>
    <mt-cell title="性别" :value="sex"></mt-cell>
    <mt-cell title="导游证号" :value="user.dyz"></mt-cell>
    <mt-cell title="联系电话" :to="{path:`editContact/${user.mobile}`}" isLink>
      <span class="c-5">{{user.mobile}}</span>
    </mt-cell>
    <div class="out-btn" @click="goOut">退出账号</div>
  </div>
</template>
<script>
  import { Cell,MessageBox } from 'mint-ui';
  import API from '../../http/api'
  import cookie from '../../assets/js/cookie.js'
  export default{
    name:'MemberInfo',
    data(){
      return{
        user:{  //用户信息
          guiderName:"暂无",
          sex:"",
          dyz:"",
          mobile:""
        },
      }
    },
    mounted(){
      this.initUserInfo();
    },
    computed:{
      sex:function(){
        switch (this.user.sex) {
          case 0:
            return '男'
            break;
          case 1:
            return '女'
            break;
          default:
            return '未知'
            break;
        }
      },
    },
    methods:{
      initUserInfo(){
        this.axios.get(API.MemberInfo)
          .then(res=>{
            if(res.data.success) {
              let mem = res.data.data;
              this.user.guiderName = mem.guiderName;
              this.user.sex = mem.sex;
              this.user.dyz = mem.dyz;
              this.user.mobile = mem.mobile;
            }
          })
          .catch(err=>{
            MessageBox.alert(err);
          })
      },
      goOut(){
        this.$store.commit('logout');
        MessageBox.confirm('', {
          message: '确定退出登录？',
          title: '提示',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(action => {
          if (action == 'confirm') {
            cookie.clearAllCookie();
            this.$router.push('/login');
          }
        }).catch(err => {
          if (err == 'cancel') {
          }
        });
      }
    }
  }
</script>
<style scoped lang="scss">
  .c-5 { color:#529cff}
  .out-btn{
    width:100%;
    height: 2rem;
    line-height:2rem;
    color: #fa5353;
    font-size: 0.7rem;
    text-align: center;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
    margin-top: 0.5rem;
  }
</style>
