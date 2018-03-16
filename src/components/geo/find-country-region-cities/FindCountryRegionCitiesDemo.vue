<template>
  <div id="find-country-region-cities-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>Country</label>
          <country-autocomplete @onCountrySelected="onCountrySelected($event)"/>
        </div>
        <div v-if="countryCode" class="form-field">
          <label>Region</label>
          <region-autocomplete :countryCode="countryCode" @onRegionSelected="onRegionSelected($event)"/>
        </div>
        <div v-if="regionCode" class="form-field">
          <label>Min Population</label><br/><input v-model="minPopulation" placeholder="Minimum population"/>
        </div>
      </div>
      <sort-by
        :options="sortByOptions"
        @sortChanged="onSortChanged"/>
      <div v-if="regionCode" class="form-button">
        <button @click="onRequestUpdated">Update Results</button>
      </div>
    </div>

    <data-table v-if="regionCode"
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
  import CountryAutocomplete from "../../../shared/components/CountryAutocomplete";
  import DataTable from '../../../shared/components/DataTable';
  import RegionAutocomplete from "../../../shared/components/RegionAutocomplete";
  import SortBy from '../../../shared/components/SortBy';

  import Config from "../../../shared/scripts/config";
  import PageableMixin from '../../../shared/scripts/pageable-mixin';

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'find-country-region-cities-demo',
    mixins: [PageableMixin],
    components: {
      CountryAutocomplete,
      DataTable,
      RegionAutocomplete,
      SortBy
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/countries',
        columns: ['city', 'location'],

        sortByOptions: [
          {value: 'name', title: 'By City Name, A-Z'},
          {value: '-name', title: 'By City Name, Z-A'},
          {value: 'elevation', title: 'By Elevation, low-high'},
          {value: '-elevation', title: 'By Elevation, high-low'},
          {value: 'population', title: 'By Population, low-high'},
          {value: '-population', title: 'By Population, high-low'}
        ],

        currentRequest: {},

        countryCode: null,
        regionCode: null,
        minPopulation: null,
        sort: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.countryCode
          ? this.baseEndpointOperation + "/" + this.countryCode
          : this.baseEndpointOperation + "/{countryCode}";

        operation += this.regionDetails
          ? "/regions/" + this.regionDetails.isoCode + "/cities"
          : "/regions/{regionCode}/cities";

        operation += "?limit=" + this.pageSize + "&offset=" + this.offset;

        if (this.minPopulation) {
          operation += "&minPopulation=" + this.minPopulation;
        }

        if (this.sort) {
          operation += "&sort=" + this.sort;
        }

        return operation;
      }
    },
    methods: {
      onCountrySelected(country) {
        this.countryCode = country.code;

        this.onRequestUpdated();
      },
      onRegionSelected(region) {
        this.regionCode = region.code;

        this.onRequestUpdated();
      },
      onRequestUpdated() {
        this.currentRequest = {
          countryCode : this.countryCode,
          regionCode: this.regionCode,
          minPopulation: this.minPopulation,
          sort: this.sort
        };
      },
      onSortChanged(sort) {
        this.sort = sort;
      },
      refreshPageData(page) {
        if (!this.regionCode) {
          return;
        }

        var self = this;

        console.log("region: " + this.regionCode);

        geoApi.findRegionCitiesUsingGET(this.countryCode, this.regionCode, {
          'minPopulation': this.currentRequest.minPopulation,
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

              _data.push({city: city.city, location: location});
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
