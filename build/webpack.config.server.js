const path = require('path');
const isDev = process.env.NODE_ENV == 'development';
const config  = {
    target: 'node',//服务端
    entry: {
        app: path.join(__dirname, '../client/server-entry.js')
    },
    output: {
        filename: 'server-entry.js',
        path: path.join(__dirname, '../dist'),
        publicPath: '/public/',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "eslint-loader"
                  }
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                  }
            }
        ],
    }
};
if(isDev) {
    config.mode = 'development';
};
module.exports = config;