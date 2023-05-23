import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

import FindCountriesDemo from '@/components/geo/FindCountriesDemo'
import FindCountryPlacesDemo from "@/components/geo/FindCountryPlacesDemo";
import FindCountryRegionsDemo from '@/components/geo/FindCountryRegionsDemo'
import GetCountryDetailsDemo from '@/components/geo/GetCountryDetailsDemo'
import GetCountryRegionDetailsDemo from '@/components/geo/GetCountryRegionDetailsDemo'
import GetCurrenciesDemo from '@/components/locale/GetCurrenciesDemo'
import GetLanguagesDemo from '@/components/locale/GetLanguagesDemo'
import GetLocalesDemo from '@/components/locale/GetLocalesDemo'
import GetTimezonesDemo from '@/components/locale/GetTimezonesDemo'
import GetTimezoneTimeDemo from '@/components/locale/GetTimezoneTimeDemo'
import FindPlacesDemo from "@/components/geo/FindPlacesDemo";
import FindPlacesNearLocationDemo from "@/components/geo/FindPlacesNearLocationDemo";
import FindPlacesNearPlaceDemo from "@/components/geo/FindPlacesNearPlaceDemo";
import GetPlaceAdminRegionDemo from "@/components/geo/GetPlaceAdminRegionDemo";
import GetPlaceDateTimeDemo from "@/components/geo/GetPlaceDateTimeDemo";
import GetPlaceDetailsDemo from "@/components/geo/GetPlaceDetailsDemo";
import GetPlaceDistanceDemo from "@/components/geo/GetPlaceDistanceDemo";
import GetPlaceTimeDemo from "@/components/geo/GetPlaceTimeDemo";
import GetTimezoneDateTimeDemo from "@/components/locale/GetTimezoneDateTimeDemo";
import FindCountryRegionPlacesDemo from "@/components/geo/FindCountryRegionPlacesDemo";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/find-countries',
    component: FindCountriesDemo
  },
  {
    path: '/find-country-places',
    component: FindCountryPlacesDemo
  },
  {
    path: '/find-country-regions',
    component: FindCountryRegionsDemo
  },
  {
    path: '/find-country-region-places',
    component: FindCountryRegionPlacesDemo
  },
  {
    path: '/find-places',
    component: FindPlacesDemo
  },
  {
    path: '/find-places-near-location',
    component: FindPlacesNearLocationDemo
  },
  {
    path: '/find-places-near-place',
    component: FindPlacesNearPlaceDemo
  },
  {
    path: '/get-place-admin-region',
    component: GetPlaceAdminRegionDemo
  },
  {
    path: '/get-place-datetime',
    component: GetPlaceDateTimeDemo
  },
  {
    path: '/get-place-details',
    component: GetPlaceDetailsDemo
  },
  {
    path: '/get-place-distance',
    component: GetPlaceDistanceDemo
  },
  {
    path: '/get-place-time',
    component: GetPlaceTimeDemo
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
    component: GetTimezoneDateTimeDemo
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
