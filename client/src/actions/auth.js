import axios from "axios";
import { setAlert } from "../actions/alert";
import setAuthToken from "../utils/setAuthToken";
import {
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
} from "./types";

//load user
export const loadUser = (token) => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = axios.get("/api/auth", token);

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//register user
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("/api/user", body, config);

    dispatch({
      type: AUTHENTICATION_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err.message);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: AUTHENTICATION_FAILED,
    });
  }
};

//login user
export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err.message);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAILED,
    });
  }
};

//login user
export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};
