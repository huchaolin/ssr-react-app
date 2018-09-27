import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import App from './views/App';

import AppState from './store/app-state'
// 与服务端同步state
const initialState =  window.__INITIAL__STATE__ || {} // eslint-disable-line

const WrapApp = () => (
    <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>);
ReactDOM.render(<WrapApp />, document.getElementById('root'));
