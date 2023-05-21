<template>
  <div id="get-currencies">
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
  </div>
</template>

<style scoped>
  @import "../../shared/styles/component.css";
</style>

<script>
import DataTable from '@/shared/components/DataTable'

import Config from '@/shared/scripts/config'
import PageableMixin from '@/shared/scripts/pageable-mixin'

const localeApi = new Config.GEO_DB.LocaleApi()

export default {
  name: 'get-currencies',
  mixins: [PageableMixin],
  components: {
    DataTable
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/locale/currencies',
      columns: ['code', 'symbol', 'countries']
    }
  },
  computed: {
    endpointOperation () {
      return `${this.baseEndpointOperation}?limit=${this.pageSize}&offset=${this.offset}`
    }
  },
  created: function () {
    this.refreshPageData(0)
  },
  methods: {
    refreshPageData () {
      const self = this

      localeApi.getCurrenciesUsingGET('', {
        limit: this.pageSize,
        offset: this.offset,
        hateoasMode: false
      })
        .then(
          function (data) {
            const response = Config.GEO_DB.CurrenciesResponse.constructFromObject(data)

            const _data = []

            for (const currency of response.data) {
              _data.push({ code: currency.code, symbol: currency.symbol, countries: currency.countryCodes.join(', ') })
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
