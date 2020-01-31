<template>
    <div class="filed"
        :class="[isAllBorder?allBorder:btmBorder,isW60?codeNoCircleFiled:'']">
        <i v-if="icon" :class="icon" class="icon"></i>
        <input type="text" class="filed-inp"
            :placeholder="placeholder"
            :value="currentValue"
            :type="type"
            :class="[srcCode|| btnText?w50:'',isW60?w70:'',icon?left1:'']"
            @input="handleInput"
            @blur = 'blurInput'
        />
        <!--<img v-if="srcCode" :src="srcCode" class="code"/>-->
        <template v-if="isValidateCode">
            <identify :contentWidth="100" :fontSizeMin="26" :identifyCode="identifyCode"></identify>
            <span class="refreshLayer" @click="refreshCode"></span>
            <i v-if="typeof currentValue!=='undefined' && currentValue !== ''" :class="[currentValue === identifyCode ? 'icon-right':'icon-wrong','validateResultIcon','icon','iconfont']"></i>
        </template>
        <a  v-if="btnText" class="code" ref="codes"  @click="getCode" :class="btnBorder?'':codeNoCircle">{{ btnText }}</a>
    </div>
</template>
<script>
import identify from '../identify'
export default {
  name:'zybFiled',
  props:{
    icon:String, //是否存在图标
    placeholder:String, // 提示值
    value: String,
    type: { //类型
      type: String,
      default: 'text'
    },
    srcCode:String,// 验证码
    btnText:String,// 按钮，验证码
    isAllBorder:Boolean, // 输入框样式
    btnBorder:Boolean, // 按钮是否为圆角
    isW60:Boolean,// 圆角的输入框,
    isValidateCode:Boolean, // 是否开启图片验证
    validateCode:Boolean,  // 验证码输入是否正确
  },
  components:{
      identify
  },
  data(){
        return{
            identifyCodes: '1234567890',
            identifyCode: '',
            currentValue: this.value, //input的值 存放在子组件里,提供操作
            w50:"w-50p",//宽度是50%;
            w70:"w-70p",
            allBorder:'allBorder', // 边框样式
            btmBorder:'border-bottom', // 只有底部边框
            codeNoCircleFiled:'nocirFiled',//没有圆角的输入框
            codeNoCircle:'bor-no-cir', // 按钮没有圆角,
            left1:'input-left1',
            isClick:true,   // 验证码是否可以点击
            countDown:10,   // 倒计时的时间
        }
  },
  mounted(){
      // 开启图形验证
      if(this.isValidateCode){
          this.makeCode(this.identifyCodes, 4);
      }
  },
    methods:{
        handleInput(evt) {
            this.currentValue = evt.target.value;
            this.$emit('change', this.currentValue);
        },
        getCode(){    // 获取验证码
            if(this.isClick) {
                this.isClick = false;
                this.$emit('getCode');
            }
        },
        timeCountDown(){    // 倒计时 默认60s
            var t = setInterval(()=>{
                let $code = this.$refs.codes;
                if(this.countDown == 0){
                    $code.text = "重新获取";
                    $code.style.color = "#83b7ff";
                    $code.style.borderColor = "#83b7ff";
                    this.countDown = 10;
                    this.isClick = true;    // 重置可以点击
                    clearInterval(t);       // 停止计时器
                }else{
                    $code.style.color = "#ccc";
                    $code.style.borderColor = "#ccc";
                    $code.text = "重新发送(" + this.countDown + ")";
                    this.countDown--;
                }
            },1000);
        },
        // 生成一个随机数
        randomNum (min, max) {
            return Math.floor(Math.random() * (max - min) + min)
        },
        refreshCode () {
            this.identifyCode = '';
            this.makeCode(this.identifyCodes, 4)
        },
        makeCode (o, l) {
            for (let i = 0; i < l; i++) {
              this.identifyCode += o[this.randomNum(0, o.length)]
            }
        },
      blurInput(){
          this.$emit('isSameValidateCode',this.currentValue === this.identifyCode);
      }
  }
}
</script>
<style lang="scss" scoped>
    .validateResultIcon {
      position: absolute;
      right: -1.2rem;
      top: 0;
    }

    .input-left1 { left:1rem!important;padding-left: .5rem!important;}
    .w-50p {width: 50%!important;}
    .w-70p {width: 70%!important;}
    .refreshLayer {
      position: absolute;
      z-index: 2;
      right: 0;
      top: 0;
      width: 100px;
      height: 40px;
    }
    .filed {
        width: 100%;
        height: 1.75rem;
        line-height: 1.75rem;
        // padding: .5rem 1rem .5rem .5rem;
        margin-bottom:.6rem;
        box-sizing: border-box;
        // display: -webkit-box;
        // display: -ms-flexbox;
        // display: flex;
        position: relative;

        &.allBorder {
            background:#fff;
            border:1px solid #e5e7e7;
            // padding: .3rem 1rem .3rem .5rem;
            width: 100%;
        }
        &.nocirFiled {
            width: 70%;
            padding: 0;
            height: 1.75rem;
            line-height: 1.75rem;
        }


        .icon {
            color:#657694;
            font-size:1rem;
        }
        .validateResultIcon.icon-right {
          color: rgba(116, 210, 0, 0.81);
        }
        .validateResultIcon.icon-wrong {
          color: #f63;
        }
        .filed-inp {
            // -webkit-box-flex: 1;
            // -ms-flex: 1;
            // flex: 1;
            width: 80%;
            font-size: .8rem;
            color:#000;
            // padding-left: .5rem;
            box-sizing: border-box;
            margin-bottom: .2rem;
            position: absolute;
            top: 0;
            line-height: 1.65rem;
            height: 1.65rem;
            left: .5rem;
        }
        .code {
            position: absolute;
            width: 3.7rem;
            height: 1.5rem;
            right: 0;
            bottom: .4rem;
        }
        a.code {
            display: inline-block;
            color:#83b7ff;
            border:1px solid #83b7ff;
            height: 1.25rem;
            line-height: 1.25rem;
            text-align: center;
            font-size: .55rem;
            border-radius: 1rem;
            background:#fff;
        }
        a.code.bor-no-cir {
            border-radius: 0;
            right: -4rem;
            height: 1.7rem;
            line-height: 1.7rem;
            top: 0;
            box-sizing: border-box;
        }

        &.nocirFiled .filed-inp{
        }
    }
</style>


