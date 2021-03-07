import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

import FindAdminDivisionsDemo from '@/components/geo/FindAdminDivisionsDemo'
import FindAdminDivisionsNearDivisionDemo from '@/components/geo/FindAdminDivisionsNearDivisionDemo'
import FindCitiesDemo from '@/components/geo/FindCitiesDemo'
import FindCitiesNearCityDemo from '@/components/geo/FindCitiesNearCityDemo'
import FindCitiesNearDivisionDemo from '@/components/geo/FindCitiesNearDivisionDemo'
import FindCitiesNearLocationDemo from '@/components/geo/FindCitiesNearLocationDemo'
import FindCountriesDemo from '@/components/geo/FindCountriesDemo'
import FindCountryRegionAdminDivisionsDemo from '@/components/geo/FindCountryRegionAdminDivisionsDemo'
import FindCountryRegionCitiesDemo from '@/components/geo/FindCountryRegionCitiesDemo'
import FindCountryRegionsDemo from '@/components/geo/FindCountryRegionsDemo'
import FindAdminDivisionsNearLocationDemo from '@/components/geo/FindAdminDivisionsNearLocationDemo'
import GetAdminDivisionDetailsDemo from '@/components/geo/GetAdminDivisionDetailsDemo'
import GetCityAdminRegionDemo from '@/components/geo/GetCityAdminRegionDemo'
import GetCityDateTimeDemo from '@/components/geo/GetCityDateTimeDemo'
import GetCityDetailsDemo from '@/components/geo/GetCityDetailsDemo'
import GetCityDistanceDemo from '@/components/geo/GetCityDistanceDemo'
import GetCityTimeDemo from '@/components/geo/GetCityTimeDemo'
import GetCountryDetailsDemo from '@/components/geo/GetCountryDetailsDemo'
import GetCountryRegionDetailsDemo from '@/components/geo/GetCountryRegionDetailsDemo'
import GetCurrenciesDemo from '@/components/locale/GetCurrenciesDemo'
import GetLanguagesDemo from '@/components/locale/GetLanguagesDemo'
import GetLocalesDemo from '@/components/locale/GetLocalesDemo'
import GetTimezonesDemo from '@/components/locale/GetTimezonesDemo'
import GetTimezoneTimeDemo from '@/components/locale/GetTimezoneTimeDemo'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  // Admin Divisions
  {
    path: '/find-admin-divisions',
    component: FindAdminDivisionsDemo
  },
  {
    path: '/find-admin-divisions-near-division',
    component: FindAdminDivisionsNearDivisionDemo
  },
  {
    path: '/find-admin-divisions-near-location',
    component: FindAdminDivisionsNearLocationDemo
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
    path: '/find-countries',
    component: FindCountriesDemo
  },
  {
    path: '/find-country-regions',
    component: FindCountryRegionsDemo
  },
  {
    path: '/find-country-region-admin-divisions',
    component: FindCountryRegionAdminDivisionsDemo
  },
  {
    path: '/find-country-region-cities',
    component: FindCountryRegionCitiesDemo
  },
  {
    path: '/get-admin-division-details',
    component: GetAdminDivisionDetailsDemo
  },
  {
    path: '/get-city-admin-region',
    component: GetCityAdminRegionDemo
  },
  {
    path: '/get-city-datetime',
    component: GetCityDateTimeDemo
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
    path: '/get-city-time',
    component: GetCityTimeDemo
  },
  {
    path: '/get-country-details',
    component: GetCountryDetailsDemo
  },
  {
    path: '/get-country-region-details',
    component: GetCountryRegionDetailsDemo
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
    component: GetCityDateTimeDemo
  },
  {
    path: '/get-timezone-time',
    component: GetTimezoneTimeDemo
  }
]

const router = new VueRouter({
  routes
})

export default router
