<template>
  <ul>
    <li class="box7">
      <div class="top">
        <h1 class="tit">Model Keyword Share</h1>
        <a href="#" class="more"><img src="images/Group9.6.png" alt=""></a>
      </div>
      <img src="../../public/images/car.png" alt="">
    </li>
  </ul>
</template>

<script>
  export default {
    name: "RowModelKeywordShare"
  }
</script>

<style scoped>
/*변경 시작-RowModelKeywordShare*/

  main .box7 { margin-bottom: 35px; position: relative; background: #212144; border-radius: 20px; padding: 40px; box-shadow: 0 4px 10px rgba(0, 0, 0, .4); text-align: center}
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
    main .box4 .right { padding: 25px}
    main .box2 .cal { position: static; transform: none; margin-top: 20px; width: 100%}
    main > ul > li.box2 > .top,
    main > ul > li.box4 > .top { margin-bottom: 20px}
    main .box4 select { width: 100%; position: static; transform: none; margin-top: 20px}
    main .box6 .top { margin-bottom: 30px}
  }
/*변경 끝*/
</style>