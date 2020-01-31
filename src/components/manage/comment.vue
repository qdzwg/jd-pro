<template>
  <div>
    <div class="comment-box">
      <div class="tit"><i class="iconfont icon-tubiao-feiji"></i>线路评分</div>
      <div class="item" v-for="(item,index) in htmlDataOne" :key="index">
        <label>{{item.name}}</label>
        <div class="love">
          <i class="iconfont icon-aixinshixin" :class="[(index<=form[item.formName])?'addon':'']" v-for="index in loveNum" @click="addLove(index,item.formName)" :key="index"></i>
        </div>
      </div>
    </div>
    
    <div class="comment-box">
      <div class="tit"><i class="iconfont icon-daoyourenyuan"></i>导游评分</div>
      <div class="item" v-for="(item, index) in htmlDataTwo" :key="index">
        <label>{{item.name}}</label>
        <div class="love">
          <i class="iconfont icon-aixinshixin" :class="[(index<=form[item.formName])?'addon':'']" v-for="index in loveNum" @click="addLove(index,item.formName)" :key="index"></i>
        </div>
      </div>      
    </div>
    <div class="comment-box">
      <div class="tit"><i class="iconfont icon-tubiao-feiji"></i>其他</div>
      <div class="item" v-for="(item, index) in htmlDataThree" :key="index">
        <label for="">{{item.name}}</label>
        <div class="love department-r">
          <span class="shifou-name" v-if="!item.isShow">否</span>
          <span class="switch" :class="{on:item.isShow}" @click.stop="switchDepartment(item, index)">
            <div class="switch-circle" :class="{right:item.isShow}"></div>
          </span>
          <span class="shifou-name ml0" v-if="item.isShow">是</span>
        </div>
      </div>
    </div>
    <div class="comment-box">
      <textarea
        placeholder="导游满足您的期待吗？说说您在团上的心得，好让我们更好的改进吧~"
        class="textarea"
        maxlength="500"
      v-model="form['content']">
      </textarea>
    </div>
    <div class='sub-btn' @click="submitFun">提交评价</div>
  </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
  import API from '../../http/api';
  export default {
    name:'Comment',
    data(){
        return {
          loveNum:5,
          
          //线路评分
          htmlDataOne:[
            {name:'餐饮',formName:"restStar"},
            {name:'司机服务',formName:"driverStar"},
            {name:'车辆卫生',formName:"carStar"},
            {name:'景点线路',formName:"parkStar"}
          ],
          //导游评分
          htmlDataTwo:[
            {name:'导游态度',formName:"guiderServerStar"},
            {name:'导游讲解',formName:"guiderExplainStar"}
          ],
          htmlDataThree:[
            {name: '强迫自费', formName: 'forceOwnexpenses', isShow: false},
            {name: '强迫购物', formName: 'forceShopping', isShow: false},
            {name: '变更行程', formName: 'changeRoute', isShow: false}
          ],
          form:{
            "guiderServerStar":1,
            "guiderExplainStar":1,
            "driverStar":1,
            "parkStar":1,
            "restStar":1,
            "carStar":1,
            "content":'',
            "commentType":1,
            "remark":'',
            "paramId":'',
            "forceOwnexpenses": 0,
            "forceShopping": 0,
            "changeRoute": 0
          }
        }
    },
    mounted(){      
      this.form.paramId = this.$route.query.paramId;
    },
    methods:{
      addLove(index,o) {
        this.form[o]=index;
      },
      //是否选择
      switchDepartment(item, index) {
        item.isShow=!item.isShow;       
        this.form[item.formName] = item.isShow ? 1 : 0;        
      },
      submitFun() {
        // console.log(this.form)
        this.axios.post(API.Comment,this.$qs.stringify(this.form))
          .then(res=>{
            MessageBox.alert(res.data.message);
          })
      }
    }
  }
</script>
<style scoped lang="scss">
  .comment-box{
    padding: 0.5rem;
    width: 100%;
    box-sizing: border-box;
    margin-top: 10px;
    background: #fff;
    border-top: 1px solid #e5e7e7;
    border-bottom: 1px solid #e5e7e7;
    .tit{
      color: #333;
      font-size: 0.7rem;
      margin-bottom: 0.5rem;
      i{
        color: #b4b4b4;
        margin-right: 0.4rem;
        font-size: 0.8rem;
        vertical-align: top;
      }
    }
  }
  .item{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    line-height: 1.5rem;
    label{
      flex: 1;
      color: #666;
      font-size: 0.6rem;
      text-align: right;
      padding-right: 0.25rem;
    }
    .love{
      flex: 5;
      i{
        margin-left: 0.8rem;
        color: #e2e2e2;
        font-size: 0.9rem;
      }
      i.addon{
        color: #ff4526;
      }
    }
    .department-r {
      // line-height: 1rem;
      font-size: 0.6rem;
      color: #454545;
      // margin-left: 0.8rem;
      .switch{
        display: inline-block;
        width: 1.5rem;
        height: 1rem;
        background: #DBDBDB;
        border-radius: 1rem;
        position: relative;
        vertical-align: middle;
        margin-left: 0.25rem;
        .switch-circle{
          position: absolute;
          left: 0.05rem;
          top: 0.1rem;
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
          background: #fff;
        }
      }
      .on{
        margin-left: 0.8rem;
        background: -webkit-linear-gradient(left, #fa664d, #ff4526);
        background: -o-linear-gradient(right, #fa664d, #ff4526 );
        background: -moz-linear-gradient(right, #fa664d , #ff4526);
        background: linear-gradient(to right, #fa664d, #ff4526);
      }
      .right{        
        transform :translateX(0);
        animation: bounceInLeft 3s linear 1;  
        animation-fill-mode:forwards;   
      }
      .shifou-name{
        margin-left: 0.8rem;
      }
      .ml0{
        margin-left: 0
      }
    }

  }
  .textarea{
    width: 100%;
    padding: 0.3rem 0.2rem;
    border-top: 1px solid #e5e7e7;
    font-size: 0.6rem;
    color: #aaa;
    margin-top: 0.4rem;
    min-height: 5.6rem;
    box-sizing: border-box;
  }
  .sub-btn{
    display: block;
    width: 85%;
    height: 1.9rem;
    line-height: 1.9rem;
    text-align: center;
    color: #fff;
    font-size: 0.65rem;
    background: #529cff;
    margin: 0.8rem auto 0;
    border-radius: 4px;
  }
  @keyframes bounceInLeft {
    0% {     
      left: 0.6rem;     
    }    
    50% {
      left: 0.6rem;      
    }  
    100% {
      left: 0.6rem;      
    }
  }
</style>
