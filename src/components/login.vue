<template>
    <div class="login" ref="login">
        <div class="title">
            <img src="../assets/images/comm/login22.png" alt="">
        </div>
        <div class="login-form">
            <zyb-filed :icon="userfiled.userIcon"
                :placeholder="userfiled.placeholder"
                :type = "userfiled.type"
                v-model = "form.loginName"
                @change="changeUser"
            >
            </zyb-filed>
            <zyb-filed :icon="pwdfiled.userIcon"
                :placeholder="pwdfiled.placeholder"
                :type = "pwdfiled.type"
                v-model = "form.loginPass"
                @change="changePwd"
            >
            </zyb-filed>
            <zyb-filed ref="validateCode" :icon="codefiled.userIcon"
                :placeholder="codefiled.placeholder"
                :type = "codefiled.type"
                :isValidateCode = true
                :validateCode="form.validateCode"
                 @isSameValidateCode = 'isSameValidateCode'
            >
            </zyb-filed>
        </div>
        <!-- <p class="error">账号错误</p> -->
        <div class="btn">
            <mt-button size="large" type="primary" @click="login" >登录</mt-button>
        </div>
        <router-link tag="a" :to="{ path:'/forget' }" class="forget">忘记密码?</router-link>
    </div>
</template>
<script>
import { Button,MessageBox,Indicator } from 'mint-ui'
import API from '../http/api'
import zybFiled from './comm/zybFiled'
import validation from '../assets/js/validation.js'
import cookie from '../assets/js/cookie.js'
import common from '../assets/js/public.js'

export default {
    name:'Login',
    components:{
        zybFiled
    },
    mounted () {        
        let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.$refs.login.style.height = h+"px";
        //console.log("state:",this.$store.state);
    },
    data() {
        return {
            form:{
                loginName:'',
                loginPass:'',
                validateCode:false
            },
            userfiled:{
                userIcon:"icon iconfont icon-geren",
                placeholder:"请输入用户名",
                type:'text'
            },
            pwdfiled:{
                userIcon:"icon iconfont icon-mima",
                placeholder:"请输入密码",
                type:'password'
            },
            codefiled:{
                userIcon:"icon iconfont icon-yanzhengma",
                placeholder:"请输入验证码",
                type:'text'
            }
        }
    },
    methods:{
        Validate(){ // 验证表单
            if(!this.form.validateCode){
                if(validation.isEmpty(this.$refs.validateCode.currentValue)){
                  MessageBox.alert('请输入验证码');
                }else{
                  MessageBox.alert('验证码错误');
                }
                return false;
            }else if(validation.isEmpty(this.form.loginName)){
                MessageBox.alert('请输入用户名');
                return false;
            }else if(validation.isEmpty(this.form.loginPass)){
                MessageBox.alert('请输入密码');
                return false;
            }
            // else if(validation.checkPhone(this.form.loginName)){
            //     MessageBox.alert("请输入正确的手机号码!");
            //     return false;
            // }
            else{
                return true;
            }
        },
        login(){    // 登录
            if(this.Validate()){
                Indicator.open('登录中...');
                let context = this;
                this.axios.get(API.LOGIN,{params:this.form})
                .then(function (res) {
                    if(res.status == 200 && res.data.success)  {
                        
                        // 清除cookie,token;
                        cookie.clearAllCookie();
                        context.$store.commit("logout");
                        let user = res.data.data;
                        console.log(res);
                        context.$store.commit('login',user);
                        cookie.setCookie("SERVER_DOAMIN",user.domain,30);
                        cookie.setCookie("gwap_ticket",user.sessionId,30);
                        cookie.setCookie("gwap_sessionId",user.guiderId,30);
                        cookie.setCookie("gwap_token_id",user.token,30);
                        Indicator.close();
                        let redirect = decodeURIComponent(context.$route.query.redirect || '/');  //获取登录成功后要跳转的路由。
                        // common.showToast('登录成功',1100);
//                        MessageBox.alert('登录成功').then(() => {
//
//                        });

                        console.log('26262626626', context.$route.query);
                        if(context.$route.query.loginFail){
                            context.$router.replace({
                                path: redirect,
                            });
                        }else{
                            context.$router.push({
                                path: redirect,
                            });
                        }
                        
                    }else{
                        Indicator.close();
                        MessageBox('登录失败', res.data.message);
                    }
                })
                .catch(function (error) {
                    Indicator.close();
                    MessageBox('登录失败', error);
                });
            }
        },
        // 表单值 回显
        changeUser(currentValue){
           this.form.loginName = currentValue;
        },
        changePwd(currentValue){
           this.form.loginPass = currentValue;
        },
        changeCode(currentValue){
           this.form.srcCode = currentValue;
        },
        isSameValidateCode(isSameValidate){
            this.form.validateCode = isSameValidate;
        }
    },
}
</script>
<style scoped lang="scss">
    .login {
        background:#fff;
        overflow: hidden;
        position: relative;

        .title {
            width: 6.25rem;
            height: 1.6rem;
            margin:2rem auto 1.75rem;
            img {
                width: 100%;
                height: 100%;
            }
        }

        .login-form {
            width: 80%;
            margin:0 auto;
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
        .forget {
            position: absolute;
            bottom:1rem;
            width: 100%;
            text-align: center;
            color:#529cff;
            font-size: .65rem;
        }
    }
</style>
