const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack:{
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'component': '@/component',
        'network': '@/network',
        'views': '@/views'
      }
    }
  },
  // devServer: {
  //   // 由之前的 'localhost'改为如下，端口默认8080
  //   host:"0.0.0.0",
  //   port: "8080",
  // }
})
