<template>
  <transition name="modal">
    <div class="modal">
      <div class="modal-wrapper">
        <div class="modal-container">
          <ul>
            <li class="box9">
              <div class="top">
                <h1 class="tit">History</h1>
              </div>
              <div class="modal_table">
                <table>
                  <thead>
                    <tr>
                      <th>날짜</th>
                      <th>내용</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in modal_page_data" :key="i"  >
                      <td>{{item.date}}</td>
                      <td>{{item.contents}}</td>
                    </tr>
                    <!--
                    <tr v-for="(item, i) in modal_page_data" :key="i">
                      <td>{{item.date}}</td>
                      <td>{{item.contents}}</td>
                      <td>{{item.time}}</td>
                    </tr>
                    -->
                  </tbody>
                </table>
              </div>
              <div class="btn">
                <button type="button" class="prev" v-if="has_prev" @click="click_prev_btn"><img src="../../public/images/prev.png" alt="">Previous</button>
                <button type="button" class="next" v-if="has_next" @click="click_next_btn">Next<img src="../../public/images/next.png" alt=""></button>
                <button type="button" class="close" @click="close_modal">close</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {EventBus} from "../event-bus";

export default {
    name: "RowHistory",
  data(){
      return{
        modal_page_info: [],
        modal_page_data: [],
        start_date: this.get_date(true),
        end_date: this.get_date(false),
        modal_page: 1,
        has_next: true,
        has_prev: true,
      }
  },
  props:{
    start: String,
    end: String,
    id: Number
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
    call_modal_api(){
      // http://ec2-3-37-174-60.ap-northeast-2.compute.amazonaws.com:30001/bmwgs/api/v1.0/csrecord/15202/keyword?start-date=2021-07-01&end-date=2021-11-01&page=1&per-page=5
      let modal_api =`${this.$get_api_host()}/bmwgs/api/v1.0/csrecord/${this.id}/keyword?start-date=${this.start}&end-date=${this.end}&page=${this.modal_page}&per-page=5`;
      this.$call_api(modal_api, data =>{
        console.log('modal data',data, this.id);
        console.log(modal_api)
        this.modal_page = data.page_info.current_page;
        this.modal_page_info = data.page_info;
        this.modal_page_data = data.data;
        this.has_next = data.page_info.has_next;
        this.has_prev = data.page_info.has_prev;
        console.log(this.modal_page_info, this.modal_page_data)
      })
    },
    close_modal(){
      EventBus.$emit('history_modal', false)
    },
    click_next_btn(){
      this.modal_page++;
      this.call_modal_api()
    },
    click_prev_btn(){
      this.modal_page--;
      this.call_modal_api()
    },
  },
  created(){
    this.call_modal_api()
    /*
    EventBus.$on('keyword_key', id =>{
      console.log('event bus keyword_key', id)
      this.call_modal_api()
    });
     */
  },
  updated() {

  }
}
</script>

<style scoped>
/*  변경 시작*/
  .modal { position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table
  }
  .modal-wrapper{ display: table-cell; vertical-align: middle}
  .modal-enter .modal-container,
  .modal-leave-active .modal-container { transform: scale(1.1)}
  main .box9{ max-width: 100%; position: relative; background: #212144; border-radius: 20px; padding: 40px; box-shadow: 0 4px 10px rgba(0, 0, 0, .4)}
  main .box9 .modal_table{ height: 419px; overflow-y: scroll}
  main .box9 table{ text-align: center}
  main .box9 table thead th:first-child { width: 50px}
  main .box9 table thead th:last-child { width: 200px}
  main .box9 table th{ padding: 20px 0; background: #4b4677; color: #fff; font-size: 18px}
  main .box9 table td{ padding: 25px 20px; background: #3c385f; color: #fff; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis; -o-text-overflow: ellipsis; -ms-text-overflow: ellipsis; border-bottom: 1px solid #545454}
  main .box9 table tr td:nth-of-type(2) { font-weight: 100}
  main .box9 table tr td:last-child { color: hsla(0, 0%, 100%, 0.7)}
  main .box9 .btn { color: #fff; text-align: center; margin-top: 40px}
  main .box9 .btn button{ width: 100px}
  main .box9 .btn button img{ margin-right: 15px}
  main .box9 .btn .next{ text-align: right}
  main .box9 .btn .next img{ margin-right: 0; margin-left: 15px}
  main .box9 .btn .close{ float: right}
  @media(max-width:1000px) { main .box1 h1{ font-size: 40px}
    main .box2 .left{ width: 100%; margin-right: 0}
    main .box2 .left .bot,
    main .box2 .left .top { width: calc(50% - 10px); display: inline-block; vertical-align: top}
    main .box2 .left .top { margin-right: 15px}
    main .box2 .left .cal,
    main .box2 .left select{ margin-top: 20px}
    main .box1 h2{ font-size: 20px}
    main .box1 h3{ font-size: 17px}
    main .box2 .right{ width: 100%}
    main .box2 .right .left2 li p{ font-size: 30px}
    main .box2 .right .left2 li div{ width: 45px; height: 45px; padding: 13px}
    main .box2 .right .right2 li p{ margin-top: 13px}
    main .box2 .left .cal > div img{ vertical-align: middle; margin-top: -3px; padding-left: 6px; width: 13px}
    main .box4 .bot .calc2{ font-size: 16px}
    main .box2 .right ul{ margin-top: 20px}
    main .box6 .right .word{ height: 465px}
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
    main .box9 table thead th:first-child { width: 50px}
    main .box9 table thead th:last-child { width: 115px}
    main .box2,
    main .box3,
    main .box4,
    main .box6 .left .bot,
    main .box6 .right,
    main .box7,
    main .box8,
    main .box9{ padding: 20px}
    main .box2 .left .in_box,
    main .box4 .left,
    main .box4 .right{ padding: 25px}
    main .box2 .cal{ position: static; transform: none; margin-top: 20px; width: 100%}
    main > ul > li.box2 > .top,
    main > ul > li.box4 > .top{ margin-bottom: 20px}
    main .box4 select{ width: 100%; position: static; transform: none; margin-top: 20px}
    main .box6 .top{ margin-bottom: 30px}
  }
/*  변경 끝*/
</style>
