<template>
    <div>
        <div class="edit">
            <!-- <p class="title">请输入修改的新密码</p> -->
            <div class="form">
                <zyb-filed
                    :placeholder="pwdfiled.placeholder"
                    :type = "pwdfiled.type"
                    v-model = "form.pwd"
                    :isAllBorder = "isAllBorder"
                    @change="changePwd"
                ></zyb-filed>
                <zyb-filed
                    :placeholder="newPwdfiled.placeholder"
                    :type = "newPwdfiled.type"
                    v-model = "form.newPwd"
                    :isAllBorder = "isAllBorder"
                    @change="changeNewPwd"
                ></zyb-filed>
            </div>
            <mt-button type="primary" size="large" @click="ResetPwd">确定</mt-button>
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
            form:{  // 表单参数
                pwd:'',
                newPwd:''
            },
            params:{    // 修改密码 请求参数
                identifyCode:'',
                newPass:'',
                mobile:'',
            },
            pwdfiled:{
                placeholder:"请输入新密码",
                type:'password'
            },
            newPwdfiled:{
                placeholder:"请确认密码",
                type:'password'
            },
            isAllBorder:true, // filed是否全部包围
        }
    },
    mounted(){
        this.params.identifyCode = this.$route.params.identifyCode;
        this.params.mobile = (this.$route.params.mobile).trim();
        console.log(params);
    },
    methods:{
        Validate(){ // 验证表单
            if(validation.isEmpty(this.form.pwd)){
                MessageBox.alert('请输入新密码');
                return false;
            }else if(validation.isEmpty(this.form.newPwd)){
                MessageBox.alert('请输入确认密码');
                return false;
            }else if(validation.checkPwd(this.form.pwd)){
                MessageBox.alert('密码格式为6-16任意数字和字母');
                return false;
            }else if(validation.isEqual(this.form.pwd,this.form.newPwd)){
                MessageBox.alert('两次输入密码不相同');
                return false;
            }else{
                return true;
            }
        },
        ResetPwd(){
            console.log(this.form);
            if(this.Validate()){
                console.log("验证通过");
                this.params.newPass = this.form.pwd;
                this.axios.get(API.ResetPwd,{params:this.params})
                .then(res=>{
                    console.log(res.data);
                    if(res.data.success) {
                        MessageBox.alert('修改成功').then(action => {
                            this.$router.push("/login");
                        });
                    }else{
                        MessageBox.alert(res.data.message);
                    }
                }).catch(err=>{
                    MessageBox.alert(err);
                });
            }
        },
        changePwd(currentValue){
           this.form.pwd = currentValue;
        },
        changeNewPwd(currentValue){
           this.form.newPwd = currentValue;
        },
    }

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

