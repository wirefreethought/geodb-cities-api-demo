<template>
  <div id="get-place-datetime-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>Place</label>
          <place-autocomplete @onPlaceSelected="onPlaceSelected($event)"/>
        </div>
        <div v-if="dateTime" class="form-field">
          <label>Date-Time (ISO-8601, UTC)</label>
          <div>{{dateTime}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "../../shared/styles/component.css";
</style>

<script>
import PlaceAutocomplete from '@/shared/components/PlaceAutocomplete'
import Config from '@/shared/scripts/config'
import DateTimeUtils from '@/shared/scripts/date-time-utils-mixin'
import {Temporal} from "@js-temporal/polyfill";

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

      dateTime: null,
      placeId: null
    }
  },
  computed: {
    endpointOperation () {
      var operation = this.placeId
        ? this.baseEndpointOperation + '/' + this.placeId + '/dateTime'
        : this.baseEndpointOperation + '/{placeId}/dateTime'

      return operation
    }
  },
  methods: {
    onPlaceSelected (place) {
      this.placeId = place.id
    },
    updateDateTime () {
      if (this.placeId) {
        const self = this

        geoApi.getPlaceDateTimeUsingGET(this.placeId)
          .then(
            function (data) {
              self.dateTime = data.data
            },

            function (error) {
              console.error(error)
            }
          )
      } else {
        this.dateTime = null
      }
    }
  },
  watch: {
    placeId: function () {
      this.updateDateTime()
    }
  }
}
</script>
