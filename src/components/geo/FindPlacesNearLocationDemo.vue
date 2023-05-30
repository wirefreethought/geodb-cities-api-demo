<template>
  <div id="find-places-near-location-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
      <pre class="endpoint_operation">{{ endpointOperation }}</pre>
    </div>
    <data-table v-if="count > 0"
      :data="currentPageData"
      :columns="columns"
      :count="count"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @pageChanged="onPageChanged">
    </data-table>
    <div style="display:flex; flex-direction:column; justify-content:start">
      <div style="display:flex; flex-flow:row; justify-content:start">
        <div class="form_element_container">
          <label>Location</label><br/>
          <input v-model="locationId" placeholder="Lat/Long: ±DD.DDDD±DDD.DDDD" class="form_field" style="width:150px"/>
        </div>
        <place-type @placeTypeChanged="onPlaceTypeChanged"/>
        <div class="form_element_container">
          <label>Min Population</label><br/>
          <input v-model="minPopulation" placeholder="Minimum population" class="form_field"/>
        </div>
        <div class="form_element_container">
          <label>Radius</label><br/>
          <input v-model="radius" placeholder="<= 100 MI (demo)" class="form_field" style="width:125px"/>
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
import SortBy from '@/shared/components/SortBy'

import Config from '@/shared/scripts/config'
import PageableMixin from '@/shared/scripts/pageable-mixin'
import PlaceType from "@/shared/components/PlaceType.vue";

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'find-places-near-location-demo',
  mixins: [PageableMixin],
  components: {
    DataTable,
    Language,
    PlaceType,
    SortBy
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/locations',
      columns: ['distance', 'name', 'population', 'location', 'country'],

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

      locationId: null,
      type: null,
      minPopulation: null,
      radius: 100,

      sort: null,
      languageCode: null
    }
  },
  computed: {
    endpointOperation () {
      var operation = this.locationId
        ? this.baseEndpointOperation + '/' + this.locationId + '/nearbyPlaces'
        : this.baseEndpointOperation + '/{locationId}/nearbyPlaces'

      operation += '?limit=' + this.pageSize + '&offset=' + this.offset

      if (this.type) {
        operation += '&types=' + this.type
      }

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
    onPlaceTypeChanged (type) {
      this.type = type
    },
    onRequestUpdated () {
      if (this.radius > 100) {
        this.radius = 100
      }

      this.currentRequest = {
        locationId: this.locationId,
        type: this.type,
        minPopulation: this.minPopulation,
        radius: this.radius
      }
    },
    onSortChanged (value) {
      this.sort = value
    },
    refreshPageData () {
      if (!this.currentRequest.locationId) {
        return
      }

      const self = this

      geoApi.findPlacesNearLocationUsingGET(
        this.currentRequest.locationId,
        {
          types: this.currentRequest.type,
          minPopulation: this.currentRequest.minPopulation,
          radius: this.currentRequest.radius,
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

              _data.push({ distance: place.distance, name: place.name, population: place.population, location: location, country: place.country })
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
