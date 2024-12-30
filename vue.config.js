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
  chainWebpack: (config) => {
    // 链式配置，配置Loader
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        // Merge the new `compilerOptions` with existing ones (if any).
        // This ensures we don't override any other configurations.
        options.compilerOptions = {
          ...(options.compilerOptions || {}), //  浅合并现有的 options，安全地保留其它可能的设置
          isCustomElement: (tag) => tag.startsWith("md-"),
        };
        return options;
      });
  },
});
