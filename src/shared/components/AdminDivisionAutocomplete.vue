<template>
  <autocomplete
    :options="currentResults"
    placeholder="Enter administrative division..."
    width="250px"
    @input="onNamePrefixChanged"
    @select="onDivisionSelected">
    <template slot="item" scope="division">
      <div class="media">
        <p>
          <strong>{{ division.title }}</strong>
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
    name: 'admin-division-autocomplete',
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

        geoApi.findAdminDivisionsUsingGET({
          'namePrefix': prefix,
          'limit': 5,
          'offset': 0,
          'hateoasMode': false
        }).then(
          function (data) {
            var response = Config.GEO_DB.PopulatedPlacesResponse.constructFromObject(data);

            var _results = new Array();

            for (var division of response.data) {
              var fullPlaceName = division.regionCode
                ? division.name + ", " + division.regionCode + ", " + division.countryCode
                :  division.name + ", " + division.countryCode;

              _results.push({id: division.id, name: fullPlaceName});
            }

            self.currentResults = _results;
          },

          function (error) {
            console.error(error);
          }
        );
      },
      onDivisionSelected(division) {
        this.$emit("onDivisionSelected", division);
      }
    }
  }
</script>
