// 接口地址
// const baseURL = "http://wy1.sendinfo.com.cn";
const baseURL = "http://" + window.location.host;
// const baseURL = "/api";
// const baseURLS = "/cd";
// const baseURL = "/gbw";
const Api = {
  // 登录
  LOGIN: `${baseURL}/gwap/login`,
  // 首页 工作计划
  Index:`${baseURL}/gwap/myTrip/index`,//首页jiekou2266
  ListSearch:`${baseURL}/gwap/myTrip/tripStatus`,//列表页工作状态
  List:`${baseURL}/gwap/myTrip/myGuideTripList`,//查看和搜索所有工作列表
  Detail:`${baseURL}/gwap/myTrip/guideTripDetail`,//工作详情 - 点开工作列表项
  Visitor: `${baseURL}/gwap/myTrip/visitorList`,//查看团下所有游客
  VisitorDetail:`${baseURL}/gwap/myTrip/famailyMemberList`,//查看团下家庭成员详细信息
  VisitorReply:`${baseURL}/gwap/myTrip/replyMessages`,//查看团下回复详细信息
  NewsList:`${baseURL}/gwap/tripLogs/trackList`,//查看轨迹列表
  NewsDetail:`${baseURL}/gwap/tripLogs/trackDetail`,//查看轨迹详情
  NoticeList:`${baseURL}/gwap/myTrip/noticeList`,//最新消息列表
  NoticeDetail:`${baseURL}/gwap/myTrip/noticeDetail`,//最新消息详情
  sendOverloadMessage:`${baseURL}/gwap/myTrip/sendOverloadMessage`,//超载提醒
  LeaveGroup:`${baseURL}/gwap/myTrip/visitorOut`, //退团申请
  SendMsgBatch:`${baseURL}/gwap/myTrip/sendMsgBatch`, //一键发送短信
  TripDetail:`${baseURL}/gwap/myTrip/tripDetail`, // 日程详情
  updateReplaceFlag: `${baseURL}/gwap/myTrip/updateReplaceFlag`, //家庭成员列表代收金额

  // 个人中心
  MemberMsgList:`${baseURL}/gwap/message/msgTempList`, // 短信列表
  MemberDelMsg:`${baseURL}/gwap/message/delMessage`,   // 删除短信模板
  MemberSaveMsg:`${baseURL}/gwap/message/saveMessage`, // 修改短信模板
  MemberDetailMsg:`${baseURL}/gwap/message/templateDetail`, // 获取短信模板详情
  MemberInfo:`${baseURL}/gwap/myTrip/guiderInfo`,  // 导游信息
  GetCode:`${baseURL}/gwap/sendCheckCode`,// 获取短信验证码
  CheckCode:`${baseURL}/gwap/validation`,// 校验短信验证码
  ResetPwd:`${baseURL}/gwap/rePwd`,// 重置密码
  ForgetPwd:`${baseURL}/gwap/forget`,// 忘记密码
  //报账
  // AccList:`${baseURL}/gwap/bz/projectList`,////帐单  --项目列表及团队信息
  AccList:`${baseURL}/gwap/ptGuider/account/queryIndex`,////帐单  --项目列表及团队信息
  // postAcc:`${baseURL}/gwap/bz/guiderBZ`,////提交报账
  postAcc:`${baseURL}/gwap/ptGuider/account/submitAccount`,////提交报账
  // proList:`${baseURL}/gwap/bz/proList`,//新增、修改报账 - 项目列表
  proList:`${baseURL}/gwap/ptGuider/account/addAccountDtlIndex`,//新增报账 - 项目列表
  eidtList:`${baseURL}/gwap/ptGuider/account/updateAccountDtlIndex`,//修改报账 - 项目列表
  // GuiderPay:`${baseURL}/gwap/bz/guiderPay`,//新增报账-添加
  GuiderPay:`${baseURL}/gwap/ptGuider/account/addAccountDtl`,//新增报账-保存
  GuiderEdit:`${baseURL}/gwap/ptGuider/account/updateAccountDtl`,//修改报账-保存
  GuiderDel:`${baseURL}/gwap/bz/guiderDel`,//报账删除
  //人事管理
  ManType:`${baseURL}/gwap/vacation/type`,//请假类别
  ManLeave:`${baseURL}/gwap/vacation/doApply`,//请假
  ManCalendar:`${baseURL}/gwap/vacation/list`,//人事管理日历
  Today:`${baseURL}/gwap/vacation/today`,//今天
  MandoUp:`${baseURL}/gwap/vacation/doUp`,//人事计划 - 请假/销假/取消请假
  //评价
  Comment:`${baseURL}/gwap/comment/saveEvaluateAjax`,
  STATIC:`${baseURL}/static/gwap`,
  //分车分餐
  AssignInfo:`${baseURL}/yc/api/assign/assignInfo`,//分车分餐
  SHIP:`${baseURL}/yc/api/assign/shipTimeList`,//班次
  ASSIGN:`${baseURL}/yc/api/assign/saveAssignAjax`,//分车分餐
  SENDMSG:`${baseURL}/yc/api/assign/showAssign`,//显示分餐分车分好
  SENDAGIN:`${baseURL}/yc/api/assign/sendMsg`,//重发
  SENDBATCH:`${baseURL}/yc/api/assign/sendMsgBatch`,//导游发送短信
  GET_ASSIGN:`${baseURL}/yc/api/assign/getAssign`,//获取
//导游信息
  GuiderInfo: `${baseURL}/yc/api/leading/queryAccountIndex`,
  queryAccount: `${baseURL}/yc/api/leading/queryAccount`,
  queryAccountDtlList: `${baseURL}/yc/api/leading/queryAccountDtlList`,
  queryAccountDtl: `${baseURL}/yc/api/leading/queryAccountDtl`,
  updateAccountDtl: `${baseURL}/yc/api/leading/updateAccountDtl`,
  submitAccount: `${baseURL}/yc/api/leading/submitAccount`
};
export default Api;
