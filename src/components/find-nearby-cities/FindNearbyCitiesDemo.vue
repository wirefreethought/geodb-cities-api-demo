<template>
  <div id="find-nearby-cities-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>Origin City</label><br/>
          <city-autocomplete @onCitySelected="onCitySelected($event)"/>
        </div>
        <div class="form-field">
          <label>Min Population</label><br/><input v-model="minPopulation" placeholder="Minimum population"/>
        </div>
        <div class="form-field">
          <label>Within Radius</label><br/><input v-model="nearLocationRadius" placeholder="Radius in miles"/>
        </div>
      </div>
      <div v-if="originCityId" class="form-button">
        <button @click="onRequestUpdated">Update Results</button>
      </div>
    </div>

    <data-table v-if="originCityId"
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
  @import "../../shared/styles/component.css";
</style>

<script>
  import DataTable from '../../shared/components/DataTable';
  import CityAutocomplete from "../../shared/components/CityAutocomplete";

  import Config from "../../shared/scripts/config";
  import PageableMixin from '../../shared/scripts/pageable-mixin';

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'find-nearby-cities-demo',
    mixins: [PageableMixin],
    components: {
      CityAutocomplete,
      DataTable
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/cities',
        columns: ['distance', 'city', 'country', 'location'],

        currentRequest: {nearLocationRadius: 100},

        originCityId: null,
        minPopulation: null,
        nearLocationRadius: 100
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.originCityId
          ? this.baseEndpointOperation + "/" + this.originCityId + "/nearbyCities"
          : this.baseEndpointOperation + "/{cityId}/nearbyCities";

        operation += "?limit=" + this.pageSize + "&offset=" + this.offset;

        if (this.minPopulation) {
          operation += "&minPopulation=" + this.minPopulation;
        }

        if (this.nearLocationRadius) {
          operation += "&nearLocationRadius=" + this.nearLocationRadius;
        }

        return operation;
      }
    },
    methods: {
      onCitySelected(city) {
        this.originCityId = city.id;

        this.onRequestUpdated();
      },
      onRequestUpdated() {
        this.currentRequest = {
          cityId: this.originCityId,
          minPopulation: this.minPopulation,
          nearLocationRadius: this.nearLocationRadius
        };
      },
      refreshPageData(page) {
        var self = this;

        geoApi.findNearbyCitiesUsingGET(this.currentRequest.cityId, {
          'minPopulation': this.currentRequest.minPopulation,
          'nearLocationRadius': this.currentRequest.nearLocationRadius,
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
