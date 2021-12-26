import Vue from 'vue';
import VueRouter from 'vue-router';
import HelloWorld from '../views/HelloWorld';
import pageOne from '../views/pageOne';
import CategoryPost from '../components/CategoryPost'

Vue.use(VueRouter)

const routes = [
  { path:"/", name: "home", component:HelloWorld },
  { path:"/external/pageOne", name: "pageOne", component:pageOne },
  { path:"/external/CategoryPost", name:"CategoryPost", component:CategoryPost}

];

const router = new VueRouter({
  mode: "history",
  routes,
});
export default router