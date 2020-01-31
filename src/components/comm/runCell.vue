<template>
  <a class="mint-cell">
    <span class="mint-cell-mask" v-if="isLink"></span>
    <div class="mint-cell-wrapper" ref="wapper">
        <div class="cell-img" ref="imgs">
            <img v-if="src" :src="src" ref="img"/>
        </div>
        <div class="cell-cnt" v-if="datas">
            <div class="mint-cell-title" >
                <span class="mint-cell-text" v-text="datas.name" v-if="datas.name"></span>
                <span class="cell-position" v-if="datas.level" >{{ level }}</span>
                <span class="cell-sex">{{ sex }}</span>
                <span class="cell-age" v-if="datas.age" v-text="datas.age"></span>
                <p class="cell-id" v-if="datas.id">id{{datas.id}}
                    <router-link :to="{ path:'/mine' }"  tag="a" class="cell-link-info">
                        查看资料
                    </router-link>
                </p>
                <p class="cell-mark" v-if="datas.mark" v-text="datas.mark"></p>
            </div>
            <div class="mint-cell-value">
                <span v-text="value"></span>
            </div>
        </div>
        <div class="cell-cnt-one" v-if="title">
            <p class="mint-cell-text" v-text="title"></p>
            <p class="cell-desc">时间：<span v-text="time"></span></p>
            <p class="cell-desc">地点：<span v-text="addr"></span></p>
            <p class="cell-desc">人数：<span v-text="num"></span></p>
        </div>
        <div class="cell-btn" v-if="btnText_pri || btnText_warn" ref="buttons">  
            <a v-if="btnText_pri"  class="run-btn run-btn_pri"  @click="btnClick(true)">{{ btnText_pri }}</a>
            <a v-if="btnText_warn"  class="run-btn run-btn_warn"  @click="btnClick(false)">{{ btnText_warn }}</a>
        </div>  
        <p class="cell-btn-tips" v-if="btnText_pri || btnText_warn"  ref="tips"></p>
    </div>
    <i v-if="isLink" class="mint-cell-allow-right"></i>
  </a>
</template>

<script>
if (process.env.NODE_ENV === 'component') {
  require('mint-ui/packages/font/style.css');
}

/**
 * mt-cell
 * @module components/cell
 * @desc 单元格
 * @param {string} [icon] - 图标，提供 more, back，或者自定义的图标（传入不带前缀的图标类名，最后拼接成 .mintui-xxx）
 * @param {string} [title] - 标题
 * @param {string} [label] - 备注信息
 * @param {boolean} [is-link=false] - 可点击的链接
 * @param {string} [value] - 右侧显示文字
 * @param {slot} - 同 value, 会覆盖 value 属性
 * @param {slot} [title] - 同 title, 会覆盖 title 属性
 * @param {slot} [icon] - 同 icon, 会覆盖 icon 属性，例如可以传入图片
 *
 * @example
 * <mt-cell title="标题文字" icon="back" is-link value="描述文字"></mt-cell>
 * <mt-cell title="标题文字" icon="back">
 *   <div slot="value">描述文字啊哈</div>
 * </mt-cell>
 */
export default {
  name: 'mt-cell',

  props: {
    height:String,  // cell高度
    icon: String,
    label: String,
    isLink: Boolean,
    value: {},
    src:String,  // 图片
    // cell1
    btnText_pri:String,  // 按钮左
    btnText_warn:String, // 按钮右
    name:String, // 姓名
    datas:{}, // 数据内容
    // cell2
    title:String, // 标题
    time:String, // 时间
    addr:String, // 地址
    num:String, // 人数
    status:String, // 状态
  },
  data(){
      return{
        cell3:[] // 通过emit传递
      }
  },
  mounted() {
    this.controlDom(); // 初始dom对象
  },
  methods:{
    controlDom(){
        this.$refs.wapper.style.height = this.height + "rem";
        this.$refs.img.style.height = +(this.height) - 1 + "rem";
        this.$refs.imgs.style.width = +(this.height) - 1 + "rem";
     },
    btnClick(flag) {
        this.$refs.buttons.style.display = "none";
        this.$refs.tips.style.display = "block";
        if(flag)
            this.$refs.tips.innerHTML = "已接受";
        else
            this.$refs.tips.innerHTML = "已拒绝";
        
    }
  },
  computed: {
    level:function() {
        switch(this.datas.level)
        {
            case '1': 
                return '(团长)'
                break;
            case '2':
                return '(管理员)'
                break;
            default:
                return ''
        }
    },
    sex:function() {
        switch(this.datas.sex) 
        {
            case '0':
                return '男'
                break;
            case '1':
                return '女'
                break;
        }
    }
  }
};
</script>

<style scoped lang="scss">
.mint-cell {
    position: relative;
    background-color: #fff;
    box-sizing: border-box;
    color: inherit;
    display: block;
    overflow: hidden;       
}

.mint-cell img {

    vertical-align: middle;
}
.cell-img {
    width: 3rem;
    border:1px solid #c1c1c1;
    padding: 2px;
}
.cell-img img {
    width: 100%;
}
.cell-cnt {
    -webkit-box-flex:1;
    -webkit-flex:1;
    flex:1;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;   
    display: flex;
    line-height: 1;
    min-height: inherit;
    padding: 0 10px;
}
.cell-cnt-one {
    line-height: 1;
    min-height: inherit;
    padding: 0 10px;
    p {
        padding-bottom: .2rem;
    }
    .cell-desc {
        font-size: .5rem;
        color:000;
        span {
            color:#666;
        }
    }
}
.cell-position {
    color:#a1a1e0;
    font-size: 0.4rem;
}
.cell-id {
    color:#999;
    font-size: 0.5rem;
    margin-top: 0.2rem;
}
.cell-link-info {
    color:#666;
    font-size: 0.5rem;
    margin-left: 0.2rem;
}
.cell-mark {
    color: #999999;
    font-size: .4rem;
    line-height: 1.2;
    margin-top: .2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
.cell-sex {
    color:#1AAD19;
    font-size: 0.5rem;
}
.cell-age {
    color:#a1a1e0;
    font-size: 0.5rem;
}
.cell-btn-tips { 
    color:#333;
    font-size: .4rem;
}
.mint-cell::after {

    color: #d9d9d9;

    content: " ";

    width: 100%;

    height: 1;

    border-top: 1px solid;

    top: 0;

    left: 0;

    position: absolute;

    -webkit-transform-origin: 0 0;

            transform-origin: 0 0;
}

@media screen and (-webkit-min-device-pixel-ratio: 2) {

    .mint-cell::after {

        -webkit-transform: scaleY(.5);

                transform: scaleY(.5);
    }
}

.mint-cell::before {

    color: #d9d9d9;

    content: " ";

    width: 100%;

    height: 1;

    border-bottom: 1px solid;

    bottom: 0;

    left: 0;

    position: absolute;

    -webkit-transform-origin: 0 100%;

            transform-origin: 0 100%;
}

@media screen and (-webkit-min-device-pixel-ratio: 2) {

    .mint-cell::before {

        -webkit-transform: scaleY(.5);

                transform: scaleY(.5);
    }
}

.mint-cell + .mint-cell::after {

    content: none;
}

.mint-cell::before {

    left: 10px;
}

.mint-cell:last-child::before {

    left: 0;
}

.mint-cell-wrapper {

    -webkit-box-align: center;

        -ms-flex-align: center;

            align-items: center;

    display: -webkit-box;

    display: -ms-flexbox;   

    display: flex;

    line-height: 1;

    min-height: inherit;

    overflow: hidden;

    padding: 0 10px;

    position: relative;

    width: 100%;
    padding:0.4rem;
}

.mint-cell-mask {}

.mint-cell-mask::after {

    background-color: #000;

    content: " ";

    opacity: 0;

    top: 0;

    right: 0;

    bottom: 0;

    left: 0;

    position: absolute;
}

.mint-cell-mask:active::after {

    opacity: .1;
}

.mint-cell-text {

    vertical-align: middle;
    font-size:0.7rem;
    color:#000;

}

.mint-cell-label {

    color: #888;

    display: block;

    font-size: 12px;

    margin-top: 6px;
}

.mint-cell-title {

    -webkit-box-flex: 1;

        -ms-flex: 1;

            flex: 1;
}
.mint-cell-title span { vertical-align: middle; }
.mint-cell-value {

    color: #888;

    display: -webkit-box;

    display: -ms-flexbox;

    display: flex;

    -webkit-box-align: center;

        -ms-flex-align: center;

            align-items: center;
}

.mint-cell-value.is-link {

    margin-right: 24px;
}

.mint-cell-left {

    position: absolute;

    height: 100%;

    left: 0;

    -webkit-transform: translate3d(-100%, 0, 0);

            transform: translate3d(-100%, 0, 0);
}

.mint-cell-right {

    position: absolute;

    height: 100%;

    right: 0;

    top: 0;

    -webkit-transform: translate3d(100%, 0, 0);

            transform: translate3d(100%, 0, 0);
}

.mint-cell-allow-right::after {

    border: solid 2px #c8c8cd;

    border-bottom-width: 0;

    border-left-width: 0;

    content: " ";

    top: 50%;

    right: 20px;

    position: absolute;

    width: 5px;

    height: 5px;

    -webkit-transform: translateY(-50%) rotate(45deg);

            transform: translateY(-50%) rotate(45deg);
}
/* btn */
.run-btn {
    position: relative;
    display: inline-block;
    padding: 0 1.32em;
    line-height: 2.3;
    margin-left: auto;
    margin-right: auto;
    padding-left: 14px;
    padding-right: 14px;
    box-sizing: border-box;
    font-size: 0.5rem;
    text-align: center;
    text-decoration: none;
    color: #fff;
    border-radius:4px;
    overflow: hidden;
    &:after {
        content: " ";
        width: 200%;
        height: 200%;
        position: absolute;
        top: 0;
        left: 0;
        border: 1px solid rgba(0, 0, 0, .2);
        transform: scale(.5);
        transform-origin: 0 0;
        box-sizing: border-box;
        border-radius: 4px;
    }
}
.run-btn + .run-btn { margin-left:0.2rem;}
.run-btn_pri {
    background-color:#1AAD19;
}
.run-btn_warn {
    background-color:#E64340;
}
</style>


