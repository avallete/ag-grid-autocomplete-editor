/**
 * Used to setup TypeScript support in cypress
 */
const autoprefixer = require('autoprefixer');
const wp = require('cypress-webpack-preprocessor-v5');

module.exports = (on) => {
    const options = {
        webpackOptions: {
            resolve: {
                extensions: [".ts", ".tsx", ".js"]
            },
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        loader: 'ts-loader',
                        options: {allowTsInNodeModules: true}
                    },
                    {
                        test: /\.(sa|sc|c)ss$/,
                        use: [
                            {loader: 'css-loader', options: {sourceMap: true}},
                            {loader: 'sass-loader', options: {sourceMap: true}},
                            {
                                loader: 'postcss-loader',
                                options: {sourceMap: true, postcssOptions: {plugins: [autoprefixer()], syntax: 'postcss-scss'}}
                            },
                        ],
                    },
                ]
            }
        },
    };
    on('file:preprocessor', wp(options))
};
