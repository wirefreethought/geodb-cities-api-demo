<template>
  <div id="find-countries-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>Name Prefix</label><br/><input v-model="namePrefix" placeholder="First letters of the country name" style="width:150px"/>
        </div>
        <div class="form-field">
          <label>Currency Code</label><br/><input v-model="currencyCode" placeholder="Currency code"/>
        </div>
      </div>
      <div class="form-button">
        <button @click="onRequestUpdated">Update Results</button>
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
  @import "../../shared/styles/base.css";
</style>

<script>
  import DataTable from '../../shared/components/DataTable';

  import Config from "../../shared/scripts/config";
  import PageableMixin from '../../shared/scripts/pageable-mixin';

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'find-countries-demo',
    mixins: [PageableMixin],
    components: {
      DataTable
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/geo/countries',
        columns: ['name', 'code'],

        currentRequest: {},

        namePrefix: null,
        currencyCode: null
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.baseEndpointOperation + "?limit=" + this.pageSize + "&offset=" + this.offset;

        if (this.namePrefix) {
          operation += "&namePrefix=" + encodeURIComponent(this.namePrefix);
        }

        if (this.currencyCode) {
          operation += "&currencyCode=" + this.currencyCode;
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
          currencyCode: this.currencyCode
        };
      },
      refreshPageData(page) {
        var self = this;

        geoApi.getCountriesUsingGET({
          'namePrefix': this.currentRequest.namePrefix,
          'currencyCode': this.currentRequest.currencyCode,
          'limit': this.pageSize,
          'offset': this.offset
        }).then(
          function(data) {
            var response = Config.GEO_DB.CountriesResponse.constructFromObject(data);

            var _data = new Array();

            for (var country of response.data) {
              _data.push(country);
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
