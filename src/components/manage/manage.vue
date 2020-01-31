<template>
    <div class="rs-manage">
        <h1>人事管理</h1>
        <router-link :to="{path:'/leave'}">111</router-link>
        <router-link :to="{path:'/manage/calendar'}">222</router-link>
        <footside-bar></footside-bar>
    </div>
</template>
<script>
import FootsideBar from '../comm/FootsideBar'

export default {
    name:'Manage',
    components:{
        FootsideBar
    },
}
</script>
<style scoped>
    .rs-manage{
        margin-top: 2rem;
    }
</style>
