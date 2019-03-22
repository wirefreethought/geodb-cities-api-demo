<template>
  <div id="get-city-details-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div class="form-field">
        <label>City</label>
        <place-autocomplete @onPlaceSelected="onPlaceSelected($event)"/>
      </div>

      <div v-if="placeDetails" width="100%" class="form-field">
        <div v-if="placeDetails.region">State/Province/Region: {{placeDetails.region}}</div>
        <div>Location (latitude, longitude): {{placeDetails.latitude}}, {{placeDetails.longitude}}</div>
        <div>Time-Zone: {{placeDetails.timezone | formatTimeZone}}</div>
        <div>Population: {{placeDetails.population}}</div>
        <div v-if="placeDetails.elevationMeters">Elevation (meters): {{placeDetails.elevationMeters}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "../../../shared/styles/component.css";
</style>

<script>
  import PlaceAutocomplete from "../../../shared/components/PlaceAutocomplete";

  import Config from "../../../shared/scripts/config";
  import DateTimeUtils from '../../../shared/scripts/date-time-utils-mixin';

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'get-city-details-demo',
    mixins: [DateTimeUtils],
    components: {
      PlaceAutocomplete
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/cities',
        placeDetails: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.placeDetails
          ? this.baseEndpointOperation + "/" + this.placeDetails.id
          : this.baseEndpointOperation + "/{placeId}";

        return operation;
      }
    },
    methods: {
      onPlaceSelected(place) {
        var self = this;

        geoApi.getCityUsingGET(
          place.id,
          {
            languageCode: this.languageCode
          }).then(
            function (data) {
              var response = Config.GEO_DB.PopulatedPlaceResponse.constructFromObject(data);

              self.placeDetails = response.data;
            },

            function (error) {
              console.error(error);
            }
          );
      }
    }
  }
</script>
