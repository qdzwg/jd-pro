<template>
  <div>
    <div class="page-line"></div>
    <div class="" @click="showLayer" >
      <mt-cell title="请假类型" is-link class="leave-islink">
        <span>{{onchangeName}}</span>
      </mt-cell>
    </div>
    <div  class="startTime" @click="openPickerStart">
      <mt-cell title="开始时间" is-link class="leave-islink">
        <span>{{form.leaveDate}}</span>
      </mt-cell>
    </div>
    <div  class="endTime" @click="openPickerEnd">
    <mt-cell title="结束时间" is-link class="leave-islink">
      <span>{{form.backDate}}</span>
    </mt-cell>
    </div>
    <mt-cell title="时长(天)" class="leave-islink form-box" >
      <!-- <input type="number" placeholder="请输入天数" v-model="form.totalDays" class="time"/> -->
      <!--<input type="number" placeholder="请输入天数" v-model="form.totalDays" class="time"
    onkeyup="if(this.value.length==1){this.value=this.value.replace(^\d+(\.\d|/+)?$,'')}else{this.value=this.value.replace(^\d+(\.\d|/+)?$,'')}"
    onafterpaste="if(this.value.length==1){this.value=this.value.replace(^\d+(\.\d|/+)?$,'0')}else{this.value=this.value.replace(^\d+(\.\d|/+)?$,'')}" />-->
      <input type="tel" placeholder="请输入天数"  v-model="form.totalDays"  class="time"
             onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
             onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}" />

    </mt-cell>
    <div class="page-line"></div>
    <mt-cell title="请假事由" class="leave-islink form-box" >
      <textarea placeholder="请输入请假事由" v-model="form.vacationReason" :maxlength="200" class="textarea"></textarea>
    </mt-cell>
    <div class="page-line"></div>
    <div class="big-blue-box"><mt-button type="primary" size="large" @click="postAjax">提交</mt-button></div>
    <mt-datetime-picker
      ref="pickerStart"
      type="datetime"
      year-format="{value}"
      month-format="{value}"
      date-format="{value}"
      :startDate=startDate
      :endDate=endDate
      @confirm="startOver">
    </mt-datetime-picker>
    <mt-datetime-picker
      ref="pickerEnd"
      type="datetime"
      :startDate=startDate
      :endDate=endDate
      year-format="{value}"
      month-format="{value}"
      date-format="{value}"
      @confirm="endOver">
    </mt-datetime-picker>
    <!--请假类型-->
    <transition name="slide">
      <mt-picker :slots="slots"
        :showToolbar="showToolbar"
        @change="onValuesChange"
        valueKey="dictDetailName"
        class="changeItem" v-if="layerShow">
        <div class="btn-box">
          <div @click="yesClick" class="sureBtn layerBtn">确定</div>
          <div @click="layerShow=!layerShow" class="sacleBtn layerBtn">取消</div>
        </div>
      </mt-picker>
    </transition>
    <div class="mask" v-if="layerShow"  @click="layerShow=!layerShow"></div>
  </div>
</template>
<script>
  import { Cell,MessageBox,DatetimePicker,Button } from 'mint-ui';
  import validation from '../../assets/js/validation.js';
  import API from '../../http/api'
  export default{
      name:'Leave',
      data(){
          return {
            pickerValue:'',
            layerShow:false,//请假数据是否显示
            showToolbar:true,//请假数据头部按钮
            startDate:new Date(),
            endDate:new Date(new Date().getFullYear() + 10, 11, 31),
            onchangeType:'',
            onchangeName:'',
            slots:[{values:[{dictDetailCode:1,dictDetailName:'病菌'},{dictDetailCode:1,dictDetailName:'我'}]}],//请假数据
            form:{
              // leaderName: "批假人",
              totalDays: "",
              status: "apply",
              vacationType:"",
              vacationReason:"",
              leaveDate:"",
              backDate:"",
              remark:'',
              dates:['',''],//请假日期
            }
          }
      },
      methods: {
        //开始时间点击
        openPickerStart() {
          this.$refs.pickerStart.open();
        },
        //结束时间点击
        openPickerEnd() {
          this.$refs.pickerEnd.open();
        },
        //开始时间点击确定
        startOver(value){
          this.form.leaveDate = this.dateChange(value);
          this.form.dates[0] = this.dateChange(value);
        },
        //结束时间点击确定
        endOver(value){
          this.form.backDate = this.dateChange(value);
          this.form.dates[1] = this.dateChange(value);
        },
        //遮罩点击
        showLayer(){
          this.layerShow=!this.layerShow;
          let e = event.target;
          e.blur();
        },
        //假期类型选择滚动
        onValuesChange(picker, values){
          this.onchangeType = values[0].dictDetailCode;
          this.onchangeName =values[0].dictDetailName;
        },
        //假期类型选择的确定按钮
        yesClick(){
          this.form.vacationType = this.onchangeType;
            this.layerShow=!this.layerShow;
        },
        dateChange(date){
            date = new Date(date);
            let year = date.getFullYear(),
                month = this.time(date.getMonth()+1),
                day = this.time(date.getDate()),
                hours = this.time(date.getHours()),
                min = this.time(date.getMinutes());
            return year+'-'+month+'-'+day+'--'+hours+':'+min;
        },
        time(s){
            return (+s<10?('0'+s):s);
        },
        Computation(sDate1, sDate2){
            var aDate, oDate1, oDate2, iDays;
            aDate = sDate1.split("-");
            oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]+' '+aDate[4]) ;  //转换为12-13-2008格式
            aDate = sDate2.split("-");
            oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]+' '+aDate[4]);
            iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24);   //把相差的毫秒数转换为天数
            iDays=iDays;
            console.log('iDays',iDays);
            return iDays;
        },
        Validate(){
          if(validation.isEmpty(parseInt(this.form.totalDays)!==this.form.totalDays)){
            MessageBox.alert('请输入整天数');
            return false;
          }else if(new Date(this.form.dates[0]).getTime()>new Date(this.form.dates[1]).getTime()){
            MessageBox.alert('起始日期必须小于结束日期');
            return false;
          }else if(this.Computation(this.form.dates[0],this.form.dates[1])!=Math.floor(this.form.totalDays)){
            console.log('天数',this.form.dates[1], this.form.dates[0])
            MessageBox.alert('请输入正确的天数');
            return false;
          }else if(validation.isEmpty(this.form.vacationReason)){
            MessageBox.alert('请输入请假事由');
            return false;
          }else{
            return true;
          }
        },
        postAjax(){
          if (this.Validate()) {
            this.form.dates = JSON.stringify(this.form.dates);
            console.log(this.form)
            this.axios.post(API.ManLeave, this.$qs.stringify(this.form))
              .then(res => {

                MessageBox.alert(res.data.message).then(action => {
                  if (res.data.success == true) {
                    this.$router.push({path: '/manage/calendar'});
                  }
                });
              });
            this.form.dates = JSON.parse(this.form.dates);
          }
        }
      },
      mounted(){
          this.axios.get(API.ManType)
            .then(res=>{
              console.log(res);
              this.slots[0].values=res.data.data;
              this.form.vacationType = res.data.data[0].dictDetailCode;//不选择时请假类型默认第一个
              this.onchangeName = res.data.data[0].dictDetailName;
            });
            let date=new Date(),
                begin=this.$route.query.begin,
                indate=new Date(begin);
          if(date.getTime()<indate.getTime()){

            this.form.leaveDate = this.form.dates[0] = this.dateChange(indate);
            this.form.backDate = this.form.dates[1] = this.dateChange(indate.setDate(indate.getDate()+1));//默认当前日期+1
          }else{
            this.form.leaveDate = this.form.dates[0] = this.dateChange(date);//默认当前日期
            this.form.backDate = this.form.dates[1] = this.dateChange(date.setDate(date.getDate()+1));//默认当前日期+1
          }
      }
    }
</script>
<style scoped lang="scss">
  .mint-cell span{
    font-size: 0.6rem;
    color: #999;
  }
  .mint-cell:last-child{
    background-image: none;
  }
  .big-blue-box{
    margin-top: 0.75rem;
    padding: 0 0.75rem;
  }
  input.time{
    font-size: 0.6rem;
    color: #999;
  }
  .textarea{
    font-size: 0.6rem;
    color: #999;
    box-sizing: border-box;
    min-height: 2.5rem;
    margin: 10px 0;
    display: block;
    width: 100%;
  }

</style>
