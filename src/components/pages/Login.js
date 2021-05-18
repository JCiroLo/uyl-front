import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { loginUser, deleteErrors } from "../../actions/authActions"

import classnames from "classnames"
import { getWords } from '../../public/Languaje'

import '../../public/css/Login.scss'

const Login = (props) => {

    const [userInfo, setUserInfo] = useState({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const { loginUser, deleteErrors } = props
    const { language, isAuthenticated } = props.auth

    document.title = getWords(language).log_in

    useEffect(() => {
        setErrors(props.errors)
        setLoading(false)
        isAuthenticated && props.history.push("/")
        props.location.state && setUserInfo(prevState => ({ ...prevState, email: props.location.state.regSuccess }))
    }, [props.errors, isAuthenticated, props.history, props.location.state])


    useEffect(() => {
        return () => {
            deleteErrors()
        }
    }, [deleteErrors])

    const onChange = e => {
        const eID = e.target.id
        const eValue = e.target.value
        setUserInfo({ ...userInfo, [eID]: eValue })
    }

    const onSubmit = e => {
        e.preventDefault()
        setLoading(true)
        const userData = {
            email: userInfo.email,
            password: userInfo.password
        };
        loginUser(userData)
    }

    const resetErrorOnClick = e => {
        const eID = e.target.id
        setErrors({ ...errors, [eID]: "" })
    }

    return (
        <div className="container">
            <div className="col-12 pb-2">
                <h4 className="r-font center" style={{ fontSize: "34px" }}>
                    {getWords(language).log_in_below}
                </h4>

            </div>
            <div className="col-12 col-xl-10 offset-xl-1 row mx-auto">
                <div className="col-12 col-lg-7 pr-lg-5">
                    <form className="login-form" noValidate onSubmit={onSubmit}>
                        <div className="form-group col-12 mb-2">
                            <label className="text-muted r-font" htmlFor="email">
                                {getWords(language).email}:
                                </label>
                            <input
                                onChange={onChange}
                                onClick={resetErrorOnClick}
                                value={userInfo.email}
                                id="email"
                                type="email"
                                className={classnames("form-control", {
                                    "is-invalid": errors.email || errors.emailnotfound,
                                    "is-valid": props.location.state
                                })}
                            />
                            <span className="valid-feedback green-text k-font">
                                Now you can Login
                            </span>
                            <span className="red-text k-font">
                                {errors.email && getWords(language).error_email_required}
                                {errors.emailnotfound && getWords(language).error_email_not_found}
                            </span>
                        </div>
                        <div className="form-group col-12">
                            <label className="text-muted r-font" htmlFor="password">
                                {getWords(language).pass}:
                            </label>
                            <input
                                onChange={onChange}
                                onClick={resetErrorOnClick}
                                value={userInfo.password}
                                id="password"
                                type="password"
                                className={classnames("form-control", {
                                    "is-invalid": errors.password || errors.passwordincorrect
                                })}
                            />

                            <span className="red-text k-font">
                                {errors.password ? getWords(language).error_pass_short : null}
                                {errors.passwordincorrect}
                            </span>
                        </div>
                        <div className="col-12 center" >
                            <button
                                style={{
                                    width: "100%",
                                    marginTop: "1rem"
                                }}
                                type="submit"
                                className="btn r-font btn-styled-color"
                            >
                                {!loading
                                    ? getWords(language).log_in
                                    : <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
                            </button>
                            <div className="col-12 k-font center pt-4" >
                                {getWords(language).dont_have_account} <Link to="/Registry" className="link"> {getWords(language).register_now}</Link>
                            </div>
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
                <div className="col-12 col-lg-5 pl-lg-5 second-box row m-0 flex-column justify-content-center">
                    <button className="btn btn-facebook r-font mb-2">
                        <i className="fab fa-facebook-f fa-fw"></i> {getWords(language).log_in_fb}
                    </button>
                    <button className="btn btn-google r-font mt-2 ripple" >
                        <i className="fab fa-google fa-fw" ></i> {getWords(language).log_in_g}
                    </button>
                </div>
            </div>
        </div>
    )

}
Login.propTypes = {
    deleteErrors: PropTypes.func.isRequired,
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { loginUser, deleteErrors }
)(Login);