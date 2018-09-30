const axios = require('axios');
const webpack = require('webpack');
const path = require('path');
const MemoryFs = require('memory-fs');
const serverConfig = require('../../build/webpack.config.server');
const proxy = require('http-proxy-middleware');

const serverRender = require('./server-render');

//由于开发时template没有写在硬盘上， 故须另外的方法读取
const getTemplate = () => {
    return new Promise( (resolve, reject) => {
        axios.get('http://localhost:8888/public/server.ejs')
        .then(res => {
            resolve(res.data)
        }).catch(reject);
    })
}

//更改模块引用的方式， 以配合服务端渲染时不打包引用的类库
const NativeModule = require('module');
const vm = require('vm');
const getModuleFromString = (bundle, filename) => {
    const m = { exports: {} };
    const wrapper = NativeModule.wrap(bundle);
    const script = new vm.Script(wrapper, {
        filename: filename,
        displayErrors: true,
    });
    const result = script.runInThisContext();
    result.call(m.exports, m.exports, require, m);
    return m
}


//监听服务端需要的bundle.js文件有动态变化， 则重新打包
const mfs = new MemoryFs;
const serverCompiler = webpack(serverConfig);
//通过mfs读取文件
serverCompiler.outputFileSystem = mfs;
let serverBundle;
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
    // //转为可使用的模块格式
    const m = getModuleFromString(bundle, 'server-entry.js')
    serverBundle = m.exports;
});

module.exports = function (app) {
    app.use('/public', proxy({
        target: 'http://localhost:8888'
    }));
    app.get('*', function (req, res, next) {
        if(!serverBundle) {
            return res.send('waiting for compile, refresh later')
        }
        getTemplate().then(template => {
            serverRender(serverBundle, template, req, res )
            .catch(next);
        })
    })
}