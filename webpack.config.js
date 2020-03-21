const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  entry: {
    app: './src/index.js',
  },
  output: {
    library: 'lensGroups.min.js',
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  }
}
