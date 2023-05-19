<template>
  <div id="find-country-regions">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
    </div>
    <div v-if="country">
      <data-table
        :data="currentPageData"
        :columns="columns"
        :count="count"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @pageChanged="onPageChanged">
      </data-table>
    </div>
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>Country</label>
          <country-autocomplete @onCountrySelected="onCountrySelected($event)"/>
        </div>
        <div class="form-field">
          <label>Name Prefix</label><br/><input v-model="namePrefix" placeholder="First letters of the region name" style="width:225px"/>
        </div>
      </div>

      <language @languageChanged="onLanguageChanged"/>

      <div v-if="country" class="form-button">
        <button @click="onRequestUpdated">Update Results</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "../../shared/styles/component.css";
</style>

<script>
import CountryAutocomplete from '@/shared/components/CountryAutocomplete'
import DataTable from '@/shared/components/DataTable'
import Language from '@/shared/components/Language'

import Config from '@/shared/scripts/config'
import PageableMixin from '@/shared/scripts/pageable-mixin'

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'find-country-regions',
  mixins: [PageableMixin],
  components: {
    CountryAutocomplete,
    DataTable,
    Language
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/countries',
      columns: ['name', 'fips', 'iso'],

      currentRequest: {},

      country: null,
      namePrefix: null,

      languageCode: null
    }
  },
  computed: {
    endpointOperation () {
      var operation = this.baseEndpointOperation

      operation = this.country
        ? operation += '/' + this.country.code + '/regions'
        : operation += '/{countryId}/regions'

      operation += '?limit=' + this.pageSize + '&offset=' + this.offset

      if (this.namePrefix) {
        operation += '&namePrefix=' + encodeURIComponent(this.namePrefix)
      }

      if (this.languageCode) {
        operation += '&languageCode=' + this.languageCode
      }

      return operation
    }
  },
  methods: {
    onLanguageChanged (value) {
      this.languageCode = value
    },
    onCountrySelected (country) {
      this.country = country

      this.onRequestUpdated()
    },
    onRequestUpdated () {
      this.currentRequest = {
        countryId: this.country.code,
        namePrefix: this.namePrefix
      }
    },
    refreshPageData () {
      if (!this.country) {
        return
      }

      const self = this

      geoApi.getRegionsUsingGET(this.currentRequest.countryId, {
        namePrefix: this.currentRequest.namePrefix,
        languageCode: this.languageCode,
        limit: this.pageSize,
        offset: this.offset,
        hateoasMode: false
      }).then(
        function (data) {
          const response = Config.GEO_DB.RegionsResponse.constructFromObject(data)

          const _data = []

          for (const region of response.data) {
            _data.push({ name: region.name, fips: region.fipsCode, iso: region.isoCode })
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
