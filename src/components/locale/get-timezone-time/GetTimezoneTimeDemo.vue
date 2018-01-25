<template>
  <div id="get-timezone-datetime-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>City</label>
          <city-autocomplete @onCitySelected="onCitySelected($event)"/>
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
  import CityAutocomplete from "../../../shared/components/CityAutocomplete";
  import Config from "../../../shared/scripts/config";
  import DateTimeUtils from '../../../shared/scripts/date-time-utils-mixin';

  const geoApi = new Config.GEO_DB.GeoApi();
  const localeApi = new Config.GEO_DB.LocaleApi();

  export default {
    name: 'get-timezone-datetime-demo',
    mixins: [DateTimeUtils],
    components: {
      CityAutocomplete
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/locale/timezones',

        zoneId: null,
        time: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.zoneId
          ? this.baseEndpointOperation + "/" + this.zoneId + "/time"
          : this.baseEndpointOperation + "/{zoneId}/time";

        return operation;
      }
    },
    methods: {
      onCitySelected(city) {
        var self = this;

        geoApi.getCityUsingGET(city.id).then(
          function (data) {
            var response = Config.GEO_DB.CityResponse.constructFromObject(data);

            self.zoneId = response.data.timezone;
          },

          function (error) {
            console.error(error);
          }
        );
      },
      updateTime() {
        if (this.zoneId) {
          var self = this;

          localeApi.getTimeZoneTimeUsingGET(this.zoneId).then(
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
      }
    },
    watch: {
      zoneId: function() {
        this.updateTime();
      }
    }
  }
</script>
