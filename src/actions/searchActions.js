import axios from 'axios'
import { ADD_SUGGESTION, SET_SUGGESTIONS } from "./types"

export const getSites = key => async dispatch => {
    try {
        const { data } = await axios.get("/api/sites/search/" + key)
        return data
    } catch (e) {
        console.log("Error: search - getSites")
    }
}

export const getOwnerData = id => async dispatch => {
    try {
        const { data } = await axios.get("/api/users/get/name/" + id)
        return data
    } catch (e) {

    }
}

export const setSearchHistory = uID => async dispatch => {
    try {
        const res = await axios.get("/api/users/get/history/" + uID)
        const searchHistory = res.data
        dispatch({
            type: SET_SUGGESTIONS,
            payload: searchHistory
        })

    } catch (e) {
        console.log(e.message)
    }
}

export const addToHistory = (search, uID) => async dispatch => {
    try {
        await axios.post("/api/users/get/history/" + uID, { search })
        dispatch({
            type: ADD_SUGGESTION,
            payload: search
        })
    } catch (e) {
        console.log(e.message)
    }
}