<template>
    <div class="more_loading" v-show="totalPage>1">
        <div  class="loading" v-show="!loading">
            <mt-spinner type="snake" color="#bdaeae" :size="20"></mt-spinner>
            <span class="allloading">加载中</span>
        </div>
        <span class="allloading" v-show="loading">-END-</span>
    </div>
</template>
<script>
import { Spinner } from 'mint-ui';
export default {
    name:'ScrollName',
    props:{
        totalPage:Number,   // 总页数
        loading:Boolean,    // 是否已经加载完成
    },
}
</script>
<style lang="scss" scoped>
    .more_loading{
        padding: 0 0 .5rem;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-justify-content:center;
            -ms-justify-content:center;
                justify-content:center;
    }
    .loading {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-justify-content:center;
            -ms-justify-content:center;
                justify-content:center;
        -webkit-align-items:center;
            -ms-align-items:center;
                align-items:center;
        span{
            margin-left:.4rem; 
            color:#666;
            font-size:.6rem;
        }
    }
    .allloading{
        color:#bdaeae;
        font-size:.6rem;
    }
</style>

