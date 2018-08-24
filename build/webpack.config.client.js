const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const isDev = process.env.NODE_ENV == 'development';
const config = {
    entry: {
        app: path.join(__dirname, '../client/app.js')
    },
    output: {
        filename: '[name].[hash].js',
        path: path.join(__dirname, '../dist'),
        publicPath: 'public',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                  }
            },
            {
                test: /\.html$/,
                use: [
                  {
                    loader: "html-loader",
                    options: { minimize: true }
                  }
                ]
            }
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: path.join(__dirname, '../client/template.html')
        })
    ]
};
if(isDev) {
    //localhost:8888/文件名 可以访问到dist目录下的静态资源
    config.devServer = {
        host: '0.0.0.0',// 表示可以用127.0.0.1， 也可以用localhost ，也可用本机IP ，避免局域网内开发时其他人连接本机失败
        port: '8888',
        contentBase: path.join(__dirname, '../dist'), //静态资源目录
        // hot: true,
        overlay: {
            errors: true
        },
        publicPath: '/public',
        historyApiFallback: {
            index: '/public/index.html'
        }
    }
};
module.exports = config;