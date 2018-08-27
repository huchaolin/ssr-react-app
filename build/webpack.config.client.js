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
        publicPath: '/public/',
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
    config.mode = 'development';
    //localhost:8888/文件名 可以访问到dist目录下的静态资源
    config.devServer = {
        host: '0.0.0.0',// 表示可以用127.0.0.1， 也可以用localhost ，也可用本机IP ，避免局域网内开发时其他人连接本机失败
        port: '8888',
        contentBase: path.join(__dirname, '../dist'), //webpack dev server把编译的内容放在内存，它指定了服务器资源的根目录，如果不写入contentBase的值，那么contentBase默认是项目的目录。
        // hot: true,
        overlay: {
            errors: true
        },
        publicPath: '/public/',//最后一个斜杠添加保证路径正确
        historyApiFallback: {
            index: '/public/index.html'
        }
    };
   
};
module.exports = config;