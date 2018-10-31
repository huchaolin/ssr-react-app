
const bootstrapper  = require('react-async-bootstrapper');
const ejs = require('ejs');
const serializeJs = require('serialize-javascript');
const ReactSSR = require('react-dom/server');
const Helmet = require('react-helmet').default;// 解决服务端渲染时各页面的seo标签分别显示

// 获取json格式的服务端渲染后的state
const getStoreState = (stores) => {
    return Object.keys(stores).reduce((result, storeName) => {
        result[storeName] = stores[storeName].toJson();
        return result
    }, {})
}

module.exports = (serverBundle, template, req, res) => {
    return new Promise( (resolve, reject) => {
        const createStoreMap = serverBundle.createStoreMap;
        const createApp = serverBundle.default;
        const routerContext = {};
        const stores = createStoreMap();
        // 判断服务端是否已保存用户信息
        const user = req.session.user;
        if (user) {
            stores.appState.user.isLogin = true;
            stores.appState.user.info = user;
        }
        const app = createApp(stores, routerContext, req.url);
        bootstrapper(app).then(() => {
            // 服务端渲染时路由跳转
            if (routerContext.url) {
                res.status(302).setHeader('Location', routerContext.url);
                res.end();
                return
            };
            //获得服务端渲染后的store的初始状态
            const initialState = serializeJs(getStoreState(stores));
            const content = ReactSSR.renderToString(app);
            const helmet = Helmet.renderStatic();
            const title = helmet.title.toString();
            const link = helmet.meta.toString();
            const meta = helmet.link.toString();
            const style = helmet.style.toString();
            const html = ejs.render(template, {
                content,
                initialState,
                title,
                meta,
                link,
                style,
            })
            console.log('服务端渲染返回html')
            res.send(html);
            resolve();
        }).catch(reject);
    })
}