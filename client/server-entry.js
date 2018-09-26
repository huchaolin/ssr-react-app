// 使用者可能从任意路由进入网站，因此服务端渲染也必须处理路由跳转的问题，以使返回给客户端的 服务端渲染出的页面 为指定路由页面
// 服务端渲染时请求过的数据为避免客户端渲染时再次请求，防止二次请求接口， 应让客户端知道这些数据

import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider, useStaticRendering } from 'mobx-react';
import App from './views/App'

import { createStoreMap } from './store/store';

// 让mobx在服务端渲染的时候不会重复数据交换， 官方给出的防止内存溢出的方法
useStaticRendering(true);

const WrapApp = (stores, routerContext, url) => (
    <Provider {...stores}>
        <StaticRouter context={routerContext} location={url}>
            <App />
        </StaticRouter>
    </Provider>
);


export default WrapApp;

export { createStoreMap };
