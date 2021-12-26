<template>
  <div class="Main">
    <h1>Main</h1>
    <router-link :to="{name:'pageOne'}">page1</router-link>
    <router-link :to="{name:'CategoryPost'}"><p>Category Post</p></router-link>

  </div>
</template>

<script>
//import $ from 'jquery';
export default {
  name: 'HelloWorld',
  data(){
    return{
      test_data: [],
    }
  },
  methods:{},
  created(){


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*변경 시작 - HelloWorld.vue*/
h3 { margin: 40px 0 0}
ul { list-style-type: none; padding: 0}
li { display: inline-block; margin: 0 10px}
a { color: #42b983}
/*변경 종료*/
</style>
