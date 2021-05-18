import React, { useEffect } from "react"
import { Link } from "react-router-dom"

import PropTypes from "prop-types"
import { connect } from "react-redux"
import classnames from "classnames"
import { setUserSites, loadingSites } from "../../../actions/authActions"
import { setSearchHistory } from "../../../actions/searchActions"

import '../../../public/css/SideNav.scss'
import ReactTooltip from "react-tooltip"

import SidenavSesionLinks from "./SidenavSesionLinks.js"
import SidenavLinks from "./SidenavLinks.js"

const Sidenav = (props) => {
    const { auth, setUserSites, loadingSites, setSearchHistory } = props
    const { sideBar, darkMode } = auth.bools


    useEffect(() => {
        const getInfo = async () => {
            await setSearchHistory(auth.user.id)
            await setUserSites(auth.user.id)
            loadingSites(false)
        }
        if (auth.isAuthenticated) {
            getInfo()
        }
    }, [auth.user.id, auth.isAuthenticated, loadingSites, setUserSites, setSearchHistory])

    return (
        <nav
            id="sidebar"
            className={classnames("sidebar", {
                active: sideBar
            })}
        >
            <div className="sidebar-header r-font">
                {!sideBar
                    ? (auth.isAuthenticated
                        ? <p className="m-0 text-capitalize">
                            {auth.user.name}
                        </p>
                        : "UpYourLink"
                    )
                    : <Link to="/">UYL</Link>
                }
            </div>
            {auth.isAuthenticated && <SidenavSesionLinks />}
            <SidenavLinks />

            <ReactTooltip
                disable={!sideBar}
                id="sideTooltip"
                place="right"
                effect="solid"
                type={darkMode ? "light" : "dark"}
            />
        </nav>
    )

}

Sidenav.propTypes = {
    setUserSites: PropTypes.func.isRequired,
    loadingSites: PropTypes.func.isRequired,
    setSearchHistory: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { setUserSites, loadingSites, setSearchHistory }
)(Sidenav);