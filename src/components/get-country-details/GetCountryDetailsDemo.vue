<template>
  <div id="get-country-details-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div class="form-field">
        <label>Country</label>
        <country-autocomplete @onCountrySelected="onCountrySelected($event)"/>
      </div>
      <div v-if="countryDetails" width="100%" class="form-field">
        <div>Code: {{countryDetails.code}}</div>
        <div>Currency: {{countryDetails.currencyCode}}</div>
        <div>States/Provinces/Regions: {{countryDetails.numRegions}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "../../shared/styles/component.css";
</style>

<script>
  import CountryAutocomplete from "../../shared/components/CountryAutocomplete";

  import Config from "../../shared/scripts/config";

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'get-city-details-demo',
    components: {
      CountryAutocomplete
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/cities',
        countryDetails: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.countryDetails
          ? this.baseEndpointOperation + "/" + this.countryDetails.code
          : this.baseEndpointOperation + "/{countryCode}";

        return operation;
      }
    },
    methods: {
      onCountrySelected(country) {
        var self = this;

        geoApi.getCountryUsingGET(country.code).then(
          function (data) {
            var response = Config.GEO_DB.CountryResponse.constructFromObject(data);

            self.countryDetails = response.data;
          },

          function (error) {
            console.error(error);
          }
        );
      }
    }
  }
</script>
