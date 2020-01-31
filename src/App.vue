<template>
  <div id="app">
    <p v-if="$route.meta.back" class="back-div">
      <input type=button  value='返回上一页' @click="$router.history.go(-1)" class="backGo">
    </p>    
    <transition name="fade" mode="out-in">
      <router-view v-if="isRouterAlive"></router-view>
    </transition>
    <!-- <footside-bar v-if="($route.path === '/')||($route.path === '/mine')"></footside-bar> -->
  </div>
</template>

<script>
import './assets/js/$.js'
export default {
  name: 'app',
  //刷新页面需要
  provide () {
    return {
      reload: this.reload
    }
  },
  data(){
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(()=>{
        this.isRouterAlive = true;
      });
    }
  },
  //
  mounted(){
    /** 初始化，规定字体rem
     *  计算方法：尺寸/40
     *  单位：rem
     */
    (function (doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = Math.max(docEl.clientWidth,window.innerWidth || 0);
                if (!clientWidth) return;
                if(clientWidth>640){clientWidth=640}
                docEl.style.fontSize = 40 * (clientWidth / 640) + 'px';
            };
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);
  }
}
</script>

<style>
@import './assets/css/global.css';
@import './assets/css/comm.css';
@import './assets/font/iconfont.css';
.back-div{
  background:#fff;
  background-color: #fff;
  height: 2rem; 
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
 .backGo{
   /* padding: 0.5rem 0; */
   margin: 0;
   color: #ffab2e;
   background:#fff;
   background-color: #fff;
   text-align: center;
   display: block;
   width: 100%;
   font-size: 0.6rem;
   vertical-align: middle;
   border-bottom: 1px solid #f0f0f0;
   height:2rem;
 }
</style>
