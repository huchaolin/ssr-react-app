import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import App from './views/App';

import appState from './store/app-state'

const WrapApp = () => (
    <Provider appState={appState}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>);
ReactDOM.render(<WrapApp />, document.getElementById('root'));
