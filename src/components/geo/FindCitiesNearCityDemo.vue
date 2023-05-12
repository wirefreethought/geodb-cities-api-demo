<template>
  <div id="find-cities-near-city-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint-operation">{{ endpointOperation }}</pre>
      <div style="display:flex; justify-content:flex-start">
        <div class="form-field">
          <label>Origin City</label><br/>
          <place-autocomplete @onPlaceSelected="onPlaceSelected($event)"/>
        </div>
        <div class="form-field">
          <label>Min Population</label><br/><input v-model="minPopulation" placeholder="Minimum population"/>
        </div>
        <div class="form-field">
          <label>Within Radius (&lt;=100)</label><br/><input v-model="radius" placeholder="Radius in miles"/>
        </div>
      </div>

      <div style="display:flex; flex-flow:row">
        <sort-by :options="sortByOptions" @sortChanged="onSortChanged"/>

        <language @languageChanged="onLanguageChanged"/>
      </div>

      <div v-if="originPlaceId" class="form-button">
        <button @click="onRequestUpdated">Update Results</button>
      </div>
    </div>

    <data-table v-if="originPlaceId"
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
import Language from '@/shared/components/Language'
import SortBy from '@/shared/components/SortBy'
import PlaceAutocomplete from '@/shared/components/PlaceAutocomplete'

import Config from '@/shared/scripts/config'
import PageableMixin from '@/shared/scripts/pageable-mixin'

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'find-cities-near-city-demo',
  mixins: [PageableMixin],
  components: {
    DataTable,
    Language,
    PlaceAutocomplete,
    SortBy
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/cities',
      columns: ['distance', 'name', 'country', 'location'],

      sortByOptions: [
        { value: 'name', title: 'Name, A-Z' },
        { value: '-name', title: 'Name, Z-A' },
        { value: 'countryId', title: 'Country Code, A-Z' },
        { value: '-countryId', title: 'Country Code, Z-A' },
        { value: 'elevation', title: 'Elevation, LO-HI' },
        { value: '-elevation', title: 'Elevation, HI-LO' },
        { value: 'population', title: 'Population, LO-HI' },
        { value: '-population', title: 'Population, HI-LO' }
      ],

      currentRequest: { radius: 100 },

      originPlaceId: null,
      minPopulation: null,
      radius: 100,

      sort: null,
      languageCode: null
    }
  },
  computed: {
    endpointOperation () {
      var operation = this.originPlaceId
        ? this.baseEndpointOperation + '/' + this.originPlaceId + '/nearbyCities'
        : this.baseEndpointOperation + '/{cityId}/nearbyCities'

      operation += '?limit=' + this.pageSize + '&offset=' + this.offset

      if (this.minPopulation) {
        operation += '&minPopulation=' + this.minPopulation
      }

      if (this.radius) {
        operation += '&radius=' + this.radius
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
    onPlaceSelected (place) {
      this.originPlaceId = place.id

      this.onRequestUpdated()
    },
    onRequestUpdated () {
      if (this.radius > 100) {
        this.radius = 100
      }

      this.currentRequest = {
        placeId: this.originPlaceId,
        minPopulation: this.minPopulation,
        radius: this.radius
      }
    },
    onSortChanged (value) {
      this.sort = value
    },
    refreshPageData (page) {
      if (!this.currentRequest.placeId) {
        return
      }

      const self = this

      geoApi.findCitiesNearCityUsingGET(this.currentRequest.placeId, {
        minPopulation: this.currentRequest.minPopulation,
        radius: this.currentRequest.radius,
        languageCode: this.languageCode,
        sort: this.sort,
        limit: this.pageSize,
        offset: this.offset,
        hateoasMode: false
      }).then(
        function (data) {
          const placesResponse = Config.GEO_DB.PopulatedPlacesResponse.constructFromObject(data)

          const _data = []

          for (const place of placesResponse.data) {
            var location = place.latitude

            if (place.longitude >= 0) {
              location += '+'
            }

            location += '' + place.longitude

            _data.push({ distance: place.distance, name: place.name, country: place.country, location: location })
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
