<template>
  <div id="find-country-places-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
    </div>
    <data-table v-if="country"
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
        <place-type @placeTypeChanged="onPlaceTypeChanged"/>
      </div>
      <div style="display:flex; flex-flow:row">
        <sort-by :options="sortByOptions" @sortChanged="onSortChanged"/>
        <language @languageChanged="onLanguageChanged"/>
      </div>

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
import PlaceType from "@/shared/components/PlaceType.vue";
import SortBy from '@/shared/components/SortBy'

import Config from '@/shared/scripts/config'
import PageableMixin from '@/shared/scripts/pageable-mixin'

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'find-country-places-demo',
  mixins: [PageableMixin],
  components: {
    CountryAutocomplete,
    DataTable,
    Language,
    PlaceType,
    SortBy
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/countries',
      columns: ['name', 'population', 'location'],

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
      minPopulation: null,
      type: null,

      sort: null,
      languageCode: null
    }
  },
  computed: {
    endpointOperation () {
      var operation = this.country
        ? this.baseEndpointOperation + '/' + this.country.code
        : this.baseEndpointOperation + '/{countryId}'

      operation += '/places'

      operation += '?limit=' + this.pageSize + '&offset=' + this.offset

      if (this.type) {
        operation += '&types=' + this.type
      }

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

      this.onRequestUpdated()
    },
    onLanguageChanged (value) {
      this.languageCode = value
    },
    onPlaceTypeChanged (type) {
      this.type = type
    },
    onRequestUpdated () {
      this.currentRequest = {
        countryId: this.country.code,
        minPopulation: this.minPopulation,
        sort: this.sort,
        type: this.type
      }
    },
    onSortChanged (sort) {
      this.sort = sort
    },
    refreshPageData () {
      if (!this.country) {
        return
      }

      const self = this

      geoApi.findCountryPlacesUsingGET(
        this.country.code,
        {
          types: this.type,
          minPopulation: this.currentRequest.minPopulation,
          languageCode: this.languageCode,
          sort: this.sort,
          limit: this.pageSize,
          offset: this.offset,
          hateoasMode: false
        }
        ).then(
          function (data) {
            const placesResponse = Config.GEO_DB.PopulatedPlacesResponse.constructFromObject(data)

            const _data = []

            for (const place of placesResponse.data) {
              var location = place.latitude

              if (place.longitude >= 0) {
                location += '+'
              }

              location += '' + place.longitude

              _data.push({ name: place.name, population: place.population, location: location })
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
