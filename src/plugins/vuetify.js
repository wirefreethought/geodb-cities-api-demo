import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import {transitions, VApp, VBtn, VFooter, VGrid, VIcon, VList, VNavigationDrawer, VToolbar} from "vuetify";

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
  },
  iconfont: 'md'
})
