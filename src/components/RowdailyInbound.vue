<template>
    <ul>
      <li class="box3">
        <div class="top">
          <h1 class="tit">Daily Inbound</h1>
          <a href="#" class="more"><img src="../../public/images/Group9.6.png" alt=""></a>
        </div>
        <p class="day">{{start_date}} ~ {{end_date}}</p>
        <VueApexCharts type="line" :options="line_option" :series="line_series"></VueApexCharts>
      </li>
    </ul>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import {EventBus} from "../event-bus";

export default {
    name: "TotalDayConsultCount",
    components:{VueApexCharts},
    data(){
      return{
        line_option:{},
        line_series: [],
        line_x_axis: [],
        line_y_axis1: [],
        line_y_axis2: [],
        start_date: this.get_date(true),
        end_date: this.get_date(false),
      }
    },
    created(){
      let double_column_chart_api = `${this.$get_api_host()}/bmwgs/api/v1.0/csrecord/chart-info/cs-record-cnt-diff?start=${this.start_date}&end=${this.end_date}`;
      this.$call_api(double_column_chart_api, data=>{
        console.log('double chart!!!', data.data, typeof(data.data.x_axis));
        this.line_x_axis = data.data.x_axis;
        this.line_y_axis1 = data.data.y_axis1;
        this.line_y_axis2 = data.data.y_axis2;
        this.created_option();
      });
        EventBus.$on('big_category_date', data =>{
          console.log('get date from dailyInbound!!', data)
          this.start_date = data[0];
          this.end_date = data[1];
          let double_column_chart_api = `${this.$get_api_host()}/bmwgs/api/v1.0/csrecord/chart-info/cs-record-cnt-diff?start=${this.start_date}&end=${this.end_date}`;
          this.$call_api(double_column_chart_api, data=>{
            console.log('double chart!!!', data.data, typeof(data.data.x_axis));
            this.line_x_axis = data.data.x_axis;
            this.line_y_axis1 = data.data.y_axis1;
            this.line_y_axis2 = data.data.y_axis2;
            this.created_option();
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
      created_option(){
        this.line_series = [
          {
            name: 'Average Call',
            type: 'column',
            data: this.line_y_axis1
          },
          {
            name: "Last Week",
            type: 'area',
            data: this.line_y_axis2
          },
        ],
          this.line_option={
            chart:{
              type: "line",
              stacked:false
            },
            dataLabels:{
              enabled: false,
              labels:{
                style:{
                  colors: '#fff'
                }
              },
            },
            colors: ['#8440EE54', '#FD749B2E', '#FD79B380'],
            fill:{
              type: 'gradient',
              gradient:{
                gradientToColors:['#8440EE54', '#FD749B2E'],
                shade: 'dark',
                type: "vertical",
                opacityFrom: 10,
                opacityTo: 10,
              }
            },
            stroke: {
              width: [6, 6, 6],
              curve: 'smooth'
            },
            plotOptions: {
              bar: {
                columnWidth: "60%",
              }
            },
            xaxis: {
              categories: this.line_x_axis,
              labels:{
                style:{
                  colors: '#fff'
                }
              },
            },
            yaxis: [
              {
                seriesName: 'Column A',
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: '#fff'
                },
                labels:{
                  style:{
                    colors: '#fff'
                  }
                },
                title: {
                  text: "Average Call",
                  style:{
                    color: '#fff'
                  }
                }
              },
              {
                seriesName: 'Column A',
                show: false
              }, {
                opposite: true,
                seriesName: 'Line C',
                axisTicks: {
                  show: true,
                },
                axisBorder: {
                  show: true,
                  color: '#fff'
                },
                labels:{
                  style:{
                    colors: '#fff'
                  }
                },
                title: {
                  text: "Last Week",
                  style:{
                    color: '#fff'
                  }
                }
              }
            ],
            tooltip: {
              shared: true,
              intersect: false,
              x: {
                show: true,
              }
            },
            legend: {
              horizontalAlign: "left",
              offsetX: 40,
              labels:{
                colors: '#fff'
              }
            }
          }
      },
    }
  }
</script>

<style scoped>
  main .box3 { margin-bottom: 35px; position: relative; background: #212144; border-radius: 20px; padding: 40px; box-shadow: 0 4px 10px rgba(0, 0, 0, .4)}
  main .box3 .left { width: 50%; vertical-align: top}
  main .box3 .right { width: calc(50% - 19px)}
</style>
