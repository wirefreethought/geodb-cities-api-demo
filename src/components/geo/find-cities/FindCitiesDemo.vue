<template>
  <div id="find-cities-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>Name Prefix</label><br/><input v-model="namePrefix" placeholder="First letters of the city name" style="width:150px"/>
        </div>
        <div class="form-field">
          <label>Min Population</label><br/><input v-model="minPopulation" placeholder="Minimum population"/>
        </div>
        <div class="form-field">
          <label>Near Location</label><br/><input v-model="location" placeholder="±DD.DDDD±DDD.DDDD" style="width:150px"/>
        </div>
        <div class="form-field">
          <label>Within Radius</label><br/><input v-model="locationRadius" placeholder="Radius in miles"/>
        </div>
      </div>
      <div class="form-button">
        <button @click="onRequestUpdated" class="input.form_field_submit_button">Update Results</button>
      </div>
    </div>

    <data-table
      :data="currentPageData"
      :columns="columns"
      :count="count"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @pageChanged="onPageChanged">
    </data-table>
  </div>
</template>

<style scoped>
  @import "../../../shared/styles/component.css";
</style>

<script>
  import DataTable from '../../../shared/components/DataTable';

  import Config from "../../../shared/scripts/config";
  import PageableMixin from '../../../shared/scripts/pageable-mixin';

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'find-cities-demo',
    mixins: [PageableMixin],
    components: {
      DataTable
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/cities',
        columns: ['city', 'country', 'location'],

        currentRequest: {},

        namePrefix: null,
        minPopulation: null,
        location: null,
        locationRadius: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.baseEndpointOperation + "?limit=" + this.pageSize + "&offset=" + this.offset;

        if (this.namePrefix) {
          operation += "&namePrefix=" + encodeURIComponent(this.namePrefix);
        }

        if (this.minPopulation) {
          operation += "&minPopulation=" + this.minPopulation;
        }

        if (this.location) {
          operation += "&location=" + encodeURIComponent(this.nearLocation);
        }

        if (this.locationRadius) {
          operation += "&locationRadius=" + this.nearLocationRadius;
        }

        return operation;
      }
    },
    created: function () {
      this.refreshPageData(0);
    },
    methods: {
      onRequestUpdated() {
        this.currentRequest = {
          namePrefix: this.namePrefix,
          minPopulation: this.minPopulation,
          location: this.location,
          locationRadius: this.locationRadius
        };
      },
      refreshPageData(page) {
        var self = this;

        geoApi.findCitiesUsingGET({
          'namePrefix': this.currentRequest.namePrefix,
          'minPopulation': this.currentRequest.minPopulation,
          'location': this.currentRequest.location,
          'locationRadius': this.currentRequest.locationRadius,
          'limit': this.pageSize,
          'offset': this.offset
        }).then(
          function(data) {
            var citiesResponse = Config.GEO_DB.CitiesResponse.constructFromObject(data);

            var _data = new Array();

            for (var city of citiesResponse.data) {
              var location = city.latitude;

              if (city.longitude >= 0) {
                location += "+";
              }

              location += "" + city.longitude;

              _data.push({city: city.city, country: city.country, location: location });
            }

            self.count = citiesResponse.metadata.totalCount;
            self.currentPageData = _data;
          },

          function(error) {
            console.error(error);
          }
        );
      }
    }
  }
</script>
