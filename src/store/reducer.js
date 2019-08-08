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