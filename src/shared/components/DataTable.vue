<template>
  <table :style="{width:width, textAlign:'left'}">
    <thead>
    <tr>
      <th v-for="(key,idx) in columns" :key="idx">{{ key | capitalize }}</th>
    </tr>
    </thead>
    <tfoot v-if="count > pageSize">
    <tr>
      <td :colspan="columns.length">
        <div style="display:flex; justify-content:space-between">
          <span v-if="!atFirstPage()">
            <a @click="onFirstPage">First</a> | <a @click="onPrevPage">Prev</a>
          </span>
          <span v-else>&nbsp;</span>

          <span>Page {{currentPage + 1}} of {{count / pageSize | roundUp}}</span>

          <span v-if="!atLastPage()">
            <a @click="onNextPage">Next</a> | <a @click="onLastPage">Last</a>
          </span>
          <span v-else>&nbsp;</span>
        </div>
      </td>
    </tr>
    </tfoot>
    <tbody>
    <tr v-for="(entry,idx) in data" :key="idx">
      <td v-for="key in columns" v-bind:key="key">
        {{entry[key]}}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
  body {
    font-family: Helvetica Neue, Arial, sans-serif;
    font-size: 14px;
    color: #444;
  }

  table {
    border: 2px solid #42b983;
    border-radius: 3px;
    background-color: #fff;
  }

  th {
    background-color: darkcyan;
    color: rgba(255, 255, 255, 0.66);
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  td {
    background-color: #f9f9f9;
  }

  th, td {
    min-width: 120px;
    padding: 10px 20px;
  }

  a:hover {
    color: darkcyan;
  }
</style>

<script>
export default {
  name: 'data-table',
  props: {
    count: Number,
    columns: Array,
    currentPage: Number,
    data: Array,
    pageSize: Number,
    width: {
      type: String,
      default: '100%'
    }
  },
  computed: {
    lastPage: function () {
      return Math.ceil(this.count / this.pageSize) - 1
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    roundUp: function (value) {
      return Math.ceil(value)
    }
  },
  methods: {
    atFirstPage: function () {
      return this.currentPage === 0
    },
    atLastPage: function () {
      return this.currentPage === this.lastPage
    },
    onFirstPage: function () {
      this.$emit('pageChanged', 0)
    },
    onLastPage: function () {
      this.$emit('pageChanged', this.lastPage)
    },
    onNextPage: function () {
      this.$emit('pageChanged', this.currentPage + 1)
    },
    onPrevPage: function () {
      this.$emit('pageChanged', this.currentPage - 1)
    }
  }
}
</script>
