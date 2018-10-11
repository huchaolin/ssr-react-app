const path = require('path');
const webpack = require('webpack');
const webpackMerge = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base");
const isDev = process.env.NODE_ENV == 'development';
const config  =webpackMerge(webpackBaseConfig, {
    target: 'node',//服务端
    entry: {
        app: path.join(__dirname, '../client/server-entry.js')
    },
    externals: Object.keys(require('../package.json').dependencies),// 服务端渲染引用类库不打包到build文件夹中
    output: {
        filename: 'server-entry.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'css-loader' ]
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.API_BASE': '"http://127.0.0.1:2222"', // 设置服务端渲染时的请求baseapi
        })
    ]
});
if(isDev) {
    config.mode = 'development';
};
module.exports = config;
