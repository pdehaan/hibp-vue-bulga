import Vue from "vue";
import VueLazyLoad from "vue-lazyload";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(VueLazyLoad);

Vue.filter("numberFormat", value => value && Number(value).toLocaleString());
Vue.filter("percentFormat", value => value && `${Number(value).toFixed(1)}%`);
Vue.filter(
  "dateFormat",
  value => value && new Date(value).toLocaleDateString()
);

new Vue({
  render: h => h(App)
}).$mount("#app");
