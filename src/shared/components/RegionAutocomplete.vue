<template>
  <autocomplete
    :options="currentResults"
    placeholder="Enter region..."
    width="250px"
    @input="onNamePrefixChanged"
    @select="onRegionSelected">
    <template slot="item" scope="region">
      <div class="media">
        <p>
          <strong>{{ region.title }}</strong>
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
    name: 'region-autocomplete',
    components: {
      Autocomplete
    },
    props: {
      countryCode: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        currentResults: []
      }
    },
    methods: {
      onNamePrefixChanged(prefix) {
        var self = this;

        geoApi.getRegionsUsingGET(this.countryCode, {
          'namePrefix': prefix,
          'limit': 5,
          'offset': 0
        }).then(
          function (data) {
            var response = Config.GEO_DB.RegionsResponse.constructFromObject(data);

            var _results = new Array();

            for (var region of response.data) {
              _results.push({code: region.isoCode, name: region.name});
            }

            self.currentResults = _results;
          },

          function (error) {
            console.error(error);
          }
        );
      },
      onRegionSelected(region) {
        this.$emit("onRegionSelected", region);
      }
    }
  }
</script>
