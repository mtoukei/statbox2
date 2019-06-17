import Vue from 'vue'
import storeBase from './store/store-base'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as d3 from 'd3'
import d3Tip from "d3-tip";
import axios from 'axios'
import VueGoodTablePlugin from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'
import 'vue-resize/dist/vue-resize.css'
import VueResize from 'vue-resize'
Vue.use(Element, { size: 'small', zIndex: 3000 });
Vue.config.productionTip = false;
Vue.use(VueGoodTablePlugin);
Vue.use(VueResize);
global.d3 = d3;
global.d3Tip = d3Tip;
global.axios =axios;
global.eStatApiId = '63bd852098e1a13aeea70ed78cba31f9f3918d2f';
const useragent = window.navigator.userAgent.toLowerCase();
if (useragent.indexOf('msie') < 0 && useragent.indexOf('trident') < 0) {
  global.ie = false
} else {
  global.ie = true
}
new Vue({
  store: storeBase,
  render: h => h(App),
}).$mount('#app');
