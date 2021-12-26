<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    console.log('HOST URL 확인', process.env.VUE_APP_DEV_HOST_URL);
    console.log('BASE URL 확인', process.env.BASE_URL);
    console.log('NODE_ENV 확인', process.env.NODE_ENV);
    console.log('process.env 확인', process.env);
  }
}
</script>

<style>

</style>
