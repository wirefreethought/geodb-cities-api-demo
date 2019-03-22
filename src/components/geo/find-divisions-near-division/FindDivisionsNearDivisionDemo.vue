<template>
  <div id="find-divisions-near-division-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>Origin Division</label><br/>
          <admin-division-autocomplete @onDivisionSelected="onDivisionSelected($event)"/>
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

      <div v-if="originDivisionId" class="form-button">
        <button @click="onRequestUpdated">Update Results</button>
      </div>
    </div>

    <data-table v-if="originDivisionId"
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
  import AdminDivisionAutocomplete from "../../../shared/components/AdminDivisionAutocomplete";
  import DataTable from '../../../shared/components/DataTable';
  import Language from '../../../shared/components/Language';
  import SortBy from '../../../shared/components/SortBy';

  import Config from "../../../shared/scripts/config";
  import PageableMixin from '../../../shared/scripts/pageable-mixin';

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'find-divisions-near-division-demo',
    mixins: [PageableMixin],
    components: {
      AdminDivisionAutocomplete,
      DataTable,
      Language,
      SortBy
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/adminDivisions',
        columns: ['distance', 'name', 'country', 'location'],

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

        originDivisionId: null,
        minPopulation: null,
        radius: 100,

        sort: null,
        languageCode: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.originDivisionId
          ? this.baseEndpointOperation + "/" + this.originDivisionId + "/nearbyDivisions"
          : this.baseEndpointOperation + "/{divisionId}/nearbyDivisions";

        operation += "?limit=" + this.pageSize + "&offset=" + this.offset;

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
      onLanguageChanged(value) {
        this.languageCode = value;
      },
      onDivisionSelected(division) {
        this.originDivisionId = division.id;

        this.onRequestUpdated();
      },
      onRequestUpdated() {
        this.currentRequest = {
          divisionId: this.originDivisionId,
          minPopulation: this.minPopulation,
          radius: this.radius,
        };
      },
      onSortChanged(value) {
        this.sort = value;
      },
      refreshPageData(page) {
        if (!this.currentRequest.divisionId) {
          return;
        }

        var self = this;

        geoApi.findDivisionsNearAdminDivisionUsingGET(this.currentRequest.divisionId, {
          'minPopulation': this.currentRequest.minPopulation,
          'radius': this.currentRequest.radius,
          'languageCode': this.languageCode,
          'sort': this.sort,
          'limit': this.pageSize,
          'offset': this.offset,
          'hateoasMode': false
        }).then(
          function (data) {
            var divisionsResponse = Config.GEO_DB.PopulatedPlacesResponse.constructFromObject(data);

            var _data = new Array();

            for (var division of divisionsResponse.data) {
              var location = division.latitude;

              if (division.longitude >= 0) {
                location += "+";
              }

              location += "" + division.longitude;

              _data.push({distance: division.distance, name: division.name, country: division.country, location: location});
            }

            self.count = divisionsResponse.metadata.totalCount;
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
