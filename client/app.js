import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import App from './views/App';

import AppState from './store/app-state'

const WrapApp = () => (
    <Provider appState={new AppState()}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>);
ReactDOM.render(<WrapApp />, document.getElementById('root'));
