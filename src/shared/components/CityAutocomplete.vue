<template>
  <autocomplete
    :options="currentResults"
    placeholder="Enter city..."
    width="250px"
    @input="onNamePrefixChanged"
    @select="onCitySelected">
    <template slot="item" scope="city">
      <div class="media">
        <p>
          <strong>{{ city.title }}</strong>
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
    name: 'city-autocomplete',
    components: {
      Autocomplete
    },
    data() {
      return {
        currentResults: []
      }
    },
    methods: {
      onNamePrefixChanged(prefix) {
        var self = this;

        geoApi.findCitiesUsingGET({
          'namePrefix': prefix,
          'limit': 5,
          'offset': 0
        }).then(
          function (data) {
            var response = Config.GEO_DB.CitiesResponse.constructFromObject(data);

            var _results = new Array();

            for (var city of response.data) {
              var fullCityName = city.regionCode
                ? city.city + ", " + city.regionCode + ", " + city.countryCode
                :  city.city + ", " + city.countryCode;

              _results.push({id: city.id, name: fullCityName});
            }

            self.currentResults = _results;
          },

          function (error) {
            console.error(error);
          }
        );
      },
      onCitySelected(city) {
        this.$emit("onCitySelected", city);
      }
    }
  }
</script>
