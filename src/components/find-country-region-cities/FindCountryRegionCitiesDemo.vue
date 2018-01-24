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
  @import "../../shared/styles/component.css";
</style>

<script>
  import CountryAutocomplete from "../../shared/components/CountryAutocomplete";
  import DataTable from '../../shared/components/DataTable';
  import RegionAutocomplete from "../../shared/components/RegionAutocomplete";

  import Config from "../../shared/scripts/config";
  import PageableMixin from '../../shared/scripts/pageable-mixin';

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'find-country-region-cities-demo',
    mixins: [PageableMixin],
    components: {
      CountryAutocomplete,
      DataTable,
      RegionAutocomplete
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/countries',
        columns: ['city', 'location'],

        currentRequest: {},

        countryCode: null,
        regionCode: null,
        minPopulation: null
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
          minPopulation: this.minPopulation
        };
      },
      refreshPageData(page) {
        var self = this;

        geoApi.findRegionCitiesUsingGET(this.countryCode, this.regionCode, {
          'minPopulation': this.currentRequest.minPopulation,
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
