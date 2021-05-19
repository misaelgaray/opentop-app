import {
    SET_TOPS,
    SET_TOP,
} from '../actions';

const initialState = {
    tops : null
};

const topsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TOPS:
            return {
                ...state,
                tops: action.tops,
            };
        case SET_TOP: 
            let newTops = [...state.tops];
            const topIndex = newTops.findIndex(item => item.id === action.top.id);
            newTops[topIndex] = {...action.top};
            return {
                ...state,
                tops: [...newTops],
            }
        default : return state;
    }
};

export default topsReducer;