const GEO_DB = require('wft-geodb-js-client')

GEO_DB.ApiClient.instance.basePath = 'http://geodb-free-service.wirefreethought.com/v1'
GEO_DB.ApiClient.instance.defaultHeaders = {}

export default {
  GEO_DB: GEO_DB
}
