<template>
  <div>
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div>
        NOTE: If you don't see results after a few seconds, it means the service isn't able to determine the admin region based on existing Wikidata.
      </div>
      <div class="form-field">
        <label>City</label>
        <place-autocomplete @onPlaceSelected="onPlaceSelected($event)"/>
      </div>

      <div v-if="containingPlace" style="width:100%" class="form-field">
        <table>
          <tr><td width="200px"/><td width="250px"/></tr>
          <tr>
            <td>Name:</td>
            <td>{{containingPlace.name}}</td>
          </tr>
          <tr v-if="containingPlace.region">
            <td>State/Province/Region:</td>
            <td>{{containingPlace.region}}</td>
          </tr>
          <tr>
            <td>Location (latitude/longitude):</td>
            <td>{{containingPlace.latitude}}/{{containingPlace.longitude}}</td>
          </tr>
          <tr>
            <td>Time-Zone:</td>
            <td>{{containingPlace.timezone | formatTimeZone}}</td>
          </tr>
          <tr>
            <td>Population:</td>
            <td>{{containingPlace.population}}</td>
          </tr>
          <tr v-if="containingPlace.elevationMeters">
            <td>Elevation (meters):</td>
            <td>{{containingPlace.elevationMeters}}</td>
          </tr>
        </table>
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

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'get-city-admin-region-demo',
  mixins: [DateTimeUtils],
  components: {
    PlaceAutocomplete
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/cities',
      selectedPlaceId: null,
      containingPlace: null
    }
  },
  computed: {
    endpointOperation () {
      var operation = this.containingPlace
        ? this.baseEndpointOperation + '/' + this.selectedPlaceId + '/locatedIn'
        : this.baseEndpointOperation + '/{cityId}/locatedIn'

      return operation
    }
  },
  methods: {
    onPlaceSelected (place) {
      const self = this

      self.selectedPlaceId = place.id

      geoApi.getCityLocatedInUsingGET(
        place.id,
        {
          languageCode: this.languageCode
        }).then(
        function (data) {
          const response = Config.GEO_DB.PopulatedPlaceResponse.constructFromObject(data)

          self.containingPlace = response.data
        },

        function (error) {
          console.error(error)
        }
      )
    }
  }
}
</script>
