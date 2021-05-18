import React, { useState, useEffect } from 'react'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import classnames from "classnames"
import { createSite, catchError } from "../../actions/authActions"
import { storage } from '../../firebase'

import ReactTooltip from "react-tooltip"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { getWords } from '../../public/Languaje'
import { Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import 'react-circular-progressbar/dist/styles.css'
import '../../public/css/CreateSite.scss'
import defaultThumbDark from '../../public/img/noThumb-dark.png'
import defaultThumbLight from '../../public/img/noThumb-light.png'
import uploadFileDark from '../../public/img/uploadFile-dark.png'
import uploadFileLight from '../../public/img/uploadFile-light.png'

const MySwal = withReactContent(Swal)

const CreateSite = props => {

    //const imageColors = usePalette(thumb)

    const [siteInfo, setSiteInfo] = useState({
        title: "",
        contentCreateSite: ""
    })
    const [siteID, setSiteID] = useState("") // After upload
    const [errors, setErrors] = useState({})
    const [thumb, setThumb] = useState(null)
    const [uploadInfo, setUploadInfo] = useState({
        state: false,
        progress: 0,
        success: false
    })
    const [switchThumb, setSwitchThumb] = useState(false)
    const [siteSubmited, setSiteSubmited] = useState(false)

    const { darkMode } = props.auth.bools
    const { language } = props.auth
    const { createSite, catchError } = props

    document.title = getWords(language).create_site

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    const onSubmit = async e => {
        e.preventDefault()
        window.scrollTo(0, 0);

        setSiteSubmited(true)

        const { user } = props.auth
        const siteData = {
            title: siteInfo.title,
            content: siteInfo.contentCreateSite,
            userID: user.id,
            thumb: thumb ? true : false
        }

        try {
            const res = await createSite(siteData)
            uploadThumb(res.data._id)
            setSiteID(res.data._id)
        }
        catch (err) {
            catchError(err)
            setSiteSubmited(false)
        }
    }

    const onChange = e => {
        const eID = e.target.id
        const eValue = e.target.value

        if (eID === "title" || eID === "contentCreateSite") {
            setSiteInfo({ ...siteInfo, [eID]: eValue })

        }
        else if (eID === "thumb") {
            setThumb(e.target.files[0])
            setSwitchThumb(true)
        }
    }

    const uploadThumb = id => {

        MySwal.fire({
            html: uploadInfo.success
                ? <>The site {siteInfo.title} has been created</>
                : <><span className="text-muted">Creating:</span> {siteInfo.title}.</>

        })

        setUploadInfo({
            ...uploadInfo,
            state: true
        })
        try {
            if (thumb) {
                // Create task to begin upload thumbnail
                const task = storage.child(id).put(thumb);

                task.on('state_changed', (snapshot) => {
                    setUploadInfo({
                        success: false,
                        progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                        state: true
                    })
                }, (error) => {
                    console.log(error.message);
                }, () => {
                    setTimeout(() => {
                        setUploadInfo({
                            progress: 100,
                            success: true,
                            state: true
                        })
                        setSiteSubmited(false)
                    }, 1000);
                })
            } else {
                setTimeout(() => {
                    setUploadInfo({
                        progress: 100,
                        success: true,
                        state: true
                    })
                    setSiteSubmited(false)
                }, 1000);
            }


        } catch (error) {
            console.log(error.message)
        }

    }

    const resetThumb = () => {
        setThumb(null)
        setSwitchThumb(false)
    }

    const resetSomeStates = () => {
        setSiteInfo({
            title: "",
            contentCreateSite: ""
        })
        setSiteID("")
        setErrors({})
        setUploadInfo({
            state: false,
            progress: 0,
            success: false
        })
        setSiteSubmited(false)
        resetThumb()
    }

    const resetErrorOnClick = e => {
        errors.content && setErrors({ ...errors, content: "" })
        errors.title && setErrors({ ...errors, title: "" })
    }

    const tooltip = <ReactTooltip
        className="r-font"
        id="createSiteTooltip"
        place="bottom"
        effect="solid"
        type={darkMode ? "light" : "dark"}
    />

    const previewThumbURL = thumb ? URL.createObjectURL(thumb) : (darkMode ? defaultThumbDark : defaultThumbLight);

    const create =
        <div className="container-md row ml-auto mr-auto">
            <div className="d-flex createSite-box-general col-md-8 offset-md-2">
                <form autoComplete="off" className="createSite-form" noValidate onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="text-muted r-font" htmlFor="title">
                            {getWords(language).title}:
                        </label>
                        <input
                            onClick={resetErrorOnClick}
                            onChange={onChange}
                            value={siteInfo.title}
                            error={errors.title}
                            id="title"
                            type="text"
                            className={classnames("form-control r-font", {
                                "is-invalid": errors.title
                            })}
                        />
                        <span className="red-text k-font">
                            {errors.title}
                        </span>
                    </div>
                    <div className="form-group">
                        <label className="r-font text-muted r-font" htmlFor="contentCreateSite">
                            {getWords(language).content}:
                    </label>
                        <textarea
                            onClick={resetErrorOnClick}
                            onChange={onChange}
                            value={siteInfo.contentCreateSite}
                            error={errors.content}
                            id="contentCreateSite"
                            type="text"
                            rows="5"
                            className={classnames("form-control k-font", {
                                "is-invalid": errors.content
                            })}
                        />
                        <span className="red-text k-font">
                            {errors.content}
                        </span>
                    </div>
                    <div className="form-group">
                        <label className="text-muted r-font">{getWords(language).thumb}: </label>
                        <div className="row m-0">
                            <div className="col-6 ggg">
                                <img
                                    className={classnames("createSite-preview-thumb", {
                                        'selected-shadow': !switchThumb
                                    })}
                                    onClick={resetThumb}
                                    src={darkMode ? defaultThumbDark : defaultThumbLight}
                                    alt="" />
                            </div>
                            <div className="col-6">
                                <label data-html="true" htmlFor="thumb" className="filupp">
                                    <img
                                        className={classnames("createSite-preview-thumb-upload", {
                                            'selected-shadow': switchThumb
                                        })}
                                        src={previewThumbURL}
                                        alt="" />
                                    <img
                                        className="createSite-preview-thumb-onHover"
                                        src={darkMode ? uploadFileDark : uploadFileLight}
                                        alt="" />
                                    <input type="file" id="thumb" accept="image/*" onChange={onChange} />
                                </label>

                            </div>
                        </div>

                    </div>
                    <div className="col-12">
                        <button
                            style={{
                                width: "100%",
                                marginTop: "1rem"
                            }}
                            type="submit"
                            className="btn btn-styled-color r-font"
                        >
                            {siteSubmited
                                ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                : getWords(language).create_site
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>

    const statusModal =
        <Modal
            className={darkMode ? "dark-mode" : "light-mode"}
            show={true}
            backdrop="static"
            keyboard={false}
            size="xl"
            centered
        >
            <Modal.Header className="r-font">
                <Modal.Title className="mx-auto">
                    {uploadInfo.success
                        ? <>The site {siteInfo.title} has been created</>
                        : <><span className="text-muted">Creating:</span> {siteInfo.title}.</>
                    }
                </Modal.Title>
            </Modal.Header>
            {uploadInfo.success
                ? <Modal.Body>
                    <div className="container">
                        <div className="float-md-left detail-thumbAndOptions">
                            {/* Thumbnail */}
                            <img className="detail-thumb w-100 d-inline" src={previewThumbURL} alt="UploadedThumb" />
                        </div>
                        <h4><strong className={darkMode ? "text-muted" : "text-dark"}>{siteInfo.title}</strong></h4>
                        <br />
                        <p className="noMargin">Share url:</p>
                        <p className="noMargin link">{'localhost:3000/Site/' + siteID}</p>
                    </div>
                </Modal.Body>
                : <Modal.Body>
                    <div className="ml-auto mr-auto col-12 col-sm-4 center r-font">
                        <CircularProgressbar
                            value={uploadInfo.progress}
                            text={`${Math.round(uploadInfo.progress)}%`}
                            styles={buildStyles({
                                textColor: darkMode ? "#f1c40f" : "#0e626c",
                                pathColor: darkMode ? "#f1c40f" : "#0e626c",
                                trailColor: "rgba(150, 150, 150, 0.3)"
                            })}
                        />
                    </div>
                </Modal.Body>
            }
            {uploadInfo.success &&
                <Modal.Footer className="mx-auto">
                    {tooltip}
                    <button
                        onClick={resetSomeStates}
                        className="btn btn-unStyled r-font"
                        data-tip={getWords(language).go_back}
                        data-for="createSiteTooltip">
                        <i className="fas fa-arrow-left fa-fw fa-2x createSite-icon-btn"></i>
                    </button>
                    <button
                        className="btn btn-unStyled r-font"
                    >
                        <Link
                            to="/Dashboard"
                            data-tip="Dashboard"
                            data-for="createSiteTooltip">
                            <i className="fas fa-home fa-fw fa-2x createSite-icon-btn"></i>
                        </Link>
                    </button>
                </Modal.Footer >
            }
        </Modal >

    return (
        <>
            {create}
            {uploadInfo.state && statusModal}
        </>
    )

}

CreateSite.propTypes = {
    catchError: PropTypes.func.isRequired,
    createSite: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { createSite, catchError }
)(CreateSite);
