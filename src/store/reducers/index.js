import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import topsReducer from './tops.reducer';

const reducers = combineReducers({
        userReducer,
        topsReducer,
    });

export default reducers;
