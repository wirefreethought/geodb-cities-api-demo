<template>
  <div id="get-city-distance-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>From</label>
          <city-autocomplete @onCitySelected="onFromCitySelected($event)"/>
        </div>
        <div class="form-field">
          <label>To</label>
          <city-autocomplete @onCitySelected="onToCitySelected($event)"/>
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
  import CityAutocomplete from "../../shared/components/CityAutocomplete";
  import Config from "../../shared/scripts/config";

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'get-city-distance-demo',
    components: {
      CityAutocomplete
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/cities',

        fromCityId: null,
        toCityId: null,
        distance: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.toCityId
          ? this.baseEndpointOperation + "/" + this.toCityId + "/distance"
          : this.baseEndpointOperation + "/{toCityId}/distance";

        operation = this.fromCityId
          ? operation + "?fromCityId=" + this.fromCityId
          : operation + "?fromCityId={fromCityId}";

        return operation;
      }
    },
    methods: {
      calculateDistance() {
        if (this.fromCityId && this.toCityId) {
          var self = this;

          geoApi.getCityDistanceUsingGET(this.toCityId, this.fromCityId).then(
              function (data) {
                self.distance = data.data;
              },

              function (error) {
                console.error(error);
              }
          );
        } else {
          this.distance = null;
        }
      },
      onFromCitySelected(city) {
        this.fromCityId = city.id;
      },
      onToCitySelected(city) {
        this.toCityId = city.id;
      }
    },
    watch: {
      fromCityId: function() {
        this.calculateDistance();
      },
      toCityId: function() {
        this.calculateDistance();
      }
    }
  }
</script>
