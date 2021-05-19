export const SET_TOPS = "SET_TOPS";
export const SET_TOP = "SET_TOP";


export function setTops(tops) {
    return dispatch => {
        dispatch({
            type: SET_TOPS,
            tops: tops,
        });
    };
}

export function setTop(top){
    return dispatch => {
        dispatch({
            type: SET_TOP,
            top: top,
        });
    };
}