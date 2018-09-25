const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session');
const ReactSSR = require('react-dom/server');
const path = require('path');
const favicon = require('serve-favicon');

const app = express();

app.use(bodyParser.json());// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));// parse application/x-www-form-urlencoded
app.use(session({
    secret: 'react cnode class',
    name: 'tid',//cookie的id
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

app.use('/api/user', require('./util/handle-login'));
app.use('/api', require('./util/proxy'));

const isDev = process.env.NODE_ENV == 'development';

//指定标签栏图标
app.use(favicon(path.join(__dirname, '../favicon.ico')))

if (!isDev) {
    //正式环境的服务端渲染
    const serverEntry = require('../dist/server-entry').default;
    const fs = require('fs');
    const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');
    app.use('/public', express.static(path.join(__dirname, '../dist')));//指定静态文件的返回
    app.get('*', function (req, res) {
        const appString = ReactSSR.renderToString(serverEntry);
        res.send(template.replace('<!--app-->', appString));
    });
} else {
    //开发环境下的服务端渲染
    const devStatic = require('./util/dev-static');
    devStatic(app);
};

app.listen(2222, function () {
    console.log('server is listening on 2222')
});
