import React from 'react'
import { NavLink } from "react-router-dom"
import { useSelector } from 'react-redux'

import { getWords } from "../../../public/Languaje"

const SidenavLinks = () => {

    const language = useSelector(state => state.auth.language)

    return (
        <ul className="k-font">
            <li data-tip={getWords(language).about_uyl} data-for="sideTooltip">
                <NavLink to="/AboutUYL" className="d-flex" activeClassName="active">
                    <i className="fas fa-users fa-fw"></i>
                    <p>{getWords(language).about_uyl}</p>
                </NavLink>
            </li>
            <li data-tip="FAQ" data-for="sideTooltip">
                <NavLink to="/FAQ" className="d-flex" activeClassName="active">
                    <i className="fas fa-question fa-fw "></i>
                    <p>FAQ</p>
                </NavLink>
            </li>
        </ul>
    )
}

export default SidenavLinks