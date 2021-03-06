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
          use: [
            {
              loader: 'imports-loader',
              options: {
                additionalCode: 'var define = false;',
              },
            },
          ]
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
