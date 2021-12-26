import Vue from 'vue'
import App from './App.vue'
import router from '@/router/router.js'
import MyPlugins from '@/plugin'
import VueCompositionApi from '@vue/composition-api'
//import {  BFormDatepicker } from 'bootstrap-vue'
import $ from 'jquery'
import * as VueGoogleMaps from "vue2-google-maps"
import Echarts from 'vue-echarts'
import { use } from 'echarts/core'


import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart,
  PieChart,
  LineChart
} from 'echarts/charts'

import {
  PolarComponent,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  PolarComponent,
]);

$;
Vue.component('v-chart', Echarts);
Vue.use(MyPlugins);
Vue.use(VueCompositionApi);
Vue.use(VueGoogleMaps, {
  load:{
    key: "AIzaSyBuiAuqvdExFKuCVRMB3CV1U-8zw7dFrxI",
    libraries: "places",
    region: "KR"
  }
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
