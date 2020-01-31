<template>
    <div class="error">
        <img src="../assets/images/comm/err-img.png" />
        <h1>{{ msg }}</h1>
    </div>
</template>

<script>
export default {
    name:'error',
    data(){
        return{
            msg:'程序猿被外星人带走了~~'
        }
    },
}
</script>

<style lang="scss" scoped>
    .error { 
        text-align: center;
        margin-top: 200px;
        img {
            width: 100%;
        }
        h1 {
            margin-top: 20px;
            font-size:1rem;
        }
    }
</style>

