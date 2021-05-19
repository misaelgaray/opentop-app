export const SET_USER = "SET_USER";

export function setUser(user) {
    return dispatch => {
        dispatch({
            type: SET_USER,
            user: user,
        });
    };
}