import axios from "axios"

export const getUserSites = id => async dispatch => {
    try {
        const { data } = await axios.get('/api/sites/userSites/' + id)
        return data
    } catch (e) {
        console.log("Error: detailUser - getUserSites")
    }
}

export const getUserInfo = id => async dispatch => {
    try {
        const { data } = await axios.get('/api/users/get/' + id)
        return data
    } catch (e) {
        console.log("Error: detailUser - getUserInfo")
    }
}

export const getVisitorInfo = id => async dispatch => {
    try {
        const { data } = await axios.get("/api/users/get/" + id)
        return data
    } catch (e) {
        console.log("Error: detailUser - getVisitorInfo")
    }
}

export const followUser = (currentUserID, toFollowUserID, action) => async dispatch => {
    try {
        await axios.put("/api/users/update/follow/" + currentUserID,
            { userID: toFollowUserID, action }
        )
    } catch (e) {
        console.log("Error: detailUser - followUser")
    }
}