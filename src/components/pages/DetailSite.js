import React, { useEffect, useState, useCallback, useRef } from 'react'
import PropTypes from "prop-types"
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    incView,
    getSite,
    getOwnerData,
    getSessionUserInfo,
    followUser,
    rateSite
} from "../../actions/detailSiteActions"

import { format } from 'timeago.js'
import nl2br from 'react-nl2br'
import Linkify from 'react-linkify'
import { Animated } from "react-animated-css";
import Loader from 'react-loader-spinner'
import ReactTooltip from 'react-tooltip'
import classnames from "classnames";

import '../../public/css/DetailSite.scss'

const isEmpty = require("is-empty")

const DetailSite = (props) => {

    const [siteInfo, setSiteInfo] = useState(
        { title: "", content: "", userID: "", rating: { views: 0, rateUp: 0 } }
    );
    const [owner, setOwner] = useState({ name: "", followers: 0 })
    const [following, setFollowing] = useState(false)
    const [rated, setRated] = useState(false)

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    //const [loadingThumb, setLoadingThumb] = useState(true)
    const [inSession, setInSession] = useState(false)

    const [scrollCoord, setScrollCoord] = useState(0)

    const { id } = props.match.params
    const { darkMode } = props.auth.bools
    const currentUser = props.auth.user
    const { rateUp, views } = siteInfo.rating
    const { incView, getSite, getOwnerData, getSessionUserInfo } = props

    useEffect(() => {
        window.scrollTo(0, 0);
        const preload = async () => {
            try {
                // Add +1 view to the site
                await incView(id)

                // Load Site info
                const { siteData, title } = await getSite(id)
                setSiteInfo(siteData)

                // Set page title
                document.title = title

                // Load site owner info
                const ownerData = await getOwnerData(siteData.userID)
                setOwner({ name: ownerData.data.name, followers: ownerData.data.followers })

                if (!isEmpty(currentUser)) {

                    // If session, you can subscribe and rate
                    setInSession(true)

                    // Load session user info
                    const data = await getSessionUserInfo(currentUser.id)

                    // Load state of buttons
                    if (data.following.includes(siteData.userID)) {
                        setFollowing(true)
                    }
                    if (data.ratedSites.includes(id)) {
                        setRated(true)
                    }
                }
                setLoading(false)
            }
            catch (e) {
                setError(true);
                document.title = "Error :("
                setLoading(false)
            }
        }
        preload()
    }, [id, currentUser, incView, getSite, getOwnerData, getSessionUserInfo])

    const followButton = async () => {
        ReactTooltip.rebuild()
        if (inSession) {
            setFollowing(!following)
            if (following) { //Unfollow
                setOwner({ ...owner, followers: owner.followers - 1 })
                await props.followUser(currentUser.id, siteInfo.userID, false)

            }
            else { //Follow
                setOwner({ ...owner, followers: owner.followers + 1 })
                await props.followUser(currentUser.id, siteInfo.userID, true)
            }
        }
        else {
            //show login modal
        }
    }

    const rateUpButton = async () => {
        if (inSession) {
            setRated(!rated)
            if (rated) {
                setSiteInfo({ ...siteInfo, rating: { ...siteInfo.rating, rateUp: siteInfo.rating.rateUp - 1 } })
                await props.rateSite(id, currentUser.id, false)
            }
            else {
                setSiteInfo({ ...siteInfo, rating: { ...siteInfo.rating, rateUp: siteInfo.rating.rateUp + 1 } })
                await props.rateSite(id, currentUser.id, true)
            }
        } else {
            // show login modal
        }
    }

    const scrollHandler = useCallback(
        (event) => {
            setScrollCoord((event.target.scrollingElement.scrollTop / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
        }, [setScrollCoord]
    )

    const errorMessage = <div className="container">
        <h1 className="center r-font detail-error404-title text-muted">Error 404</h1>
        <p className="center k-font detail-error404-content text-muted">Sorry!, the site that you're trying to access does not exist.
            This usually happen when the owner has removed it, or when the URL has been copied wrong</p>
        <div className="d-flex justify-content-center">
            <Link to="/" className="btn-unStyled r-font">
                <i className="fas fa-home fa-fw" /> Go to homepage
            </Link>
            <Link to="/" className="btn-unStyled r-font" style={{ marginLeft: "20px" }}>
                <i className="fas fa-exclamation-circle fa-fw" /> Contact us
            </Link>
        </div>
    </div>

    // Thumbnail url
    const url = `https://firebasestorage.googleapis.com/v0/b/upyourlink-2556d.appspot.com/o/thumbnails%2F${siteInfo._id}_800x450?alt=media&token=d8e74adf-4ba3-4926-8deb-643afc6f5eeb`

    // Buttons
    const btnClassNames = inSession ? "btn btn-styled-noColor" : "btn btn-unStyled"

    // Url detector color
    const componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" className="link" rel="noopener noreferrer">
            {text}
        </a>
    )

    const date = "Created " + format(siteInfo.createdAt)
    const limitScroll = 50

    useEventListener('scroll', scrollHandler)

    return (
        <>
            {!loading ?
                error
                    ? errorMessage
                    : <div className="detail">
                        <div className='detail-thumb w-100'
                            style={{
                                backgroundImage: `url(${url})`,
                                opacity: scrollCoord > limitScroll ? 0.1 : 1, top: scrollCoord > limitScroll && 0
                            }}>
                        </div>

                        <div
                            className={classnames("detail-actions k-font", { 'visible': scrollCoord > limitScroll })}
                            style={{
                                opacity: scrollCoord > limitScroll ? '1' : '0'
                            }}
                        >
                            <div className="row m-0 detail-actions-visitor">
                                {/* User info */}
                                <div className="row text-muted k-font m-0">
                                    <i className="fas fa-user-circle fa-3x my-auto" style={{ padding: '0 10px 0 0' }} />
                                    <div className="my-auto">
                                        <Link to={"/User/" + siteInfo.userID} className="btn btn-unStyled p-0">{owner.name}</Link>
                                        <p className="m-0 text-muted">Followers: {owner.followers}</p>
                                    </div>
                                </div>

                                <div className="row m-0">
                                    {/* Rate */}
                                    <div className="my-auto mx-2" data-tip="Rate" data-for="actionsTooltip">
                                        {rated
                                            ? <button onClick={rateUpButton} className="btn btn-styled-color">
                                                <i className="fas fa-heart fa-fw" /> {rateUp}
                                            </button>
                                            : <button onClick={rateUpButton} className={btnClassNames}>
                                                <i className="fas fa-heart fa-fw" /> {rateUp}
                                            </button>
                                        }
                                    </div>

                                    {/* Follow */}
                                    {siteInfo.userID !== currentUser.id &&
                                        <div className="my-auto">
                                            {following
                                                ? <button onClick={followButton} className="btn btn-styled-color">
                                                    Following
                                                </button>
                                                : <button
                                                    onClick={followButton}
                                                    className={btnClassNames}
                                                    data-tip="Follow"
                                                    data-for="actionsTooltip"
                                                >
                                                    <i className="fas fa-user-plus fa-fw" />
                                                </button>}
                                        </div>
                                    }

                                    {/* Edit */}
                                    {siteInfo.userID === currentUser.id &&
                                        <button className="btn btn-styled-noColor my-auto">
                                            <i className="fas fa-pencil-alt fa-fw"></i> Edit
                                    </button>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="detail-title m-0" style={{ visibility: scrollCoord > limitScroll ? 'hidden' : 'visible' }}>
                            <span></span>
                            <Animated animationOut="fadeOutUp"
                                animationOutDuration={500}
                                isVisible={scrollCoord < limitScroll}>
                                <h3 className="r-font">{siteInfo.title}</h3>
                                <h2 className="k-font">{siteInfo.updatedAt ? date : null}</h2>
                                <h2 className="k-font"><i className="fas fa-eye fa-fw"></i> {views}</h2>
                            </Animated>
                            <div className="detail-scrollMessage" style={{ opacity: scrollCoord > limitScroll ? 0 : 1, top: scrollCoord > limitScroll && 0 }}>
                                <span>
                                    <i className="fas fa-chevron-down fa-fw fa-2x"></i>
                                </span>
                            </div>
                        </div>
                        <div className="detail-content" style={{ opacity: scrollCoord > limitScroll ? 1 : 0 }}>
                            <div className="detail-content-display">
                                <div className="detail-content-title">
                                    <div className="detail-content-title-inner r-font">
                                        {siteInfo.title}
                                    </div>
                                </div>
                                <div className="detail-content-description">
                                    <p className="k-font mt-3 detail-site-content">
                                        <Linkify componentDecorator={componentDecorator}> {nl2br(siteInfo.content)} </Linkify>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                : <div className="detail">
                    <div className="detail-images">
                        <div className="detail-thumb">

                        </div>
                    </div>
                    <div className="detail-title justify-content-center">
                        <span className="r-font detail-loadingText k-font">Loading</span>
                        <Loader
                            type="ThreeDots"
                            color="#999999"
                            height={30}
                            width={100}
                        />
                    </div>
                </div>
            }
            <ReactTooltip
                id="actionsTooltip"
                place="bottom"
                effect="solid"
                type={darkMode ? "light" : "dark"}
            />
        </>
    )
}

const useEventListener = (eventName, handler, element = window) => {
    // Create a ref that stores handler
    const savedHandler = useRef();

    // Update ref.current value if handler changes.
    // This allows our effect below to always get latest handler ...
    // ... without us needing to pass it in effect deps array ...
    // ... and potentially cause effect to re-run every render.
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(
        () => {
            // Make sure element supports addEventListener
            // On 
            const isSupported = element && element.addEventListener;
            if (!isSupported) return;

            // Create event listener that calls handler function stored in ref
            const eventListener = event => savedHandler.current(event);

            // Add event listener
            element.addEventListener(eventName, eventListener);

            // Remove event listener on cleanup
            return () => {
                element.removeEventListener(eventName, eventListener);
            };
        },
        [eventName, element] // Re-run if eventName or element changes
    );
};

DetailSite.propTypes = {
    rateSite: PropTypes.func.isRequired,
    incView: PropTypes.func.isRequired,
    getSite: PropTypes.func.isRequired,
    getOwnerData: PropTypes.func.isRequired,
    getSessionUserInfo: PropTypes.func.isRequired,
    followUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { incView, getSite, getOwnerData, getSessionUserInfo, followUser, rateSite }
)(DetailSite);