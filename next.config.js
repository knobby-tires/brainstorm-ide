// next.config.js
module.exports = {
    reactStrictMode: true,
    webpack: function (config) {
      config.experiments = {
        asyncWebAssembly: true,
        layers: true,
      };
  
      config.output = {
        ...config.output,
        webassemblyModuleFilename: 'static/wasm/[modulehash].wasm'
      };
  
      return config;
    }
  };