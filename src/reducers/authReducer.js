import {
    SET_CURRENT_USER, SWITCH_SIDEBAR, SET_SUGGESTIONS, ADD_SUGGESTION,
    SET_USER_SITES, SWITCH_SEARCHBAR, ADD_SITE, DELETE_SITE,
    LOADING_SITES, CLEAR_USER_SITES, SET_LANGUAGE, UPDATE_NAME, SET_DARK_MODE
} from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
    isAuthenticated: false,
    user: {},
    bools: {
        loadingSites: true,
        sideBar: true,
        searchBar: false,
        darkMode: false
    },
    userSites: [],
    language: "",
    searchHistory: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case SWITCH_SIDEBAR:
            return {
                ...state,
                bools: {
                    ...state.bools,
                    sideBar: !state.bools.sideBar
                }
            }
        case SWITCH_SEARCHBAR:
            return {
                ...state,
                bools: {
                    ...state.bools,
                    searchBar: !state.bools.searchBar
                },
            }
        case SET_USER_SITES:
            return {
                ...state,
                userSites: action.userSites.reverse()
            }
        case CLEAR_USER_SITES:
            return {
                ...state,
                bools: {
                    ...state.bools,
                    loadingSites: true
                },
                userSites: {}
            }
        case ADD_SITE:
            return {
                ...state,
                userSites: [action.newSite].concat(state.userSites)
            }
        case DELETE_SITE:
            return {
                ...state,
                userSites: state.userSites.filter(site => site._id !== action.deletedSite)
            }
        case LOADING_SITES:
            return {
                ...state,
                bools: {
                    ...state.bools,
                    loadingSites: action.payload
                }
            }
        case SET_LANGUAGE:
            return {
                ...state,
                language: action.payload
            }
        case SET_DARK_MODE:
            return {
                ...state,
                bools: {
                    ...state.bools,
                    darkMode: action.payload
                }
            }
        case UPDATE_NAME:
            return {
                ...state,
                user: {
                    ...state.user,
                    name: action.payload
                }
            }
        case SET_SUGGESTIONS:
            return {
                ...state,
                searchHistory: action.payload
            }
        case ADD_SUGGESTION:
            if (state.searchHistory.length >= 5) {
                const removeLastHistory = state.searchHistory.splice(0, 4)
                return {
                    ...state,
                    searchHistory: [action.payload].concat(removeLastHistory)
                }
            }
            return {
                ...state,
                searchHistory: [action.payload].concat(state.searchHistory)
            }
        default:
            return state;
    }
}