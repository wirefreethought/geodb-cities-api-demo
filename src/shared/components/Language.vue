<template>
  <div style="display:flex; justify-content:flex-start">
    <div class="form-field">
      <label>Language</label><br/>
      <select v-model="languageCode" @change="onChanged">
        <option v-for="language in languages" :value="language.code">{{language.name}}</option>
      </select>
    </div>
  </div>
</template>

<script>
  import Config from '../../shared/scripts/config';

  const localeApi = new Config.GEO_DB.LocaleApi();

  export default {
    name: 'language',
    data() {
      return {
        languageCode: "en",
        languages: []
      }
    },
    created: function () {
      // Load first 6 languages.
      this.loadLanguages(5, 0);
      this.loadLanguages(1, 5);
    },
    methods: {
      loadLanguages: function(limit, offset) {
        var self = this;

        localeApi.getLanguagesUsingGET({
          limit: limit,
          offset: offset
        }).then(
          function (data) {
            var response = Config.GEO_DB.LanguagesResponse.constructFromObject(data);

            for (var language of response.data) {
              self.languages.push({code: language.code, name: language.name});
            }
          },

          function (error) {
            console.error(error);
          }
        );
      },
      onChanged: function() {
        this.$emit("languageChanged", this.languageCode);
      }
    }
  }
</script>
