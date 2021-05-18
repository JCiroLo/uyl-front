import React, { useEffect, useState } from 'react'
import PropTypes from "prop-types"
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getSites, getOwnerData } from "../../actions/searchActions"

import { format } from 'timeago.js'
import ReactTooltip from "react-tooltip"

import '../../public/css/Search.scss'

const SearchSites = (props) => {
    const [sites, setSites] = useState([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingProgress, setLoadingProgress] = useState(0)

    const urlParams = new URLSearchParams(props.location.search)
    const key = urlParams.get('search')

    document.title = "Search: " + key;
    window.scrollTo(0, 0);

    const { darkMode } = props.auth.bools
    const { getSites, getOwnerData } = props

    useEffect(() => {
        // Reset values on re-search
        setError(false)
        setLoading(true)
        setLoadingProgress(0)
        setSites([])

        const searchSites = async () => {
            try {
                const data = await getSites(key);

                setLoadingProgress(90)

                const sitesWithOwner = await Promise.all(data.map(async (site) => {
                    const ownerData = await getOwnerData(site.userID);
                    return {
                        ...site,
                        ownerName: ownerData.name,
                        ownerFollowers: ownerData.followers
                    }
                }));

                setLoadingProgress(100)
                setSites(sitesWithOwner)
                setLoading(false)
                data.length === 0 && setError(true)
            }
            catch (e) {
                setLoadingProgress(100)
                setError(true)
                setLoading(false)
            }
        }
        searchSites()
    }, [key, getSites, getOwnerData])

    const errorMessage = <div className="container">
        <h4 className="center r-font detail-error404-title text-muted">Not found</h4>
    </div>

    const foundSites = sites.map(site => {
        const url = site.thumb
            ? `https://firebasestorage.googleapis.com/v0/b/upyourlink-2556d.appspot.com/o/thumbnails%2F${site._id}_800x450?alt=media&token=d8e74adf-4ba3-4926-8deb-643afc6f5eeb`
            : 'https://firebasestorage.googleapis.com/v0/b/upyourlink-2556d.appspot.com/o/thumbnails%2Fno_thumb_800x450.jpg?alt=media&token=d86d9caa-ebbd-4014-b453-fe4689199516'

        const { views } = site.rating

        return <div key={site._id} className="col-12 search-site row pl-0">

            {/* Thumbnail */}
            <Link to={"/Site/" + site._id} className="col-12 col-md-6 col-lg-4 col-xl-3 p-0">
                <div className="site-thumb w-100 thumb-preview" style={{ backgroundImage: `url(${url})` }} />
            </Link>

            <div className="search-site-data col">
                {/* Title */}
                <Link to={"/Site/" + site._id}>
                    <h4 className="search-site-title k-font">{site.title}</h4>
                </Link>

                {/* Views - Date*/}
                <span className="text-muted k-font"><i className="fas fa-eye fa-fw" /> {views} - {format(site.createdAt)}</span>

                {/* Owner */}
                <Link
                    className="row text-muted k-font m-0"
                    to={"/User/" + site.userID}
                    data-tip
                    data-for={"tooltip-" + site._id}
                >
                    <i className="fas fa-user-circle my-auto fa-fw" style={{ padding: '0 10px 0 0', fontSize: '20px' }} />
                    <span className="my-auto">
                        <span className="text-capitalize">{site.ownerName}</span>
                    </span>
                </Link>

                {/* Content */}
                <Link to={"/Site/" + site._id}>
                    <p className="search-site-content k-font mt-2">{site.content}</p>
                </Link>

            </div>
            <ReactTooltip
                id={"tooltip-" + site._id}
                place='right'
                effect='solid'
                clickable={true}
                type={darkMode ? "light" : "dark"}
                className="d-flex p-2 k-font"
            >
                <i className="fas fa-user fa-fw" />
                <p className="mb-0 mx-2 my-auto">{site.ownerFollowers} followers</p>
            </ReactTooltip>
        </div>
    })

    return (
        <div className="container-fluid">
            {loading
                ? <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        aria-valuenow={loadingProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: `${loadingProgress}%` }}
                    ></div>
                </div>
                : <div className="row m-0">
                    {error
                        ? errorMessage
                        : foundSites
                    }
                </div>
            }

        </div>
    )
}

SearchSites.propTypes = {
    getSites: PropTypes.func.isRequired,
    getOwnerData: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { getSites, getOwnerData }
)(SearchSites);


