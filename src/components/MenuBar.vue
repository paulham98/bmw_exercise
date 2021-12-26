<template>
  <header>
    <button type="button"><img src="../../public/images/Category.png" alt=""></button>
    <div class="right">
      <div class="search">
        <input type="text" placeholder="Search">
        <button type="button"><img src="../../public/images/Group.png" alt=""></button>
      </div>
      <button type="button" class="re"><img src="../../public/images/Chat.png" alt=""></button>
      <button type="button"><img src="../../public/images/Notification.png" alt=""></button>
      <button type="button"><img src="../../public/images/Icon.png" alt=""></button>
    </div>
  </header>

</template>

<script>
  export default {
    name: "MenuBar"
  }
</script>

<style scoped>
/*변경 시작*/
header { background: #212144; padding: 13px 20px}
header button { background: #003; width: 38px; height: 38px; border-radius: 500px; display: inline-block; padding: 7px 0; vertical-align: top}
header .right { float: right}
header .right > button { margin-left: 15px}
header .right .search { display: inline-block; background: #131931; border-radius: 500px; width: 400px; padding: 3px 20px; vertical-align: top; box-sizing: border-box; margin-right: 15px}
header .right .search input { background: none; border: 0; font-size: 14px; width: calc(100% - 22px); font-family: BMW-Type-Global, sans-serif}
header .right .search button { background: none; width: auto; height: auto; vertical-align: middle}
header .right .search button img { display: block}

@media (max-width: 800px) {
  header{padding-bottom: 64px;}
  header .right .search{position: absolute;width: calc(100% - 40px);bottom: 13px;left: 20px;}
  header{position: relative;}
}
/*변경 끝*/
</style>