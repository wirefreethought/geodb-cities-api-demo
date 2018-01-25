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

import FindCitiesDemo from './components/geo/find-cities/FindCitiesDemo';
import FindNearbyCitiesDemo from './components/geo/find-nearby-cities/FindNearbyCitiesDemo';
import GetCityDetailsDemo from './components/geo/get-city-details/GetCityDetailsDemo';
import GetCityDistanceDemo from './components/geo/get-city-distance/GetCityDistanceDemo';
import GetCityDateTimeDemo from './components/geo/get-city-datetime/GetCityDateTimeDemo';
import GetCityTimeDemo from './components/geo/get-city-time/GetCityTimeDemo';
import GetCountryDetailsDemo from './components/geo/get-country-details/GetCountryDetailsDemo';
import GetCountryRegionDetailsDemo from './components/geo/get-country-region-details/GetCountryRegionDetailsDemo';
import FindCountriesDemo from './components/geo/find-countries/FindCountriesDemo';
import FindCountryRegionsDemo from './components/geo/find-country-regions/FindCountryRegionsDemo';
import FindCountryRegionCitiesDemo from './components/geo/find-country-region-cities/FindCountryRegionCitiesDemo';

import FindCurrenciesDemo from './components/locale/find-currencies/FindCurrenciesDemo';
import GetLocalesDemo from './components/locale/get-locales/GetLocalesDemo';

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
    },
    {
      path: '/find-currencies',
      component: FindCurrenciesDemo
    },
    {
      path: '/get-locales',
      component: GetLocalesDemo
    }]
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
