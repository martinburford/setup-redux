// React imports
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { Link, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';

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

class App extends Component {
    componentDidMount(){
        this.checkUrlForPrePopulation();
    }

    componentDidUpdate(prevProps, prevState){
        this.checkUrlForPrePopulation();
    }

    checkUrlForPrePopulation(){
        const routeUrlArr = this.props.location.pathname.split('/');
        const routeUrl = routeUrlArr[routeUrlArr.length-1];
        const parsedUrlParams = {...queryString.parse(this.props.location.search)};
        const shouldPrePopulate = parsedUrlParams.hasOwnProperty('pre-populate');

        if(shouldPrePopulate){
            const actionsArr = [];

            if(configuration.urls.hasOwnProperty(routeUrl)){
                [...configuration.urls[routeUrl]].forEach(action => {
                    actionsArr.push({
                        type: action,
                        payload: configuration.actions[action].payload
                    });
                });
            }

            this.props.onPerformMultipleActions(actionsArr);

            // Perform multiple actions
            // this.props.onPerformMultipleActions([{
            //     type: 'ADD_FIRSTNAME',
            //     payload: 'Martin'
            // },{
            //     type: 'ADD_MIDDLENAME',
            //     payload: 'James'
            // },{
            //     type: 'ADD_SURNAME',
            //     payload: 'Burford'
            // }]);
        }
    }

    render(){
        return (
            <div>
                <div>
                    <h2>Standard routing links</h2>
                    <Link to="/">Homepage</Link> | <Link to="/firstName">First name</Link> | <Link to="/middleName">Middle name</Link> | <Link to="/surname">Surname</Link>
                    <br /><br /><hr />
                    <h2>Pre-population routing links</h2>
                    <Link to="/">Homepage</Link> | <Link to="/firstName?pre-populate">First name</Link> | <Link to="/middleName?pre-populate">Middle name</Link> | <Link to="/surname?pre-populate">Surname</Link>
                    <br /><br /><hr /><br />
                    <button onClick={this.props.onAddFirstName}>Add firstName of 'Martin'</button>
                    <button onClick={this.props.onAddMiddleName}>Add middleName of 'James'</button>
                    <button onClick={this.props.onAddSurname}>Add surname of 'Burford'</button>
                    <br /><br /><hr />
                    <h2>Redux state</h2>
                    <p>
                        First name: {this.props.firstName}<br />
                        Middle name: {this.props.middleName}<br />
                        Surname: {this.props.surname}
                    </p>
                </div>
                <hr />
                <div>
                    <Route path="/firstName" exact render={() => (
                        <p>
                            1: Run <strong>ADD_FIRSTNAME</strong> action
                        </p>
                    )} />
                    <Route path="/middleName" exact render={() => (
                        <p>
                            1: Run <strong>ADD_FIRSTNAME</strong> action<br />
                            2: Run <strong>ADD_MIDDLENAME</strong> action
                        </p>
                    )} />
                    <Route path="/surname" exact render={() => (
                        <p>
                            1: Run <strong>ADD_FIRSTNAME</strong> action<br />
                            2: Run <strong>ADD_MIDDLENAME</strong> action<br />
                            3: Run <strong>ADD_SURNAME</strong> action
                        </p>
                    )} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        firstName: state.firstName,
        middleName: state.middleName,
        surname: state.surname
    }
};

const mapDispatchToProps = dispatch => {
    return {
        // MULTIPLE ACTIONS
        onPerformMultipleActions: (actions) => dispatch(actions),

        // SINGULAR ACTIONS
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