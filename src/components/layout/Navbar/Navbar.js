import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { switchSidebar, switchSearchar, setLanguage, setDarkMode } from "../../../actions/authActions"
import { addToHistory } from "../../../actions/searchActions"

import ReactTooltip from "react-tooltip"
import classnames from "classnames"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Animated } from "react-animated-css";

import NavbarSessionLinks from './NavbarSessionLinks'
import { getWords } from "../../../public/Languaje"
import '../../../public/css/Navigation.scss'
import '../../../public/css/CustomToggle.scss'

const MySwal = withReactContent(Swal)

const useOutsideAlerter = (ref, hideFunction) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                hideFunction(false)
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, hideFunction]);
}

const Navbar = (props) => {

    const [search, setSearch] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [suggestions, setSuggestions] = useState([])

    const { auth, addToHistory } = props
    const session = auth.isAuthenticated
    const { language, searchHistory } = auth
    const { searchBar, darkMode } = auth.bools
    const backBtn = null

    // No dissapear the suggestion window
    const wrapperRef = useRef(null)
    useOutsideAlerter(wrapperRef, setShowSuggestions)

    useEffect(() => {
        setSuggestions(searchHistory)
    }, [searchHistory])

    useEffect(() => {
        ReactTooltip.rebuild()
    })

    const openSidenav = () => {
        props.switchSidebar()
    }

    const openSearch = () => {
        props.switchSearchar()
        ReactTooltip.hide()
    }

    const switchWindowMode = () => {
        document.body.style.backgroundColor = !darkMode ? '#232526' : '#fff';
        props.switchTheme()
        props.setDarkMode(!darkMode) // Redux
        localStorage.setItem('dark', JSON.stringify(!darkMode)) // Local storage
    }

    const switchLanguage = (selection) => {
        props.setLanguage(selection) // Redux state
        localStorage.setItem('language', JSON.stringify(selection)) // Local storage
    }

    const onChangeSearch = (e) => {
        setSearch(e.target.value)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setShowSuggestions(false)
        const lastSearch = search.trim()
        if (lastSearch !== "") {
            if (suggestions.length >= 5) {
                suggestions.pop()
            }
            setSuggestions([lastSearch].concat(suggestions))
            addToHistory(lastSearch, auth.user.id)
            props.history.push("/Results?search=" + lastSearch)
        }
    }

    const preferencesModal = () => {
        MySwal.fire({
            width: '20rem',
            title: 'Preferences',
            html: <>
                <span>Tema</span>
                <div>
                    <button type="button"
                        className={classnames("btn btn-toggle r-font", { 'active': darkMode })}
                        data-toggle="button"
                        aria-pressed="false"
                        autoComplete="off"
                        onClick={() => {
                            switchWindowMode()
                            MySwal.close()
                        }}>
                        <div className="handle"></div>
                    </button>
                </div>
                <br />
                <span>Idioma</span>
                <div className="row justify-content-center">
                    <button className={
                        classnames("btn language-selector mx-2 px-2 py-1", {
                            'active': language === 'en'
                        })}
                        onClick={() => {
                            if (language !== 'en') {
                                switchLanguage('en')
                                MySwal.close()
                            }
                        }}>
                        English
                    </button>
                    <button className={
                        classnames("btn language-selector mx-2 px-2 py-1", {
                            'active': language === 'es'
                        })}
                        onClick={() => {
                            if (language !== 'es') {
                                switchLanguage('es')
                                MySwal.close()
                            }
                        }}>
                        Español
                    </button>
                    <button className="btn language-selector mx-2 px-2 py-1">
                        Otros...
                    </button>
                </div>
            </>,
            showCloseButton: true,
            showConfirmButton: false,
            buttonsStyling: false,
            customClass: {
                container: darkMode ? "dark-mode" : "light-mode",
                title: 'r-font font-weight-normal text-muted',
                content: 'k-font p-0',
                cancelButton: 'k-font btn btn-unStyled col-12 p-0',
            }
        })
    }

    const authActionsModal = () => {
        MySwal.fire({
            html: <div className="row m-0 nav-modal-links">
                <a className="btn btn-unStyled col-12" href="/Login" >
                    Login
                </a>
                <a className="btn btn-unStyled col-12" href="/Registry">
                    Signin
                </a>
            </div>,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: <i className="fas fa-arrow-left"></i>,
            buttonsStyling: false,
            customClass: {
                container: darkMode ? "dark-mode" : "light-mode",
                content: 'k-font p-0',
                cancelButton: 'k-font btn btn-unStyled col-12 p-0',
            }
        })
    }

    const openSideBtn =
        <div className="nav-open" onClick={openSidenav} >
            <i className="fas fa-bars fa-2x fa-fw" aria-hidden="true"></i>
        </div>

    const sugg =
        suggestions.map((S, c) => {
            return <Link key={c} className="nav-suggestion k-font" to={"/Results?search=" + S} onClick={() => { setShowSuggestions(false) }}>
                {S}
            </Link>
        })

    const search1 =
        <div
            ref={wrapperRef}
            className={classnames("nav-item hide-nav-search nav-search flex-grow-1", {
                "active": showSuggestions
            })}>
            <div className="input-group display-suggestions" >
                <form className="search d-flex w-100" onSubmit={handleSearch}>
                    <input
                        onChange={onChangeSearch}
                        id="search"
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        className="form-control m-0 col"
                        type="text"
                        placeholder={getWords(language).search}
                        onFocus={() => setShowSuggestions(true)}>
                    </input>
                    <button
                        className="nav-btn nav-btn-submit"
                        type="submit"
                        data-tip="Go"
                        data-for="navTooltip"
                        style={{ order: "3" }}
                    >
                        <i className="fas fa-search fa-2x mr-2 fa-fw" />
                    </button>
                </form>
            </div>

            <div className={classnames("input-group", { "d-block": showSuggestions, "d-none": !showSuggestions })}>
                <div className="nav-search-suggestions row m-0 flex-column pt-2 pb-0">
                    {sugg}
                </div>
            </div>
        </div>

    const search2 =
        <Animated
            animationIn="bounceInDown"
            animationInDuration={100}
            isVisible={searchBar}
            className={classnames("nav-item nav-search flex-grow-1", {
                "active": showSuggestions
            })}
        >
            <div
                ref={wrapperRef}
            >
                <div className="input-group display-suggestions">
                    <form className="search d-flex w-100" onSubmit={handleSearch}>
                        <input
                            onChange={onChangeSearch}
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            id="search"
                            className="form-control h-100"
                            type="text"
                            style={{ order: "2" }}
                            placeholder={getWords(language).search}
                            onFocus={() => setShowSuggestions(true)}>
                        </input>
                        <div
                            className="nav-btn nav-btn-back"
                            role="button"
                            onClick={openSearch}
                            style={{ order: "1" }}
                        >
                            <i className="fas fa-chevron-left fa-2x fa-fw" />
                        </div>

                        <button
                            className="nav-btn nav-btn-submit"
                            type="submit"
                            style={{ order: "3" }}
                        >
                            <span><i className="fas fa-search fa-2x mr-1 fa-fw" /></span>
                        </button>
                    </form>
                </div>
                <div className={classnames("input-group", { "d-block": showSuggestions, "d-none": !showSuggestions })}>
                    <div className="nav-search-suggestions row m-0 flex-column pt-2 pb-0">
                        {sugg}
                    </div>
                </div>
            </div>

        </Animated>

    const openSearchBtn =
        <button
            className="nav-btn"
            onClick={openSearch}
            data-tip={getWords(language).search}
            data-for="navTooltip">

            <i className="fas fa-search fa-2x fa-fw nav-btn-search" />
        </button>

    const authButtons =
        <button className="nav-btn nav-btn-authActions" onClick={authActionsModal}>
            <i className="fas fa-user fa-2x fa-fw"></i>
        </button>

    const preferencesToggle =
        <button className="nav-btn nav-btn-preferences"
            onClick={() => preferencesModal()}
            data-tip={getWords(language).preferences}
            data-for="navTooltip">
            <i className="fas fa-cog fa-2x fa-fw " />
        </button>

    return (
        <nav className="navbar nav-color row m-0 my-1">

            {!searchBar && openSideBtn /* OpenSideNav button */}

            {searchBar && backBtn /* Back search */}

            {!searchBar /* Search bar */
                ? search1
                : search2
            }
            <div className="row m-0">
                {!searchBar && openSearchBtn /* Open SearchBar button */}

                {session && !searchBar && <NavbarSessionLinks tooltip={ReactTooltip} /* Session buttons */ />}

                {!searchBar && preferencesToggle /* Preferences */}

                {!session && !searchBar && authButtons /* Not session buttons */}
            </div>


            <ReactTooltip
                className="nav-tooltip"
                id="navTooltip"
                place="bottom"
                effect="float"
                type={darkMode ? "light" : "dark"}
            />
        </nav >
    );

}

Navbar.propTypes = {
    setDarkMode: PropTypes.func.isRequired,
    addToHistory: PropTypes.func.isRequired,
    setLanguage: PropTypes.func.isRequired,
    switchSearchar: PropTypes.func.isRequired,
    switchSidebar: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { switchSidebar, switchSearchar, setLanguage, setDarkMode, addToHistory }
)(Navbar);