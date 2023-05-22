<template>
  <div style="display:flex; justify-content:flex-start">
    <div class="form-field">
      <label>Type</label><br/>
      <select v-model="selectedTypes" @change="onChanged" multiple="true" size="3">
        <option v-for="option in typeOptions" v-bind="option" :value="option.value">{{option.title}}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'type',
  props: {
    options: Array
  },
  data () {
    return {
      selectedTypes: [],
      typeOptions: [
        { value: 'ADM2', title: 'Admin Division' },
        { value: 'CITY', title: 'City' },
        { value: 'ISLAND', title: 'Island' }
      ],
    }
  },
  methods: {
    onChanged: function () {
      this.$emit('placeTypesChanged', this.selectedTypes)
    }
  }
}
</script>
