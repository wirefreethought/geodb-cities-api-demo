var path = require('path')

module.exports = {
  publicPath: '/dist/',
  outputDir: path.resolve(__dirname, './dist'),
  filenameHashing: false,

  chainWebpack: config => {
    config.module.rules.delete('eslint');

    config
      .entry('geodb-demo')
        .add('./src/main.js')
        .end()

      // Geo Demos
      .entry('geodb-find-admin-divisions-demo')
        .add('./src/components/geo/find-admin-divisions/index.js')
        .end()
      .entry('geodb-find-cities-demo')
        .add('./src/components/geo/find-cities/index.js')
        .end()
      .entry('geodb-find-cities-near-city-demo')
        .add('./src/components/geo/find-cities-near-city/index.js')
        .end()
      .entry('geodb-find-cities-near-division-demo')
        .add('./src/components/geo/find-cities-near-division/index.js')
        .end()
      .entry('geodb-find-cities-near-location-demo')
        .add('./src/components/geo/find-cities-near-location/index.js')
        .end()
      .entry('geodb-find-countries-demo')
        .add('./src/components/geo/find-countries/index.js')
        .end()
      .entry('geodb-find-country-regions-demo')
        .add('./src/components/geo/find-country-regions/index.js')
        .end()
      .entry('geodb-find-country-region-cities-demo')
        .add('./src/components/geo/find-country-region-cities/index.js')
        .end()
      .entry('geodb-find-country-region-divisions-demo')
        .add('./src/components/geo/find-country-region-divisions/index.js')
        .end()
      .entry('geodb-find-divisions-near-division-demo')
        .add('./src/components/geo/find-divisions-near-division/index.js')
        .end()
      .entry('geodb-find-divisions-near-location-demo')
        .add('./src/components/geo/find-divisions-near-location/index.js')
        .end()
      .entry('geodb-get-admin-division-details-demo')
        .add('./src/components/geo/get-admin-division-details/index.js')
        .end()
      .entry('geodb-get-city-details-demo')
        .add('./src/components/geo/get-city-details/index.js')
        .end()
      .entry('geodb-get-city-datetime-demo')
        .add('./src/components/geo/get-city-datetime/index.js')
        .end()
      .entry('geodb-get-city-distance-demo')
        .add('./src/components/geo/get-city-distance/index.js')
        .end()
      .entry('geodb-get-city-time-demo')
        .add('./src/components/geo/get-city-time/index.js')
        .end()
      .entry('geodb-get-country-details-demo')
        .add('./src/components/geo/get-country-details/index.js')
        .end()
      .entry('geodb-get-country-region-details-demo')
        .add('./src/components/geo/get-country-region-details/index.js')
        .end()

      // Locale Demos
      .entry('geodb-get-currencies-demo')
        .add('./src/components/locale/get-currencies/index.js')
        .end()

      .entry('geodb-get-languages-demo')
        .add('./src/components/locale/get-languages/index.js')
        .end()

      .entry('geodb-get-locales-demo')
        .add('./src/components/locale/get-locales/index.js')
        .end()

      .entry('geodb-get-timezones-demo')
        .add('./src/components/locale/get-timezones/index.js')
        .end()

      .entry('geodb-get-timezone-datetime-demo')
        .add('./src/components/locale/get-timezone-datetime/index.js')
        .end()

      .entry('geodb-get-timezone-time-demo')
        .add('./src/components/locale/get-timezone-time/index.js')
        .end()

      .output
        .path(path.resolve(__dirname, './dist'))
        .filename('[name].js');
  },

  configureWebpack: {
    module: {
      rules: [
        {
          test: /wft-geodb-js-client\/.*\.js$/,
          use: 'imports-loader?define=>false'
        }
      ]
    },
    node: {
      fs: 'empty'
    }
  },

  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
};
