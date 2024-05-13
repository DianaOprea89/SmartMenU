const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify')
      }
    }
  }
})
