<template>
    <div class="login" ref="login">
        <div class="login-form">
            <zyb-filed 
                :placeholder="userfiled.placeholder" 
                :type = "userfiled.type" 
                v-model = "form.username"
                @change="changeUser">
            </zyb-filed>
            <zyb-filed 
                :placeholder="codefiled.placeholder" 
                :type = "codefiled.type"
                :btnText="codefiled.btnText"  
                :btnBorder="codefiled.btnBorder"  
                v-model = "form.btnCode"
                @change="changeCode"
                @getCode="getCode" 
                ref="childFunction" >
            </zyb-filed>
            <zyb-filed 
                :placeholder="pwdfiled.placeholder" 
                :type = "pwdfiled.type" 
                v-model = "form.password"
                @change="changepsw">
            </zyb-filed>
            <zyb-filed 
                :placeholder="pwdNfiled.placeholder" 
                :type = "pwdNfiled.type" 
                v-model = "form.passwordNew"
                @change="changepwsN">
            </zyb-filed>
        </div>
        <div class="btn">
            <mt-button size="large" type="primary" @click.native="getForm">确定</mt-button>
        </div>
    </div>
</template>
<script>
import { Button,MessageBox } from 'mint-ui'
import API from '../http/api'
import zybFiled from './comm/zybFiled'
import validation from '../assets/js/validation.js'
import common from '../assets/js/public.js'
export default {
  name:'forget',
  components:{
        zybFiled,
  },
  mounted () {
        let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.$refs.login.style.height = h+"px";
  },
  data(){
    return{
      form:{
            username:'',
            btnCode:'',
            password:'',
            passwordNew:'',
        },
        params:{            // 接口参数
            mobile:"",      // 手机号
            newPass:"",     // 新密码
            identifyCode:"" // 验证码
        },
        userfiled:{
            placeholder:"请输入手机号码",
            type:'number'
        },
        codefiled:{
            placeholder:"请输入验证码",
            type:'number',
            btnText:'获取验证码',
            btnBorder:true,
        },
        pwdfiled:{
            placeholder:"请输入密码",
            type:'password'
        },
        pwdNfiled:{
            placeholder:"请确认新密码",
            type:'password'
        },
    }
  },
  methods:{

    // 获取验证码
    getCode(){  
        this.axios.get(API.GetCode,{params:{mobile:this.form.username}})
            .then(res=>{
                console.log(res.data);
                if(res.data.success) {   // 成功 执行倒计时
                    MessageBox.alert("密码已成功发送至您的手机，请查收");
                    this.$refs.childFunction.timeCountDown();
                }else{
                    MessageBox.alert(res.data.message);
                }
            }).catch(err=>{});
    },
    // 提交表单
    getForm(){
        console.log(this.form);
        if(this.Validate()){
            console.log('通过');
            this.params.mobile = this.form.username;
            this.params.identifyCode = this.form.btnCode;
            this.params.newPass = this.form.password;
            this.axios.get(API.ForgetPwd,{params:this.params})
                .then(res=>{
                    if(res.data.success){
                        common.showToast("重置成功",1000);
                        setTimeout(
                            this.$router.push({name:'Login'})
                            ,1200);
                    }else{
                        common.showToast("出错了",1000);
                    }
                }).catch(err=>{
                    console.log(err);
                    MessageBox.alert(err); 
                });  
        }
    },
    Validate(){
        if(validation.isEmpty(this.form.username)){
            MessageBox.alert('手机号码不能为空');
            return false;
        }else if(validation.checkPhone(this.form.username)){
            MessageBox.alert('请输入正确格式的手机号码');
            return false;
        }else if(validation.isEmpty(this.form.btnCode)){
            MessageBox.alert('验证码不能为空');
            return false;
        }else if(validation.isEmpty(this.form.password)){
            MessageBox.alert('请输入新密码');
            return false;
        }else if(validation.isEmpty(this.form.passwordNew)){
            MessageBox.alert('请输入确认密码');
            return false;
        }else if(validation.checkPwd(this.form.password)){
            MessageBox.alert('密码格式为6-16任意数字和字母');
            return false;
        }else if(validation.isEqual(this.form.password,this.form.passwordNew)){
            MessageBox.alert('两次输入密码不相同');
            return false;
        }else{
            return true;
        }
    },
    changeUser(currentValue){
          this.form.username = currentValue; 
    },
    changeCode(currentValue){
          this.form.btnCode = currentValue; 
    },
    changepsw(currentValue){
          this.form.password = currentValue; 
    },
    changepwsN(currentValue){
          this.form.passwordNew = currentValue; 
    },
  }
  
}
</script>
<style lang="scss" scoped>
  .login { 
        background:#fff; 
        overflow: hidden;
        position: relative;
        margin-top: 2rem;
  }
   .login-form {
            width: 80%;
            margin:1rem auto;
        }

        .btn {
            width: 70%;
            margin:1.75rem auto 0;

            .mint-button {
                border-radius: .8rem;
                height: 1.75rem;
                line-height: 1.75rem;
            }
        }
        .error {
            font-size: .55rem;
            text-align: center;
            color:#ff1138;
        }
</style>


