<template>
  <div id="get-country-details-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div class="form-field">
        <label>Country</label>
        <country-autocomplete @onCountrySelected="onCountrySelected($event)"/>
      </div>
      <div v-if="countryDetails" style="width:100%" class="form-field">
        <table>
          <tr><td width="200px"/><td width="250px"/></tr>
          <tr>
            <td>Code:</td>
            <td>{{countryDetails.code}}</td>
          </tr>
          <tr>
            <td>Supported Currencies:</td>
            <td>{{countryDetails.currencyCodes.join(', ')}}</td>
          </tr>
          <tr>
            <td>States/Provinces/Regions:</td>
            <td>{{countryDetails.numRegions}}</td>
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
import CountryAutocomplete from '@/shared/components/CountryAutocomplete'

import Config from '@/shared/scripts/config'

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'get-country-details-demo',
  components: {
    CountryAutocomplete
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/countries',
      countryDetails: null
    }
  },
  computed: {
    endpointOperation () {
      return this.countryDetails
        ? this.baseEndpointOperation + '/' + this.countryDetails.code
        : this.baseEndpointOperation + '/{countryId}'
    }
  },
  methods: {
    onCountrySelected (country) {
      const self = this

      geoApi.getCountryUsingGET(country.code, {})
        .then(
          function (data) {
            const response = Config.GEO_DB.CountryResponse.constructFromObject(data)

            self.countryDetails = response.data
          },

          function (error) {
            console.error(error)
          }
        )
    }
  }
}
</script>
