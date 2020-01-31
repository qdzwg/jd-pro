<template>
    <div>
        <input type=button  value='返回上一页' @click="$router.history.go(-1)" class="backGo">
        <div class="edit">
            <div class="template-name">
                <input type="text" class="templateName-text" v-model="params.templateName">
            </div>
            <div class="bd">                
                <textarea id="" class="msg" v-model="params.templateContent"></textarea>
            </div>
            <div class="bd-btn">
                <mt-button type="primary" size="normal" plain  @click.native="cancel">取消</mt-button>
                <mt-button type="primary" size="normal" @click.native="save">保存</mt-button>
            </div>
        </div>
    </div>
</template>
<script>
import { Button,MessageBox} from 'mint-ui'
import API from '../../http/api'
import validation from '../../assets/js/validation.js'
import common from '../../assets/js/public.js'
export default {
    name:'editMsg',
    components:{

    },
    data(){
        return{
            params:{                    // 提交参数:
                templateId: "" ,        // 模板ID
                templateName: "",       // 模板名称
                templateContent: "",    // 模板内容
            },
            status:'',  // 状态
        }
    },
    mounted(){
        this.status = this.$route.params.status;
        console.log("status:",this.status);
        if(this.status=="1") { // 新增页面
            this.initMsg();
        }
    },
    methods:{
        Validate(){ // 验证表单
            if(validation.isEmpty(this.params.templateContent)){
                MessageBox.alert('请输入短信内容');
                return false;
            }else if(validation.checkLength(this.params.templateContent,500)){
                MessageBox.alert('内容长度不能超过500个字符');
                return false;
            }else{
                return true;
            }
        },
        initMsg(){  //回显内容
           this.params.templateId = this.$route.params.editcode;
           this.axios.get(API.MemberDetailMsg,{params:{id:this.params.templateId}})
                .then(res=>{
                    if(res.data.success){
                        this.params.templateContent = res.data.data.templateContent;
                        this.params.templateName = res.data.data.templateName;
                    }else{
                        MessageBox.alert(res.message);
                    }
                })
                .catch(res=>{

                })
        },
        // 保存按钮
        save(){
            console.log(this.params)
            let context = this,tips='';
            if(this.status=="1") tips="修改成功"
            else  tips="添加成功"
            MessageBox.confirm('',{
                message:'是否保存此次编辑的内容'
            }).then(action => {
                
                if(action == 'confirm') {
                    if(this.Validate()){
                        console.log(this.params)
                        this.axios.post(API.MemberSaveMsg,this.$qs.stringify(this.params))
                        .then(res=>{
                            if(res.data.code==200 && res.data.success){
                                common.showToast(tips,1100);
                                let redirect = decodeURIComponent(this.$route.query.redirect || '/msgList');
                                setTimeout(function() {
                                    context.$router.push({
                                        path: redirect,
                                    });
                                }, 1200);
                            }else{
                                MessageBox.alert(res.data.message);
                            }
                        })
                        .catch(err=>{
                            MessageBox.alert(err);
                        });
                    }
                }
            }).catch(err => {if (err == 'cancel') {}});
        },

        // 取消按钮操作
        cancel(){
            MessageBox.confirm('',{
                message:'确定取消编辑,返回上一页吗？',
                cancelButtonText: '手滑点错了'
            }).then(action => {
                if(action == 'confirm') {
                    this.$router.push({name:'msgList'});
                }
            }).catch(err => {
                if (err == 'cancel') {
                    console.log('点了取消');
                }
            });
        }
    },
}
</script>
<style scoped lang="scss">
    .template-name{
        margin: 0.5rem 0;
        .templateName-text{
            height: 2rem;
            line-height: 2rem;
            font-size: 0.7rem;
            width: 94%;
            padding: 0 3%;
            color: #666;
        }
    }
    .edit {
        width: 94%;
        margin:0 auto 0;

        .bd{
            width: 100%;
            height: 20rem;
            border:1px solid #e6e6e6;
            background:#fff;
            box-sizing: border-box;
            padding: .75rem;
            
            .msg {
                width: 100%;
                height: 100%;
                font-size: .7rem;
                color:#666;
                resize: none;
                outline: none;
            }
        }

        .bd-btn {
            margin-top: .5rem;
        }
        .mint-button { width: 47% ;border-radius: 2px; box-sizing: border-box; }
        .mint-button + .mint-button { margin-left: 4% }
        .mint-button--primary.is-plain {
            background: #fff;
        }
    }
</style>
