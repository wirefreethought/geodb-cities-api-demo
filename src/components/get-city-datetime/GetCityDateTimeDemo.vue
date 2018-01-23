<template>
  <div id="get-city-datetime-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>City</label>
          <city-autocomplete @onCitySelected="onCitySelected($event)"/>
        </div>
        <div v-if="dateTime" class="form-field">
          <label>Date-Time (ISO8601)</label>
          <div>{{dateTime | formatDateTime}}</div>
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
  import DateTimeUtils from '../../shared/scripts/date-time-utils-mixin';

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'get-city-datetime-demo',
    mixins: [DateTimeUtils],
    components: {
      CityAutocomplete
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/cities',

        cityId: null,
        dateTime: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.cityId
          ? this.baseEndpointOperation + "/" + this.cityId + "/dateTime"
          : this.baseEndpointOperation + "/{cityId}/dateTime";

        return operation;
      }
    },
    methods: {
      updateDateTime() {
        if (this.cityId) {
          var self = this;

          geoApi.getCityDateTimeUsingGET(this.cityId).then(
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
      },
      onCitySelected(city) {
        this.cityId = city.id;
      }
    },
    watch: {
      cityId: function() {
        this.updateDateTime();
      }
    }
  }
</script>
