const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpackMerge = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base");
const cdnConfig = require("../app.config").cdn;
const isDev = process.env.NODE_ENV == 'development';
const config = webpackMerge(webpackBaseConfig, {
    entry: {
        app: path.join(__dirname, '../client/app.js')
    },
    output: {
        filename: '[name].[hash].js',
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                  {
                    loader: "html-loader",
                    options: { minimize: true }
                  }
                ]
            },
            {
                test: /\.ejs$/,
                use: [
                    {
                        loader: "ejs-compiled-loader",
                        options: {
                            'htmlmin': true, // or enable here  
                            'htmlminOptions': {
                                removeComments: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: path.join(__dirname, '../client/template.html')
        }), 
        new HtmlWebPackPlugin({
            template:  path.join(__dirname, '../client/server.template.ejs'),
            filename: 'server.ejs'
        })
    ]
});
if(isDev) {
    config.mode = 'development';
    config.devtool = '#cheap-module-eval-source-map';// 方便快速定位错误到源代码
    //localhost:8888/文件名 可以访问到dist目录下的静态资源
    config.devServer = {
        host: '0.0.0.0',// 表示可以用127.0.0.1， 也可以用localhost ，也可用本机IP ，避免局域网内开发时其他人连接本机失败
        port: '8888',
        // contentBase: path.join(__dirname, '../dist'), //webpack dev server把编译的内容放在内存，它指定了服务器资源的根目录，如果不写入contentBase的值，那么contentBase默认是项目的目录。
        // hot: true,
        overlay: {
            errors: true
        },
        publicPath: '/public/',//最后一个斜杠添加保证路径正确
        historyApiFallback: {
            index: '/public/index.html'
        },
        proxy: {
            '/api': 'http://localhost:2222'
        }
    };
} else {
    config.entry = {
        app: path.join(__dirname, '../client/app.js'),
    };
    config.optimization = {
        minimizer: [
            new UglifyJsPlugin()
        ],
        splitChunks: {
			cacheGroups: {
                libs: {
                    test: /node_modules/,
                    chunks: "initial", // 只打包初始时依赖的第三方
                    name: "chunk-libs",
                    priority: 10,
                },
                antd: {
                    test: /antd/,
                    chunks: "initial", // 只打包初始时依赖的第三方
                    name: "chunk-antd", // 单独将 elementUI 拆包
                    priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                }, 
			}
		}
    }
    config.output.filename = '[name].[chunkhash].js';
    config.output.publicPath = cdnConfig.host;
    config.plugins.push(
        new BundleAnalyzerPlugin(),
        new webpack.DefinePlugin({
                    'process.env' : {
                        NODE_ENV: JSON.stringify('production'),
                    }
                }),
    )
}
module.exports = config;
