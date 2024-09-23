const webpack = require('webpack');

module.exports = function override(config, env) {
  config.plugins.push(
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /@babel\/standalone$/
    })
  );
  
  return config;
}
