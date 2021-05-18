import axios from "axios"

export const incView = id => async dispatch => {
    try {
        await axios.put("/api/sites/userSites/" + id)
    } catch (e) {
        console.log(e.message)
    }
}

export const getSite = id => async dispatch => {
    try {
        const res = {}
        const site = await axios.get("/api/sites/detail/" + id)
        res.siteData = site.data
        res.title = site.data.title
        return res
    }
    catch (e) {
        console.log("Error getSite - detailSite")
    }
}
export const getOwnerData = id => async dispatch => {
    try {
        const ownerData = await axios.get("/api/users/get/name/" + id)
        return ownerData
    }
    catch (e) {
        console.log("Error getOwnerData - detailSite")
    }
}

export const getSessionUserInfo = id => async dispatch => {
    try {
        const { data } = await axios.get("/api/users/get/" + id)
        return data
    }
    catch (e) {
        console.log("Error getSessionUserInfo - detailSite")
    }
}

export const followUser = (currentUserID, ownerUserID, action) => async dispatch => {
    try {
        await axios.put("/api/users/update/follow/" + currentUserID,
            { userID: ownerUserID, action }
        )
    }
    catch (e) {
        console.log("Error followUser - detailSite")
    }
}

export const rateSite = (siteID, currentUserID, action) => async dispatch => {
    try {
        await axios.put("/api/sites/detail/" + siteID,
            { userID: currentUserID, action }
        )
    } catch (e) {
        console.log("Error rateSite - detailSite")
    }
}