<template>
  <v-app light>
    <v-navigation-drawer
      fixed
      light
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      app
    >
      <v-list dense class="pt-0">
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          value="true"
          router
          v-bind:to="item.action"
        >
          <v-list-tile-action>
            <v-icon dark v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        clipped: false,
        drawer: true,
        fixed: false,
        items: [
          {
            icon: 'widgets',
            title: 'Find Cities',
            action: '/find-cities'
          },
          {
            icon: 'widgets',
            title: 'Find Nearby Cities',
            action: '/find-nearby-cities'
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
            title: 'Get City Date-Time',
            action: '/get-city-datetime'
          },
          {
            icon: 'widgets',
            title: 'Get City Time',
            action: '/get-city-time'
          },
          {
            icon: 'widgets',
            title: 'Find Countries',
            action: '/find-countries'
          },
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'GeoDB Demo'
      }
    }
  }
</script>
