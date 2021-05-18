import React from "react"

import PropTypes from "prop-types"
import { connect } from "react-redux"

import '../../public/css/Landing.scss'
import { getWords } from '../../public/Languaje'

const Landing = props => {

    document.title = "UpYourLink"

    const { isAuthenticated, user, language } = props.auth;

    return (
        <div className="container">
            {isAuthenticated && <p className="r-font text-center mb-0 greeting">
                {getWords(language).greeting_landing1} {user.name}, {getWords(language).greeting_landing2}
            </p>}
            <h1 className="title">Up Your Link</h1>
            {!isAuthenticated && <h4 className="subtitle ">{getWords(language).subtitle}</h4>}
        </div>

    )

}
Landing.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
)(Landing);