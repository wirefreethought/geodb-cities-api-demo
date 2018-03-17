<template>
  <div id="find-cities-near-location-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>Location</label><br/>
          <input v-model="locationId" placeholder="GPS location (in ISO-6709 format: ±DD.DDDD±DDD.DDDD)"/>
        </div>
        <div class="form-field">
          <label>Min Population</label><br/><input v-model="minPopulation" placeholder="Minimum population"/>
        </div>
        <div class="form-field">
          <label>Within Radius</label><br/><input v-model="radius" placeholder="Radius in miles"/>
        </div>
      </div>
      <sort-by
        :options="sortByOptions"
        @sortChanged="onSortChanged"/>
      <div class="form-button">
        <button @click="onRequestUpdated" class="input.form_field_submit_button">Update Results</button>
      </div>
    </div>

    <data-table v-if="count > 0"
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
  import SortBy from '../../../shared/components/SortBy';

  import Config from "../../../shared/scripts/config";
  import PageableMixin from '../../../shared/scripts/pageable-mixin';

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'find-cities-near-location-demo',
    mixins: [PageableMixin],
    components: {
      DataTable,
      SortBy
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/locations',
        columns: ['distance', 'city', 'country', 'location'],

        sortByOptions: [
          {value: 'name', title: 'City Name, A-Z'},
          {value: '-name', title: 'City Name, Z-A'},
          {value: 'countryCode', title: 'Country Code, A-Z'},
          {value: '-countryCode', title: 'Country Code, Z-A'},
          {value: 'elevation', title: 'Elevation, LO-HI'},
          {value: '-elevation', title: 'Elevation, HI-LO'},
          {value: 'population', title: 'Population, LO-HI'},
          {value: '-population', title: 'Population, HI-LO'}
        ],

        currentRequest: {radius: 100},

        locationId: null,
        minPopulation: null,
        radius: 100,
        sort: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.locationId
          ? this.baseEndpointOperation + "/" + this.locationId + "/nearbyCities"
          : this.baseEndpointOperation + "/{locationId}/nearbyCities";

        operation += "?limit=" + this.pageSize + "&offset=" + this.offset;

        if (this.minPopulation) {
          operation += "&minPopulation=" + this.minPopulation;
        }

        if (this.radius) {
          operation += "&radius=" + this.radius;
        }

        if (this.sort) {
          operation += "&sort=" + this.sort;
        }

        return operation;
      }
    },
    methods: {
      onRequestUpdated() {
        this.currentRequest = {
          locationId: this.locationId,
          minPopulation: this.minPopulation,
          radius: this.radius
        };
      },
      onSortChanged(sort) {
        this.sort = sort;
      },
      refreshPageData(page) {
        if (!this.currentRequest.locationId) {
          return;
        }

        var self = this;

        geoApi.findCitiesNearLocationUsingGET(this.currentRequest.locationId, {
          'minPopulation': this.currentRequest.minPopulation,
          'radius': this.currentRequest.radius,
          'sort': this.sort,
          'limit': this.pageSize,
          'offset': this.offset
        }).then(
          function (data) {
            var citiesResponse = Config.GEO_DB.CitiesResponse.constructFromObject(data);

            var _data = new Array();

            for (var city of citiesResponse.data) {
              var location = city.latitude;

              if (city.longitude >= 0) {
                location += "+";
              }

              location += "" + city.longitude;

              _data.push({distance: city.distance, city: city.city, country: city.country, location: location});
            }

            self.count = citiesResponse.metadata.totalCount;
            self.currentPageData = _data;
          },

          function (error) {
            console.error(error);
          }
        );
      }
    }
  }
</script>
