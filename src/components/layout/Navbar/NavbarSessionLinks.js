import React from 'react'
import { Link } from "react-router-dom"
import { logoutUser } from "../../../actions/authActions"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import { getWords } from "../../../public/Languaje"

const NavbarSessionLinks = (props) => {

    const onLogoutClick = e => {
        e.preventDefault()
        props.logoutUser()
        props.tooltip.hide()
    }

    const { language } = props.auth

    return (
        <>
            {/* Create site */}
            <Link className="nav-btn nav-btn-add" to="/Create" data-tip={getWords(language).new_site} data-for="navTooltip">
                <i className="fas fa-plus-circle fa-2x fa-fw " />
            </Link>

            {/* Logout */}

            <button
                onClick={onLogoutClick}
                className="nav-btn nav-btn-logout"
                data-tip={getWords(language).log_out}
                data-for="navTooltip"
            >
                <i className="fas fa-power-off fa-2x fa-fw " />
            </button>
        </>
    )

}
NavbarSessionLinks.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(NavbarSessionLinks);