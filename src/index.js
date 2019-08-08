// React imports
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reduxMulti from 'redux-multi';
import { batchedSubscribe } from 'redux-batched-subscribe';

// Add middleware to allow our action creators to return functions and arrays
const createStoreWithMiddleware = applyMiddleware(
    reduxMulti,
  )(createStore);

// Ensure our listeners are only called once, even when one of the above middleware call the underlying store's `dispatch` multiple times
const createStoreWithBatching = batchedSubscribe(
    fn => fn()
)(createStoreWithMiddleware);

// Local project (JavaScript) imports
import App from './App';
import reducer from './store/reducer';

const app = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

const store = createStoreWithBatching(reducer);

ReactDOM.render(<Provider store={store}>{app}</Provider>, document.getElementById('root'));