<template>
    <ul>
      <li class="box4">
        <div class="top">
          <h1 class="tit">Issues Scanner</h1>
          <a href="#" class="more"><img src="../../public/images/Group9.6.png" alt=""></a>
          <select v-model="selected_big_category">
            <option v-if="selected_big_category === 'Filter'">Filter</option>
            <option v-if="show_big_category">데이터가 없습니다.</option>
            <option v-for="(item, i) in big_category" :key="i">{{item.category_name}}</option>
          </select>
        </div>
        <div class="left">
          <h1 class="mn_tit">Category</h1>
          <h1 style="color:white" v-if="show_big_category">데이터가 없습니다.</h1>
          <VueApexCharts v-else id="cart1" height="500"  style="width:100%;height: 500px; margin: 0 auto;max-width:500px; min-height: 500px" type="radialBar" :options="big_plotOptions" :series="big_series"></VueApexCharts>
        </div>
        <div class="right">
          <h1 class="mn_tit">Subcategory</h1>
          <h1 style="color:white" v-if="show_middle_category">데이터가 없습니다.</h1>
          <VueApexCharts v-else id="cart2" height="500" style="width:100%;height: 500px; margin: 0 auto;max-width:500px;min-height: 500px" type="radialBar"  :options="middle_plotOptions" :series="middle_series"></VueApexCharts>
        </div>
      </li>
    </ul>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import {EventBus} from "../event-bus";

export default {
    name: "ConsultCategory",
    components:{VueApexCharts},
    data(){
      return {
        big_category:[],
        selected_big_category: 'Filter',
        start_date: this.get_date(true),
        end_date: this.get_date(false),
        hostname: this.$get_api_host(),

        bigOption: {},
        middleOption: {},
        search_date: false,
        show_big_category: true,
        show_middle_category: true,
        big_labels:[],
        big_series:[],
        big_plotOptions: {},
        middle_series:[],
        middle_plotOptions: {},
        middle_labels: [],

    }
    },
    watch:{
      selected_big_category: function(selected_big_category){
        console.log(selected_big_category);
        this.click_big_category()
      },
    },
    created(){
      console.log(this.start_date, this.end_date);
      console.log(this.selected_big_category);
      let big_category_api = `${this.$get_api_host()}/bmwgs/api/v1.0/csrecord/chart-info/cs-record-cnt-by-category?start=${this.start_date}&end=${this.end_date}`;
      this.$call_api(big_category_api, data =>{
        console.log('big category for radial bar!!!', data.data);
        if(data.data.length === 0){
          console.log("api 안에 차트데이터가 없습니다!!!!!!!")
        }else{
          this.show_big_category = false;
          this.big_labels = [];
          this.big_series  = [];
          for(let item of data.data){
            this.big_category = data.data;
            this.big_labels.push(item.category_name);
            this.big_series.push(item.count);
          }
          this.big_labels = Object.values(this.big_labels);
          console.log(this.big_labels);
          this.create_big_option()
        }
      });

      EventBus.$on('big_category_date', data =>{
        console.log('event bus big category date', data);
        this.start_date = data[0];
        this.end_date = data[1];
        let big_category_api = `${this.$get_api_host()}/bmwgs/api/v1.0/csrecord/chart-info/cs-record-cnt-by-category?start=${this.start_date}&end=${this.end_date}`;
        this.$call_api(big_category_api, data =>{
          console.log('big category for radial bar!!!', data.data);
          if(data.data.length === 0){
            console.log("api 안에 차트데이터가 없습니다!!!!!!!")
          }else{
            this.show_big_category = false;
            this.big_labels = [];
            this.big_series = [];
            let total = 0;
            for(let item of data.data){
              total += item.count
            }
            for(let item of data.data){
              let percentage = Math.ceil((item.count / total) * 100);
              this.big_category = data.data;
              this.big_labels.push(item.category_name);
              this.big_series.push(percentage);
            }
            this.big_labels = Object.values(this.big_labels);
            console.log(this.big_labels);
            this.create_big_option()
          }
        });
      })

    },
    methods:{
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
      click_big_category(){
        console.log(this.selected_big_category, this.big_category);
        for(let item of this.big_category){
          if(item.category_name === this.selected_big_category){
            let middle_api = `${this.$get_api_host()}/bmwgs/api/v1.0/csrecord/chart-info/cs-record-cnt-by-category/${item.category_id}?start=${this.start_date}&end=${this.end_date}`;
            this.$call_api(middle_api, middle_data =>{
              console.log('data for SUB category', middle_data.data , item.category_id);
              if(middle_data.data.length === 0){
                console.log('middle data 가 없습니다.')
              }else{
                this.middle_labels = [];
                this.middle_series = [];
                let total = 0;
                for(let item of middle_data.data){
                  total += item.count
                }
                for(let middle_item of middle_data.data){
                  let percentage = Math.ceil((middle_item.count / total) * 100);
                  this.middle_labels.push(middle_item.category_name);
                  this.middle_series.push(percentage);
                }
                this.middle_labels = Object.values(this.middle_labels);
                console.log(this.middle_labels);
                this.create_middle_option()

                this.show_middle_category = false;
              }
            });

          }
        }
      },
      create_big_option() {
        //this.big_series;
        this.big_plotOptions = {
          chart:{
            type:'radialBar',
            height: 500
          },
          colors:['#d769f4', '#7365e9', '#32a1ff', '#ff5c43'],
          labels: this.big_labels,
          legend:{
            show:true,
            fontSize:'20px',
            position: 'top',
            labels:{
              colors: '#fff'
            },
          },
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: {
                  fontSize: '20px',
                },
                value: {
                  fontSize: '30px',
                  color: '#fff'
                },
              }
            }
          },
        };
      },
      create_middle_option(){
        //this.middle_series;
        this.middle_plotOptions = {
          chart:{
            type:'radialBar',
            height: 500
          },
          colors:['#d769f4', '#7365e9', '#32a1ff', '#ff5c43'],
          labels: this.middle_labels,
          legend:{
            show:true,
            fontSize:'20px',
            position: 'top',
            labels:{
              colors: '#fff'
            },
          },
          plotOptions:{
            radialBar: {
              dataLabels: {
                name: {
                  fontSize: '20px',
                },
                value: {
                  fontSize: '30px',
                  color: '#fff'
                },
              }
            }
          }

        };
      },


    },
  }
</script>

<style scoped>

/*변경 시작 - RowissuesScanner*/
main .box4 { margin-bottom: 35px; position: relative; background: #212144; border-radius: 20px; padding: 40px; box-shadow: 0 4px 10px rgba(0, 0, 0, .4)}
main .box4 .left { border-radius: 0; background: none; padding: 0; margin-bottom: 0; width: 40%; margin-right: 17px; box-shadow: none}
main .box4 select { background: #fff; border-radius: 500px; display: inline-block; text-align: left; width: 40%; vertical-align: middle; position: absolute; padding: 13.5px 31px ; color: #8e8ea1; border: 0; background: #131931 url(../../public/images/Icon-1.png)no-repeat; background-position: calc(100% - 20px); background-position: -moz-calc(100% - 20px); top: 50%; left: 283px; transform: translateY(-50%)}
main .box4 .left .bot,
main .box4 .left .top { margin-bottom: 20px; position: relative; background: #212144; border-radius: 20px; padding: 30px; box-shadow: 0 4px 10px rgba(0, 0, 0, .4)}
main .box4 .left,
main .box4 .right {height: 700px;width: calc(50% - 11px);vertical-align: top;flex: 1;background: #3c385f;border-radius: 25px;padding: 40px 35px;box-shadow: none;margin-bottom: 0;text-align: right;margin-bottom: 15px;}
main .box4 .mn_tit { text-align: left; margin-bottom: 30px}
main .box4 .left div,
main .box4 .right div { display: inline-block !important}
main .box4 .right .word { height: 482px}
main .box4 .bot { text-align: center}
main .box4 .bot > div { margin-top: 30px}
main .box4 .bot > div ul { position: relative; z-index: 0}
main .box4 .bot>div ul:before { content: ""; width: calc(100% - 5px); height: 59px; background: #3c385f; border-left: 5px solid #e94bc3; position: absolute; box-shadow: 0 4px 4px rgba(0, 0, 0, .25); left: 0; z-index: -1}
main .box4 .bot>div ul li:last-child p { padding-bottom: 0 !important}
main .box4 .bot > div ul li.acive p { color: #fff}
main .box4 .bot > div ul li.active p.calc2 { text-shadow: 0 4px 4px rgba(0, 0, 0, .25)}
main .box4 .bot > div > p { padding: 0 0 20px !important; }
main .box4 .bot > div > p.calc2 { font-size: 16px; text-align: center; padding-left: 0}
main .box4 .bot .calc1 { width: 60px; display: inline-block; color: #8e8ea1; padding: 18px 0; vertical-align: middle}
main .box4 .bot .calc2 { width: calc(100% - 65px); text-align: left; font-size: 18px; display: inline-block; box-sizing: border-box; color: #8e8ea1; vertical-align: middle; padding: 18px 0 18px 30px; }
main .box4 .right:after { content: ""; clear: both; display: block}
main .box4 .right ul { background: #3c385f; box-shadow: 0 4px 4px rgba(0, 0, 0, .25); border-radius: 40px; float: right; color: #fff; padding: 0 30px 12px; }
main .box4 .right ul li p { display: inline-block; vertical-align: middle; margin-right: 10px}
main .box4 .right ul li div { display: inline-block; width: 55px; height: 25px; background: #0078e8; border-radius: 500px; box-shadow: inset 2px 3px 6px #1d2d3c; font-size: 14px; overflow: hidden; cursor: pointer; position: relative; padding: 0 10px; vertical-align: middle; transition: background 0.5s}
main .box4 .right ul li div .gray { display: none}
main .box4 .right ul li div.off .gray { display: block}
main .box4 .right ul li div.off .blue { display: none}
main .box4 .right ul li div.off { background: #131931; box-shadow: inset 2px 3px 6px #000408; text-align: right}
main .box4 .right ul li div.off span { left: 3px}
main .box4 .right ul li div span { height: 18px; position: absolute; background: #fff; width: 18px; border-radius: 100px; left: calc(100% - 21px); top: 50%; transform: translateY(-50%); transition: left 0.5s}
main .box4 .right ul li div em { color: #fff; padding: 4px 0; display: inline-block}
main .box4 .right ul li { display: inline-block; margin-top: 12px}
main .box4 .right ul li:nth-of-type(2) { padding: 0 45px}

  @media(max-width:1250px) { main .box2 .left { width: 100%}
    main .box2 .right { display: flex; width: 100%; margin-top: 20px}
    main .box2 .right li:last-child { margin-right: 0}
    main .left,
    main .right li { flex: 1}
    main .box2 .right li p { font-size: 40px}
    main .box2 .right li div { width: 90px; height: 90px; padding: 20px; right: 25px; bottom: 25px}
    main .box2 .right li div.chart2 { width: 100px; height: 100px}
    main .box2 .right li div.chart2 canvas { width: 100px !important; height: 100px !important}
    .chart:before { content: ""; width: 100px; height: 117px; position: absolute; background: url('../../public/images/Group505.png') no-repeat; right: -23px; top: -6px; z-index: -1; background-size: 100%}
    main .box1 h1 { margin-top: 100px}
    main .box2 .right li { padding: 25px}
  }

  @media(max-width:1132px) { main .box2 .right .right2 li:first-of-type { padding-bottom: 17px}
    .chart { float: none; display: block; text-align: right}
    .chart span { width: 100px; right: 0}
    .chart canvas { width: 100px !important; height: 100px !important}
    .chart:before { width: 94px; height: 106px; right: -20px; top: -1px; background-size: 100%}
  }

  @media(max-width:1100px) { main .box2 .right .right2 li p { font-size: 40px}
    main .box2 .right li div { width: 50px; height: 50px; padding: 10px; right: 20px; bottom: 20px}
    main .box2 .right li p { font-size: 30px}
    main .box2 .right li { height: 200px; padding: 20px}
  }

  @media(max-width:1000px) { main .box1 h1 { font-size: 40px}
    main .box2 .left { width: 100%; margin-right: 0}
    main .box2 .left .bot,
    main .box2 .left .top { width: calc(50% - 10px); display: inline-block; vertical-align: top}
    main .box2 .left .top { margin-right: 15px}
    main .box2 .left .cal,
    main .box2 .left select { margin-top: 20px}
    main .box1 h2 { font-size: 20px}
    main .box1 h3 { font-size: 17px}
    main .box2 .right { width: 100%}
    main .box2 .right .left2 li p { font-size: 30px}
    main .box2 .right .left2 li div { width: 45px; height: 45px; padding: 13px}
    main .box2 .right .right2 li p { margin-top: 13px}
    main .box2 .left .cal > div img { vertical-align: middle; margin-top: -3px; padding-left: 6px; width: 13px}
    main .box4 .bot .calc2 { font-size: 16px}
    main .box2 .right ul { margin-top: 20px}
    main .box6 .right .word { height: 465px}
    main .box6 .bot>div ul:before { height: 56px}
    main .box6 .right ul li:nth-of-type(2) { padding: 0 19px}
    main .box6 .right ul li div em { font-size: 13px; padding: 6px 0}
    main .box6 .right ul li div { width: 52px; padding: 0 8px}
    main .box6 .right ul li p { margin-right: 5px}
    main .box6 select { left: 200px}
    main .tit { font-size: 24px}
    main .box2 .in_box .calc1,
    main .box2 .in_box .calc3,
    main .box2 .in_box li p.calc2,
    main .box6 .bot .calc2 { font-size: 15px}
    main .box2 .in_box ul li.active p,
    main .box6 .bot>div ul li.active p.calc1,
    main .box6 .bot > div ul li.active p.calc2 { font-size: 20px; padding: 17.5px 0}
    main .box6 .right .word { height: 394px}
    main .box9 table thead th:first-child { width: 131px}
    main .box9 table thead th:last-child { width: 115px}
    main .box2,
    main .box3,
    main .box4,
    main .box6 .left .bot,
    main .box6 .right,
    main .box7,
    main .box8,
    main .box9 { padding: 20px}
    main .box2 .left .in_box,
    main .box4 .left,
    main .box4 .right {padding: 15px;border-radius: 10px;}
    main .box4 .left>*, main .box4 .right>*{font-size: 15px;}
    main .box2 .cal { position: static; transform: none; margin-top: 20px; width: 100%}
    main > ul > li.box2 > .top,
    main > ul > li.box4 > .top { margin-bottom: 20px}
    main .box4 select { width: 100%; position: static; transform: none; margin-top: 20px}
    main .box6 .top { margin-bottom: 30px}
  }

  @media(max-width:800px) { main .box2 .left .bot,
  main .box2 .left .top { padding: 20px}
    main .box1 { padding: 25px}
    main .left,
    main .right { padding: 20px}
    main .box6 .left .bot { margin-bottom: 35px}
    main .tit { font-size: 17px}
    main .more { top: 19px; right: 20px}
    main .box6 .left { width: 100%; margin-right: 0}
    main .box6 .left select { margin-top: 20px}
    main .box6 .right { width: 100%}
    header { padding-bottom: 64px}
    header .right .search { position: absolute; width: calc(100% - 40px); bottom: 13px; left: 20px}
    header { position: relative}
    main .box2 .left .cal > div img { width: 11px}
    main .box2 .left .cal > div { width: 100%; padding: 8px 10px}
    main .box2 .left .cal span { display: block; text-align: center}
    main .box2 .left select { width: 100%; padding: 8px 10px 8px 25px; }
    main .box2 .left select:nth-of-type(2) { margin-left: 0; margin-top: 22px}
    main .box5 h1 { font-size: 40px; bottom: 20px; padding-right: 30px}
    main .box1 h1 { font-size: 30px}
    main .box2 .right { display: block}
    main .box2 .right li { margin-right: 0; margin-bottom: 15px; height: 148px}
    main .box2 .left>div:last-child div { display: block}
    main .box2 .left>div:last-child div ul { width: 100%}
    main .box2 .in_box #pie1 div,
    main .box2 .in_box #pie1 { width: 100px !important; height: 100px !important}
    main .box2 .in_box #pie1 { margin-left: 20px}
    main .box2 .in_box ul { width: calc(100% - 125px)}
    main .box2 .in_box #pie1 canvas { top: 50% !important; left: 50% !important; transform: translate(-50%, -50%); width: 200px !important; height: 200px !important}
  }

  @media(max-width:600px) { main .box2 .right .right2 li { padding: 18px}
    main .box2 .right .right2 li p { font-size: 28px; margin-top: 19px}
    main .box2 .right .left2 li { padding: 15px 18px}
    main .box2 .right .left2 li p { font-size: 25px}
    main .box2 .right .left2 li div { right: 13px}
    main .box2 .right .left2 { margin-right: 12px}
    main .box2 .right .right2 { width: calc(50% - 16px)}
    main .box2 .right .left2 li div { width: 35px; height: 35px; padding: 10px}
    main .box2 .left .in_box,
    main .box4 .left,
    main .box4 .right {width: 100%;height: auto;}
    main .box4 .right{margin-bottom:0}
    main .box2 .in_box:first-child ul { width: 100%; margin-top: 130px}
    main .box2 .in_box #pie1 { position: absolute; left: 50%; transform: translateX(-50%); margin-left: 0}
    main .box2 .in_box .calc1 { width: 45px}
    main .box2 .in_box li p.calc2 { width: calc(100% - 115px); padding-left: 20px !important}
    main .box2 .in_box .calc3 { width: 50px}
    main .box5 h1 { font-size: 27px}
  }

  @media(max-width:450px) {
    main .box2 .left .bot,
    main .box2 .left .top { padding: 15px}
    main .box2 .right .left2 li p,
    main .box2 .right .right2 li p { font-size: 20px}
    main .box2 .right li div.chart2 { width: 80px; height: 80px}
    main .box2 .right li div.chart2 canvas { width: 80px !important; height: 80px !important}
    .chart span { font-size: 16px; width: 80px}
    main .box2 .right .right2 li:first-of-type { padding-bottom: 10px}
    main .tit { font-size: 16px; letter-spacing: -1px}
    main .more {top: 0;right: 0;width: 13px;}
    main .left,
    main .right { padding: 15px}
    main .box3 .left,
    main .box3 .right { width: 100%}
    .chart:before { width: 79px; height: 106px; right: -17px; top: -5px; background-size: 100%}
  }

  @media(max-width:400px) { main .box2 .right .left2, main .box2 .right .right2 { width: 100%}
    main .box2 .right .right2 li { width: calc(50% - 43px); display: inline-block; margin-bottom: 0; vertical-align: top}
    main .box2 .right .right2 li:first-of-type { margin-right: 10px}
    main .box2 .right .right2 li p { margin-top: 55px}
  }
/*변경 끝 */

</style>
