<template>
  <div>
      <div class="nodata">
            <i  class="icon iconfont icon-kuliancopy"></i>
            <p>暂无数据</p>
            <p v-if="isAdd">试着添加一条数据</p>
      </div>
  </div>
</template>
<script>
export default {
  name:'noData',
  props:{
      isAdd:Boolean, //是否提示 新增数据
  },
  mounted(){
     // console.log("add:",this.isAdd);
  }
}
</script>
<style lang="scss" scoped>
    .nodata {
        text-align: center;
        margin:2rem 0 1rem;
        i { color:#ccc;font-size: 2.5rem;}
        p {
            padding-top: 1rem;
            color:#b5aeae;
            font-size:.7rem;
        }
    }
</style>


