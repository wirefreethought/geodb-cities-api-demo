<template>
  <div id="get-timezone-datetime-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>City</label>
          <city-autocomplete @onCitySelected="onCitySelected($event)"/>
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
        dateTime: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.zoneId
          ? this.baseEndpointOperation + "/" + this.zoneId + "/dateTime"
          : this.baseEndpointOperation + "/{zoneId}/dateTime";

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
      updateDateTime() {
        if (this.zoneId) {
          var self = this;

          localeApi.getTimeZoneDateTimeUsingGET(this.zoneId).then(
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
      zoneId: function() {
        this.updateDateTime();
      }
    }
  }
</script>
