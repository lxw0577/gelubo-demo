<template>
  <div class="outer-main">
      <div class="topDiv flexDiv flexSB">
          <div class="Topleft"></div>
          <div class="topTitle">{{nowday}}</div>
          <div class="today" @click="BackToToday">今天</div>
      </div>
      <div class="time">
          <div class="timeTop flexDiv flexFS">
              <div class="timeTopT"><div>日</div></div>
              <div class="timeTopT"><div>一</div></div>
              <div class="timeTopT"><div>二</div></div>
              <div class="timeTopT"><div>三</div></div>
              <div class="timeTopT"><div>四</div></div>
              <div class="timeTopT"><div>五</div></div>
              <div class="timeTopT"><div>六</div></div>
          </div>
          <swiper loop  :show-dots="false" @on-index-change="monChange" @on-get-height="swiperHeight('24rem')" v-model="swiperItemIndex">
            <swiper-item  class="timeDay flexDiv flexFS" v-for="(item,key) in dayArr" :key="key" v-if="btnFlag==1">
                <div class="timeTopT" v-for="(daynum,index) in item.day" :key="index">
                    <div :class="[
                        {changeBg:(nowday == item.date + '-' + (daynum<10?'0'+daynum:daynum))},
                        {nowBg:(thisDay == item.date + '-' + (daynum<10?'0'+daynum:daynum))}
                    ]" 
                    @click="daynum!='' &&changeColor(item,index)">
                        {{daynum}}
                    </div>
                </div>
            </swiper-item>
            <swiper-item class="timeDay flexDiv flexFS" v-for="(item,key) in weekArr" :key="key" v-if="btnFlag==0">
                <div class="timeTopT" v-for="(daynum,index) in item.day" :key="index">
                    <div :class="[
                        {changeBg:(nowday == item.allday[index])},
                        {nowBg:(thisDay == item.allday[index])}
                    ]" 
                    @click="changeColor(item,index)">
                        {{daynum}}
                    </div>
                </div>
            </swiper-item>
        </swiper>
          <div class="buttonB" @click="(btnFlag==1?swiperHeight('4rem'):swiperHeight('24rem'));(trans($event))"><span class="span1">></span></div>
      </div>
      <div class="navC  flexDiv flexSA">
          <div class="nav"  v-for="(item,key) in centerList" :key="key" :class="{chanCee:chanCe == key}" @click="chanCe=key">{{item}}<div class="borderB"></div></div>
      </div>
      <div class="listDemo">
          <div class="list" v-for="(item,key) in listDemo" :key="key">
              <div class="listT">{{item.listT}}</div>
              <div class="listCon">{{item.listCon}}</div>
              <div class="listMe">我的角色：{{item.listMe}}</div>
              <div class="listTime">{{item.listTime}}</div>
              <div class="listMore">. . .</div>
          </div>
      </div>
      <div style="height:5rem"></div>
      <div class="bottomDiv flexDiv flexSA">
          <div class="bod" v-for="(item,key) in bottomList" :key="key" :class="{chanGee:chanGe == key}" @click="chanGe=key">{{item}}</div>
      </div>
  </div>
</template>

<script>
import { Alert,Swiper,SwiperItem } from 'vux'
import { constants } from 'crypto';
export default {
  name: 'demo',
  data () {
    return {
        msg: '',
        btnFlag : 1,//展开标志
        listDemo:[
          {listT:'227市场',listCon:'定价依据和客户判定',listMe:'经办人',listTime:'16：24'},
          {listT:'227市场',listCon:'定价依据和客户判定',listMe:'经办人',listTime:'16：24'},
          {listT:'227市场',listCon:'定价依据和客户判定',listMe:'经办人',listTime:'16：24'},
          {listT:'227市场',listCon:'定价依据和客户判定',listMe:'经办人',listTime:'16：24'},
          {listT:'227市场',listCon:'定价依据和客户判定',listMe:'经办人',listTime:'16：24'},
          {listT:'227市场',listCon:'定价依据和客户判定',listMe:'经办人',listTime:'16：24'},
          {listT:'227市场',listCon:'定价依据和客户判定',listMe:'经办人',listTime:'16：24'}
        ],
        // day:[],
        swiperItemIndex:0,
        choiceDate:'',//选择的年月
        dayArr:[
            {date:'',day:[]},
            {date:'',day:[]},
            {date:'',day:[]}
        ],
        weekArr :[
            {allday:[],day:[]},
            {allday:[],day:[]},
            {allday:[],day:[]},
        ],
        changeC:-1,//选择的日期
        dayNow:-1,//今天
        dayMonthNow:'',//今天准确月份，不会改变
        thisDay:'',//今天准确日期，不会改变
        nowday:"",
        bottomList:['工作','角色','事项','同事','日历'],
        chanGe:4,
        centerList:['已设置提醒','创建时间','最后发言时间'],
        chanCe:0
    }
  },
  mounted(){
        var myDate = new Date();
        myDate.getMonth()+1<10?this.choiceDate = myDate.getFullYear() +'-0' + (myDate.getMonth()+1):this.choiceDate = myDate.getFullYear() +'-' + (myDate.getMonth()+1);
        this.dayMonthNow = this.choiceDate;
        this.thisDay= this.choiceDate+'-'+(myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate());
        this.getDayArr(myDate.getFullYear(),myDate.getMonth()+1,0);


        var d1 = new Date();
        var d2 = new Date(d1);
        var d3 = new Date(d1);
        d2.setDate(d1.getDate()+7);
        d3.setDate(d1.getDate()-7);

        this.weekArr[0] = this.getWeekDay(d1.getFullYear()+'-'+(d1.getMonth()+1) + '-' + d1.getDate());
        this.weekArr[1] = this.getWeekDay(d2.getFullYear()+'-'+(d2.getMonth()+1) + '-' + d2.getDate());
        this.weekArr[2] = this.getWeekDay(d3.getFullYear()+'-'+(d3.getMonth()+1) + '-' + d3.getDate());

        this.nowday = this.getNowFormatDate();
  },
  components:{
        Alert,Swiper,SwiperItem
  },
  
  methods:{
        //获取当前时间
        getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        //判断闰年
        runNian(_year) {
            if(_year%400 === 0 || (_year%4 === 0 && _year%100 !== 0) ) {
                return true;
            }else { 
                return false; 
            }
        },
        //判断某年某月的1号是星期几
        getFirstDay(_year,_month,arri) {
            _month<10?this.dayArr[arri].date = _year+'-0'+_month:this.dayArr[arri].date=_year+'-'+_month;
            var allDay = 0, y = _year-1, i = 1;
            allDay = y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) + 1;
            for ( ; i<_month; i++) {
                switch (i) {
                    case 1: allDay += 31; break;
                    case 2: 
                        if(this.runNian(_year)) { allDay += 29; }
                        else { allDay += 28; }
                        break;
                    case 3: allDay += 31; break;
                    case 4: allDay += 30; break;
                    case 5: allDay += 31; break;
                    case 6: allDay += 30; break;
                    case 7: allDay += 31; break;
                    case 8: allDay += 31; break;
                    case 9: allDay += 30; break;
                    case 10: allDay += 31; break;
                    case 11: allDay += 30; break;
                    case 12: allDay += 31; break;
                }
            }
            var firstDay =  allDay%7;
            console.log('firstDay',_month+'/'+firstDay)
            console.log(_year,_month)
            this.dayArray(firstDay,_year,_month,arri);
            
        },
        dayArray(firstDay,_year,_month,arri){
            this.dayArr[arri].day = []
            var myDate = new Date();
            // var key = firstDay==0?1:firstDay;
            var key = firstDay;
            arri == 0 ?this.changeC = key + myDate.getDate()-1 : this.changeC; //默认选择本月的日期
            this.dayNow = this.changeC//默认选择本月的日期
            for(var i = 0 ; i<key;i++){
                this.dayArr[arri].day.push('');
            }
            if(_month==1 || _month==3 || _month==5 || _month==7 || _month==8 || _month==10 || _month==12){
                console.log("_month",_month)
                for(var j = 1;j<=31;j++){
                    this.dayArr[arri].day.push(j);
                }
            }else if(_month==4 || _month==6 || _month==9 || _month==11){
                console.log("_month",_month)
                for(var j = 1;j<=30;j++){
                    this.dayArr[arri].day.push(j);
                }
            }else{
                if(this.runNian(_year)) {
                    for(var j = 1;j<=29;j++){
                        this.dayArr[arri].day.push(j);
                    }
                }else{
                    for(var j = 1;j<=28;j++){
                        this.dayArr[arri].day.push(j);
                    }
                }
            }
        },
        changeColor(item,index){
            let _this = this;
            this.changeC = index;
            if(this.btnFlag == 1){
                item.day[index]<10?this.nowday = item.date+'-0'+item.day[index]:this.nowday = item.date+'-'+item.day[index];
                this.choiceDate = item.date;


                var d1 = new Date(_this.nowday);
                var d2 = new Date(d1);
                var d3 = new Date(d1);
                d2.setDate(d1.getDate()+7);
                d3.setDate(d1.getDate()-7);
                this.weekArr[0] = this.getWeekDay(d1.getFullYear()+'-'+(d1.getMonth()+1) + '-' + d1.getDate());
                this.weekArr[1] = this.getWeekDay(d2.getFullYear()+'-'+(d2.getMonth()+1) + '-' + d2.getDate());
                this.weekArr[2] = this.getWeekDay(d3.getFullYear()+'-'+(d3.getMonth()+1) + '-' + d3.getDate());
            }else{
                var choiceDate = item.allday[index].split('-')[0] + '-' + item.allday[index].split('-')[1]
                this.nowday = item.allday[index]
                this.choiceDate = choiceDate;


                var myDate = new Date(_this.nowday);
                myDate.getMonth()+1<10?this.choiceDate = myDate.getFullYear() +'-0' + (myDate.getMonth()+1):this.choiceDate = myDate.getFullYear() +'-' + (myDate.getMonth()+1);
                this.getDayArr(myDate.getFullYear(),myDate.getMonth()+1,0);
            }
            

        },
        swiperHeight(oHeight){
            this.$nextTick(()=>{
                document.getElementsByClassName('vux-slider')[0].style.height = oHeight;
                document.getElementsByClassName('vux-swiper')[0].style.height = oHeight;
                // this.$refs.cateSwiper.xheight = diffHei+'px'
            })
            oHeight=='24rem'?this.btnFlag = 1:this.btnFlag = 0;
            this.swiperItemIndex = 0;
        },
        monChange(index){
            let _this = this;

            this.swiperItemIndex  = index;
            var date = this.dayArr[index].date.split('-');
            if(this.btnFlag ==1){
                this.getDayArr(Number(date[0]),Number(date[1]),index);
            }else{
                var thisdate = new Date(this.weekArr[index].allday[0])
                this.weekChange(thisdate,index);
                
            }
        },
        getDayArr(year,month,index){// 获取日历数组
            var last = 0 , now = 0 ,next = 0;
            if(index == 0 ){
                last = 2; now = 0 ; next = 1;
            }else if(index == 1){
                last = 0; now = 1; next = 2;
            }else{
                last = 1; now = 2; next = 0;
            }
            //上月
            if((month)==1){
                this.getFirstDay(year-1,12,last);
            }else{
                this.getFirstDay(year,month-1,last);
            }
            //本月
            this.getFirstDay(year,month,now);
            //下月
            if((month)==12){
                this.getFirstDay(year+1,1,next);
            }else{
                this.getFirstDay(year,month+1,next);
            }
        },
        getWeekDay(dateString) { // 获取当前周数组
            let dateStringReg = /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/;
            
            if (dateString.match(dateStringReg)) {
                
                // let presentDate = new Date(dateString);
                // var strArr = dateString.split('-')
                // if (presentDate.getDay() ==0){
                //     strArr[2] = Number(strArr[2])+1;
                //     strArr[2] = strArr[2]<10?'0'+strArr[2]:strArr[2];
                //     dateString =strArr.join('-')
                // }
                // webview以及部分浏览器 无法识别“yyyy-mm-dd” 必须转化为“yyyy/mm/dd”
                var dateString = dateString.split('-').join('/');
                let presentDate = new Date(dateString);
                var strArr = dateString.split('/')
                if (presentDate.getDay() ==0){
                    strArr[2] = Number(strArr[2])+1;
                    strArr[2] = strArr[2]<10?'0'+strArr[2]:strArr[2];
                    dateString =strArr.join('/')
                }
                presentDate = new Date(dateString);
                let today =  presentDate.getDay() ;
                console.log('presentDate',presentDate)
                console.log('today',today)
                var arrDate = [];
                var allArrDate = [];
                Array.from(new Array(7), function(val, index) {
                    // console.log(presentDate.getTime() - (today - index-1) * 24 * 60 * 60 * 1000)
                    arrDate[index] = formatDate(new Date(presentDate.getTime() - (today - index ) * 24 * 60 * 60 * 1000))[0];
                    allArrDate[index] = formatDate(new Date(presentDate.getTime() - (today - index ) * 24 * 60 * 60 * 1000))[1];
                    // var temp = arrDate[6];
                    // arrDate.unshift(temp);
                    // arrDate.pop();
                    // console.log(arrDate)
                    // return arrDate;
                });
                var temp = {
                    allday:allArrDate,
                    day:arrDate
                };
                console.log(temp)
                return temp;

            } else {
                throw new Error('日期格式： "yyyy-mm-dd" or "yyyy/mm/dd"');
            }

            function formatDate(date) {
                var oday =  date.getDate();
                var day = date.getDate()<10?'0'+date.getDate():date.getDate();
                var month =(date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):date.getMonth()+1; 
                var aday =  date.getFullYear() + '-' + month + '-' + day;
                var thisarr = [oday,aday]
                return thisarr;
                // return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            }
        },
        weekChange(date,index){
            var d1 = date;
            var d2 = new Date(d1);
            var d3 = new Date(d1);
            if(index==0){
                d2.setDate(d1.getDate()+7);
                d3.setDate(d1.getDate()-7);
                this.weekArr[1]=this.getWeekDay(d2.getFullYear()+'-'+(d2.getMonth()+1) + '-' + d2.getDate());
                this.weekArr[2]=this.getWeekDay(d3.getFullYear()+'-'+(d3.getMonth()+1) + '-' + d3.getDate());
            }else if(index==1){
                d2.setDate(d1.getDate()-7);
                d3.setDate(d1.getDate()+7);
                this.weekArr[0] = this.getWeekDay(d2.getFullYear()+'-'+(d2.getMonth()+1) + '-' + d2.getDate());
                this.weekArr[2] = this.getWeekDay(d3.getFullYear()+'-'+(d3.getMonth()+1) + '-' + d3.getDate());
            }else{
                d2.setDate(d1.getDate()+7);
                d3.setDate(d1.getDate()-7);
                this.weekArr[0] = this.getWeekDay(d2.getFullYear()+'-'+(d2.getMonth()+1) + '-' + d2.getDate());
                this.weekArr[1] = this.getWeekDay(d3.getFullYear()+'-'+(d3.getMonth()+1) + '-' + d3.getDate());
            }
            
        },
        BackToToday(){
            this.nowday = this.thisDay;



            this.swiperItemIndex = 0;
            var myDate = new Date();
            myDate.getMonth()+1<10?this.choiceDate = myDate.getFullYear() +'-0' + (myDate.getMonth()+1):this.choiceDate = myDate.getFullYear() +'-' + (myDate.getMonth()+1);
            this.getDayArr(myDate.getFullYear(),myDate.getMonth()+1,0);
            var d1 = new Date();
            var d2 = new Date(d1);
            var d3 = new Date(d1);
            d2.setDate(d1.getDate()+7);
            d3.setDate(d1.getDate()-7);

            this.weekArr[0] = this.getWeekDay(d1.getFullYear()+'-'+(d1.getMonth()+1) + '-' + d1.getDate());
            this.weekArr[1] = this.getWeekDay(d2.getFullYear()+'-'+(d2.getMonth()+1) + '-' + d2.getDate());
            this.weekArr[2] = this.getWeekDay(d3.getFullYear()+'-'+(d3.getMonth()+1) + '-' + d3.getDate());
        },
        trans(e){
            
            var ospan = document.getElementsByClassName('span1')[0];
            ospan.style.transform= this.btnFlag==1?'rotate(-90deg)':'rotate(90deg)';
        }
   },
   watch:{
       btnFlag(){
           console.log('btnFlag')
       }
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.outer-main{
    height: 100%;

}
.topDiv{
    height: 5rem;
    background: #333333;
    color: #fff;
    
}
.Topleft{
    flex: 1;
}
.topTitle{
    font-size: 1.2rem;
    flex: 1;
    line-height: 5rem;
    text-align: center;
}
.today{
    margin-right: 1.5rem;
    font-size: 1.4rem;
    flex: 1;
    text-align: right;
}
.time{
    /* height: 10.5rem; */
    padding-left:3%;
    /* width: 100%;
    margin: 0 auto; */
}
.timeTop{
    width: 100%;
    
}
.timeTopT{
    width: 14%;
}
.timeTopT div{
    width: 4rem;
    height: 4rem;
    font-size: 1.4rem;
    line-height: 4rem;
    text-align: center;
    border-radius: 50%;
    /* background: #2a579a; */
}
.changeBg{
    background: #2a579a;
    color: #fff;
}
.nowBg{
    border:1px #2a579a solid;
}
.timeDay{
    flex-wrap: wrap;
}
.buttonB{
    width: 100%;
    /* height:2rem; */
    text-align: center;
    line-height: 3rem;
    /* transform:rotate(-90deg); */
}
.vux-swiper,.vux-slider{
    transition:0.5s;
}
.buttonB span{
    display: inline-block;
    transform:rotate(-90deg);
    transition:0.5s;
}
.navC{
    width: 100%;
    height: 5rem;
    border-top: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc;
}

.listDemo{
    width: 100%;
    height: 42rem;
    overflow: auto;
    
    /* border-bottom: 1px solid #f2f2f2; */
}
.list{
    /* height: 7.4rem; */
    padding: 1rem 0.6rem 1rem 2.3rem;
    position: relative;
    border-bottom: 1px solid #f2f2f2;
    font-size: 1.2rem;
}
.listT{
    color: #000;
    font-size: 1.8rem;

}
.listCon{
    color: #999999;
    
}
.listMe{
    color: #0099cc;
}
.listTime{
    color: #999999;
    position: absolute;
    right: 0.6rem;
    top:1rem;
}
.listMore{
    color: #999999;
    /* font-size: 2rem; */
    position: absolute;
    right: 0.6rem;
    bottom: 1rem;
}
.bottomDiv{
    position: fixed;
    background: #fff;
    bottom: 0;
    width: 100%;
    height: 5rem;
    border-top: 1px solid #dcdcdc;

}
.chanGee{
    color: #2a579a;
}
.chanCee{
    color: #2a579a;
    font-weight: bolder;
}
.nav{
    line-height: 5rem;
    position: relative;
}
.chanCee .borderB{
    position: absolute;
    top:0;
    left: 0;
    right: 0;
    margin: auto;
    height: 5rem;
    width: 4rem;
    border-bottom: #2a579a 1px solid;
}

/* 
.title{
  line-height: 100px;
  text-align: center;
  color: #fff;
}
.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}
@-webkit-keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
.fadeInUp {
  animation-name: fadeInUp;
} */
</style>
