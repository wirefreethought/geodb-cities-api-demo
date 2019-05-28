<template>
  <div id="get-admin-division-details-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div class="form-field">
        <label>Administrative Division</label>
        <admin-division-autocomplete @onPlaceSelected="onPlaceSelected($event)"/>
      </div>

      <div v-if="divisionDetails" width="100%" class="form-field">
        <div v-if="divisionDetails.region">State/Province/Region: {{divisionDetails.region}}</div>
        <div>Location (latitude, longitude): {{divisionDetails.latitude}}, {{divisionDetails.longitude}}</div>
        <div>Time-Zone: {{divisionDetails.timezone | formatTimeZone}}</div>
        <div>Population: {{divisionDetails.population}}</div>
        <div v-if="divisionDetails.elevationMeters">Elevation (meters): {{divisionDetails.elevationMeters}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "../../../shared/styles/component.css";
</style>

<script>
  import Config from "../../../shared/scripts/config";
  import DateTimeUtils from '../../../shared/scripts/date-time-utils-mixin';
  import AdminDivisionAutocomplete from "../../../shared/components/AdminDivisionAutocomplete";

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'get-city-details-demo',
    mixins: [DateTimeUtils],
    components: {
      AdminDivisionAutocomplete
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/adminDivisions',
        divisionDetails: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.divisionDetails
          ? this.baseEndpointOperation + "/" + this.divisionDetails.id
          : this.baseEndpointOperation + "/{divisionId}";

        return operation;
      }
    },
    methods: {
      onPlaceSelected(place) {
        var self = this;

        geoApi.getAdminDivisionUsingGET(
          place.id,
          {
            languageCode: this.languageCode
          }).then(
            function (data) {
              var response = Config.GEO_DB.PopulatedPlaceResponse.constructFromObject(data);

              self.divisionDetails = response.data;
            },

            function (error) {
              console.error(error);
            }
          );
      }
    }
  }
</script>
