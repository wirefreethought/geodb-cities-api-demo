<template>
  <autocomplete
    :options="currentResults"
    placeholder="Enter place"
    width="200px"
    @input="onNamePrefixChanged"
    @select="onPlaceSelected">
    <template slot="item" slot-scope="place">
      <div class="media">
        <p>
          <strong>{{ place.title }}</strong>
        </p>
      </div>
    </template>
  </autocomplete>
</template>

<script>
import Autocomplete from './Autocomplete'

import Config from '@/shared/scripts/config'

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'place-autocomplete',
  components: {
    Autocomplete
  },
  data () {
    return {
      currentResults: []
    }
  },
  methods: {
    onNamePrefixChanged (prefix) {
      if (prefix.length < 3) {
        return;
      }

      const self = this

      geoApi.findPlacesUsingGET({
        namePrefix: prefix,
        limit: 5,
        offset: 0,
        hateoasMode: false,
        sort: '-population'
      }).then(
        function (data) {
          const response = Config.GEO_DB.PopulatedPlacesResponse.constructFromObject(data)

          const _results = []

          for (const place of response.data) {
            const fullPlaceName = place.regionCode
              ? place.name + ', ' + place.regionCode + ', ' + place.countryCode
              : place.name + ', ' + place.countryCode

            _results.push({ id: place.id, name: fullPlaceName })
          }

          self.currentResults = _results
        },

        function (error) {
          console.error(error)
        }
      )
    },
    onPlaceSelected (place) {
      this.$emit('onPlaceSelected', place)
    }
  }
}
</script>
