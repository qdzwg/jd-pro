<template>
    <div>
        <div class="edit">
            <p class="title">我们会通过短信的方式将验证码发送至手机{{showPhone}}，请注意查收。</p>
            <div class="form">
                <zyb-filed
                    :placeholder="codefiled.placeholder"
                    :type = "codefiled.type"
                    v-model = "form.identifyCode"
                    :btnText="codefiled.btnText"
                    :isW60="codefiled.isW60"
                    :isAllBorder = "isAllBorder"
                    :btnBorder="codefiled.btnBorder"
                    @change="changeUser"
                    @getCode="getCode"
                    ref="childFunction"
                ></zyb-filed>
            </div>
            <mt-button type="primary" size="large" @click="checkCode">下一步</mt-button>
        </div>
    </div>
</template>
<script>
import { Button,MessageBox } from 'mint-ui';
import zybFiled from '../comm/zybFiled'
import API from '../../http/api'
import validation from '../../assets/js/validation.js'
export default {
    name:'editContact',
    components:{
        zybFiled,
    },
    data(){
        return{
            form:{  // 验证 验证码是否正确 参数
                identifyCode:'',
            },
            params:{   // 请求验证码 参数
                mobile:'',
            },
            codefiled:{
                placeholder:"请输入验证码",
                type:'number',
                btnText:'获取验证码',
                btnBorder:false,
                isW60:true
            },
            isAllBorder:true, // filed是否全部包围
        }
    },
    mounted(){
        console.log("参数:",this.$route.params.phone,typeof  this.$route.params.phone);
        this.params.mobile = (this.$route.params.phone).trim();
        this.form.mobile = (this.$route.params.phone).trim();
    },
    computed:{
        showPhone:function(){
            return validation.replaceStr(this.$route.params.phone,[3,5,3],0);
        }
    },
    methods:{
        Validate(){
            if(validation.isEmpty(this.form.identifyCode)){
                MessageBox.alert('验证码不能为空');
                return false;
            }else{
                return true;
            }
        },
        getCode(){  // 获取 验证码
            this.axios.get(API.GetCode,{params:this.params})
                .then(res=>{
                    console.log(res.data);
                    if(res.data.success) {   // 成功 执行倒计时
                        MessageBox.alert("验证码已成功发送至您的手机，请查收");
                        this.$refs.childFunction.timeCountDown();
                    }else{
                        MessageBox.alert(res.data.message);
                    }
                }).catch(err=>{});
        },
        checkCode(){ // 验证 验证码
            if(this.Validate()){
                 this.$router.push({name:'editPwd',params:{identifyCode:this.form.identifyCode,mobile:this.form.mobile}})
                /*this.axios.get(API.CheckCode,{params:this.form})
                    .then(res=>{
                        console.log("res",res.data);
                        if(res.data.success){
                            this.$router.push({ name: 'editPwd', params:
                                { identifyCode: this.form.identifyCode,
                                  mobile:this.form.mobile
                                }
                            });
                        }else{
                            MessageBox.alert(res.data.message);
                        }
                    }).catch(err=>{});*/
            }
        },

        changeUser(currentValue){ this.form.identifyCode = currentValue; },
    },

}
</script>
<style lang="scss" scoped>
    .edit{
        padding: .6rem 1.1rem;

        .title {
            color:#999999;
            font-size: .6rem;
            line-height: 1.8;
            word-break: break-all;
        }

        .form{
            margin:.7rem 0;
        }
    }
</style>

