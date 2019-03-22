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
          <label>Within Radius</label><br/><input v-model="radius" placeholder="Radius in miles"/>
        </div>
      </div>

      <div style="display:flex; flex-flow:row">
        <sort-by :options="sortByOptions" @sortChanged="onSortChanged"/>

        <language @languageChanged="onLanguageChanged"/>
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
  import Language from '../../../shared/components/Language';
  import SortBy from '../../../shared/components/SortBy';

  import Config from "../../../shared/scripts/config";
  import PageableMixin from '../../../shared/scripts/pageable-mixin';

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'find-cities-demo',
    mixins: [PageableMixin],
    components: {
      DataTable,
      Language,
      SortBy
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/cities',
        columns: ['name', 'country', 'location'],

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

        currentRequest: {},

        namePrefix: null,
        minPopulation: null,
        location: null,
        radius: null,

        sort: null,
        languageCode: null
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
          operation += "&location=" + encodeURIComponent(this.location);
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
    created: function () {
      this.refreshPageData(0);
    },
    methods: {
      onLanguageChanged(value) {
        this.languageCode = value;
      },
      onRequestUpdated() {
        this.currentRequest = {
          namePrefix: this.namePrefix,
          minPopulation: this.minPopulation,
          location: this.location,
          radius: this.radius
        };
      },
      onSortChanged(value) {
        this.sort = value;
      },
      refreshPageData(page) {
        var self = this;

        geoApi.findCitiesUsingGET({
          'namePrefix': this.currentRequest.namePrefix,
          'minPopulation': this.currentRequest.minPopulation,
          'location': this.currentRequest.location,
          'radius': this.currentRequest.radius,
          'languageCode': this.languageCode,
          'sort': this.sort,
          'limit': this.pageSize,
          'offset': this.offset,
          'hateoasMode': false
        }).then(
          function(data) {
            var placesResponse = Config.GEO_DB.PopulatedPlacesResponse.constructFromObject(data);

            var _data = new Array();

            for (var place of placesResponse.data) {
              var location = place.latitude;

              if (place.longitude >= 0) {
                location += "+";
              }

              location += "" + place.longitude;

              _data.push({name: place.name, country: place.country, location: location });
            }

            self.count = placesResponse.metadata.totalCount;
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
