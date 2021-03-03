<template>
  <div id="get-timezone-datetime-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>City</label>
          <place-autocomplete @onPlaceSelected="onPlaceSelected($event)"/>
        </div>
        <div v-if="time" class="form-field">
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
const localeApi = new Config.GEO_DB.LocaleApi()

export default {
  name: 'get-timezone-datetime-demo',
  mixins: [DateTimeUtils],
  components: {
    PlaceAutocomplete
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/locale/timezones',

      zoneId: null,
      time: null
    }
  },
  computed: {
    endpointOperation () {
      return this.zoneId
        ? this.baseEndpointOperation + '/' + this.zoneId + '/time'
        : this.baseEndpointOperation + '/{zoneId}/time'
    }
  },
  methods: {
    onPlaceSelected (place) {
      const self = this

      geoApi.getCityUsingGET(place.id, {}).then(
        function (data) {
          const response = Config.GEO_DB.PopulatedPlaceResponse.constructFromObject(data)

          self.zoneId = response.data.timezone
        },

        function (error) {
          console.error(error)
        }
      )
    },
    updateTime () {
      if (this.zoneId) {
        const self = this

        localeApi.getTimeZoneTimeUsingGET(this.zoneId).then(
          data => {
            self.time = data.data
          },
          error => {
            console.error(error)
          }
        )
      } else {
        this.time = null
      }
    }
  },
  watch: {
    zoneId: function () {
      this.updateTime()
    }
  }
}
</script>
