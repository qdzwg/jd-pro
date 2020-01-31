<template>
  <div>
    <div class="famaily-title">
      <span>家庭成员信息</span>
    </div>
    <div class="famaily-list">
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
      >
        <div class="famaily-content" v-for="(item,index) in list" :key="index">
          <div class="top">
            <span>
              联系方式:
              <em @click="callPhone(item.tel)">{{item.tel}}</em>
            </span>
            <span v-if="item.sex&&item.sex!=''">
              性别:
              <em>{{item.sex=='female'? '女': '男'}}</em>
            </span>
          </div>
          <div class="family-item clearfix">
            <span class="family-item-index">{{ index+1 }}</span>
            <div class="info">
              <p>
                <i class="iconfont icon-geren"></i>
                <em>姓名：</em>
                {{item.name}}
              </p>
              <p>
                <i class="iconfont icon-shenfenzheng"></i>
                <em>证件号码：</em>
                {{item.certNo}}
              </p>
              <p>
                <i class="iconfont icon-dizhi1"></i>
                <em>接站地址：</em>
                {{item.meetAddr}}
              </p>
              <p>
                <i class="iconfont icon-dizhi1"></i>
                <em>送站地址：</em>
                {{item.deliverAddr}}
              </p>
            </div>
          </div>
        </div>
        <scroll-bottom :totalPage="totalPage" :loading="loading"></scroll-bottom>
      </div>
    </div>
    <no-data v-if="noDataStatus" :isAdd="true"></no-data>
  </div>
</template>
<script>
import API from "../../http/api.js";
import noData from "../comm/noData";
import scrollBottom from "../comm/scrollBottom";
export default {
  name: "visitorDetail",
  components: {
    noData,
    scrollBottom
  },
  data() {
    return {
      noDataStatus: false, //暂无数据
      loading: false,
      list: [],
      totalPage: 1,
      params: {
        // 列表参数
        tripNo: "",
        rows: 10, //每页条数
        page: 0 //当前页
      }
    };
  },
  methods: {
    loadAjax() {
      this.axios
        .get(API.VisitorDetail, {
          params: {
            sourceId: this.$route.params.sourceId,
            tripId: this.$route.params.tripId
          }
        })
        .then(response => {         
          this.list = this.list.concat(response.data.data.items);          
          if (this.list.length < 1) this.noDataStatus = true;
          else this.noDataStatus = false;
          this.totalPage = response.data.data.totalPage;
          // this.list.forEach((item, index)=>{
          //   this.list[index].suoyin = this.params.page*this.params.rows - this.params.rows + (index+1)
          // })
          // this.isHaveMore();
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 分页查询
    loadMore() {
      this.params.page = parseInt(this.params.page) + 1;
      if (!this.loading) {
        this.loadAjax(); // 调用list加载
        if (this.params.page >= this.totalPage) {
          this.loading = true;
        }
      }
    },
    // 检测是否可以上拉,true是禁止上拉加载
    isHaveMore() {
      this.loading = false;
      if (this.params.page >= this.totalPage) {
        this.loading = true;
      }
    },
    callPhone(phoneNumber) {
      window.location.href = "tel:" + phoneNumber;
    }
  }
};
</script>
<style scoped lang="scss">
.famaily-title {
  position: fixed;
  height: 1.75rem;
  width: 100%;
  color: #666;
  font-size: 0.6rem;
  line-height: 1.75rem;
  padding: 0 0.5rem;
  background: #f8f8f8;
  z-index: 89;
  text-align: center;
  border-bottom: 1px solid #eee;
  top: 2rem;
}
.famaily-list {
  padding-top: 3.8rem;
  .famaily-content {
    margin-bottom: 0.5rem;
    background: #fff;
    .top {
      line-height: 1.35rem;
      font-size: 0.55rem;
      color: #333;
      border-bottom: 1px solid #f0f0f0;
      padding: 0 0.5rem;
      span {
        margin-right: 1.9rem;
      }
      em {
        color: #999;
      }
    }
    .family-item {
      .family-item-index {
        display: inline-block;
        vertical-align: middle;
        margin-left: 0.5rem;
        font-size: 0.6rem;
        color: #999;
      }
      .info {
        display: inline-block;
        vertical-align: middle;
        background: #fff;
        padding: 0.3rem 0.5rem;
        border-top: 1px solid #f0f0f0;
        border-bottom: 1px solid #f0f0f0;
        box-sizing: border-box;
        margin-bottom: 0.2rem;
        // width: 100%;
        p {
          color: #999;
          font-size: 0.6rem;
          line-height: 0.95rem;
          i {
            color: #95c2ff;
            display: inline-block;
            width: 0.9rem;
            text-align: center;
            vertical-align: middle;
            font-size: 0.65rem;
          }
          em {
            color: #333;
          }
        }
      }
    }
  }
}
</style>
