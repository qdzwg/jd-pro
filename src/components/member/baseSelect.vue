<template>
    <div class="base-select" @click="showDataList" v-bind:style="{width: widthData}">
        <div class="base-label">班次</div>
      <div class="sub-selected-value">
        {{selectedValue.value}}<!--显示选择的值-->
        <div class="sub-select-list" v-bind:style="{width: widthData2}" v-if="showData">
          <div class="sub-select-item" v-for="(item, index) in dataList" @click.stop="select(item, index)">
            {{item.value}}
          </div>
        </div>
      </div>
  </div>
</template>



<script>
import API from '../../http/api'
export default {
    data(){
        return{
            showData:false
        }
    },
    props: {
      dataList:Array,
      selectedValue: Object,//传回父组件的选择值
      widthData:{
        type: String,
        default: "160px"
      },
      widthData2:{
        type: String,
        default: "160px"
      }
    },
    computed:{
       
    },
    methods: {
      showDataList(){
        this.showData=!this.showData
        
      },
      select(item,index){
        this.showData=false;
        //this.selectedValue=item;
        //赋值的时候要分开写
        this.selectedValue.key=item.key;
        this.selectedValue.value=item.value;
        this.$emit('select');
      },
    },
}
</script>

<style lang="scss">
.base-select {
    position: relative;
    top: 0px;
    float: right;
    // border: 1px solid #ddd;
    height: 2rem;
    background-color: #fff; 
    &:after {
      position: absolute;
      top: 50%;
      right: 5px;
      color:#ccc;
      transform: translateY(-50%);
      content: '';
      width: 0;
      border-top: 5px solid #999;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      height: 0;
    }
    .base-label{
        font-size: 0.7rem;
    font-weight: normal;
    line-height: 2rem;
    margin-left:.5rem;
    }
      .sub-selected-value {
        position: absolute;
        top: 10px;
        left:5.7rem;
        font-size: 15px;
        color:#333;
        .sub-select-list {
          position: absolute;
          top: 33px;
          left:0;
          background: white;
          //width: 160px;
          box-shadow: 1px 1px 1px 1px #D9D9D9;
          z-index: 9;
          .sub-select-item {
            width: auto;
            min-width: 7.25rem;
            height: 2.5rem;
            line-height: 2.5rem;
            position: relative;
            text-align: left;
            img {
              position: absolute;
              top: 50%;
              right: 0;
              transform: translate(-0.1rem, -50%);
              width: .8125rem;
              height: .625rem;
            }
          }
        }
      }
  }
</style>

