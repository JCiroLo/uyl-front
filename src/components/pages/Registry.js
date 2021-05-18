import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { registerUser, deleteErrors } from "../../actions/authActions"

import classnames from "classnames"
import { getWords } from '../../public/Languaje'

import '../../public/css/Registry.scss'

const Registry = props => {

    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [spaces, setSpaces] = useState(0)

    const { isAuthenticated, language } = props.auth
    const { registerUser, deleteErrors } = props

    document.title = getWords(language).sign_up

    useEffect(() => {
        isAuthenticated && props.history.push("/")
        setErrors(props.errors)
        setLoading(false)
    }, [isAuthenticated, props.errors, props.history])

    useEffect(() => {
        return () => {
            deleteErrors()
        }
    }, [deleteErrors])

    const onChange = e => {
        const eID = e.target.id
        const eValue = e.target.value

        if (eID === "name") {
            const str = eValue
            const exp = /\s+/g
            const spaces = str.match(exp)
            spaces ? setSpaces(spaces.length) : setSpaces(0)
        }
        setUserInfo({ ...userInfo, [eID]: eValue })
    }

    const onSubmit = e => {
        e.preventDefault()
        setLoading(true)
        const newUser = {
            name: userInfo.name,
            email: userInfo.email,
            password: userInfo.password,
            password2: userInfo.password2
        };
        registerUser(newUser, props.history);
    }

    const resetErrorOnClick = e => {
        const eID = e.target.id
        setErrors({ ...errors, [eID]: "" })
    }

    return (
        <div className="container" >
            <div className="col-12 pb-2">
                <h4 className="r-font center" style={{ fontSize: "34px" }}>
                    <b className="text-muted small">{getWords(language).greeting_registry}</b>
                    <br />
                    <b> {getWords(language).register_below}</b>
                </h4>
            </div>

            <div className="col-12 col-xl-10 offset-xl-1 row mx-auto">
                <div className="col-12 col-lg-7 pr-lg-5">
                    <form autoComplete="off" className="registry-form row" noValidate onSubmit={onSubmit}>
                        <div className="form-group col-12 mb-2">
                            <label className="text-muted r-font" htmlFor="name">
                                {getWords(language).name}:
                            </label>
                            <input
                                onClick={resetErrorOnClick}
                                onChange={onChange}
                                value={userInfo.name}
                                id="name"
                                type="text"
                                className={classnames("form-control", {
                                    "is-invalid": errors.name || spaces > 0,
                                })}
                            />
                            <span className="red-text k-font">
                                {spaces > 0 && "No usar espacios"}
                                {errors.name}
                            </span>
                        </div>
                        <div className="form-group col-12 mb-2">
                            <label className="text-muted r-font" htmlFor="email">
                                {getWords(language).error_email_required}
                            </label>
                            <input
                                onClick={resetErrorOnClick}
                                onChange={onChange}
                                value={userInfo.email}
                                id="email"
                                type="email"
                                className={classnames("form-control", {
                                    "is-invalid": errors.email
                                })}
                            />
                            <span className="red-text k-font">
                                {errors.email}
                            </span>
                        </div>
                        <div className="form-group col-12 col-sm-6 mb-2">
                            <label className="text-muted r-font" htmlFor="password">
                                {getWords(language).pass}:
                                </label>
                            <input
                                onClick={resetErrorOnClick}
                                onChange={onChange}
                                value={userInfo.password}
                                id="password"
                                type="password"
                                className={classnames("form-control", {
                                    "is-invalid": errors.password
                                })}
                            />
                            <span className="red-text k-font">
                                {errors.password ? getWords(language).error_pass_short : null}
                            </span>
                        </div>
                        <div className="form-group col-12 col-sm-6 mb-2">
                            <label className="text-muted r-font" htmlFor="password2">
                                {getWords(language).pass2}:
                                </label>
                            <input
                                onClick={resetErrorOnClick}
                                onChange={onChange}
                                value={userInfo.password2}
                                id="password2"
                                type="password"
                                className={classnames("form-control", {
                                    "is-invalid": errors.password2
                                })}
                            />
                            <span className="red-text k-font">
                                {errors.password2 ? getWords(language).error_pass2_short : null}
                            </span>
                        </div>
                        <div className="col-12 center">
                            <button
                                style={{
                                    width: "100%",
                                    marginTop: "1rem"
                                }}
                                type="submit"
                                className="btn r-font btn-styled-color"
                            >
                                {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : getWords(language).sign_in}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="separator d-none d-lg-inline">
                    <div className="top"></div>
                    <div className="mid r-font text-muted">{getWords(language).or}</div>
                    <div className="bot"></div>
                </div>

                <div className="d-inline d-lg-none mt-lg-0 my-3 r-font text-muted mx-auto">
                    <h2 className="m-0">{getWords(language).or}</h2>
                </div>

                <div className="col-12 col-lg-5 pl-lg-5 d-flex justify-content-center flex-column">
                    <button className="btn btn-facebook r-font mb-2">
                        <i className="fab fa-facebook-f fa-fw"></i> {getWords(language).sign_up_fb}
                    </button>
                    <button className="btn btn-google r-font mt-2 ">
                        <i className="fab fa-google fa-fw" ></i> {getWords(language).sign_up_g}
                    </button>
                </div>
            </div>
        </div>
    )
}

Registry.propTypes = {
    deleteErrors: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { registerUser, deleteErrors }
)(withRouter(Registry));