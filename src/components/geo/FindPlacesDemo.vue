<template>
  <div id="find-places-demo">
    <div style="display:flex; flex-direction:column; justify-content:flex-start">
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
      <div style="display:flex; justify-content:start">
        <div class="form_element_container">
          <label>Name Prefix</label><br/>
          <input v-model="namePrefix" placeholder="Place name prefix" class="form_field" style="width:125px"/>
        </div>
        <place-type @placeTypeChanged="onPlaceTypeChanged"/>
        <div class="form_element_container">
          <label>Min Population</label><br/>
          <input v-model="minPopulation" placeholder="Minimum population" class="form_field"/>
        </div>
        <div class="form_element_container">
          <label>Location</label><br/>
          <input v-model="location" placeholder="±DD.DDDD±DDD.DDDD" class="form_field" style="width:150px"/>
        </div>
        <div class="form_element_container">
          <label>Radius</label><br/>
          <input v-model="radius" placeholder="<= 100 MI (demo)" class="form_field" style="width:125px" />
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
  name: 'find-places-demo',
  mixins: [PageableMixin],
  components: {
    DataTable,
    Language,
    PlaceType,
    SortBy
  },
  data () {
    return {
      baseEndpointOperation: 'GET /v1/geo/places',
      columns: ['name', 'population', 'location', 'country'],

      sortByOptions: [
        { value: 'name', title: 'Name, A-Z' },
        { value: '-name', title: 'Name, Z-A' },
        { value: 'countryCode', title: 'Country Code, A-Z' },
        { value: '-countryCode', title: 'Country Code, Z-A' },
        { value: 'elevation', title: 'Elevation, LO-HI' },
        { value: '-elevation', title: 'Elevation, HI-LO' },
        { value: 'population', title: 'Population, LO-HI' },
        { value: '-population', title: 'Population, HI-LO' }
      ],

      currentRequest: {},

      type: null,
      namePrefix: null,
      minPopulation: null,
      location: null,
      radius: null,

      sort: null,
      languageCode: null
    }
  },
  computed: {
    endpointOperation () {
      var operation = this.baseEndpointOperation + '?limit=' + this.pageSize + '&offset=' + this.offset

      if (this.type) {
        operation += '&types=' + this.type
      }

      if (this.namePrefix) {
        operation += '&namePrefix=' + encodeURIComponent(this.namePrefix)
      }

      if (this.minPopulation) {
        operation += '&minPopulation=' + this.minPopulation
      }

      if (this.location) {
        operation += '&location=' + encodeURIComponent(this.location)
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
  created: function () {
    this.refreshPageData(0)
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
        type: this.type,
        namePrefix: this.namePrefix,
        minPopulation: this.minPopulation,
        location: this.location,
        radius: this.radius
      }
    },
    onSortChanged (value) {
      this.sort = value
    },
    refreshPageData () {
      const self = this

      geoApi.findPlacesUsingGET({
        types: this.currentRequest.type,
        namePrefix: this.currentRequest.namePrefix,
        minPopulation: this.currentRequest.minPopulation,
        location: this.currentRequest.location,
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

              _data.push({ name: place.name, population: place.population, location: location, country: place.country })
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
