/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: function (config) {
    return {
      ...config,
      experiments: {
        topLevelAwait: true,
        asyncWebAssembly: true,
      },
      output: {
        ...config?.output,
        webassemblyModuleFilename: 'static/wasm/[modulehash].wasm'
      }
    };
  }
};