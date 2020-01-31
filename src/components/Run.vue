<template>
  <div class="template">
    <div class="side-wapper">
      <div class="wap-cell">
        <run-cell v-for="(n,index) in 2" :key="index"
        :btnText_pri = "cell1.btnText"
        :btnText_warn = "cell1.btnText2"
        height = "3"
        :src = "cell1.src"
        :datas = "cell1.conObj2[index]"
        ></run-cell>
        <run-cell v-for="(n,index) in 2" :key="index"
        height = "4"
        :src = "cell2[index].src"
        :title = "cell2[index].title"
        :time = "cell2[index].time"
        :addr = "cell2[index].addr"
        :num = "cell2[index].num"
        :status = "cell2[index].status"
        ></run-cell>
      </div>
      <!-- <router-link :to="{ path:'index' }" tag="a">跳转至主页</router-link> -->
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import runCell from './comm/runCell'

export default {
  name: 'run',
  components:{
    runCell,
  },
  data () {
    return {
      cell1:{ //带有btn的cell
        btnText:'接受',
        btnText2:'拒绝',
        src:require("./../assets/images/comm/err-img.png"),
        conObj:[
          { name:'张三', id:'11205090', level:'0' },
          { name:'梁朝伟', id:'312312312', level:'1' },
          { name:'刘德华', id:'11205090', level:'2' }
        ],
        conObj2:[
          { name:'张三', sex:'0',age:'27', mark:'我是张三，希望能加入你们的跑团哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈' },
          { name:'梁朝伟', sex:'1', age:'30',mark:'我是梁朝伟，希' },
          { name:'刘德华', sex:'0', age:'28',mark:'我是刘德华，希望能加入你们的跑团、哈哈哈哈哈' },
        ],
      },
      cell2: [//多行文字的cell
        {
          src:require("./../assets/images/comm/aaa.jpg"),
          title:'杭州西湖跑团城市定向赛',
          time:'17/09/04 18:00 - 17/09/04 20:00',
          addr:'杭州西湖音乐喷泉广场',
          num:'100',
          status:'1'
        },
        {
          src:require("./../assets/images/comm/bbb.jpg"),
          title:'杭州西湖跑团城市定向赛',
          time:'17/09/04 18:00 - 17/09/04 20:00',
          addr:'杭州西湖音乐喷泉广场',
          num:'100',
          status:'0'
        }
      ]
    }
  },
  mounted() {
  }
}
</script>

<style  lang="scss">
  .side-wapper {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    padding-bottom: 2.8rem;
    box-sizing:border-box;
    margin-top: 2rem;
  }
  .wap-cell {
    width: 100%;
  }
</style>
