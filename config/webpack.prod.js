var path = require('path')

var autoprefixer = require('autoprefixer')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'production',
  devtool: 'source-map',

  entry: './ag-grid-autocomplete-editor.ts',

  externals: {
    '@ag-grid-community/core': '@ag-grid-community/core',
  },

  output: {
    path: path.resolve('./dist/'),
    publicPath: 'http://localhost:8080/',
    filename: 'ag-grid-autocomplete-editor.js',
    libraryTarget: 'umd',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: ['.ts'],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { allowTsInNodeModules: true },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true, postcssOptions: { plugins: [autoprefixer()], syntax: 'postcss-scss' } },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
}
