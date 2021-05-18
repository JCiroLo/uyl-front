import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import '../../public/css/Dashboard.scss'
/* import { getWords } from '../../public/Languaje'

import Skeleton from '../layout/LoadingSkeleton' */

const Dashboard = (props) => {

    //const { language} = props.auth

    document.title = "Dashboard"

    return (
        <div className="container">
            <h1 className="r-font text-muted text-center">Sites</h1>
        </div>
    );

}
Dashboard.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
)(Dashboard);