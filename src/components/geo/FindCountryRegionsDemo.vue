<template>
  <div id="find-country-regions">
    <div style="display:flex; flex-direction:column; justify-content:start">
      <pre class="endpoint_operation">{{ endpointOperation }}</pre>
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
    <div style="display:flex; flex-direction:column; justify-content:start">
      <div style="display:flex; flex-direction:row; justify-content:start">
        <div class="form_element_container">
          <label>Country</label>
          <country-autocomplete @onCountrySelected="onCountrySelected($event)"/>
        </div>
        <div class="form_element_container">
          <label>Name Prefix</label><br/>
          <input v-model="namePrefix" placeholder="Region name prefix" class="form_field" style="width:150px"/>
        </div>
      </div>

      <div style="display:flex; flex-flow:row; justify-content:start">
        <sort-by :options="sortByOptions" :multiLevel="false" @sortChanged="onSortChanged"/>
        <language @languageChanged="onLanguageChanged"/>
      </div>

      <div v-if="country" class="form_element_container">
        <button @click="onRequestUpdated" class="form_button">Update Results</button>
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
import SortBy from "@/shared/components/SortBy.vue";

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'find-country-regions',
  mixins: [PageableMixin],
  components: {
    CountryAutocomplete,
    DataTable,
    Language,
    SortBy
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/countries',
      columns: ['name', 'fips', 'iso'],

      sortByOptions: [
        { value: 'name', title: 'Name, A-Z' },
        { value: '-name', title: 'Name, Z-A' },
        { value: 'fipsCode', title: 'FIPS, A-Z' },
        { value: '-fipsCode', title: 'FIPS, Z-A' },
        { value: 'isoCode', title: 'ISO, A-Z' },
        { value: '-isoCode', title: 'ISO, Z-A' }
      ],

      currentRequest: {},

      country: null,
      namePrefix: null,

      sort: null,
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

      if (this.sort) {
        operation += '&sort=' + this.sort
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
    onSortChanged (value) {
      this.sort = value
    },
    refreshPageData () {
      if (!this.country) {
        return
      }

      const self = this

      geoApi.getRegionsUsingGET(this.currentRequest.countryId, {
        namePrefix: this.currentRequest.namePrefix,
        languageCode: this.languageCode,
        sort: this.sort,
        limit: this.pageSize,
        offset: this.offset,
        hateoasMode: false
      })
        .then(
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
