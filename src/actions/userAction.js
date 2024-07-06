import axios from "axios";
import { clientAxios } from "../config/axios.config";
import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS,USER_LOGIN_FAIL,USER_LOGOUT} from "../constants/userConstant";
export const login = (username, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        //headers
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        //get login data
        const { data } = await axios.post(
            "/auth/login",
            { username, password },
            config
        );
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });

        //set user info into local storage
        localStorage.setItem("userInfo", JSON.stringify(data.data));
    } catch (error) {
        let errorMessage;
        if (error.response && error.response.data) {
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else {
                errorMessage = error.response.data.error || 'An unknown error occurred.';
            }
        } else {
            errorMessage = 'An unknown error occurred.';
        }
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: errorMessage,
        });
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });

};
