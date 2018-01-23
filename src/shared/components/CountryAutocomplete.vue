<template>
  <autocomplete
    :options="currentCountryResults"
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
        baseEndpointOperation: 'GET /v1/geo/countries',
        currentCountryResults: []
      }
    },
    methods: {
      onNamePrefixChanged(prefix) {
        var self = this;

        geoApi.getCountriesUsingGET({
          'namePrefix': prefix,
          'limit': 5,
          'offset': 0
        }).then(
          function (data) {
            var response = Config.GEO_DB.CountriesResponse.constructFromObject(data);

            var _results = new Array();

            for (var country of response.data) {
              _results.push({code: country.code, name: country.name});
            }

            self.currentCountryResults = _results;
          },

          function (error) {
            console.error(error);
          }
        );
      },
      onCountrySelected(country) {
        this.$emit("onCountrySelected", country);
      }
    }
  }
</script>
