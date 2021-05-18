import React from 'react'
import { NavLink } from "react-router-dom"
import { useSelector } from 'react-redux'

import { getWords } from "../../../public/Languaje"

const SidenavSesionLinks = ({ userID }) => {

    const language = useSelector(state => state.auth.language)

    const { user } = useSelector(state => state.auth);

    return (
        <ul className="k-font">
            <li data-tip="Dashboard" data-for="sideTooltip">
                <NavLink className="d-flex" to="/Dashboard" activeClassName="active">
                    <i className="fas fa-link fa-fw"></i>
                    <p>Dashboard</p>
                </NavLink>
            </li>
            <li data-tip={getWords(language).my_profile} data-for="sideTooltip">
                <NavLink className="d-flex" to={"/User/" + user.id} activeClassName="active">
                    <i className="fas fa-user fa-fw"></i>
                    <p>{getWords(language).my_profile}</p>
                </NavLink>
            </li>
            <li data-tip="Analytics" data-for="sideTooltip">
                <NavLink to="/Analytics" className="d-flex" activeClassName="active">
                    <i className="fas fa-chart-bar fa-fw"></i>
                    <p>Analytics</p>
                </NavLink>
            </li>

        </ul>
    )
}

export default SidenavSesionLinks