import { combineReducers } from 'redux';
import filesReducer from './files';

const mainReducer = combineReducers({
    files: filesReducer,
});

export default mainReducer;