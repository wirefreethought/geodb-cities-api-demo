<template>
  <div id="get-country-region-details-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div class="form-field">
        <label>Country</label>
        <country-autocomplete @onCountrySelected="onCountrySelected($event)"/>
      </div>
      <div v-if="countryCode" class="form-field">
        <label>Region</label>
        <region-autocomplete :countryCode="countryCode" @onRegionSelected="onRegionSelected($event)"/>
      </div>
      <div v-if="regionDetails" width="100%" class="form-field">
        <div>FIPS: {{regionDetails.fipsCode}}</div>
        <div>HASC: {{regionDetails.hascCode}}</div>
        <div>ISO: {{regionDetails.isoCode}}</div>
        <div v-if="regionDetails.numCities > 0">Cities/Towns: {{regionDetails.numCities}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "../../../shared/styles/component.css";
</style>

<script>
  import CountryAutocomplete from '../../../shared/components/CountryAutocomplete';
  import RegionAutocomplete from '../../../shared/components/RegionAutocomplete';

  import Config from "../../../shared/scripts/config";

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'get-country-region-details-demo',
    components: {
      CountryAutocomplete,
      RegionAutocomplete
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/countries',
        countryCode: null,
        regionDetails: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.countryCode
          ? this.baseEndpointOperation + "/" + this.countryCode
          : this.baseEndpointOperation + "/{countryCode}";

        operation += this.regionDetails
          ? "/regions/" + this.regionDetails.isoCode
          : "/regions/{regionCode}";

        return operation;
      }
    },
    methods: {
      onCountrySelected(country) {
        this.countryCode = country.code;
      },
      onRegionSelected(region) {
        var self = this;

        geoApi.getRegionUsingGET(this.countryCode, region.code).then(
          function (data) {
            var response = Config.GEO_DB.RegionResponse.constructFromObject(data);

            self.regionDetails = response.data;
          },

          function (error) {
            console.error(error);
          }
        );
      }
    }
  }
</script>
