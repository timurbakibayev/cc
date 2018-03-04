import { combineReducers } from 'redux';


const filesListReducer = (state = [], action) => {
    switch (action.type) {
        case "ACTION_LOADED":
            return action.data;
        default:
            return state;
    }
};


const filesReducer = combineReducers({
    list: filesListReducer,
});

export default filesReducer;