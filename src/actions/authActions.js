import axios from "axios"
import setAuthToken from "../utils/setAuthToken"
import jwt_decode from "jwt-decode"
import {
    GET_ERRORS,
    CLEAR_ERRORS,
    SET_CURRENT_USER,
    SWITCH_SIDEBAR,
    SET_USER_SITES,
    CLEAR_USER_SITES,
    SWITCH_SEARCHBAR,
    ADD_SITE,
    DELETE_SITE,
    LOADING_SITES,
    SET_LANGUAGE,
    SET_DARK_MODE, UPDATE_NAME
} from "./types"

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post("/api/registry", userData)
        .then(res => history.push({ pathname: "/Login", state: { regSuccess: userData.email } })) // re-direct to login on successful register
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const deleteErrors = () => dispatch => {
    dispatch({
        type: CLEAR_ERRORS
    })
}

// Login - get user token
export const loginUser = userData => async dispatch => {
    try {
        const res = await axios.post("/api/login", userData)
        // Save to localStorage
        // Set token to localStorage
        const { token } = res.data
        localStorage.setItem("jwtToken", token)
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token)
        // Set current user
        dispatch(setCurrentUser(decoded))
        // Set current user sites
        await dispatch(setUserSites(decoded.id))
        dispatch(loadingSites(false))
    } catch (err) {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    }
};

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem("jwtToken")
    // Remove auth header for future requests
    setAuthToken(false)
    // Remove sites
    dispatch({ type: CLEAR_USER_SITES })
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}))
};

// Open and close the sidebar
export const switchSidebar = () => dispatch => {
    dispatch({
        type: SWITCH_SIDEBAR
    });
}

export const switchSearchar = () => dispatch => {
    dispatch({
        type: SWITCH_SEARCHBAR
    });
}

// Create Site
export const createSite = siteData => async dispatch => {
    const res = await axios.post("/api/sites/create", siteData)
    dispatch({
        type: ADD_SITE,
        newSite: res.data
    })
    return res
};

// Delete Site
export const deleteSite = id => async dispatch => {
    const res = await axios.delete("/api/sites/delete/" + id)
    dispatch({
        type: DELETE_SITE,
        deletedSite: id
    })
    console.log(res.data.message)
};

//Catch errors
export const catchError = err => dispatch => {
    dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    })
}

// Get user sites
export const setUserSites = userID => async dispatch => {
    const res = await axios.get("/api/sites/userSites/" + userID);
    dispatch({
        type: SET_USER_SITES,
        userSites: res.data
    })
};

// Sites is loading
export const loadingSites = state => dispatch => {
    dispatch({
        type: LOADING_SITES,
        payload: state
    })
}

// Set language
export const setLanguage = lan => dispatch => {
    dispatch({
        type: SET_LANGUAGE,
        payload: lan
    })
}

// Set dark mode
export const setDarkMode = mode => dispatch => {
    dispatch({
        type: SET_DARK_MODE,
        payload: mode
    })
}

// Change user name
export const updateUserName = async (data) => {
    try {
        await axios.put("/api/users/update/name/" + data.id, data)
        return true

    } catch (e) {
        return false
    }
}

export const updateName = name => dispatch => {
    dispatch({
        type: UPDATE_NAME,
        payload: name
    })
}

// Change user password
export const updateUserPassword = async (data) => {
    try {
        await axios.put("/api/users/update/password/" + data.id, data)
        return true

    } catch (e) {
        return false
    }
}