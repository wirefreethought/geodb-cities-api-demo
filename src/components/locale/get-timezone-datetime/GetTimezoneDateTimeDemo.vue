<template>
  <div id="get-timezone-datetime-demo">
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
  import Config from "../../../shared/scripts/config";
  import DateTimeUtils from '../../../shared/scripts/date-time-utils-mixin';
  import PlaceAutocomplete from "../../../shared/components/PlaceAutocomplete";

  const geoApi = new Config.GEO_DB.GeoApi();
  const localeApi = new Config.GEO_DB.LocaleApi();

  export default {
    name: 'get-timezone-datetime-demo',
    mixins: [DateTimeUtils],
    components: {
      PlaceAutocomplete
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
      onPlaceSelected(place) {
        var self = this;

        geoApi.getCityUsingGET(place.id).then(
          function (data) {
            var response = Config.GEO_DB.PopulatedPlaceResponse.constructFromObject(data);

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
