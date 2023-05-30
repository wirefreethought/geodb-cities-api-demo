<template>
  <div id="find-countries-demo">
    <div style="display:flex; flex-direction:column; justify-content:start">
      <pre class="endpoint_operation">{{ endpointOperation }}</pre>
    </div>
    <data-table
      :data="currentPageData"
      :columns="columns"
      :count="count"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @pageChanged="onPageChanged">
    </data-table>
    <div style="display:flex; flex-direction:column; justify-content:start">
      <div style="display:flex; flex-direction:row; justify-content:start">
        <div class="form_element_container">
          <label>Name Prefix</label><br/>
          <input v-model="namePrefix" placeholder="First letters of the country name" class="form_field" style="width:125px"/>
        </div>
      </div>

      <div style="display:flex; flex-flow:row; justify-content:start">
        <sort-by :options="sortByOptions" @sortChanged="onSortChanged"/>
        <language @languageChanged="onLanguageChanged"/>
      </div>

      <div class="form_element_container">
        <button @click="onRequestUpdated" class="form_button">Update Results</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "../../shared/styles/component.css";
</style>

<script>
import DataTable from '@/shared/components/DataTable'
import Language from '@/shared/components/Language'

import Config from '@/shared/scripts/config'
import PageableMixin from '@/shared/scripts/pageable-mixin'
import SortBy from "@/shared/components/SortBy.vue";

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'find-countries-demo',
  mixins: [PageableMixin],
  components: {
    DataTable,
    Language,
    SortBy
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/countries',
      columns: ['name', 'code', 'currencies'],

      sortByOptions: [
        { value: 'name', title: 'Name, A-Z' },
        { value: '-name', title: 'Name, Z-A' },
        { value: 'code', title: 'Country Code, A-Z' },
        { value: '-code', title: 'Country Code, Z-A' }
      ],

      currentRequest: {},

      namePrefix: null,

      sort: null,
      languageCode: null
    }
  },
  computed: {
    endpointOperation () {
      var operation = this.baseEndpointOperation + '?limit=' + this.pageSize + '&offset=' + this.offset

      if (this.namePrefix) {
        operation += '&namePrefix=' + encodeURIComponent(this.namePrefix)
      }

      if (this.languageCode) {
        operation += '&languageCode=' + this.languageCode
      }

      if (this.sort) {
        operation += '&sort=' + this.sort
      }

      return operation
    }
  },
  created: function () {
    this.refreshPageData(0)
  },
  methods: {
    onLanguageChanged (value) {
      this.languageCode = value
    },
    onRequestUpdated () {
      this.currentRequest = {
        namePrefix: this.namePrefix
      }
    },
    onSortChanged (value) {
      this.sort = value
    },
    refreshPageData () {
      const self = this

      geoApi.getCountriesUsingGET({
        namePrefix: this.currentRequest.namePrefix,
        currencyCode: this.currentRequest.currencyCode,
        languageCode: this.languageCode,
        sort: this.sort,
        limit: this.pageSize,
        offset: this.offset,
        hateoasMode: false
      })
        .then(
          function (data) {
            const response = Config.GEO_DB.CountriesResponse.constructFromObject(data)

            const _data = []

            for (const country of response.data) {
              _data.push({ name: country.name, code: country.code, currencies: country.currencyCodes })
            }

            self.count = response.metadata.totalCount
            self.currentPageData = _data
          },

          function (error) {
            console.error(error)
          }
        )
    }
  }
}
</script>
