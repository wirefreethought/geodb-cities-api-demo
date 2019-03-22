<template>
  <div id="get-city-datetime-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>City</label>
          <place-autocomplete @onPlaceSelected="onPlaceSelected($event)"/>
        </div>
        <div v-if="dateTime" class="form-field">
          <label>Date-Time (ISO8601, UTC)</label>
          <div>{{dateTime | formatDateTime}}</div>
        </div>
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
    name: 'get-city-datetime-demo',
    mixins: [DateTimeUtils],
    components: {
      PlaceAutocomplete
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/cities',

        dateTime: null,
        divisionId: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.placeId
          ? this.baseEndpointOperation + "/" + this.placeId + "/dateTime"
          : this.baseEndpointOperation + "/{cityId}/dateTime";

        return operation;
      }
    },
    methods: {
      onDivisionSelected(place) {
        this.placeId = place.id;
      },
      updateDateTime() {
        if (this.placeId) {
          var self = this;

          geoApi.getCityDateTimeUsingGET(this.placeId).then(
              function (data) {
                self.dateTime = data.data;
              },

              function (error) {
                console.error(error);
              }
          );
        } else {
          this.dateTime = null;
        }
      }
    },
    watch: {
      divisionId: function() {
        this.updateDateTime();
      }
    }
  }
</script>
