<template>
  <div id="get-city-time-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>City</label>
          <city-autocomplete @onCitySelected="onCitySelected($event)"/>
        </div>
        <div v-if="time" class="form-field">
          <label>Time</label>
          <div>{{time}}</div>
        </div>
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
        time: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.cityId
          ? this.baseEndpointOperation + "/" + this.cityId + "/time"
          : this.baseEndpointOperation + "/{cityId}/time";

        return operation;
      }
    },
    methods: {
      updateTime() {
        if (this.cityId) {
          var self = this;

          geoApi.getCityTimeUsingGET(this.cityId).then(
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
      onCitySelected(city) {
        this.cityId = city.id;
      }
    },
    watch: {
      cityId: function() {
        this.updateTime();
      }
    }
  }
</script>
