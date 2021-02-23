import Vue from 'vue';
import VueRouter from 'vue-router';

import './plugins/vuetify'

import {
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

import FindAdminDivisionsDemo from "./components/geo/find-admin-divisions/FindAdminDivisionsDemo";
import FindCitiesDemo from './components/geo/find-cities/FindCitiesDemo';
import FindCitiesNearCityDemo from './components/geo/find-cities-near-city/FindCitiesNearCityDemo';
import FindCitiesNearDivisionDemo from './components/geo/find-cities-near-division/FindCitiesNearDivisionDemo';
import FindCitiesNearLocationDemo from './components/geo/find-cities-near-location/FindCitiesNearLocationDemo';
import FindCountriesDemo from './components/geo/find-countries/FindCountriesDemo';
import FindCountryRegionsDemo from './components/geo/find-country-regions/FindCountryRegionsDemo';
import FindCountryRegionCitiesDemo from './components/geo/find-country-region-cities/FindCountryRegionCitiesDemo';
import FindCountryRegionDivisionsDemo from "./components/geo/find-country-region-divisions/FindCountryRegionDivisionsDemo";
import FindDivisionsNearDivisionDemo from './components/geo/find-divisions-near-division/FindDivisionsNearDivisionDemo';
import FindDivisionsNearLocationDemo from './components/geo/find-divisions-near-location/FindDivisionsNearLocationDemo';
import GetAdminDisivionDetailsDemo from "./components/geo/get-admin-division-details/GetAdminDivisionDetailsDemo";
import GetCityAdminRegionDemo from "./components/geo/get-city-admin-region/GetCityAdminRegionDemo";
import GetCityDetailsDemo from './components/geo/get-city-details/GetCityDetailsDemo';
import GetCityDistanceDemo from './components/geo/get-city-distance/GetCityDistanceDemo';
import GetCityDateTimeDemo from './components/geo/get-city-datetime/GetCityDateTimeDemo';
import GetCityTimeDemo from './components/geo/get-city-time/GetCityTimeDemo';
import GetCountryDetailsDemo from './components/geo/get-country-details/GetCountryDetailsDemo';
import GetCountryRegionDetailsDemo from './components/geo/get-country-region-details/GetCountryRegionDetailsDemo';

import GetCurrenciesDemo from './components/locale/get-currencies/GetCurrenciesDemo';
import GetLanguagesDemo from './components/locale/get-languages/GetLanguagesDemo';
import GetLocalesDemo from './components/locale/get-locales/GetLocalesDemo';
import GetTimezonesDemo from './components/locale/get-timezones/GetTimezonesDemo';
import GetTimezoneDateTimeDemo from './components/locale/get-timezone-datetime/GetTimezoneDateTimeDemo';
import GetTimezoneTimeDemo from './components/locale/get-timezone-time/GetTimezoneTimeDemo';

import App from './App'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/find-admin-divisions',
      component: FindAdminDivisionsDemo
    },
    {
      path: '/find-cities',
      component: FindCitiesDemo
    },
    {
      path: '/find-cities-near-city',
      component: FindCitiesNearCityDemo
    },
    {
      path: '/find-cities-near-division',
      component: FindCitiesNearDivisionDemo
    },
    {
      path: '/find-cities-near-location',
      component: FindCitiesNearLocationDemo
    },
    {
      path: '/find-divisions-near-division',
      component: FindDivisionsNearDivisionDemo
    },
    {
      path: '/find-divisions-near-location',
      component: FindDivisionsNearLocationDemo
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
      path: '/find-country-region-divisions',
      component: FindCountryRegionDivisionsDemo
    },
    {
      path: '/find-country-region-cities',
      component: FindCountryRegionCitiesDemo
    },
    {
      path: '/get-admin-division-details',
      component: GetAdminDisivionDetailsDemo
    },
    {
      path: '/get-city-admin-region',
      component: GetCityAdminRegionDemo
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
      path: '/get-currencies',
      component: GetCurrenciesDemo
    },
    {
      path: '/get-languages',
      component: GetLanguagesDemo
    },
    {
      path: '/get-locales',
      component: GetLocalesDemo
    },
    {
      path: '/get-timezones',
      component: GetTimezonesDemo
    },
    {
      path: '/get-timezone-datetime',
      component: GetTimezoneDateTimeDemo
    },
    {
      path: '/get-timezone-time',
      component: GetTimezoneTimeDemo
    }]
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
