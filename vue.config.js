module.exports = {
  filenameHashing: false,

  chainWebpack: config => {
    config.module.rules.delete('eslint')
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

  transpileDependencies: [
    'vuetify'
  ]
}
