import {createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import throttle from 'lodash/throttle';
import mainReducer from './reducers';

const configureStore = () => {
    const middlewares = [thunk];
    if (process.env.NODE_ENV !== 'production') {
        middlewares.push(createLogger());
    }

    const loadState = () => {
        try {
            const serializedState = localStorage.getItem('state');
            if (serializedState === null) {
                return undefined;
            }
            const state = JSON.parse(serializedState);
            return {auth:
                {
                    auth: {
                        token: state.token,
                        role: state.role,
                        is_staff: state.is_staff,
                        user: state.user,
                        isAuthenticated: state.isAuthenticated,
                    }
                }};
        } catch (err) {
            console.log('storage undefined');
            return undefined;
        }
    };

    const saveState = (state) => {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem('state', serializedState);
        } catch (err) {
            // Ignore write errors.
        }
    };

    const store =  createStore(
        mainReducer,
        loadState(),
        applyMiddleware(...middlewares));

    store.subscribe(
        throttle(() => {
                console.log('saving state', store.getState());
                saveState({
                    isAuthenticated: store.getState().auth.auth.isAuthenticated,
                    token: store.getState().auth.auth.token,
                    role: store.getState().auth.auth.role,
                    is_staff: store.getState().auth.auth.is_staff,
                    user: store.getState().auth.auth.user,
                });
            },
            1000));

    return store;

};

export default configureStore;
