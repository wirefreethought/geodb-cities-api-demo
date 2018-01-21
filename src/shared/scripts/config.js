const GEO_DB = require('wft-geodb-js-client');

GEO_DB.ApiClient.instance.basePath = 'http://geodb-free-service.wirefreethought.com';

export default {
  GEO_DB: GEO_DB
}
