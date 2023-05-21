<template>
  <autocomplete
    :options="currentResults"
    :selectedIcon="this.selectedCountry ? this.selectedCountry.flagImageUri : ''"
    placeholder="Enter country"
    width="250px"
    @input="onNamePrefixChanged"
    @select="onCountrySelected">
    <template slot="item" slot-scope="country">
      <div class="media">
        <p>
          <strong>{{ country.title }}</strong>
        </p>
      </div>
    </template>
  </autocomplete>
</template>

<script>
import Autocomplete from './Autocomplete'

import Config from '../../shared/scripts/config'

const geoApi = new Config.GEO_DB.GeoApi()

export default {
  name: 'country-autocomplete',
  components: {
    Autocomplete
  },
  data () {
    return {
      currentResults: [],
      selectedCountry: null
    }
  },
  methods: {
    onNamePrefixChanged (prefix) {
      if (prefix.length < 3) {
        return;
      }

      const self = this

      geoApi.getCountriesUsingGET({
        namePrefix: prefix,
        limit: 5,
        offset: 0,
        hateoasMode: false
      }).then(
        function (data) {
          const response = Config.GEO_DB.CountriesResponse.constructFromObject(data)

          const _results = []

          for (const country of response.data) {
            _results.push({ code: country.code, name: country.name })
          }

          self.currentResults = _results
        },

        function (error) {
          console.error(error)
        }
      )
    },
    onCountrySelected (country) {
      const self = this

      geoApi.getCountryUsingGET(country.code, {
        asciiMode: false,
        languageCode: 'en'
      }).then(
        function (data) {
          const response = Config.GEO_DB.CountryResponse.constructFromObject(data)

          self.selectedCountry = response.data

          self.$emit('onCountrySelected', self.selectedCountry)
        },

        function (error) {
          console.error(error)
        }
      )
    }
  }
}
</script>
