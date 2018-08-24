const express = require('express');
const ReactSSR = require('react-dom/server');
const serverEntry = require('../dist/server-entry').default;
const  fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

const app = express();
app.use('/public', express.static(path.join(__dirname, '../dist')));//指定静态文件的返回
app.get('*', function(req, res) {
    const appString = ReactSSR.renderToString(serverEntry);
    res.send(template.replace('<!--app-->', appString));
});

app.listen(1111, function() {
    console.log('server is listening on 1111')
});