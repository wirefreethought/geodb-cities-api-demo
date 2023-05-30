<template>
  <div class="form_element_container">
    <label>Type</label><br/>
    <select class="form_field" v-model="selectedType" @change="onChanged" size="1">
      <option v-for="option in typeOptions" v-bind="option" :value="option.value">{{option.title}}</option>
    </select>
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
      selectedType: null,
      typeOptions: [
        { value: 'ADM2', title: 'Admin Division' },
        { value: 'CITY', title: 'City' },
        { value: 'ISLAND', title: 'Island' }
      ],
    }
  },
  methods: {
    onChanged: function () {
      this.$emit('placeTypeChanged', this.selectedType)
    }
  }
}
</script>
