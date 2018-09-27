const axios = require('axios');
const webpack = require('webpack');
const path = require('path');
const MemoryFs = require('memory-fs');
const serverConfig = require('../../build/webpack.config.server');
const ejs = require('ejs');
const serializeJs = require('serialize-javascript');
const ReactSSR = require('react-dom/server');
const proxy = require('http-proxy-middleware');
const bootstrapper  = require('react-async-bootstrapper');
//由于开发时template没有写在硬盘上， 故须另外的方法读取
const getTemplate = () => {
    return new Promise( (resolve, reject) => {
        axios.get('http://localhost:8888/public/server.ejs')
        .then(res => {
            resolve(res.data)
        }).catch(reject);
    })
}

const Module = module.constructor;


//监听服务端需要的bundle.js文件有动态变化， 则重新打包
const mfs = new MemoryFs;
const serverCompiler = webpack(serverConfig);
//通过mfs读取文件
serverCompiler.outputFileSystem = mfs;
let serverBundle, createStoreMap;
serverCompiler.watch({}, (err, stats) => {
    if(err) throw err;
    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(warn => console.warn(warn));

    const bundlePath = path.join(
        serverConfig.output.path,
        serverConfig.output.filename
    );
    //bundle读取出来为string格式， 需转为可使用的模块格式
    const bundle = mfs.readFileSync(bundlePath, 'utf-8');
    //转为可使用的模块格式
    const m = new Module();
    //使用此方法必须指定名字，否则报错
    m._compile(bundle, 'server-entry.js');
    serverBundle = m.exports.default;
    //stores部分
    createStoreMap = m.exports.createStoreMap;
    console.log('createStoreMap', createStoreMap)
});

// 获取json格式的服务端渲染后的state
const getStoreState = (stores) => {
    return Object.keys(stores).reduce((result, storeName) => {
        result[storeName] = stores[storeName].toJson();
        return result
    }, {})
}
module.exports = function (app) {
    app.use('/public', proxy({
        target: 'http://localhost:8888'
    }));
    app.get('*', function (req, res) {
        getTemplate().then(template => {
            const routerContext = {};
            const stores = createStoreMap();
            const app = serverBundle(stores, routerContext, req.url);
            bootstrapper(app).then(() => {
                // 服务端渲染时路由跳转
                if (routerContext.url) {
                    res.status(302).setHeader('Location', routerContext.url);
                    res.end();
                    return
                };
                //获得服务端渲染后的store的初始状态
                const initialState = serializeJs(getStoreState(stores));
                console.log('initialState'. initialState)
                const content = ReactSSR.renderToString(app);

                const html = ejs.render(template, {
                    content,
                    initialState,
                })

                // const ssrHtml = template.replace('<app></app>', content);
                res.send(html);
            })
            .catch(err => console.log('Eek, error!', err));
        })
    })
}