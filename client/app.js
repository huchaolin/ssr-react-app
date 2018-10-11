import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import App from './views/App';
import stores from './store/store';

const { AppState, TopicStore } = stores;

console.log('stores111', stores)
// 与服务端同步state
const initialState =  window.__INITIAL__STATE__ || {} // eslint-disable-line
const mobxState = {
    appState: new AppState(initialState.appState),
    topicStore: new TopicStore(initialState.topicStore),
}

const WrapApp = () => (
    <Provider {...mobxState}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>);
ReactDOM.render(<WrapApp />, document.getElementById('root'));
