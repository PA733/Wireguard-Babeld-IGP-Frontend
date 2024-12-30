const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8080/api",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
  transpileDependencies: true,
});
