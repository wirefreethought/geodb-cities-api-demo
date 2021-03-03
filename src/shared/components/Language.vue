<template>
  <div style="display:flex; justify-content:flex-start">
    <div class="form-field">
      <label>Language</label><br/>
      <select v-model="languageCode" @change="onChanged">
        <option v-for="language in languages" v-bind="language" :value="language.code">{{language.name}}</option>
      </select>
    </div>
  </div>
</template>

<script>
import Config from '../../shared/scripts/config'

const localeApi = new Config.GEO_DB.LocaleApi()

export default {
  name: 'language',
  data () {
    return {
      languageCode: 'en',
      languages: []
    }
  },
  created: function () {
    // Load first 10 languages.
    this.loadLanguages(10, 0)
  },
  methods: {
    loadLanguages: function (limit, offset) {
      const self = this

      localeApi.getLanguagesUsingGET({
        limit: limit,
        offset: offset,
        hateoasMode: false
      }).then(
        function (data) {
          const response = Config.GEO_DB.LanguagesResponse.constructFromObject(data)

          for (const language of response.data) {
            self.languages.push({ code: language.code, name: language.name })
          }

          self.languages.sort((a, b) => {
            if (a === b) {
              return 0
            }

            return a.name < b.name ? -1 : 1
          })
        },

        function (error) {
          console.error(error)
        }
      )
    },
    onChanged: function () {
      this.$emit('languageChanged', this.languageCode)
    }
  }
}
</script>
