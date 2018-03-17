<template>
  <div style="display:flex; justify-content:flex-start">
    <div class="form-field">
      <label>Sort By</label><br/>
      <select v-model="sort1" @change="onSort1Changed">
        <option value="">NONE</option>
        <option v-for="option in options" :value="option.value">{{option.title}}</option>
      </select>
    </div>
    <div v-if="sort1 !== ''"class="form-field">
      <label>Then By</label><br/>
      <select v-model="sort2" @change="onChanged">
        <option value="">NONE</option>
        <option v-if="!isSort1Value(option.value)" v-for="option in options" :value="option.value">{{option.title}}</option>
      </select>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sort-by',
    props: {
      options: Array
    },
    data() {
      return {
        sort1: "",
        sort2: ""
      }
    },
    methods: {
      getDirectionlessSortValue: function(value) {
        if (value.length > 0) {
          var firstChar = value.charAt(0);

          return firstChar === '+' || firstChar === '-'
            ? value.substring(1)
            : value;
        }

        return value;
      },
      isSort1Value: function(value) {
        return this.getDirectionlessSortValue(this.sort1) === this.getDirectionlessSortValue(value);
      },
      onChanged: function() {
        let sort = this.sort1;

        if (this.sort2 !== "") {
          sort += "," + this.sort2;
        }

        this.$emit("sortChanged", sort);
      },
      onSort1Changed: function() {
        this.sort2 = "";

        this.onChanged();
      },
    }
  }
</script>
