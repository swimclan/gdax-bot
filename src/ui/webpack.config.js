const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  module: {
    rules: [
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: ['file-loader?mimetype=image/svg+xml']},
      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, use: ['file-loader?mimetype=application/font-woff']},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, use: ['file-loader?mimetype=application/font-woff']},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: ['file-loader?mimetype=application/octet-stream']},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: ['file-loader']},
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  },
  mode: 'development',
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: ['node_modules']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  }
};