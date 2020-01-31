<template>
  <div class="template">
    <template v-if="result.opType!=='modify'">
      <div class="ntitle">{{result.opTitle}}</div>
      <div class="ntime">{{result.createTime}}</div>
      <div class="ncontent">
        <br/>
        <div  v-html="result.opContent"></div>
      </div>
      <div class="vistor-list"  v-if="result.fields" style="margin-top: 10px;">
        <div class="tripBox">
          <p v-for="(item) in result.fields">
            <label style="font-weight: 500;">行程编号：{{tripNo}}</label><br>
            <i class="iconfont icon-biangeng1"></i><em>{{item.itemName}}&nbsp;&nbsp;</em>
            <span>
              <span style="color: crimson;">{{item.beforeVal}}</span>
              <span>&nbsp;变更为&nbsp;</span>
              <span style="color: green">{{item.afterVal}}</span>
              <span>{{item.fieldName}}:&nbsp;&nbsp;</span>
            </span>
          </p>
        </div>
        <label class="label-box">
        </label>
      </div>
    </template>
    <template v-else>
      <div class="vistor-list"  v-if="result.cisTripBodyList">
        <div class="tripBox">
          行程编号：{{tripNo}}
          <span v-if="result.cisTripBodyList">{{result.cisTripBodyList.createTime}}</span>
        </div>
        <label class="label-box">
            <div class="top">
              <span>联系方式：<em :class="{'c-red':field('tel')}">{{result.cisTripBodyList.tel}}</em></span>
              <span v-if="result.cisTripBodyList.sex&&result.cisTripBodyList.sex!=''">性别：<em :class="{'c-red':field('sex')}">{{result.cisTripBodyList.sex=='female'?'女':'男'}}</em></span>
            </div>
            <div class="info">
              <p>
                <i class="iconfont icon-geren"></i><em>姓名：</em>
                <span :class="{'c-red':field('name')}">{{result.cisTripBodyList.name}}</span>
              </p>
              <p>
                <i class="iconfont icon-shenfenzheng"></i><em>证件号码：</em>
                <span :class="{'c-red':field('certNo')}">{{result.cisTripBodyList.certNo}}</span>
              </p>
              <p>
                <i class="iconfont icon-dizhi1"></i><em>接站地址：</em>
                <span :class="{'c-red':field('meetAddr')}">{{result.cisTripBodyList.meetAddr}}</span>
              </p>
              <p>
                <i class="iconfont icon-dizhi1"></i><em>送站地址：</em>
                <span :class="{'c-red':field('deliverAddr')}">{{result.cisTripBodyList.deliverAddr}}</span>
              </p>
            </div>
        </label>
      </div>
    </template>
  </div>
</template>
<script>

  import Api from '../../http/api';
  export default {
    name: 'NewsDetail',
    components:{
    },
    data(){
      return {
        id:'',
        tripNo:'',
        result:{}
      }
    },
    mounted(){
      this.id=this.$route.params.id;
      this.tripNo=this.$route.query.tripNo;
      this.axios.get(Api.NewsDetail,{params:{id:this.id}})
        .then(res=>{
            this.result = res.data.data;
        });
    },
    methods:{
      //修改过的信息添加class
      field(name){
        let flag = false;
        for(let i=0;i<this.result.fields.length;i++){
          if(name==this.result.fields[i].fieldName){
            flag=true;
          }
        }
        return flag;
      }
    },
    computed:{

    }
  }
</script>
<style lang="scss" scoped>
  .c-red{color: #fa5353!important;}
  .ntitle{
    color: #333;
    font-size: 0.7rem;
    text-align: center;
    line-height: 2rem;
    padding: 0 0.5rem;
  }
  .ntime{
    font-size: 0.55rem;
    color: #999;
    padding: 0 0.5rem;
  }
  .ncontent{
    color: #666;
    font-size: 0.6rem;
    line-height: 1.2rem;
    padding: 0 0.5rem;
  }
  .vistor-list{
    background: #fff;
    padding: 0 0.5rem;
    border-top:1px solid #f0f0f0;
    border-bottom:1px solid #f0f0f0;
    box-sizing: border-box;
    margin-bottom: 0.2rem;
    margin-top: 0.2rem;
    width:100%;
    .tripBox{
      font-size: 0.6rem;
      color: #666;
      border-bottom: 1px solid #f0f0f0;
      line-height: 1.8rem;
      span{
        float: right;
        font-size: 0.55rem;
        color: #999;
      }
    }
    .label-box{
      display: block;
      width:100%;
      height: 100%;
    }
    .top{
      line-height:1.35rem;
      font-size: 0.55rem;
      color: #333;
      border-bottom: 1px solid #f0f0f0;
      span{
        margin-right: 1.9rem;
        em{
          color: #999;
        }
      }
    }
    .info{
      padding: 0.3rem 0;
      p{
        color: #999;
        font-size: 0.6rem;
        line-height:0.95rem;
        i{
          color: #95c2ff;
          display: inline-block;
          width: 0.9rem;
          text-align: center;
          vertical-align: middle;
          font-size:0.65rem;
        }
        em{
          color: #333;
        }
      }
    }

  }
</style>
