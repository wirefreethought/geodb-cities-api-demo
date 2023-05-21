<template>
  <div id="find-countries-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
    </div>
    <data-table
      :data="currentPageData"
      :columns="columns"
      :count="count"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @pageChanged="onPageChanged">
    </data-table>
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>Name Prefix</label><br/><input v-model="namePrefix" placeholder="First letters of the country name" style="width:225px"/>
        </div>
      </div>

      <language @languageChanged="onLanguageChanged"/>

      <div class="form-button">
        <button @click="onRequestUpdated">Update Results</button>
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

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'find-countries-demo',
  mixins: [PageableMixin],
  components: {
    DataTable,
    Language
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/countries',
      columns: ['name', 'code', 'currencies'],

      currentRequest: {},

      namePrefix: null,

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
    refreshPageData () {
      const self = this

      geoApi.getCountriesUsingGET({
        namePrefix: this.currentRequest.namePrefix,
        currencyCode: this.currentRequest.currencyCode,
        languageCode: this.languageCode,
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
