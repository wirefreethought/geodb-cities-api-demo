<template>
  <v-app light>
    <v-navigation-drawer
        fixed
        light
        :mini-variant="miniVariant"
        :clipped="clipped"
        v-model="drawer"
        width="300px"
        app
    >
      <v-list dense class="pt-0">
        <v-list-item
            v-for="(item, i) in items"
            :key="i"
            value="true"
            router
            v-bind:to="item.action"
        >
          <v-list-item-action>
            <v-icon dark v-html="item.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title v-text="title"></v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
@import './shared/styles/app.css';
</style>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'widgets',
          title: 'Find Admin Divisions',
          action: '/find-admin-divisions'
        },
        {
          icon: 'widgets',
          title: 'Find Admin Divisions Near Division',
          action: '/find-admin-divisions-near-division'
        },
        {
          icon: 'widgets',
          title: 'Find Admin Divisions Near Location',
          action: '/find-admin-divisions-near-location'
        },
        {
          icon: 'widgets',
          title: 'Find Cities',
          action: '/find-cities'
        },
        {
          icon: 'widgets',
          title: 'Find Cities Near City',
          action: '/find-cities-near-city'
        },
        {
          icon: 'widgets',
          title: 'Find Cities Near Division',
          action: '/find-cities-near-division'
        },
        {
          icon: 'widgets',
          title: 'Find Cities Near Location',
          action: '/find-cities-near-location'
        },
        {
          icon: 'widgets',
          title: 'Find Countries',
          action: '/find-countries'
        },
        {
          icon: 'widgets',
          title: 'Find Country Regions',
          action: '/find-country-regions'
        },
        {
          icon: 'widgets',
          title: 'Find Country Region Admin Divisions',
          action: '/find-country-region-admin-divisions'
        },
        {
          icon: 'widgets',
          title: 'Find Country Region Cities',
          action: '/find-country-region-cities'
        },
        {
          icon: 'widgets',
          title: 'Get Admin Division Details',
          action: '/get-admin-division-details'
        },
        {
          icon: 'widgets',
          title: 'Get City Admin Region',
          action: '/get-city-admin-region'
        },
        {
          icon: 'widgets',
          title: 'Get City Date-Time',
          action: '/get-city-datetime'
        },
        {
          icon: 'widgets',
          title: 'Get City Details',
          action: '/get-city-details'
        },
        {
          icon: 'widgets',
          title: 'Get City Distance',
          action: '/get-city-distance'
        },
        {
          icon: 'widgets',
          title: 'Get City Time',
          action: '/get-city-time'
        },
        {
          icon: 'widgets',
          title: 'Get Country Details',
          action: '/get-country-details'
        },
        {
          icon: 'widgets',
          title: 'Get Country Region Details',
          action: '/get-country-region-details'
        },
        {
          icon: 'widgets',
          title: 'Get Currencies',
          action: '/get-currencies'
        },
        {
          icon: 'widgets',
          title: 'Get Languages',
          action: '/get-languages'
        },
        {
          icon: 'widgets',
          title: 'Get Locales',
          action: '/get-locales'
        },
        {
          icon: 'widgets',
          title: 'Get Time-Zones',
          action: '/get-timezones'
        },
        {
          icon: 'widgets',
          title: 'Get Time-Zone Date-Time',
          action: '/get-timezone-datetime'
        },
        {
          icon: 'widgets',
          title: 'Get Time-Zone Time',
          action: '/get-timezone-time'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'GeoDB Demo'
    }
  }
}
</script>
