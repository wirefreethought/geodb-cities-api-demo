export default {
  data() {
    return {
      count: 0,
      currentPage: 0,
      currentPageData: [],
      pageSize: 5
    }
  },
  computed: {
    offset() {
      return this.currentPage * this.pageSize;
    }
  },
  methods: {
    onPageChanged(page) {
      this.currentPage = page;
    },
    refreshPageData(page) {
    }
  },
  watch: {
    currentPage: function (val) {
      this.refreshPageData(val);
    },
    currentRequest: function (val) {
      this.currentPage = 0;
      this.refreshPageData(0);
    }
  }
}
