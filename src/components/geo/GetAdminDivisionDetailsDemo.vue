<template>
  <div id="get-admin-division-details-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div class="form-field">
        <label>Administrative Division</label>
        <admin-division-autocomplete @onPlaceSelected="onPlaceSelected($event)"/>
      </div>

      <div v-if="divisionDetails" style="width:100%" class="form-field">
        <table>
          <tr><td width="200px"/><td width="250px"/></tr>
          <tr v-if="divisionDetails.region">
            <td>State/Province/Region:</td>
            <td>{{divisionDetails.region}}</td>
          </tr>
          <tr>
            <td>Location (latitude/longitude):</td>
            <td>{{divisionDetails.latitude}}/{{divisionDetails.longitude}}</td>
          </tr>
          <tr>
            <td>Time-Zone:</td>
            <td>{{divisionDetails.timezone | formatTimeZone}}</td>
          </tr>
          <tr>
            <td>Population:</td>
            <td>{{divisionDetails.population}}</td>
          </tr>
          <tr v-if="divisionDetails.elevationMeters">
            <td>Elevation (meters):</td>
            <td>{{divisionDetails.elevationMeters}}</td>
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
import Config from '@/shared/scripts/config'
import DateTimeUtils from '@/shared/scripts/date-time-utils-mixin'
import AdminDivisionAutocomplete from '@/shared/components/AdminDivisionAutocomplete'

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'get-city-details-demo',
  mixins: [DateTimeUtils],
  components: {
    AdminDivisionAutocomplete
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/adminDivisions',
      divisionDetails: null
    }
  },
  computed: {
    endpointOperation () {
      var operation = this.divisionDetails
        ? this.baseEndpointOperation + '/' + this.divisionDetails.id
        : this.baseEndpointOperation + '/{divisionId}'

      return operation
    }
  },
  methods: {
    onPlaceSelected (place) {
      const self = this

      geoApi.getAdminDivisionUsingGET(
        place.id, {
          languageCode: this.languageCode
        }).then(
        function (data) {
          var response = Config.GEO_DB.PopulatedPlaceResponse.constructFromObject(data)

          self.divisionDetails = response.data
        },

        function (error) {
          console.error(error)
        }
      )
    }
  }
}
</script>
