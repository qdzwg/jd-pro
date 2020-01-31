<template>
  <div class="footer-btn-box">
    <div class="footer-btn">
      <div class="btn tui-btn" @click="first">{{text[0]}}</div>
      <div class="btn send-btn" v-if="text[1]" @click="last">{{text[1]}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'footbtn',
    props:['text','hideIndex'],
    data(){
      return {
      }
    },
    mounted() {
        console.log(this.hideIndex)
    },
    methods:{
      first(){
          let a='我';
          this.$emit('firstCli',a);
      },
      last(){
          this.$emit('lastCli');
      }
    }
  }
</script>
<style scoped lang="scss">
  .footer-btn-box{
    height: 2rem;
    width: 100%;
  }
  .footer-btn{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    overflow: hidden;
    position: fixed;
    bottom:0;
    left: 0;
    z-index:999;
    width:100%;
    .btn{
      height:2rem;
      display: block;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      font-size: 0.7rem;
      text-align: center;
      line-height:2rem;
      background: #fff;
      color: #529cff;
    }
    .send-btn.btn{
      background: #ffab2e;
      color: #fff;
    }
  }
</style>
