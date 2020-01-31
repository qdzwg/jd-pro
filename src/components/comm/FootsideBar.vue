<template>
     <div class="footer-box">
       <div class="footer-tabbar">
          <router-link :to="{ path:'/'}"  tag="a" class="footer-tabbar-item" id="fA">
              <i  class="icon iconfont icon-zhangdan1"></i>
              <p>工作计划</p>
          </router-link>
          <router-link :to="{ path:'/account' }"  tag="a" class="footer-tabbar-item"  id="fB">
              <i  class="icon iconfont icon-xiaofei"></i>
              <p>导游报账</p>
          </router-link>
          <router-link :to="{ path:'/manage/calendar' }"  tag="a" class="footer-tabbar-item"  id="fC">
              <i  class="icon iconfont icon-renshiguanli"></i>
              <p>人事管理</p>
          </router-link>
          <router-link :to="{ path:'/member' }"  tag="a" class="footer-tabbar-item"  id="fD">
              <i  class="icon iconfont icon-geren"></i>
              <p>个人中心</p>
          </router-link>
      </div>
    </div>
</template>
<script>

export default {
    name:'footsidebar',
    mounted() {
        // 检测是否需要高亮
        if(this.$route.meta.active && this.$route.meta.active!=undefined) {
            let id = this.$route.meta.active;
            $('#'+id).addClass('router-link-exact-active router-link-active');
        }
    }
}
</script>
<style scoped lang="scss">
    .footer-box{
      height: 2.6rem;
      width:100%;
    }
    .footer-tabbar{
        position: fixed;
        background-color: #fafafa;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        right: 0;
        bottom: 0;
        left: 0;
        text-align: center;
        z-index:90;
        height: 2.6rem;

        &:after {
            color: #d9d9d9;
            content: " ";
            width: 100%;
            height: 1;
            border-top: 1px solid;
            top: 0;
            left: 0;
            position: absolute;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            -webkit-transform: scaleY(.5);
            transform: scaleY(.5);
        }

        .footer-tabbar-item {
            display: block;
            padding: 7px 0;
            -webkit-box-flex: 1;
            -ms-flex: 1;
            flex: 1;
            color:#657694;
            p{ font-size: .6rem }
        }
        .footer-tabbar-item.router-link-exact-active { background:transparent; }
        .footer-tabbar-item.router-link-exact-active i{ color: #529cff; }
        .footer-tabbar-item.router-link-exact-active p{ color: #529cff; }

        i.icon {
            display: block;
            margin-bottom: .3rem;
            color:#666;
            font-size: 1rem;
        }
    }
</style>

