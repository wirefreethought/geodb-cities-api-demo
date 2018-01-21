<template>
  <div id="get-city-details-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div class="form-field">
        <label>City</label>
        <city-autocomplete @onCitySelected="onCitySelected($event)"/>
      </div>
      <div v-if="cityDetails" width="100%" class="form-field">
        <div v-if="cityDetails.region">State/Province/Region: {{cityDetails.region}}</div>
        <div>Location (latitude, longitude): {{cityDetails.location.latitude}}, {{cityDetails.location.longitude}}</div>
        <div>Time-Zone: {{cityDetails.timezone | toHumanReadableTimeZone}}</div>
        <div>Population: {{cityDetails.population}}</div>
        <div v-if="cityDetails.elevationMeters">Elevation (meters): {{cityDetails.elevationMeters}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "../../shared/styles/base.css";
</style>

<script>
  import CityAutocomplete from "../../shared/components/CityAutocomplete";
  import Config from "../../shared/scripts/config";

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'get-city-details-demo',
    components: {
      CityAutocomplete
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/cities',
        cityDetails: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.cityDetails
          ? this.baseEndpointOperation + "/" + this.cityDetails.id
          : this.baseEndpointOperation + "/{cityId}";

        return operation;
      }
    },
    filters: {
      toHumanReadableTimeZone: function (timeZone) {
        if (!timeZone) {
          return ''
        }

        return timeZone.replace('__', '/');
      }
    },
    methods: {
      onCitySelected(city) {
        var self = this;

        geoApi.getCityUsingGET(city.id).then(
          function (data) {
            var response = Config.GEO_DB.CityResponse.constructFromObject(data);

            self.cityDetails = response.data;
          },

          function (error) {
            console.error(error);
          }
        );
      }
    }
  }
</script>
