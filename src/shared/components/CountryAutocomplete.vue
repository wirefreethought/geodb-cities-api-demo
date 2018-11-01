<template>
  <autocomplete
    :options="currentResults"
    :selectedIcon="this.selectedCountry ? this.selectedCountry.flagImageUri : ''"
    placeholder="Enter country..."
    width="250px"
    @input="onNamePrefixChanged"
    @select="onCountrySelected">
    <template slot="item" scope="country">
      <div class="media">
        <p>
          <strong>{{ country.title }}</strong>
        </p>
      </div>
    </template>
  </autocomplete>
</template>

<script>
  import Autocomplete from './Autocomplete';

  import Config from '../../shared/scripts/config';

  const geoApi = new Config.GEO_DB.GeoApi();

  export default {
    name: 'country-autocomplete',
    components: {
      Autocomplete
    },
    data() {
      return {
        currentResults: [],
        selectedCountry: null
      }
    },
    methods: {
      onNamePrefixChanged(prefix) {
        var self = this;

        geoApi.getCountriesUsingGET({
          'namePrefix': prefix,
          'limit': 5,
          'offset': 0,
          'hateoasMode': false
        }).then(
          function (data) {
            var response = Config.GEO_DB.CountriesResponse.constructFromObject(data);

            var _results = new Array();

            for (var country of response.data) {
              _results.push({code: country.code, name: country.name});
            }

            self.currentResults = _results;
          },

          function (error) {
            console.error(error);
          }
        );
      },
      onCountrySelected(country) {
        var self = this;

        geoApi.getCountryUsingGET(country.code).then(
          function (data) {
            var response = Config.GEO_DB.CountryResponse.constructFromObject(data);

            self.selectedCountry = response.data;

            self.$emit("onCountrySelected", self.selectedCountry);
          },

          function (error) {
            console.error(error);
          }
        );
      }
    }
  }
</script>
