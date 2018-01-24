require('../node_modules/vuetify/src/stylus/app.styl')

import Vue from 'vue';
import VueRouter from 'vue-router';

import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions
} from 'vuetify';

import FindCitiesDemo from './components/find-cities/FindCitiesDemo';
import FindNearbyCitiesDemo from './components/find-nearby-cities/FindNearbyCitiesDemo';
import GetCityDetailsDemo from './components/get-city-details/GetCityDetailsDemo';
import GetCityDistanceDemo from './components/get-city-distance/GetCityDistanceDemo';
import GetCityDateTimeDemo from './components/get-city-datetime/GetCityDateTimeDemo';
import GetCityTimeDemo from './components/get-city-time/GetCityTimeDemo';
import GetCountryDetailsDemo from './components/get-country-details/GetCountryDetailsDemo';
import GetCountryRegionDetailsDemo from './components/get-country-region-details/GetCountryRegionDetailsDemo';
import FindCountriesDemo from './components/find-countries/FindCountriesDemo';
import FindCountryRegionsDemo from './components/find-country-regions/FindCountryRegionsDemo';
import FindCountryRegionCitiesDemo from './components/find-country-region-cities/FindCountryRegionCitiesDemo';

import App from './App'

Vue.use(VueRouter);

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions
  }
});

const router = new VueRouter({
  routes: [
    {
      path: '/find-cities',
      component: FindCitiesDemo
    },
    {
      path: '/find-nearby-cities',
      component: FindNearbyCitiesDemo
    },
    {
      path: '/get-city-details',
      component: GetCityDetailsDemo
    },
    {
      path: '/get-city-distance',
      component: GetCityDistanceDemo
    },
    {
      path: '/get-city-datetime',
      component: GetCityDateTimeDemo
    },
    {
      path: '/get-city-time',
      component: GetCityTimeDemo
    },
    {
      path: '/find-countries',
      component: FindCountriesDemo
    },
    {
      path: '/get-country-details',
      component: GetCountryDetailsDemo
    },
    {
      path: '/find-country-regions',
      component: FindCountryRegionsDemo
    },
    {
      path: '/get-country-region-details',
      component: GetCountryRegionDetailsDemo
    },
    {
      path: '/find-country-region-cities',
      component: FindCountryRegionCitiesDemo
    }]
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
