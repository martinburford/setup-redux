// Global node imports
const path = require('path');
const webpackMerge = require('webpack-merge');

// Webpack configuration
const webpackCommon = require('./webpack/webpack.common.js');
const webpackDev = require('./webpack/webpack.dev.config.js')
const webpackProd = require('./webpack/webpack.prod.config.js');
let webpackConfig = webpackCommon;

module.exports = env => {
    const environment = env.DEVELOPMENT ? 'dev' : 'prod';

    switch(environment){
        case 'dev':
            webpackConfig = webpackMerge(webpackConfig, webpackDev);
            break;
        case 'prod':
            webpackConfig = webpackMerge(webpackConfig, webpackProd);
            break;
        default:
            webpackConfig = webpackMerge(webpackConfig, webpackDev);
            break;
    }

    return webpackConfig;
};