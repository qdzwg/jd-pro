//首页
// 测试环境
var base="t.weiare.com";

// 首页接口(公告详情见JK_031接口)
var JK_001 = {
    // params: {
    //     guiderId: "导游id"
    // },
	method: "${base}/cis/gwap/myTrip/index.htm",
    results: {
        onWork: { //未完成的工作
            routeName: "线路名称",
            totalNum: "人数",
            status: "状态",//已成团
            tripNo: "团号",
            planDateBegin: "发团时间"
        },
        endWork: {//已完成的工作
            routeName: "线路名称",
            totalNum: "人数",
            status: "状态",//已成团
            tripNo: "团号",
            planDateBegin: "发团时间"
        },
        msgs: [ //最新消息
            {
            	id: "公告id",
            	dictDetailName: "消息标题",
                createTime: "消息时间",
            },
            {
            	id: "公告id",
            	dictDetailName: "消息标题",
            	createTime: "消息时间",
            }
        ],
        notice(新增字段) :{
        		unReadNum : "未读数量",
        		notice:"提示语",
        		timeStr:"时间",
        }
    }
}



//查看和搜索所有工作列表
// status字段  枚举对应关系
var CisTripStatusEnum = {
	zutuan		:	"组团中",
	chengtuan	:	"成团",
	fatuan		:	"发团",
	init		:	"新建",
	confirm		:	"已确认",
	cancel		:	"取消",
	audited		:	"已审核",
	finish		:	"结束",
	filed		:	"已归档"
}
var JK_002 = {
	method: "${base}/cis/gwap/myTrip/myGuideTripList.htm",
    params: {
        status: "状态",//状态(枚举见上面)
        dayNum: "天数",
        planDateBegin: "发团日期",
        routeName: "按线路名搜索"//模糊查询

    },
    results: [{
        routeName: "线路名称",
        audltNum: "人数",
        status: "状态",//已成团
        tripNo: "团号",
        planDateBegin: "发团时间",
    }]
}

/** 工作详情 - 点开工作列表项 **/
var JK_003 = {
	method: "${base}/cis/gwap/myTrip/guideTripDetail.htm",
    params: {
        tripNo: "团号",
    },
    results: {
        routeName: "线路名称",
        stinationAreaName: "线路区域",
        dayNum: "游玩天数",
        audltNum: "出团人数",
        guiderQp: "带团导游",//??

    },
}

//查看所有团下游客
var JK_004 = {
	method: "${base}/cis/gwap/myTrip/visitorList.htm",
    params: {
        tripNo: "团号",
    },
    results: [
        {
            name: "姓名",
            sex: "性别",
            tel: '联系方式',
            certNo: '证件号',
            meetAddr: '接站地',
            deliverAddr: "送站地"
        }
    ]
}
/** 查看某个游客信息 */
var JK_005 = {
	method: "${base}/cis/gwap/myTrip/visitorDetail.htm",
    params: {
        id: "游客id",
    },
    results: {
        name: "姓名",
        sex: "性别",
        tel: '联系方式',
        certNo: '证件号',
        meetAddr: '接站地',
        deliverAddr: "送站地"
    }
}


//消息模板列表
var JK_006 = {
	method: "${base}/central/gwap/message/msgTempList.htm",
    results: [{
        id: "模板id",
        templateName: "模板名称",
        templateCode: "模板编号 ",
        templateContent: "模板内容 ",
    },]
}
//消息模板详情
var JK_007 = {
	method: "${base}/central/gwap/message/templateDetail.htm",
    params: {
        id: "模板id",
    },
    results: {
        id: "模板id",
        templateName: "模板名称",
        templateCode: "模板编号 ",
        templateContent: "模板内容 ",
    }
}

//一键发送短信
var JK_008 = {
	method: "${base}/cis/gwap/myTrip/sendMsgBatch.htm",
    params: {
        visitors: ['101','102'],//??  游客手机,逗号隔开
        templateId: '模板id'
    },
}
//退团申请
var JK_009 = {
	method: "${base}/cis/gwap/myTrip/visitorOut.htm",
    params: {
        visitors: ['101','102'],//??  游客id,用逗号隔开
        tripNo: "团号"
    },
}


//查看轨迹列表
var TrackOpTypeEnum =  {
	add		:	"添加",
	modify	:	"修改",
	out		:	"退团",
	report	:	"报账",
	aduit	:	"审核"
}
var JK_010 = {
	method : "${base}/cis/gwap/myTrip/trackList.htm",
    params: {
        tripNo: "团号",
    },
    results: [{
        id: "轨迹id",
        createTime: "消息日期",
        topic	: "标题",
        notice: "消息内容 ",
        opType : "操作类型(图标判断依据,详情见上面)",
        isRead : "T:已读,F:未读"(新增)
    },]
}

//轨迹详情
var JK_011 = {
	method : "${base}/cis/gwap/myTrip/trackDetail.htm",
    params: {
        id: "轨迹id",
    },
    results: {
    	opType	: "操作类型,详情见:TrackOpTypeEnum",
    	opClass : "对象名(与下列对象对应,有且仅有一个;例如:若值为cisTripBodyList,则从cisTripBodyList对象中取值)",
    	cisTripBodyList: {
    		name: "姓名",
    		certType: "证件类型",
    		certNo: "证件号",
    		tel: "联系方式",
    		status: "状态",
    		sex: "性别",
    		meetAddr: "接站地址",
    		deliverAddr: "送站地址",
    	},
    	CisTripGuider : {
    		submitSum : "报账金额",
    		auditFlag : "审核标志",
    		auditLoginName : "审核人",
    		auditTime : "审核时间",
    		
    	},
    	fields : {
    		// 注: 若opType为add,则此信息为空
    		fieldName : "发生变化的字段", 
    		beforeVal : "修改前",
    		afterVal  : "修改后",
    		creatTime :	"修改时间"
    	}
    },
}






//临时超载提醒
var JK_012 = {
	method: "${base}/cis/gwap/myTrip/sendOverloadMessage.htm",
    params: {
        tripNo: "团号",
        overloadNum: "超载人数",
    },
    data: {success: true, "message": "提醒短信发送成功", data: null, code: 200}
}

//查看行程详细信息
var JK_027 = {
	method: "${base}/cis/gwap/myTrip/tripDetail.htm",
    params: {
        tripNo: "团号",
    },
    results: [
        {
            dayIndex:"游玩日期",
            transportation:"交通工具",
            parkName:"景区",
            oyomrtstuInfoId:"行程介绍",
            planningId:"行程订单id",
            hotelId:"酒店id",
            hotelName:"酒店名称",
            breakfast:"早餐",
            lunch:"中餐",
            dinner:"晚餐",
        }
    ]
}


//?? 导游报帐 列表 -团
/**
 * 导游报账不是以团为单位的， 是团下房景车餐等项目的
 * @type {{params: {guiderId: string, status: string, dayNum: string, planDateBegin: string, routeName: string}, results: *[]}}
 */
var JK_013 = {
	method: "${base}/cis/gwap/myTrip/myGuideTripList.htm",
    params: {
        status: "状态",//已成团
        dayNum: "天数",
        planDateBegin: "发团日期",
        routeName: "按线路名搜索",//模糊查询
        tripFinsh:"报账状态"//E未报账F已报账T已审核   报帐状态,
    },
    data:[{
        routeName: "线路名称",
        audltNum: "人数",
        status: "状态",//已成团
        tripNo: "团号",
        planDateBegin: "发团时间",
        gapStatus: "E/T/F", //E未报账F已报账T已审核   报帐状态,
    }]
}

//帐单  --项目列表及团队信息

var JK_014 = {
	method: "${base}/cis/gwap/myTrip/projectList.htm",
    params: {
        tripNo:"团号",
        finsh:"项目状态"//保存:2
    },
    data: {
        trip:{
        	tripNo:"行程团号",
            audltNum:'成人',
            childNum:'儿童',
            loanPrice:'导游借款'
        },
        list:[{
        	itemId:"项目id",
            item: "项目(车:car\房:hotel\景:park\餐:rest\保险:insur\交通:traffic\其它支出:outfee\导服费:guider)",
            itemName: "项目名称(东方博物馆11(必填))",
            num: "数量",
            freeNum: "免去数量",
            finalSum: "金额",
            price: "单价",
            submitSum: "报帐金额",
            remarks:"备注",
            billSum:"报账数量"
            
        }]
    }
}
//新增、修改报账 - 项目列表
var JK_015 = {
		method: "${base}/cis/gwap/myTrip/proList.htm",
	    params: {
	        tripNo:"团号",
	        finsh:"项目状态"//0:未报账2:保存
	    },
	    data:[{
        	itemId:"项目id",
            item: "项目(车:car\房:hotel\景:park\餐:rest\保险:insur\交通:traffic\其它支出:outfee\导服费:guider)",
            itemName: "项目名称(东方博物馆11(必填))",
            num: "数量",
            freeNum: "免去数量",
            finalSum: "金额",
            price: "单价",
            submitSum: "报帐金额",
            remarks:"备注",
            billSum:"报账数量"
        }]
}
//新增报账-添加
var JK_016 = {
	method: "${base}/cis/gwap/myTrip/guiderPay.htm",
    params: {
        tripNo: "团号",//此字段不用加cisTripProject.
        itemId: "项目id",//更改字段
    	item:"项目类型（车、房、景...）车:car\房:hotel\景:park\餐:rest\保险:insur\交通:traffic\其它支出:outfee\其它消费:other",
    	billSum: '报账数量',
        price:'单价',
        remarks: "备注"
    }
}
//报账删除
var JK_034 = {
	method: "${base}/cis/gwap/myTrip/guiderDel.htm",
    params: {
        id: "项目id",
    	item:"项目类型（车、房、景...）车:car\房:hotel\景:park\餐:rest\保险:insur\交通:traffic\其它支出:outfee"
    },
}


//提交报账
var JK_017 = {
	method: "${base}/cis/gwap/myTrip/guiderBZ.htm",
    params: {tripNo:"行程团号",
    		 proJson:[{
			    	id:"项目id",
			    	item:"项目类型（车、房、景...）车:car\房:hotel\景:park\餐:rest\保险:insur\交通:traffic\其它支出:outfee",
    				}]
    		}
}


//////////////////////////人事
//人事计划日程
// status字段  枚举对应关系
var GuiderVacationStatusEnum = {
    apply		:	"申请中",
    on	:	"度假中/已审核",
    back  : "回来", //提前返回
    finish		:	"已销假",//正常过完假期
}
var JK_018 = {
    method:"${base}/central/gwap/vacation/list.htm",
    params: {
        month: '2017-12'
    },
    results: [{
        dateLine: "日期",
        day: "天(28)",
        status: "状态（请假/审核中)",
    }]
}
/**
 * 请假明细
 * @type {{method: string, params: {month: string}, results: *[]}}
 */

var JK_029 = {
    method:"${base}/central/gwap/vacation/get.htm",
    params: {
        id: '请假条id'
    },
    results: {
        leaderName: "批假人",
        totalDays: "天数",
        status: "状态（请假/审核中)",
        vacationType:"请假类型",
        vacationReason:"请假事由",
        leaveDate:"请假日期",
        backDate:"假期结束日期",
        remark:'说明'
    }
}

/**
 *  请假类型
 * @type {{method: string}}
 */
var JK_032 = {
    method:"${base}/central/gwap/vacation/vactionType.htm",
    results: [{
        dictDetailCode:"code",//ill
        dictDetailName:"名称",//病假
    }]
}
/**
 *  请假类型
 * @type {{method: string}}t
 */
var JK_032 = {
    method:"${base}/central/gwap/vacation/type.htm",
    results: [{
        dictDetailCode:"code",//ill
        dictDetailName:"名称",//病假
    }]
}

/**
 * 请假
 * @type {{method: string, params: {month: string}, results: *[]}}
 */
var GuiderVacationStatusEnum = {
		apply	:	"申请中",
		cancel	:	"取消请假",
		on		:	"请假中",
		back	:	"已返回",
		finish	:	"已销假"
}
var JK_030 = {
    method:"${base}/central/gwap/vacation/doApply.htm",
    params: {
        // leaderName: "批假人",
        totalDays: "天数(1.5)",
        status: "状态（请假/审核中)",//枚举详情请看上面(GuiderVacationStatusEnum)
        vacationType:"请假类型",
        vacationReason:"请假事由",
        leaveDate:"请假日期",
        backDate:"假期结束日期",
        remark:'说明',

        dates:'["2017-12-20","2017-12-21"]',//请假日期
    },
}


//?? 人事计划 - 请假/销假/取消请假
var JK_019 = {
    method:"${base}/central/gwap/vacation/doUp.htm",
    params: {
        guiderId: '导游id',
        dates: "日期（[2017-07-07,2017-07-08]）",
    },
}


////////////////////个人中心

//个人信息
var JK_020 = {
    // params: {
    //     id: '导游id',
    // },
	method: "${base}/cis/gwap/myTrip/guiderInfo.htm",
    results: {
        guiderId: "infoId",
        guiderName: "导游名称",
        guiderCode: "导游编号",
        info: "签名",
        idcard: "身份证",
        mobile: "手机 ",
        corpId: "公司id ",
        corpName: "公司名称 ",
        email: "邮箱 ",
        address: "地址 ",
        sex: "性别",
        dyz: "导游证",
        photoUrl: "头像连接",
        lang: "语种",
        edu: "教育程度",
        serviceClass: "导游类型",
        nativePlace: "籍贯",
    }
}

//短信模板管理-增 JK_006
var JK_021 = {
	method: "${base}/central/gwap/message/saveMessage.htm",
    params: {
        guiderId: "导游ID",
        templateName: "模板名称",
        templateContent: "模板内容 ",
    }
}
//短信模板管理-删 JK_006
var JK_022 = {
	method: "${base}/central/gwap/message/delMessage.htm",
    params: {
        guiderId: "导游ID",
        templateIds: ["模板ID", "模板ID2"],
    }
}
//短信模板管理-改 JK_006
var JK_023 = {
	method: "${base}/central/gwap/message/saveMessage.htm",
    params: {
        guiderId: "导游ID",
        templateId: "模板ID",
        templateName: "模板名称",
        templateContent: "模板内容 ",
    }
}


//登录
var JK_024 = {
    method:"${base}/central/gwap/login.htm?loginName=hong&loginPass=123456",
    params: {
        loginName: "导游帐号",
        loginPass: "登录密码"
    },
    results: {
        guiderId: '导游id',
        sessionId:"12fafdafdaf21afafa",
        ticket:"dfljalfjlfj",
        domain:""
    }
}

//修改密码
var JK_025 = {
    method:"${base}/central/gwap/rePwd.htm",
    params: {
        // guiderId: "导游ID",
        identifyCode: "",
        newPass: "",//
    },
}


//发送短信验证码 - 重置密码
var JK_026 = {
    method:"${base}/central/gwap/sendCheckCode.htm",
    params: {
        mobile: "手机号",
        identifyCode:"验证码",
    },

}

//发送短信验证码
var JK_026 = {
    method:"${base}/central/gwap/sendCheckCode.htm",
    params: {
        mobile: "手机号",
    },
    results:{
        identifyCode:"验证码",
    }

}

//校验信验证码
var JK_028 = {
    method:"${base}/central/gwap/validation.htm",
    params: {
        identifyCode:"验证码",
    },

}

// 补充:
// 公告详情
var JK_031 = {
		method: "${base}/cis/gwap/myTrip/noticeDetail.htm",
	     params: {
	         id: "公告id"
	     },
	    results: {
	    	dictDetailName: "标题",
	    	dictDetailValue: "内容",
	    }
	}


//校验信验证码
var JK_033 = {
    method:"${base}/central/gwap/forget.htm",
    params: {
        mobile: "手机号",
        newPass: "",//
        identifyCode:"验证码",
    },

}

// 行程状态列表
var JK_034 = {
	    method:"${base}/cis/gwap/myTrip/tripStatus.htm",
	    data : {
	    	key : value
	    }
	}

//导游评价
/*
 *  cisTripComment.tripNo  参数名前都要加上cisTripComment.
 * */
var JK_035 = {
	    method:"${base}/cis/gwap/myTrip/saveEvaluateAjax.htm",
	    params : {
	    	commentType:"0:投诉1:评价",
	    	guiderServerStar:"导游服务评级(1-5)",
	    	guiderExplainStar:"导游讲解评级(1-5)",
	    	driverStar:"司机服务评级(1-5)",
	    	parkStar:"景区线路评级(1-5)",
	    	restStar:"餐饮评级(1-5)",
	    	carStar:"车辆卫生评级(1-5)",
	    	content:"评价人内容",
	    	remark:"游客信息info"
	    }
	}


//短信发送(导游评价)
/*
 *  
 * */
var JK_035 = {
	    method:"${base}/cis/gwap/myTrip/sendMsgAjax.htm",
	    params : {
	    	tripNo : "团号"
	    },
		data : {
			info:"游客信息"
		}
	}
