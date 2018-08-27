const express = require('express');
const ReactSSR = require('react-dom/server');
const path = require('path');

const app = express();

const isDev = process.env.NODE_ENV == 'development';

if (!isDev) {
    //正式环境的服务端渲染
    const serverEntry = require('../dist/server-entry').default;
    const  fs = require('fs');
    const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');
    app.use('/public', express.static(path.join(__dirname, '../dist')));//指定静态文件的返回
    app.get('*', function(req, res) {
        const appString = ReactSSR.renderToString(serverEntry);
        res.send(template.replace('<!--app-->', appString));
    });
} else {
    //开发环境下的服务端渲染
    const devStatic = require('./util/dev_static');
    devStatic(app);
};

app.listen(1111, function() {
    console.log('server is listening on 1111')
});