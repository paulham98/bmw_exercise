<template>
    <ul>
      <li class="box1">
        <img src="../../public/images/BMW.png" alt="">
        <h1>Customer Voice Dashboard</h1>
      </li>
      <li class="box2">
        <div class="top">
          <h1 class="tit">Overview</h1>
          <a href="#" class="more"><img src="../../public/images/Group9.6.png" alt=""></a>
          <div class="cal">
              <Datepicker ref="start_search" input-class="inputCss" calendar-class="calendarCss" wrapper-class="wrapper-class" v-model="start_select_date" :format="formatting_date" ></Datepicker>
              <img src="../../public/images/cal.png" alt="">
            <span>~</span>
              <Datepicker @click="click_calendar"  ref="end_search" input-class="inputCss" calendar-class="calendarCss" wrapper-class="wrapper-class"  v-model="end_select_date" :format="formatting_date" @opened="click_end_date"></Datepicker>
              <img src="../../public/images/cal.png" alt="">
          </div>
        </div>
        <div class="left">
          <div class="in_box">
            <h1 class="mn_tit">Current Issues</h1>
            <p class="day" style="margin-bottom: 40px;">{{start_select_date}} ~ {{end_select_date}}</p>
            <ul v-if="current_issues_show">
              <li>
                <p>데이터가 없습니다.</p>
              </li>
            </ul>
            <ul v-else>
              <li class="active" v-for="(item, i) in current_issues_data" :key="i">
                <p class="calc1">{{i + 1}}위</p>
                <p class="calc2">{{item.category_name}}</p>
                <p class="calc3">{{item.percentage}}%</p>
              </li>
            </ul>
            <div id="pie1" style="height: 180px; width:200px; position:absolute">
              <VueApexCharts class="apex_pie" type="donut"  width="240" :options="pie_chart_option" :series="pie_chart_series"></VueApexCharts>
            </div>
          </div>
          <div class="in_box">
            <h1 class="mn_tit">Keywords List</h1>
            <p class="day">{{start_select_date}} ~ {{end_select_date}}</p>
            <div>
              <ul v-if="keyword_list_show">
                <li>
                  <p>데이터가 없습니다.</p>
                </li>
              </ul>
              <ul v-if="!keyword_list_show">
                <li class="active" v-for="(item, i) in left_keyword_data" :key="i" @click="open_modal(item.keyword_key)" style="cursor:pointer; ">
                  <p class="calc1">{{item.rank}}위</p>
                  <p class="calc2">{{item.keyword}}</p>
                  <p class="calc3"><button type="button" :class="item.color">{{item.case_name}}</button></p>
                </li>
              </ul>
              <ul class="in_box_right" v-if="!keyword_list_show">
                <li class="active" v-for="(item, i) in right_keyword_data" :key="i" @click="open_modal(item.keyword_key)" style="cursor:pointer;">
                  <p class="calc1">{{item.rank}}위</p>
                  <p class="calc2">{{item.keyword}}</p>
                  <p class="calc3"><button type="button" :class="item.color">{{item.case_name}}</button></p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <ul class="right">
            <li>
              <span>Total Inbound</span>
              <p>{{Math.round(cs_total * 100)/100}} <em>건</em></p>
              <div class="purple"><img src="../../public/images/Vector.png" alt=""></div>
            </li>
            <li>
              <span>Daily Average</span>
              <p>{{Math.round(avg_cnt_per_day * 100)/100}} <em>건</em></p>
              <div class="blue"><img src="../../public/images/Vector-1.png" alt=""></div>
            </li>
            <li>
              <span>Complete Inbound</span>
              <p>{{Math.round(complete_cnt * 100) /100}} <em>건</em></p>
              <VueApexCharts class="chart chart2"  type="radialBar" :options="donut_chart_option" :series="donut_chart_series"></VueApexCharts>
            </li>
        </ul>
      </li>
      <RowHistory v-if="show_modal" :start="start_select_date" :end="end_select_date" :id="modal_id"></RowHistory>
    </ul>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import {EventBus} from "../event-bus";
import dayjs from 'dayjs';
import VueApexCharts from 'vue-apexcharts'
import RowHistory from "../components/RowHistory"
  export default {
    name: "ConsultStatics",
    components:{Datepicker, VueApexCharts,RowHistory},
    data(){
      return{
        category_data:[],
        show_calendar:false,
        big_category:[],
        show_modal:false,
        modal_id:1,
        start_select_date: this.get_date(true),
        end_select_date: this.get_date(false),
        avg_cnt_per_day:'',
        complete_cnt: '',
        complete_ratio: '',
        cs_total: 0,
        pie_chart_option: {},
        pie_chart_series:[],
        donut_chart_option: {},
        donut_chart_series: [],
        left_keyword_data:[],
        right_keyword_data:[],
        keyword_list_show : true,
        current_issues_data: [],
        current_issues_show: true,
      }
    },
    watch:{
      start_select_date: function (start_select_date) {
        console.log(start_select_date);
        this.search_date(this.start_select_date, this.end_select_date, 'st');
        console.log('on watch!!!!!',this.start_select_date,start_select_date);
      },
      end_select_date: function(end_select_date){
        console.log(end_select_date);
        this.search_date(this.start_select_date, this.end_select_date, 'en')
        // if(this.start_select_date === ''){
        //   alert('시작 날짜를 정해주세요.');
        //   this.$refs.start_search.$children[0].$emit('showCalendar');
        // }else{
        //   console.log('selected start date and plz choose ',end_select_date)
        // }
      },
    },
    methods:{
      open_modal(id){
        EventBus.$emit('history_modal', true);
        this.modal_id= id;
        this.show_modal = true;
      },
      string_to_int(data){
        let regex = /[^0-9]/g;
        let result = data.replace(regex, "");
        result = parseInt(result);
        return result
      },
      click_calendar(){
        if(this.show_calendar === false){
          this.show_calendar = true;
          return true
        }else{
          this.show_calendar = false;
          return false
        }
      },
      search_date(st, en, sel){
        // data formatting

        st =  dayjs(st).format('YYYY-MM-DD');
        en = dayjs(en).format('YYYY-MM-DD');
        let start = this.string_to_int(st);
        let end = this.string_to_int(en);
        console.log(st, en);
        if(end-start < 0){
          // 잘못된 형식이면 start, end인지 판단해서 빈칸으로 만들고, alert
          console.log(end, start, end-start);
          if(sel === 'st'){
            this.start_select_date = '';
          }else{
            this.end_select_date = '';
          }
          return alert('잘못된 형식입니다.')
        }else if(end -start >= 0){
          // 제대로된 형식이면 api call 해서 data 가져오기
          this.search_cs_statistics(st, en)
        }
        //console.log("methods", this.start_select_date)
      },
      create_pie_chart_option(){
        this.pie_chart_option= {};
        this.pie_chart_series = [];
        let label = [];
        for(let item of this.current_issues_data){
          this.pie_chart_series.push(item.percentage);
          label.push(item.category_name)
        }
        this.pie_chart_option = {
          chart:{
            width: 240,
            height: 240,
            type: 'donut'
          },
          stroke: {
            width: 1,
            colors: undefined
          },
          fill: {
            // colors : ['#0d96e8','#e9377b', '#ab77ec'],
            opacity: 0.9
          },
          labels: label,
          legend:{
            show: false
          },
          dataLabels:{
            style:{
              fontSize: '18px'
            }
          }
        };
      },
      create_donut_chart_option(donut_data){
        this.donut_chart_series = [];
        this.donut_chart_option = {};
        this.donut_chart_series.push(Math.round(donut_data*100)/100);
        this.donut_chart_option = {
          colors: ['#00DD23'],
          chart:{
            offsetX:60,
            offsetY:30,
            width:180,
            height:180,
            type: 'radialBar'
          },
          plotOptions:{
            radialBar:{
              dataLabels:{
                name:{
                  show:false
                },
                value:{
                  offsetY: -3,
                  color: 'white'
                }
              }
            },
          },

        }
      },

      search_cs_statistics(start, end){
        //let start = dayjs(this.start_select_date).format('YYYY-MM-DD');
        //let end = dayjs(this.end_select_date).format('YYYY-MM-DD');
        // let csrecord_api = `http://ec2-3-37-174-60.ap-northeast-2.compute.amazonaws.com:30001/bmwgs/api/v1.0/csrecord/statistic?start=2021-10-11&end=2021-10-12`;
        //
        console.log(start,end);
        let date =[];
        date.push(start);
        date.push(end);
        EventBus.$emit('big_category_date', date);
        /*
        EventBus.$emit('history_date', date =>{
          console.log("1231234", date)
        });
         */
        this.start_select_date = start;
        this.end_select_date = end;
        this.get_keyword_list();
        this.get_current_issues();

        let csrecord_api = `${this.$get_api_host()}/bmwgs/api/v1.0/csrecord/statistic?start=${start}&end=${end}`;
        this.$call_api(csrecord_api, data =>{
          console.log('csrecord!!!', data);
          this.cs_total = data.total_cs_num;
          this.avg_cnt_per_day = data.average_cs_count_per_day;
          this.complete_cnt = data.complete_cs_cnt;
          this.complete_ratio = data.cs_complete_rate;
          this.create_donut_chart_option(data.cs_complete_rate)
        });
      },
      formatting_date(date){
        return dayjs(date).format('YYYY-MM-DD')
      },
      get_date(state){
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth()+1;
        if(state === true){
          month = today.getMonth();
        }
        let day = today.getDate();
        return `${year}-${month}-${day}`
      },
      click_end_date(){
        console.log("!!!!")
        if(this.start_select_date === ''){
          return alert("시작 날짜를 정해주세요")
        }
      },
      get_keyword_list(){
        // let keyword_api = `http://ec2-3-37-174-60.ap-northeast-2.compute.amazonaws.com:30001/bmwgs/api/v1.0/keyword/rank?start-date=2021-07-01&end-date=2021-11-30`;
        let keyword_api = `${this.$get_api_host()}/bmwgs/api/v1.0/keyword/rank?start-date=${this.start_select_date}&end-date=${this.end_select_date}`;
        this.$call_api(keyword_api, data =>{
          console.log("keyword data!!!",data.data);
          let items = data.data;
          items.sort(function (a, b){
            return a - b
          });
          this.left_keyword_data = [];
          this.right_keyword_data = [];
          console.log("sort keyword data", items);
          // 데이터 길이에 따라 데이터 넣는 방식 다르게 적용

          if(data.data.length > 0 && data.data.length < 5){

            for(let i = 0; i < items.length; i++){
              if(items[i].case_name === '서비스 혜택 문의'){
                items[i].color = 'green'
              }else if(items[i].case_name === 'AS 문의'){
                items[i].color = 'pink'
              }else if(items[i].case_name === '밴티지(Vantage)'){
                items[i].color = 'red'
              }else if(items[i].case_name === '사고 접수'){
                items[i].color = 'blue'
              }else if(items[i].case_name === '기능 문의'){
                items[i].color = 'purple'
              }
              //console.log(items[i]);
              this.left_keyword_data.push(items[i]);
              this.keyword_list_show = false;
            }
          }else if(data.data.length === 0){
            this.keyword_list_show = true;

          }else if(data.data.length >= 5 && data.data.length <= 10){
            for(let i = 0; i < 5; i++){
              if(items[i].case_name === '서비스 혜택 문의'){
                items[i].color = 'green'
              }else if(items[i].case_name === 'AS 문의'){
                items[i].color = 'pink'
              }else if(items[i].case_name === '밴티지(Vantage)'){
                items[i].color = 'red'
              }else if(items[i].case_name === '사고 접수'){
                items[i].color = 'blue'
              }else if(items[i].case_name === '기능 문의'){
                items[i].color = 'purple'
              }
              //console.log(items[i]);
              this.left_keyword_data.push(items[i]);
            }
            for(let i = 5; i<items.length; i++){
              if(items[i].case_name === '서비스 혜택 문의'){
                items[i].color = 'green'
              }else if(items[i].case_name === 'AS 문의'){
                items[i].color = 'pink'
              }else if(items[i].case_name === '밴티지(Vantage)'){
                items[i].color = 'red'
              }else if(items[i].case_name === '사고 접수'){
                items[i].color = 'blue'
              }else if(items[i].case_name === '기능 문의'){
                items[i].color = 'purple'
              }
              //console.log(items[i]);
              this.right_keyword_data.push(items[i])
            }
            this.keyword_list_show = false;
          }else if(data.data.length > 10){
            for(let i = 0; i < 5; i++){
              if(items[i].case_name === '서비스 혜택 문의'){
                items[i].color = 'green'
              }else if(items[i].case_name === 'AS 문의'){
                items[i].color = 'pink'
              }else if(items[i].case_name === '밴티지(Vantage)'){
                items[i].color = 'red'
              }else if(items[i].case_name === '사고 접수'){
                items[i].color = 'blue'
              }else if(items[i].case_name === '기능 문의'){
                items[i].color = 'purple'
              }
              //console.log(items[i]);
              this.left_keyword_data.push(items[i]);
              if(items[i].case_name === '서비스 혜택 문의'){
                items[i].color = 'green'
              }else if(items[i].case_name === 'AS 문의'){
                items[i].color = 'pink'
              }else if(items[i].case_name === '밴티지(Vantage)'){
                items[i].color = 'red'
              }else if(items[i].case_name === '사고 접수'){
                items[i].color = 'blue'
              }else if(items[i].case_name === '기능 문의'){
                items[i].color = 'purple'
              }
              this.right_keyword_data.push(items[i+5])
            }
            this.keyword_list_show = false;
          }

        });
      },
      get_current_issues(){
        let current_api = `${this.$get_api_host()}/bmwgs/api/v1.0/csrecord/chart-info/cs-record-cnt-by-category?start=${this.start_select_date}&end=${this.end_select_date}`;
        this.$call_api(current_api, data =>{
          console.log('current issues data', data.data);
          if(data.data.length === 0) {
            console.log('current issues에 관한 데이터가 없습니다.')
          }else{
            let items = data.data;
            items.sort(function (a, b){
              return b.count - a.count
            });
            let sum = 0;
            for(let item of items){
              sum += item.count
            }
            this.current_issues_data  =[];
            if(data.data.length > 3){
              for(let i = 0; i < 3; i++){
                items[i].percentage = Math.ceil((items[i].count / sum) * 100 );
                this.current_issues_data.push(items[i]);
              }
              this.current_issues_show = false
            }else if(data.data.length > 0 && data.data.length <= 3){
              for(let item of items){
                item.percentage = Math.ceil((item.count / sum) * 100);
                this.current_issues_data.push(item);
              }
              this.current_issues_show = false
            }
            console.log(this.current_issues_data)
            this.create_pie_chart_option()
          }
        })

      }
    },
    created() {
      let big_category_api = `${this.$get_api_host()}/bmwgs/api/v1.0/category/`;
      this.$call_api(big_category_api, data =>{
        console.log('root big category!!!', data);
        this.category_data = data;
        for(let item of this.category_data){
          this.big_category.push(item.category_name)
        }
        console.log(this.big_category)
      });
     this.get_keyword_list();
     this.get_current_issues();
      let date =[];
      date.push(this.start_select_date);
      date.push(this.end_select_date);
      EventBus.$emit('big_category_date', date);
      this.search_date(this.start_select_date, this.end_select_date, 'created');
      EventBus.$on('focus_search', search => {
        if (search === false && this.start_select_date === '') {
          this.$refs.start_search.$children[0].$emit('showCalendar');
        } else if (search === false && this.end_select_date === '') {
          this.$refs.end_search.$children[0].$emit('showCalendar');
        }
      });
      EventBus.$on('history_modal', data =>{
        this.show_modal = data
      })
    },
  }
</script>

<style>
  main{background: #003;padding: 40px 30px; }
  main .tit{font-size: 30px;color: #fff;text-align: left;}
  main .more{position: absolute;right: 0;top: 30px;top: 50%;transform: translateY(-50%);}

  main .left,main .right{/* margin-bottom: 20px; */background: #212144;border-radius: 20px;padding: 30px;display: inline-block;position: relative;box-shadow: 0px 4px 10px rgba(0,0,0,0.4);}
  main .left{margin-right:15px;}

  main .box1{box-shadow: 0px 4px 4px #000000;border-radius: 20px;color: #fff;padding: 35px 45px;margin-bottom: 35px;background: url(../../public/images/Group842.png);background-size: 104% 117%;/* height: 331px; */background-position: center;text-align: right;}
  main .box1 h1{font-size: 55px;text-align: left;margin-top: 169px;text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);}
  main .box1 h2{font-size: 25px;margin-bottom: 10px;}
  main .box1 h3{font-size: 20px;}

  main .box2{margin-bottom: 35px;position: relative;background: #212144;border-radius: 20px;padding: 40px;box-shadow: 0px 4px 10px rgba(0,0,0,0.4);}
  main>ul>li>.top{position:relative;flex: 100%;margin-bottom: 55px;z-index:3;}

  main .box2 .left{border-radius: 0;background: none;padding: 0;margin-bottom: 0;width: 65%;margin-right: 17px;box-shadow: none;}
  main .box2 .left>div:first-child{margin-bottom: 20px;}
  main .box2 .left .in_box{background:#3C385F;border-radius: 25px;position: relative;padding: 40px 35px;}
  .day{text-align:right;color:#fff;font-weight: 100;margin: 15px 0;}
  .mn_tit{color:#fff;font-size:20px;}
  main .box2 .left>div:last-child div{display:flex;}
  main .box2 .left>div:last-child div ul:last-child:before{display:none;}
  main .box2 .left>div:last-child div ul{flex:1;}
  main .box2 .cal{display: inline-block;position: absolute;width: 600px!important;left: 180px;top: 50%;padding:0px;transform: translateY(-50%);}
  main .box2 .cal>div{background: #131931;border-radius: 500px;display: inline-block;text-align: center;vertical-align: middle;padding: 0px;}
  main .box2 .cal>div p{display:inline-block;color: #fff;}
  main .box2 .cal>div img{vertical-align:middle;margin-top: -4px;padding-left: 12px;}
  /*main .box2 .cal span{font-weight: 600;padding: 0 10px;color: #ffffff;font-size: 20px;vertical-align: middle;opacity: 0.5;}*/
  main .box2 .left select:nth-of-type(1){margin-left: 0;}
  main .box2 .left select{background: #fff;border-radius: 500px;display: inline-block;text-align: left;width: calc(50% - 10px);vertical-align: middle;padding: 13.5px 25px;margin-left: 15px;color: #8E8EA1;border: 0;margin-top: 83px;background: #131931 url(../../public/images/Icon-1.png)no-repeat;background-position: calc(100% - 20px);background-position: -webkit-calc(100% - 20px);background-position: -moz-calc(100% - 20px);padding-right: 31px!important;}
  main .box2 .right{width: calc(35% - 21px);vertical-align: top;box-sizing: border-box;border-radius: 0;box-shadow: none;padding: 0;}
  main .box2 .right ul{margin-top:50px;vertical-align:top;}
  main .box2 .right li{background: #3C385F;box-shadow: 0px 5px 10px rgba(19, 25, 49, 0.45);border-radius: 20px;padding: 30px 35px;color: #fff;position: relative;height: 267px;box-sizing: border-box;margin-right: 20px;}
  main .box2 .right li div{width: 120px;height: 120px;border-radius:500px;position: absolute;text-align: center;padding: 28px 0;right: 35px;bottom: 30px;}
  main .box2 .right li div.chart2{padding:0;width: 120px;height: 120px;}
  main .box2 .right li div.purple{background:#3C234F;}
  main .box2 .right li div.blue{background:#142853;}
  main .box2 .right li:nth-of-type(1){background:linear-gradient(180deg, rgba(248, 108, 153, 0.3) 0%, rgba(118, 52, 153, 0.3) 100%);}
  main .box2 .right li:nth-of-type(2){background:linear-gradient(180deg, rgba(0, 65, 140, 0.3) 0%, rgba(52, 135, 153, 0.3) 100%);}
  main .box2 .right li:nth-of-type(3){background:linear-gradient(180deg, rgba(0, 71, 94, 0.3) 0%, rgba(2, 210, 60, 0.3) 100%);}
  main .box2 .right li span{font-size:20px;}
  main .box2 .right li p{font-size: 50px;position: absolute;bottom: 27px;}
  main .box2 .right li p em{font-size:20px}
  main .box2 .right li:last-child{margin-bottom:0;}
  main .box2 .right li:last-child{margin-bottom:0px}
  main .box2 .right .left2{width: 50%;margin-right: 40px;display: inline-block;}
  main .box2 .right .left2 li{background: #3C385F;box-shadow: 0px 5px 10px rgba(19, 25, 49, 0.45);border-radius: 15px;padding: 15px 30px;color: #fff;position: relative;}
  main .box2 .right .left2 li div{width:58px;height:58px;border-radius:500px;position:absolute;right:30px;top:50%;transform: translateY(-50%);text-align: center;padding: 17px;}
  main .box2 .right .left2 li div.green{background: #214d4b;}
  main .box2 .right .left2 li div.yellow{background: #72614a;}
  main .box2 .right .left2 li div.blue{background: #234b76;}
  main .box2 .right .left2 li span{font-size:14px;color: #9390A8;margin-bottom: 4px;display: block;}
  main .box2 .right .left2 li p{font-size:35px;}
  main .box2 .right .left2 li p em{font-size:14px}
  main .box2 .right .right2{width: calc(50% - 44px);display: inline-block;}
  main .box2 .right .right2 li{background: rgb(136,66,179);background: linear-gradient(0deg, rgba(136,66,179,1) 0%, rgba(255,106,170,1) 100%);box-shadow: 0px 5px 10px rgba(19, 25, 49, 0.45);border-radius: 17px;color: #fff;padding: 25px;padding-bottom: 17px;}
  main .box2 .right .right2 li:after{content:"";clear:both;display:block;}
  main .box2 .right .right2 li>span{font-size:14px;}
  main .box2 .right .right2 li p{font-size:45px;text-shadow: 0px 2px 4px rgba(0,0,0,0.5);margin-top: 19px;}
  .chart {text-align: center;display: inline-block;position: relative;float: right;z-index: 0;}
  .chart:before{content:"";width: 94px;height: 126px;position:absolute;background: url(../../public/images/Group505.png) no-repeat;right: -6px;top: 50px!important;z-index: -1;padding-top: 30px}
  .chart span{position: absolute;display: block;width: 100%;text-align: center;top: 50%;transform: translateY(-50%);font-size: 25px;}
  main .box2 .in_box ul{position: relative;z-index: 0;text-align: center;width: calc(100% - 265px);display: inline-block;vertical-align: top;}
  main .box2 .in_box #pie1{display:inline-block;margin-left: 40px;margin-top: -40px;}
  main .box2 .in_box #pie1 canvas{top: 50%!important;left: 50%!important;transform:translate(-50%,-50%);width: 360px!important;height: 360px!important;}
  main .box2 .in_box ul li{padding-right: 10px;border-bottom: 1px solid rgba(999,999,999,0.2);}
  main .box2 .in_box:last-child ul:last-child li:first-child{border-bottom:1px solid rgba(999,999,999,0.2)}
  main .box2 .in_box ul li:first-child{border-bottom:0;}
  main .box2 .in_box .in_box_right .active:first-child{margin-bottom:-1px;}
  main .box2 .in_box ul::before{content: "";width: calc(100% - 5px);height: 62px;background: #111138;border-left: 5px solid #00ff29;position: absolute;box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);z-index: -1;left: 0;}
  main .box2 .in_box ul li.active p{color: #fff;font-size: 24px;padding: 16px 0;}
  main .box2 .in_box ul li.active button{/* margin: 4px 0; */vertical-align: middle;}
  main .box2 .in_box ul li.active p.calc2{text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);}
  main .box2 .in_box .calc1{width: 85px;display: inline-block;padding: 18px 0;vertical-align: middle;font-size: 16px;}
  main .box2 .in_box li p{font-size:18px;padding:18px 0;vertical-align:middle;color: #fff;}
  main .box2 .in_box li p.calc2{width: calc(100% - 173px);text-align: left;display: inline-block;box-sizing: border-box;padding-left: 30px!important;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow: ellipsis;-ms-text-overflow: ellipsis;}
  main .box2 .in_box .calc3{width: 80px;display: inline-block;}
  main .box2 .in_box .calc3 button{border-radius: 3px;font-size: 12px;padding: 5px 13px;}
  main .box2 .in_box .calc3 button.pink{width:80%;background:#FF00A8;text-overflow: ellipsis; overflow: hidden; white-space: nowrap}
  main .box2 .in_box .calc3 button.green{width:80%;background: #00DD23;text-overflow: ellipsis; overflow: hidden; white-space: nowrap}
  main .box2 .in_box .calc3 button.blue{width:80%;background: #159BFA;text-overflow: ellipsis; overflow: hidden; white-space: nowrap}
  main .box2 .in_box .calc3 button.red{width:80%;background: #F64444;text-overflow: ellipsis; overflow: hidden; white-space: nowrap}
  main .box2 .in_box .calc3 button.purple{width:80%;background: #D7B7FF;text-overflow: ellipsis; overflow: hidden; white-space: nowrap}
  @media(max-width:1132px){
    main .box2 .right .right2 li:nth-of-type(1){padding-bottom: 17px;}
    .chart{float:none;display:block;text-align:right;}
    .chart span{width:100px;right: 0;}
    .chart canvas{width: 100px!important;height: 100px!important;}
    .chart:before{width: 94px;height: 106px;right: -20px;top: 30px!important;background-size: 100%;}
  }
  @media(max-width: 1250px){
    main .box2 .left{width:100%;}
    main .box2 .right{display:flex;width: 100%;margin-top: 20px;}
    main .box2 .right li:last-child{margin-right:0}
    main .left, main .right li{flex:1}
    main .box2 .right li p{font-size:40px;}
    main .box2 .right li div{width: 90px;height: 90px;padding: 20px;right: 25px;bottom: 25px;}
    main .box2 .right li div.chart2{width:100px;height:100px;}
    main .box2 .right li div.chart2 canvas{width: 100px!important;height: 100px!important;}
    .chart:before{content:"";width: 100px;height: 117px;position:absolute;background: url(../../public/images/Group505.png) no-repeat;right: -30px;top: 30px!important;z-index: -1;background-size: 100%;}
    main .box1 h1{margin-top: 100px;}
    #cart1,#cart2,#cart1 div,#cart1 canvas,#cart2 div,#cart2 canvas{/* width:100%!important; *//* max-width: inherit!important; */}
    main .box2 .right li{padding:25px;}
  }
  @media(max-width:1132px){
    main .box2 .right .right2 li:nth-of-type(1){padding-bottom: 17px;}
    .chart{float:none;display:block;text-align:right;}
    .chart span{width:100px;right: 0;}
    .chart canvas{width: 100px!important;height: 100px!important;}
    .chart:before{width: 94px;height: 106px;right: -40px!important;top: 50px!important;background-size: 100%;}
  }
  @media(max-width:1100px){
    main .box2 .right .right2 li p{font-size:40px}
    main .box2 .right li div{width: 50px;height: 50px;padding: 10px;right: 20px;bottom: 20px;}
    main .box2 .right li p{font-size:30px}
    main .box2 .right li{height:200px;padding: 20px;}
  }
  @media(max-width: 1000px){
    main .box1 h1{font-size:40px;}
    main .box2 .left{width:100%;margin-right:0;}
    main .box2 .left .top, main .box2 .left .bot{width: calc(50% - 10px);display: inline-block;vertical-align: top;}
    main .box2 .left .top{margin-right:15px;}
    main .box2 .left .cal{margin-top:20px;}
    main .box2 .left select{margin-top:20px;}
    main .box1 h2{font-size:20px;}
    main .box1 h3{font-size:17px;}
    main .box2 .right{width:100%;}
    main .box2 .right .left2 li p{font-size:30px;}
    main .box2 .right .left2 li div{width: 45px;height: 45px;padding: 13px;}
    main .box2 .right .right2 li p{margin-top: 13px;}
    main .box2 .left .cal>div img{vertical-align:middle;margin-top: -3px;padding-left: 6px;width: 13px;}
    main .box4 .bot .calc2{font-size: 16px;}
    main .box2 .right ul{margin-top: 20px;}
    main .box6 .right .word{height: 465px;}
    main .box6 .bot>div ul::before{height: 56px;}
    main .box6 .right ul li:nth-of-type(2){padding: 0 19px;}
    main .box6 .right ul li div em{font-size: 13px;padding: 6px 0;}
    main .box6 .right ul li div{width: 52px;padding: 0 8px;}
    main .box6 .right ul li p{margin-right: 5px;}
    main .box6 select{left:200px}
    main .tit{font-size: 24px;}
    main .box6 .bot .calc2,main .box2 .in_box li p.calc2,main .box2 .in_box .calc1,main .box2 .in_box .calc3{font-size:15px;}
    main .box6 .bot>div ul li.active p.calc2,main .box6 .bot>div ul li.active p.calc1,main .box2 .in_box ul li.active p{font-size:20px;padding: 17.5px 0;}
    main .box6 .right .word{height: 394px;}
    main .box9 table thead th:first-child{width: 131px;}
    main .box9 table thead th:last-child{width: 115px;}
    main .box2, main .box3, main .box4, main .box6 .left .bot, main .box6 .right,main .box7,main .box8,main .box9{padding:20px}
    main .box2 .left .in_box,main .box4 .left, main .box4 .right{padding:25px}
    main .box2 .cal{position:static;transform:none;margin-top:20px;width: 100%;}
    main>ul>li.box2>.top,main>ul>li.box4>.top{margin-bottom:20px}
    main .box4 select{width:100%;position:static;transform:none;margin-top:20px;}
    main .box6 .top{margin-bottom:30px}
  }
  @media(max-width:800px){
    main .box2 .left .top, main .box2 .left .bot{padding: 20px;}
    main .box1{padding:25px;}
    main .left, main .right{padding: 20px;}
    main .box6 .left .top, main .box6 .left .bot{/* padding: 20px; */}
    main .box6 .left .bot{margin-bottom:35px}
    main .tit{font-size: 17px;}
    main .more{top:19px;right: 20px;}
    main .box6 .left{width: 100%;margin-right: 0;}
    main .box6 .left select{margin-top: 20px;}
    main .box6 .right{width: 100%;}
    header{padding-bottom: 64px;}
    header .right .search{position: absolute;width: calc(100% - 40px);bottom: 13px;left: 20px;}
    header{position: relative;}
    main .box2 .left .cal>div img{width:11px}
    main .box2 .left .cal>div{width:100%;padding: 8px 10px;}
    main .box2 .left .cal span{display:block;text-align:center;}
    main .box2 .left select{width:100%;padding: 8px 10px;padding-left: 25px;}
    main .box2 .left select:nth-of-type(2){margin-left:0;margin-top: 22px;}
    main .box5 h1{font-size:40px;bottom: 20px;padding-right: 30px;}
    main .box1 h1{font-size:30px;}
    main .box2 .right{display:block;}
    main .box2 .right li{margin-right:0;margin-bottom:15px;height: 148px;}
    main .box2 .left>div:last-child div{display:block;}
    main .box2 .left>div:last-child div ul{width:100%}
    main .box2 .in_box #pie1,main .box2 .in_box #pie1 div{width: 100px!important;height: 100px!important;}
    main .box2 .in_box .apex_pie{margin-left:20px; width: 100px;}
    main .box2 .in_box ul{width:calc(100% - 265px);}
    main .box2 .in_box #pie1 canvas{top: 50%!important;left: 50%!important;transform:translate(-50%,-50%);width: 200px!important;height: 200px!important;}
  }
  @media(max-width:600px){
    main .box2 .right .right2 li{padding: 18px;}
    main .box2 .right .right2 li p{font-size: 28px;margin-top: 19px;}
    main .box2 .right .left2 li{padding:15px 18px}
    main .box2 .right .left2 li p{font-size: 25px;}
    main .box2 .right .left2 li div{right: 13px;}
    main .box2 .right .left2{margin-right: 12px;}
    main .box2 .right .right2{width: calc(50% - 16px);}
    main .box2 .right .left2 li div{width: 35px;height: 35px;padding: 10px;}
    main .box2 .left .in_box, main .box4 .left, main .box4 .right{width:100%}
    main .box2 .in_box:first-child ul{width:100%;margin-top: 250px!important;}
    main .box2 .in_box #pie1{left: 50%;transform: translateX(-50%);margin-left: 0;}
    main .box2 .in_box .calc1{width: 45px;}
    main .box2 .in_box li p.calc2{width: calc(100% - 115px);padding-left: 20px!important;}
    main .box2 .in_box .calc3{width:50px}
    main .box5 h1{font-size:27px;}
    main .box2 .in_box .apex_pie{margin-left: -50px;}
  }
  @media(max-width:550px){
    .wrapper-class{
      width: 20% !important;
      display: inline-block!important;
      height:30px;
      top: -5px;
    }
    main .box2 .in_box .apex_pie{margin-right:80px!important; margin-left:-50px!important;width: 100px;}
  }
  @media(max-width:450px){
    main .box2 .left .top, main .box2 .left .bot{padding: 15px;}
    main .box2 .right .left2 li p{font-size: 20px;}
    main .box2 .right .right2 li p{font-size: 20px;}
    main .box2 .right li div.chart2{width:80px;height:80px;}
    main .box2 .right li div.chart2 canvas{width: 80px!important;height: 80px!important;/* margin-top: 20px; */}
    .chart span{font-size:16px;width: 80px;/* padding-top: 15px; */}
    main .box2 .right .right2 li:nth-of-type(1){padding-bottom:10px}
    main .tit{font-size:16px;letter-spacing: -1px;}
    main .more{top:13px;right: 15px;width: 13px;}
    main .left, main .right{padding:15px;}
    main .box3 .left,main .box3 .right{width: 100%;}
    .chart:before{width: 79px;height: 106px;right: -17px!important;top: 30px!important;background-size: 100%;}
  }
  @media(max-width:400px){
    main .box2 .right .left2{width:100%;}
    main .box2 .right .right2{width:100%;}
    main .box2 .right .right2 li{width: calc(50% - 43px);display:inline-block;margin-bottom: 0;vertical-align: top;}
    main .box2 .right .right2 li:nth-of-type(1){margin-right:10px}
    main .box2 .right .right2 li p{margin-top: 55px;}
    .wrapper-class{
      width: 10% !important;
      display: inline-block!important;
      height:30px;
      top: -5px;
    }
  }
  .vdp-datepicker{
    text-align: left!important;
  }
  .wrapper-class{
    width: 30% ;
    display: inline-block!important;
    height:30px;
    top: -5px;
    padding: 0px!important;
    color:#ffffff;
  }
  .inputCss {
    background: #131931;
    text-align: center;
    display: inline-block!important;
    border-radius: 20px!important;
    border: 0px;
    width:100%;
    height:100%;
  }
  .calendarCss {
    width: 300px!important;
    background-color: #2B2B4B!important;
  }
  .calendarCss header{
    width: 300px!important;
    background-color: #2B2B4B!important;
    padding: 0px!important;
  }
  .calendarCss span{
    position: relative;
  }
  .calendarCss .cell.day{
    margin-top: 0px!important;
  }
  .vdp-datepicker__calendar header .prev:after{
    border-right: 10px solid white!important;
  }
  .vdp-datepicker__calendar header .next:after{
    border-left: 10px solid white!important;
  }
</style>
