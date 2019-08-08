# **setup/redux**

**Please note:** before running any code from this branch, be sure to run `npm install`.

This repository has been created in order to demonstrate how **Redux** (https://www.npmjs.com/package/redux) should be used in order to allow for state to be managed centrally:

----

Via the implementation of **mapStateToProps** and **mapDispatchToProps**, Redux is great at enabling a centralized way to control the state of a single page React application. In the case of a regular SPA, there are usually 2 primary purposes of using Redux:

1. Component re-use.

2. Deep-linking / data pre-population.

In order to demonstrate how to get this to work, there is a specific flow of logic which has to be put in place:

- Create a simple React application with routing. In the case of this example, 3 unique routes have been created.
- Assign a single action for each of the 3 routes. 
- Write logic to check the URL for specific parameters, which identifies if a route is to be subjected to pre-population.
- Enable multiple sequential actions to be executed upon a route being mounted (and re-loaded).

The above requirements are not particularly complex, however where there is added complexity is in relation to getting Redux to be able to sequentially run multiple actions in one go. There are a couple of Node packages required in order to do that, in addition to the regular packages which are needed for more simple implementations of React with Redux:

- **redux-batched-subscribe** - https://www.npmjs.com/package/redux-batched-subscribe
- **redux-multi** - https://www.npmjs.com/package/redux-multi

In order to get this working, a few additional steps are required at the root level of your application:

1. Firstly, an instance of a redux store must be created with **redux-multi** acting as middleware.
2. Then, **batchedSubscribe** needs to be attached to this store instance.
3. A reducer needs to be provided to the Redux store instance.
4. Your React application needs to be wrapped by the **Provider** made available via **react-redux**, passing the Redux store instance as a property.

An example of this in its entirety is below:

```javascript
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
```

## The React application within this branch

The sole purpose of this branch is to get / set the **firstName**, **middleName** and **surname** of an individual to the browser, via Redux state. It is possible to either add each of these individually, or collectively all at once.

## Reducer

A simple reducer needs to be setup in the first instance. This will receive the actions from the React components as an input and will output the updated state relating to that specific action. As can be seen in the code below, the initial state of the application is that no values are provided for the firstName, middleName or surname. An action of **ADD_FIRSTNAME** updates the state with the firstName payload. Similar actions are also in place for the actions of **ADD_MIDDLENAME** and **ADD_SURNAME**.

```javascript
const initialState = {
  firstName: '',
  middleName: '',
  surname: ''
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    case 'ADD_FIRSTNAME':
      return {
        ...state,
        firstName: action.payload
      }
    case 'ADD_MIDDLENAME':
      return {
        ...state,
        middleName: action.payload
      }
    case 'ADD_SURNAME':
      return {
        ...state,
        surname: action.payload
      }
  }

  return state;
}

export default reducer;
```

With Redux connected to the React app and the reducer created, component specific code can now be written. In the case of this simple application, there is only 1 component which provides the 3 routes and the necessary rendering of those routes. As a result of this, **mapStateToProps** and **mapDispatchToProps** can be included within this single file as shown below:

```javascript
const mapStateToProps = state => {
  return {
    firstName: state.firstName,
    middleName: state.middleName,
    surname: state.surname
  }
};

const mapDispatchToProps = dispatch => {
  return {
    // Multiple actions
    onPerformMultipleActions: (actions) => dispatch(actions),

    // Singular actions
    onAddFirstName: () => dispatch({
      type: 'ADD_FIRSTNAME',
      payload: 'Martin'
    }),
    onAddMiddleName: () => dispatch({
      type: 'ADD_MIDDLENAME',
      payload: 'James'
    }),
    onAddSurname: () => dispatch({
      type: 'ADD_SURNAME',
      payload: 'Burford'
    })
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
```

**mapStateToProps** is merely retrieving the state from Redux with **mapDispatchToProps** providing the actionCreators for sending actions to the reducer, in order to update the Redux-managed state. Whilst the 3 methods **onAddFirstName()**, **onAddMiddleName()** and **onAddSurname()** will call a single action at a given time, the far more important action here is **onPerformMultipleActions()**. What this does is receives an array of actions which will be run in sequence. The structure of the array (of actions) it receives should be in the following form:

```javascript
[{
  type: 'ADD_FIRSTNAME',
  payload: 'Martin'
},{
  type: 'ADD_MIDDLENAME',
  payload: 'James'
},{
  type: 'ADD_SURNAME',
  payload: 'Burford'
}]
```

## Knowing when to run multiple actions at once

This can be achieved in a number of different ways. However, in the case of this branch, a check for the existence of a URL parameter is made when the component renders. If a queryString paramater of **pre-populate** is found, a check is made. This checks the current route URL against a configuration object. If **configuration.urls[CURRENT_ROUTE_URL]** exists, the actions which need to be executed for that route are retrieved. As can be seen in the code snippet below, the following actions are required to be run against the corresponding route URLs:

- Route of **firstName**
  - ADD_FIRSTNAME

- Route of **middleName**
  - ADD_FIRSTNAME
  - ADD_MIDDLENAME

- Route of **surname**
  - ADD_FIRSTNAME
  - ADD_MIDDLENAME
  - ADD_SURNAME

```javascript
// Configuration of URLs against actions
const configuration = {
  // Pre-population data for the actions
  actions: {
    'ADD_FIRSTNAME': {
      payload: 'Martin'
    },
    'ADD_MIDDLENAME': {
      payload: 'James'
    },
    'ADD_SURNAME': {
      payload: 'Burford'
    }
  },
  // Map the designated actions to call against each specific route/URL
  urls: {
    firstName: ['ADD_FIRSTNAME'],
    middleName: ['ADD_FIRSTNAME','ADD_MIDDLENAME'],
    surname: ['ADD_FIRSTNAME','ADD_MIDDLENAME','ADD_SURNAME']
  }
}
```

With the list of actions for the current route URL identified, it is then necessary to pull the necessary pre-population data for those actions from the **configuration.actions** object. With that done, an array can be constructed and provided to the **onPerformMultipleActions()** method within mapDispatchToProps. This will result in all of the necessary actions being run in sequential order. This sequential execution is possible via the way **redux-batched-subscribe** works, and specifically how it provides a **notify()** callback after each action is complete.