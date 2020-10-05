import {
  AUTHENTICATION_FAILED,
  AUTHENTICATION_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
} from "../actions/types";

const initialState = {
  user: null,
  loading: true,
  isAuthenticated: false,
  token: localStorage.getItem("token"),
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case AUTHENTICATION_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return { ...state, ...payload, isAuthenticated: true, loading: false };

    case LOGOUT:
    case AUTHENTICATION_FAILED:
    case AUTH_ERROR:
    case LOGIN_FAILED:
      localStorage.removeItem("token");
      return { ...state, token: null, isAuthenticated: false, loading: false };

    case USER_LOADED:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };

    default:
      return state;
  }
}
