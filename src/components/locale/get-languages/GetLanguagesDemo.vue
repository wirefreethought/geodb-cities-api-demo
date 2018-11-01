<template>
  <div id="get-languages">
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
    name: 'get-languages',
    mixins: [PageableMixin],
    components: {
      DataTable
    },
    data() {
      return {
        baseEndpointOperation: 'GET /v1/locale/languages',
        columns: ['code', 'name'],
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

        localeApi.getLanguagesUsingGET({
          'limit': this.pageSize,
          'offset': this.offset,
          'hateoasMode': false
        }).then(
          function(data) {
            var response = Config.GEO_DB.LanguagesResponse.constructFromObject(data);

            var _data = new Array();

            for (var language of response.data) {
              _data.push({'code': language.code, 'name': language.name});
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
