import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store';
import * as types from '@/store/types';
import Run from '@/components/Run';
import Plan from '@/components/plan/plan'; // 工作计划 首页
import Account from '@/components/account/account'; // 导游查账
import Manage from '@/components/manage/manage'; // 人事管理
import Calendar from '@/components/manage/calendar'; // 人事管理日历
import Member from '@/components/member/member'; // 个人中心
import Error from '@/components/error'; // 404page
import Login from '@/components/login'; // login
import Forget from '@/components/forget'; // 忘记密码
import Visitor from '@/components/plan/visitor';//游客信息列表
import VisitorDetail from '@/components/plan/visitorDetail';//家庭成员信息列表
import VisitorReply from '@/components/plan/VisitorReply';//游客信息回复列表
import PlanList from '@/components/plan/list';//跟团列表
import PlanCalendar from '@/components/plan/calendar'; // 工作计划列表日历模式
import travelInfo from '@/components/plan/travelinfo';//行程信息
import PlanDetails from '@/components/plan/planDetails';// 未发团详情
import NewsList from '@/components/plan/newsList';// 查看轨迹
import NoticeList from '@/components/plan/noticeList';// 最新消息详情
import NoticeDetail from '@/components/plan/noticeDetail';// 最新消息详情
import NewsDetail from '@/components/plan/NewsDetail';// 查看轨迹详情
import MemberInfo from '@/components/member/memberInfo';// 个人资料
import msgList from '@/components/member/msgList.vue'; //短信模板列表
import EditMsg from '@/components/member/editMsg'; //编辑短信
import editContact from '@/components/member/editContact'; //修改联系方式
import editPwd from '@/components/member/editPwd'; //修改密码
import splitMeals from '@/components/member/splitMeals'; //分车分餐
import sendMsg from '@/components/member/sendMsg'; //发送短信
import AccList from '@/components/account/accList'; //账单列表
import addAccount from '@/components/account/add.vue'; //添加账单
import Leave from '@/components/manage/leave.vue'; //请假
import Comment from '@/components/manage/comment.vue'; //请假
import guiderInfo from '@/components/manage/guiderInfo.vue'; //
import guiderAccant from '@/components/manage/guiderAccant.vue'; //
import accantEdit from '@/components/manage/accantEdit.vue'; //

Vue.use(Router);

/**
 * 路由配置
 * meta:
 *    requireAuth :boolean  // 添加该字段，表示进入这个路由是需要登录的
 *    active:fA,fB,fC,fD        // 添加二级菜单高亮 对应导航
 */
const routes = [
  { path: '/login', name: 'Login', component: Login,},
  { path: '/forget', name: 'Forget', component: Forget, meta: {back: true}},
  { path: '/', name: 'Plan', meta: {
    requireAuth: true,
  },component: Plan},
  { path: '/account', name: 'Account', component: Account, meta: {back: true} },
  { path: '/manage', name: 'Manage', component: Manage, meta: {back: true} },
  { path: '/member', name: 'Member',
    meta: {
      requireAuth: true,
      back: true
    },
    component: Member
  },
  { path: '*',component: Error },
  { path: '/run',name: 'Run',component: Run, meta: {back: true} },
  // manage
  { path: '/manage/calendar',name:'Calendar',component: Calendar, meta: {back: true}},
  // plan
  { path: '/visitor/:tripNo/:guiderId',name:'Visitor',component: Visitor, meta: {back: true}},
  { path: '/visitorDetail/:tripId/:sourceId',name:'VisitorDetail',component: VisitorDetail, meta: {back: true}},
  { path: '/VisitorReply/:id',name:'VisitorReply',component: VisitorReply, meta: {back: true}},
  { path: '/travelInfo/:tripNo',name:'travelInfo',component: travelInfo, meta: {back: true}},
  { path:'/list/:status' ,name:'PlanList',component:PlanList,meta:{active:'fA'}},
  { path: '/PlanCalendar',name:'PlanCalendar',component:PlanCalendar,meta:{active:'fA'}},
  { path:'/planDetails/:tripNo/:type' ,name:'PlanDetails',component:PlanDetails, meta: {back: true}},
  { path: '/NewsList/:tripNo',name:'NewsList',component:NewsList},
  { path: '/NewsDetail/:id',name:'NewsDetail',component:NewsDetail},
  { path: '/NoticeList',name:'NoticeList',component:NoticeList},
  { path: '/NoticeDetail/:id',name:'NoticeDetail',component:NoticeDetail},
  //member
  { path:'/editMsg/:status/:editcode',name:'EditMsg',component:EditMsg }, // status:0 新增，1 修改
  { path:'/editContact/:phone',name:'editContact',component:editContact },
  { path:'/editPwd/:identifyCode/:mobile',name:'editPwd',component:editPwd },
  { path: '/memberInfo',name:'MemberInfo',component:MemberInfo },
  { path: '/msgList',name:'msgList',component:msgList },
  { path: '/splitMeals',name:'splitMeals',component:splitMeals },
  { path: '/sendMsg',name:'sendMsg',component:sendMsg },
  //account
  { path: '/addAccount/:tripNo/:finsh/:itemId/:updata',name:'addAccount',component:addAccount },
  { path: '/addList/:tripNo/:finsh',name:'AccList',component:AccList },
  //manage
  { path: '/leave',name:'leave',component:Leave},
  //评价
  { path: '/comment',name:'Comment',component:Comment},
  //导游信息
  { path: '/guiderInfo',name:'guiderInfo',component:guiderInfo,meta: {back: true}},
  //导游报账新
  { path: '/guiderAccant',name:'guiderAccant',component:guiderAccant,meta: {back: true}},
  //修改报账
  { path: '/accantEdit',name:'accantEdit',component:accantEdit,meta: {back: true}}
];

// 页面刷新时，重新赋值token和页面信息
if(window.localStorage.getItem('token')) {
  let data = {
    sessionId:window.localStorage.getItem('token'),
    guiderId:window.localStorage.getItem('guiderId'),
    loginName:window.localStorage.getItem('loginName')
  }
  store.commit('login',data);
}

const router = new Router({
  // mode: 'history',
  // base:'/dist/',
  routes
});


/**
 * 路由拦截
 * 1.判断该路由是否需要登录验证
 * 2.判断是否存在token
 * 将跳转的路由path作为参数，跳转成功后到该路由
 */
router.beforeEach((to,from,next) => {
  //console.log(to);
  if(to.matched.some(r => r.meta.requireAuth)) {
    //console.log(store.state.token);
    if(store.state.token && store.state.token!="undefined" && store.state.token!=undefined) {
      next();
    }
    else {
      next({
        path:'/login',
        query:{redirect:to.fullPath}
      })
    }
  }
  else {
    next();
  }
});

export default router;

