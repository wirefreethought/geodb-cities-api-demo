<template>
  <div id="get-place-time-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint_operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form_field">
          <label>Place</label>
          <place-autocomplete @onPlaceSelected="onPlaceSelected($event)"/>
        </div>
        <div v-if="time" class="form_field">
          <label>Local Time</label>
          <div>{{time}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "../../shared/styles/component.css";
</style>

<script>
import Config from '@/shared/scripts/config'
import DateTimeUtils from '@/shared/scripts/date-time-utils-mixin'
import PlaceAutocomplete from '@/shared/components/PlaceAutocomplete'

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'get-place-datetime-demo',
  mixins: [DateTimeUtils],
  components: {
    PlaceAutocomplete
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/places',

      placeId: null,
      time: null
    }
  },
  computed: {
    endpointOperation () {
      return this.placeId
        ? this.baseEndpointOperation + '/' + this.placeId + '/time'
        : this.baseEndpointOperation + '/{placeId}/time'
    }
  },
  methods: {
    updateTime () {
      if (this.placeId) {
        const self = this

        geoApi.getPlaceTimeUsingGET(this.placeId)
          .then(
            function (data) {
              self.time = data.data
            },

            function (error) {
              console.error(error)
            }
          )
      } else {
        this.time = null
      }
    },
    onPlaceSelected (place) {
      this.placeId = place.id
    }
  },
  watch: {
    placeId: function () {
      this.updateTime()
    }
  }
}
</script>
