<template>
  <div id="get-place-distance-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>From</label>
          <place-autocomplete @onPlaceSelected="onFromPlaceSelected($event)"/>
        </div>
        <div class="form-field">
          <label>To</label>
          <place-autocomplete @onPlaceSelected="onToPlaceSelected($event)"/>
        </div>
        <div v-if="distance" class="form-field">
          <label>Distance</label>
          <div>{{distance}} miles</div>
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
import PlaceAutocomplete from '@/shared/components/PlaceAutocomplete'

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'get-place-distance-demo',
  components: {
    PlaceAutocomplete
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/places',

      fromPlaceId: null,
      toPlaceId: null,
      distance: null
    }
  },
  computed: {
    endpointOperation () {
      var operation = this.toPlaceId
        ? this.baseEndpointOperation + '/' + this.toPlaceId + '/distance'
        : this.baseEndpointOperation + '/{toPlaceId}/distance'

      operation = this.fromPlaceId
        ? operation + '?toPlaceId=' + this.fromPlaceId
        : operation + '?toPlaceId=toPlaceId}'

      return operation
    }
  },
  methods: {
    calculateDistance () {
      if (this.fromPlaceId && this.toPlaceId) {
        const self = this

        geoApi.getPlaceDistanceUsingGET(this.toPlaceId, this.fromPlaceId, {})
          .then(
            function (data) {
              self.distance = data.data
            },

            function (error) {
              console.error(error)
            }
          )
      } else {
        this.distance = null
      }
    },
    onFromPlaceSelected (place) {
      this.fromPlaceId = place.id
    },
    onToPlaceSelected (place) {
      this.toPlaceId = place.id
    }
  },
  watch: {
    fromPlaceId: function () {
      this.calculateDistance()
    },
    toPlaceId: function () {
      this.calculateDistance()
    }
  }
}
</script>
