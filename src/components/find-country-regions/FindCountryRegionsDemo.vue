<template>
  <div id="find-country-regions">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>Country</label>
          <country-autocomplete @onCountrySelected="onCountrySelected($event)"/>
        </div>
        <div class="form-field">
          <label>Name Prefix</label><br/><input v-model="namePrefix" placeholder="First letters of the region name" style="width:150px"/>
        </div>
      </div>
      <div v-if="countryCode" class="form-button">
        <button @click="onRequestUpdated">Update Results</button>
      </div>
    </div>

    <div v-if="countryCode">
      <data-table
        :data="currentPageData"
        :columns="columns"
        :count="count"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @pageChanged="onPageChanged">
      </data-table>
    </div>
  </div>
</template>

<style scoped>
  @import "../../shared/styles/component.css";
</style>

<script>
  import CountryAutocomplete from '../../shared/components/CountryAutocomplete';
  import DataTable from '../../shared/components/DataTable';

  import Config from "../../shared/scripts/config";
  import PageableMixin from '../../shared/scripts/pageable-mixin';

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'find-country-regions',
    mixins: [PageableMixin],
    components: {
      CountryAutocomplete,
      DataTable
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/countries',
        columns: ['name', 'fips', 'hasc', 'iso'],

        currentRequest: {},

        countryCode: null,
        namePrefix: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.baseEndpointOperation + "?limit=" + this.pageSize + "&offset=" + this.offset;

        operation = this.countryCode
          ? operation += "/" + this.countryCode + "/regions"
          : operation += "/{countryCode}/regions";

        if (this.namePrefix) {
          operation += "?namePrefix=" + encodeURIComponent(this.namePrefix);
        }

        return operation;
      }
    },
    methods: {
      onCountrySelected(country) {
        this.countryCode = country.code;

        this.onRequestUpdated();
      },
      onRequestUpdated() {
        this.currentRequest = {
          namePrefix: this.namePrefix
        };
      },
      refreshPageData(page) {
        var self = this;

        geoApi.getRegionsUsingGET(this.countryCode, {
          'namePrefix': this.currentRequest.namePrefix,
          'limit': this.pageSize,
          'offset': this.offset
        }).then(
          function(data) {
            var response = Config.GEO_DB.RegionsResponse.constructFromObject(data);

            var _data = new Array();

            for (var region of response.data) {
              _data.push({'name': region.name, 'fips': region.fipsCode, 'hasc': region.hascCode, 'iso': region.isoCode});
            }

            self.count = response.metadata.totalCount;
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
