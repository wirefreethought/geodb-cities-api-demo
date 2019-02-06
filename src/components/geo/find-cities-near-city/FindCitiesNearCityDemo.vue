<template>
  <div id="find-cities-near-city-demo">
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
          <label>Within Radius</label><br/><input v-model="radius" placeholder="Radius in miles"/>
        </div>
      </div>

      <div style="display:flex; flex-flow:row">
        <sort-by :options="sortByOptions" @sortChanged="onSortChanged"/>

        <language @languageChanged="onLanguageChanged"/>
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
  @import "../../../shared/styles/component.css";
</style>

<script>
  import DataTable from '../../../shared/components/DataTable';
  import CityAutocomplete from "../../../shared/components/CityAutocomplete";
  import Language from '../../../shared/components/Language';
  import SortBy from '../../../shared/components/SortBy';

  import Config from "../../../shared/scripts/config";
  import PageableMixin from '../../../shared/scripts/pageable-mixin';

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'find-cities-near-city-demo',
    mixins: [PageableMixin],
    components: {
      CityAutocomplete,
      DataTable,
      Language,
      SortBy
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/cities',
        columns: ['distance', 'city', 'country', 'location'],

        sortByOptions: [
          {value: 'name', title: 'City Name, A-Z'},
          {value: '-name', title: 'City Name, Z-A'},
          {value: 'countryId', title: 'Country Code, A-Z'},
          {value: '-countryId', title: 'Country Code, Z-A'},
          {value: 'elevation', title: 'Elevation, LO-HI'},
          {value: '-elevation', title: 'Elevation, HI-LO'},
          {value: 'population', title: 'Population, LO-HI'},
          {value: '-population', title: 'Population, HI-LO'}
        ],

        currentRequest: {radius: 100},

        originCityId: null,
        minPopulation: null,
        radius: 100,

        sort: null,
        languageCode: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.originCityId
          ? this.baseEndpointOperation + "/" + this.originCityId + "/nearbyCities"
          : this.baseEndpointOperation + "/{cityId}/nearbyCities";

        operation += "?limit=" + this.pageSize + "&offset=" + this.offset + "&types=CITY";

        if (this.minPopulation) {
          operation += "&minPopulation=" + this.minPopulation;
        }

        if (this.radius) {
          operation += "&radius=" + this.radius;
        }

        if (this.languageCode) {
          operation +="&languageCode=" + this.languageCode;
        }

        if (this.sort) {
          operation += "&sort=" + this.sort;
        }

        return operation;
      }
    },
    methods: {
      onCitySelected(city) {
        this.originCityId = city.id;

        this.onRequestUpdated();
      },
      onLanguageChanged(value) {
        this.languageCode = value;
      },
      onRequestUpdated() {
        this.currentRequest = {
          cityId: this.originCityId,
          minPopulation: this.minPopulation,
          radius: this.radius,
        };
      },
      onSortChanged(value) {
        this.sort = value;
      },
      refreshPageData(page) {
        if (!this.currentRequest.cityId) {
          return;
        }

        var self = this;

        geoApi.findCitiesNearCityUsingGET(this.currentRequest.cityId, {
          'minPopulation': this.currentRequest.minPopulation,
          'types': 'CITY',
          'radius': this.currentRequest.radius,
          'languageCode': this.languageCode,
          'sort': this.sort,
          'limit': this.pageSize,
          'offset': this.offset,
          'hateoasMode': false
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
