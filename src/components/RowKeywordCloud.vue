<template>
    <ul>
      <li class="box5">
        <h1>Models Analysis</h1>
        <img src="../../public/images/Group841.png" alt="">
      </li>
      <li class="box6">
        <div class="left">
          <div class="bot">
            <div class="top">
              <h1 class="tit">Keyword Top7</h1>
              <a href="#" class="more"><img src="../../public/images/Group9.6.png" alt=""></a>
            </div>
            <div>
              <p class="calc1">순위</p>
              <p class="calc2">검색어</p>
              <ul v-if="selected_car_id === 100">
                <li class="active">
                  <p class="calc2">모델을 선택해주세요.</p>
                </li>
              </ul>
              <ul v-else-if="selected_car_id === 0">
                <li class="active">
                  <p class="calc2">{{selected_car_model}} 데이터가 없습니다.</p>
                </li>
              </ul>
              <ul v-else>
                <li v-for="(item, i) in car_id_data" :key="i" class="active">
                  <p class="calc1">{{i+1}}</p>
                  <p class="calc2">{{item.keyword}}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="top">
            <h1 class="tit">Models</h1>
            <a href="#" class="more"><img src="../../public/images/Group9.6.png" alt=""></a>
            <select v-model="selected_car_model" @change="select_car_model(selected_car_model)">
              <option v-if="selected_car_model === '차량모델'">차량모델</option>
              <option v-for="(item, i) in car_data" :key="i" >{{item.name}}</option>
            </select>
          </div>
          <div class="word">
            <vue-word-cloud
              :words="cloud_word" :color="([, weight]) => weight == 13 ? '#FF7BA8' : weight == 12 ? '#00DA8D' : weight == 11 ? '#0E6EFF' : weight == 10 ? ' #6649BA' : weight == 9 ? '#0E6EFF' : weight == 8 ? '#ffffff' :
                                                          weight == 7 ? '#FF7BA8' : weight == 6 ? '#AE7751' : weight == 5 ? '#0E6EFF' : weight == 4 ? ' #8E4BB5' : weight == 3 ? '#D0E51B' : ' #ffffff'" font-family="Roboto"
              style="top: 8%; height: 75%; position: relative; width: 100%;">
            </vue-word-cloud>
          </div>
          <ul>
            <li>
              <p>Positive</p>
              <div class="dig on">
                <em class="blue">On</em>
                <em class="gray">Off</em>
                <span></span>
              </div>
            </li>
            <li>
              <p>Neutrality</p>
              <div class="dig off">
                <em class="blue">On</em>
                <em class="gray">Off</em>
                <span></span>
              </div>
            </li>
            <li>
              <p>Negative</p>
              <div class="dig off">
                <em class="blue">On</em>
                <em class="gray">Off</em>
                <span></span>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
</template>

<script>

import VueWordCloud from "vuewordcloud"

  export default {
    name: "pageTwo",
    components: {VueWordCloud,},
    data(){
      return{
        cloud_word:[],
        car_data:[],
        car_id_data: [],
        selected_car_model:'차량모델',
        selected_car_id: 100,
        cloud_weigh_total: 0,
      }
    },
    methods:{
      select_car_model(model_name){
        console.log(model_name);
        let arr = this.car_data;
        for(let use of arr){
          if(model_name === use.name){
            this.selected_car_id = use.id;
          }
        }
        let car_model_id_api = `${this.$get_api_host()}/bmwgs/api/v1.0/keyword/car_model/${this.selected_car_id}/`;
        this.$call_api(car_model_id_api, data=>{
          this.car_id_data = [];
          if(data.length === 0){
            this.selected_car_id = 0;
            this.get_word_cloud_data();
            return
          }else if(this.select_car_model === '차량모델'){
            this.selected_car_id = 100;
            this.get_word_cloud_data();
            return
          }
          let items = data;
          items.sort(function (a, b){
            if(a.count > b.count){
              return 1;
            }
          });
          console.log('car id model', items);

          if(items.length < 7){
            for(let i = 0; i < items.length; i++){
              this.car_id_data.push(items[i]);
            }
          }else{
            for(let i = 0; i < 7; i++){
              this.car_id_data.push(items[i]);
            }
          }

          this.get_word_cloud_data()
        })
      },
      get_word_cloud_data(){
        //word cloud의 데이터 형식 -> cloud_word:[['가능하다', 11],['감사하다', 2]]
        // 파라메터로 자동차 모델명 들어올수 있음
        this.cloud_word = []; // 워드 클라우드 초기화
        let word_cloud__api = `${this.$get_api_host()}/bmwgs/api/v1.0/keyword/car_model/${this.selected_car_id}/`;
        this.$call_api(word_cloud__api, data => {
          console.log('word cloud!!', data);
          if(data.length === 0){
            let no = [];
            no.push('데이터가 없습니다.');
            no.push(100);
            this.cloud_word.push(no);
            return
          }else{
            let average = 0;
            for(let item of data){
              average += item.count
              //console.log('word cloud count :', item.count);
            }
            average = average /  data.length;
            console.log('word cloud count average:', average);
            this.cloud_weigh_total  = average;
            for(let item of data){
              // 단어간 차이가 평균보다 극심할 때 어느정도 줄여주는 것
              // 평균의 3배보다 클경우 평균에서 극심히 벗어난걸로 생각하고
              if(item.count > 400){
                item.count = 13
              }else if(item.count >200){
                item.count = 12
              }else if(item.count >100){
                item.count = 11
              }else if(item.count >90){
                item.count = 10
              }else if(item.count >80){
                item.count = 9
              }else if(item.count >40){
                item.count = 8
              }else if(item.count >30){
                item.count = 7
              }else if(item.count >20){
                item.count = 6
              }else if(item.count >10){
                item.count = 5
              }else if(item.count >4){
                item.count = 4
              }else if(item.count >3){
                item.count = 3
              }else if(item.count <3){
                item.count = 2
              }
              let arr = [];
              arr.push(item.keyword);
              arr.push(item.count);
              //console.log(arr)
              this.cloud_word.push(arr);
            }
          }

        })
      }
    },
    created(){
      let car_model_api = `${this.$get_api_host()}/bmwgs/api/v1.0/car/models`

      this.$call_api(car_model_api, data =>{
        console.log('car model!!!', data);
        this.car_data = data
      });


    }
  }
</script>

<style scoped>

/*변경 시작 -RowKeywordCloud*/
main .box5 { box-shadow: 0 4px 4px #000; border-radius: 20px; color: #fff; margin-bottom: 35px; background-size: 104% 117%; background-position: 50%; text-align: right; position: relative}
main .box5 img { width: 100%; display: block; min-height: 200px}
main .box5 h1 { font-size: 55px; text-align: right; text-shadow: 0 2px 2px rgba(0, 0, 0, .5); position: absolute; bottom: 45px; width: 100%; padding-right: 65px; box-sizing: border-box}

main .box6 { margin-bottom: 35px}
main .box6 .left { border-radius: 0; background: none; padding: 0; margin-bottom: 0; width: 40%; margin-right: 17px; box-shadow: none}
main .box6 select {background: #fff;border-radius: 500px;display: inline-block;text-align: left;width: 40%;vertical-align: middle;position: absolute;padding: 13.5px 31px;color: #8e8ea1;border: 0;background-position: calc(100% - 20px);background-position: -moz-calc(100% - 20px);top: 50%;left: 50%;transform: translate(-50%,-50%);background: #131931 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAB0SURBVHgBfYxhDYAgEIU5EhjBKBqBBpJAIYEGAGzAtIg2sAJF4AQ25ubQ9+e+9/btQGu7EkJH8hNEskACrfcj1u5DO6UcepoQwLN4XMVyAMizUxZjbItIr4jNI4VeCJ4f0CKmwfvASo/Mi1SNUnZSapvf+w2neCkBL5StLAAAAABJRU5ErkJggg==)no-repeat;}
main .box6 .left .bot { position: relative; background: #212144; border-radius: 20px; padding: 30px; box-shadow: 0 4px 10px rgba(0, 0, 0, .4)}
main .box6 .right { width: calc(60% - 21px); vertical-align: top}
main .box6 .right .word { height: 420px}
main .box6 .bot { text-align: center}
main .box6 .top { position: relative; margin-bottom: 55px}
main .box6 .bot > div ul { position: relative; z-index: 0}
main .box6 .bot > div ul li.active { border-bottom: 0}
main .box6 .bot>div ul:before { content: ""; width: calc(100% - 5px); height: 63px; position: absolute; box-shadow: 0 4px 4px rgba(0, 0, 0, .25); left: 0; z-index: -1; background: #3c385f; border-left: 5px solid #ff00c2}
main .box6 .bot > div ul li.active p { color: #fff; font-size: 21px; padding: 17px 0}
main .box6 .bot > div ul li.active p.calc2 { text-shadow: 0 4px 4px rgba(0, 0, 0, .25)}
main .box6 .bot > div > p { padding: 0 0 20px !important; font-weight: 100}
main .box6 .bot > div > p.calc2 { font-size: 16px; text-align: center; padding-left: 0; font-weight: 100}
main .box6 .bot .calc1 { width: 60px; display: inline-block; color: #8e8ea1; padding: 18px 0; vertical-align: middle}
main .box6 .bot .calc2 { width: calc(100% - 65px); text-align: left; font-size: 18px; display: inline-block; box-sizing: border-box; color: #8e8ea1; vertical-align: middle; padding: 19px 0 19px 30px !important; }
main .box6 .bot ul .calc1,
main .box6 .bot ul .calc2 { color: #fff}
main .box6 .right:after { content: ""; clear: both; display: block}
main .box6 .right ul { background: #3c385f; box-shadow: 0 4px 4px rgba(0, 0, 0, .25); border-radius: 40px; float: right; color: #fff; padding: 0 30px 12px; }
main .box6 .right ul li p { display: inline-block; vertical-align: middle; margin-right: 10px}
main .box6 .right ul li div {display: inline-block;width: 55px;height: 25px;background: #0078e8;border-radius: 500px;box-shadow: inset 2px 3px 6px #1d2d3c;font-size: 14px;overflow: hidden;cursor: pointer;position: relative;padding: 0 10px;vertical-align: middle;transition: background 0.5s;text-align: left;}
main .box6 .right ul li div .gray { display: none}
main .box6 .right ul li div.off .gray { display: block}
main .box6 .right ul li div.off .blue { display: none}
main .box6 .right ul li div.off { background: #131931; box-shadow: inset 2px 3px 6px #000408; text-align: right}
main .box6 .right ul li div.off span { left: 4px}
main .box6 .right ul li div span { height: 18px; position: absolute; background: #fff; width: 18px; border-radius: 100px; left: calc(100% - 21px); top: 50%; transform: translateY(-50%); transition: left 0.5s}
main .box6 .right ul li div em { color: #fff; padding: 4px 0; display: inline-block}
main .box6 .right ul li { display: inline-block; margin-top: 12px}
main .box6 .right ul li:nth-of-type(2) { padding: 0 45px}

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
    main .box6 select {/* left: 200px */}
    main .tit { font-size: 24px}
    main .box2 .in_box .calc1,
    main .box2 .in_box .calc3,
    main .box2 .in_box li p.calc2,
    main .box6 .bot .calc2 { font-size: 15px}
    main .box2 .in_box ul li.active p,
    main .box6 .bot>div ul li.active p.calc1,
    main .box6 .bot > div ul li.active p.calc2 {font-size: 15px;padding: 17.5px 0;}
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
    main .box4 .right { padding: 25px}
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
    main .more {top: 0px;right: 0;}
    main .box6 .left { width: 100%; margin-right: 0}
    main .box6 .left select { margin-top: 20px}
    main .box6 .right { width: 100%}
    main .box6 .right .top{padding-bottom: 57px;}
    main .box6 select {width: 100%;bottom:0;top: inherit;transform: none;left: 0;}
    header { padding-bottom: 64px}
    header .right .search { position: absolute; width: calc(100% - 40px); bottom: 13px; left: 20px}
    header { position: relative}
    main .box2 .left .cal > div img { width: 11px}
    main .box2 .left .cal > div { width: 100%; padding: 8px 10px}
    main .box2 .left .cal span { display: block; text-align: center}
    main .box2 .left select { width: 100%; padding: 8px 10px 8px 25px; }
    main .box2 .left select:nth-of-type(2) { margin-left: 0; margin-top: 22px}
    main .box5 h1 {font-size: 30px;bottom: 20px;padding-right: 30px;}
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
    main .box4 .right { width: 100%}
    main .box2 .in_box:first-child ul { width: 100%; margin-top: 130px}
    main .box2 .in_box #pie1 { position: absolute; left: 50%; transform: translateX(-50%); margin-left: 0}
    main .box2 .in_box .calc1 { width: 45px}
    main .box2 .in_box li p.calc2 { width: calc(100% - 115px); padding-left: 20px !important}
    main .box2 .in_box .calc3 { width: 50px}
    main .box5 h1 { font-size: 27px}
  }

/*  변경 끝*/
</style>
