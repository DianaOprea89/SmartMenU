const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      },
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Proxy requests to backend server
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, // Optional: rewrite path if your backend routes do not start with `/api`
      },
    },
  },
});
