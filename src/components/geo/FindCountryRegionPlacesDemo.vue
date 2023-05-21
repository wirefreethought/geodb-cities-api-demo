<template>
  <div id="find-country-region-cities-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
    </div>
    <data-table v-if="regionCode"
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
          <label>Country</label>
          <country-autocomplete @onCountrySelected="onCountrySelected($event)"/>
        </div>
        <div v-if="country" class="form-field">
          <label>Region</label>
          <region-autocomplete :countryId="country.code" @onRegionSelected="onRegionSelected($event)"/>
        </div>
        <div v-if="regionCode" class="form-field">
          <label>Min Population</label><br/><input v-model="minPopulation" placeholder="Minimum population"/>
        </div>
      </div>

      <div style="display:flex; flex-flow:row">
        <sort-by :options="sortByOptions" @sortChanged="onSortChanged"/>

        <language @languageChanged="onLanguageChanged"/>
      </div>

      <div v-if="regionCode" class="form-button">
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
import RegionAutocomplete from '@/shared/components/RegionAutocomplete'
import SortBy from '@/shared/components/SortBy'

import Config from '@/shared/scripts/config'
import PageableMixin from '@/shared/scripts/pageable-mixin'

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'find-country-region-cities-demo',
  mixins: [PageableMixin],
  components: {
    CountryAutocomplete,
    DataTable,
    Language,
    RegionAutocomplete,
    SortBy
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/countries',
      columns: ['name', 'location'],

      sortByOptions: [
        { value: 'name', title: 'Name, A-Z' },
        { value: '-name', title: 'Name, Z-A' },
        { value: 'elevation', title: 'Elevation, LO-HI' },
        { value: '-elevation', title: 'Elevation, HI-LO' },
        { value: 'population', title: 'Population, LO-HI' },
        { value: '-population', title: 'Population, HI-LO' }
      ],

      currentRequest: {},

      country: null,
      regionCode: null,
      minPopulation: null,

      sort: null,
      languageCode: null
    }
  },
  computed: {
    endpointOperation () {
      var operation = this.country
        ? this.baseEndpointOperation + '/' + this.country.code
        : this.baseEndpointOperation + '/{countryId}'

      operation += this.regionCode
        ? '/regions/' + this.regionCode + '/cities'
        : '/regions/{regionCode}/cities'

      operation += '?limit=' + this.pageSize + '&offset=' + this.offset

      if (this.minPopulation) {
        operation += '&minPopulation=' + this.minPopulation
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
    onCountrySelected (country) {
      this.country = country
      this.regionCode = null

      this.onRequestUpdated()
    },
    onLanguageChanged (value) {
      this.languageCode = value
    },
    onRegionSelected (region) {
      this.regionCode = region.code

      this.onRequestUpdated()
    },
    onRequestUpdated () {
      this.currentRequest = {
        countryId: this.country.code,
        regionCode: this.regionCode,
        minPopulation: this.minPopulation,
        sort: this.sort
      }
    },
    onSortChanged (sort) {
      this.sort = sort
    },
    refreshPageData () {
      if (!this.country || !this.regionCode) {
        return
      }

      const self = this

      geoApi.findRegionCitiesUsingGET(this.country.code, this.regionCode, {
        minPopulation: this.currentRequest.minPopulation,
        languageCode: this.languageCode,
        sort: this.sort,
        limit: this.pageSize,
        offset: this.offset,
        hateoasMode: false
      })
        .then(
          function (data) {
            const placesResponse = Config.GEO_DB.PopulatedPlacesResponse.constructFromObject(data)

            const _data = []

            for (const place of placesResponse.data) {
              var location = place.latitude

              if (place.longitude >= 0) {
                location += '+'
              }

              location += '' + place.longitude

              _data.push({ name: place.name, location: location })
            }

            self.count = placesResponse.metadata.totalCount
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
