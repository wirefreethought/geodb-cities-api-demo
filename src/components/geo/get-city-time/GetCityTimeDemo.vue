<template>
  <div id="get-city-time-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>City</label>
          <place-autocomplete @onPlaceSelected="onPlaceSelected($event)"/>
        </div>
        <div v-if="time" class="form-field">
          <label>Local Time</label>
          <div>{{time}}</div>
        </div>
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
  import PlaceAutocomplete from "../../../shared/components/PlaceAutocomplete";

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'get-city-datetime-demo',
    mixins: [DateTimeUtils],
    components: {
      PlaceAutocomplete
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/cities',

        placeId: null,
        time: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.placeId
          ? this.baseEndpointOperation + "/" + this.placeId + "/time"
          : this.baseEndpointOperation + "/{placeId}/time";

        return operation;
      }
    },
    methods: {
      updateTime() {
        if (this.placeId) {
          var self = this;

          geoApi.getCityTimeUsingGET(this.placeId).then(
              function (data) {
                self.time = data.data;
              },

              function (error) {
                console.error(error);
              }
          );
        } else {
          this.time = null;
        }
      },
      onPlaceSelected(place) {
        this.placeId = place.id;
      }
    },
    watch: {
      placeId: function() {
        this.updateTime();
      }
    }
  }
</script>
