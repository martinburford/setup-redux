// Global node imports
const path = require('path');

// NPM imports (specific to Webpack)
const cleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    plugins: [
        new cleanWebpackPlugin([path.resolve(__dirname.replace('webpack',''),'dist')], {
            allowExternal: true
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
        new TerserPlugin({
            parallel: true,
            sourceMap: true // Must be set to true if using source-maps in production
        })
        ]
    }
}