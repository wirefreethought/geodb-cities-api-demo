<template>
  <div id="get-currencies">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
    </div>
    <br/>
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

  const localeApi = new Config.GEO_DB.LocaleApi();

  export default {
    name: 'get-currencies',
    mixins: [PageableMixin],
    components: {
      DataTable
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/locale/currencies',
        columns: ['code', 'countries'],
      }
    },
    computed: {
      endpointOperation() {
        var operation = this.baseEndpointOperation + "?limit=" + this.pageSize + "&offset=" + this.offset;

        return operation;
      }
    },
    created: function () {
      this.refreshPageData(0);
    },
    methods: {
      refreshPageData(page) {
        var self = this;

        localeApi.getCurrenciesUsingGET({
          'limit': this.pageSize,
          'offset': this.offset
        }).then(
          function(data) {
            var response = Config.GEO_DB.CurrenciesResponse.constructFromObject(data);

            var _data = new Array();

            for (var currency of response.data) {
              _data.push({'code': currency.code, 'countries': currency.countryCodes.join(", ")});
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
