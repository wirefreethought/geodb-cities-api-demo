<template>
  <autocomplete
    :options="currentResults"
    placeholder="Enter city..."
    width="250px"
    @input="onNamePrefixChanged"
    @select="onPlaceSelected">
    <template slot="item" scope="place">
      <div class="media">
        <p>
          <strong>{{ place.title }}</strong>
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
    name: 'place-autocomplete',
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
          'offset': 0,
          'hateoasMode': false
        }).then(
          function (data) {
            var response = Config.GEO_DB.PopulatedPlacesResponse.constructFromObject(data);

            var _results = new Array();

            for (var place of response.data) {
              var fullPlaceName = place.regionCode
                ? place.name + ", " + place.regionCode + ", " + place.countryCode
                :  place.name + ", " + place.countryCode;

              _results.push({id: place.id, name: fullPlaceName});
            }

            self.currentResults = _results;
          },

          function (error) {
            console.error(error);
          }
        );
      },
      onPlaceSelected(place) {
        this.$emit("onPlaceSelected", place);
      }
    }
  }
</script>
