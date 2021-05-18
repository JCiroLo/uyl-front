import React, { useEffect, useState } from 'react'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import { storage } from '../../firebase'
import { deleteSite, updateName, updateUserName, updateUserPassword } from "../../actions/authActions"
import {
    getUserSites, getUserInfo, getVisitorInfo, followUser
} from "../../actions/detailUserActions"

import { Button, Dropdown } from 'react-bootstrap'
import { getWords } from '../../public/Languaje'
import { format } from 'timeago.js'
import ReactTooltip from 'react-tooltip'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import LoadingSkeleton from '../layout/LoadingSkeleton'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import '../../public/css/DetailUser.scss'

const isEmpty = require("is-empty")
const MySwal = withReactContent(Swal)

const DetailUser = (props) => {
    const [userSites, setUserSites] = useState([])
    const [userInfo, setUserInfo] = useState({})
    const [following, setFollowing] = useState(false)

    // Settings
    const [loading, setLoading] = useState(true)
    const [errorLoading, setErrorLoading] = useState(false)

    const { id } = props.match.params
    const { language, user, bools } = props.auth
    const { darkMode } = bools
    const { getUserSites, getUserInfo, getVisitorInfo, followUser, deleteSite, updateName } = props

    useEffect(() => {
        window.scrollTo(0, 0);
        const getInfo = async () => {
            try {
                const sites = await getUserSites(id)
                setUserSites(sites.reverse())

                const userInfo = await getUserInfo(id)
                setUserInfo(userInfo)

                if (!isEmpty(user)) {

                    // Load session user info
                    const data = await getVisitorInfo(user.id)

                    // Load state of buttons
                    if (data.following.includes(id)) {
                        setFollowing(true)
                    }
                }

                document.title = userInfo.name

                setLoading(false)

            } catch (e) {
                setErrorLoading(true)
                setLoading(false)
            }
        }
        getInfo()
    }, [id, user, getUserSites, getUserInfo, getVisitorInfo, props.auth])

    // Handlers - user settings

    const openAccountSettings = () => {
        MySwal.fire({
            html: <div className="row m-0">
                <button className="k-font btn btn-unStyled col-12 mb-1"
                    onClick={() => {
                        MySwal.closeModal(); modalChangeName(); return false;
                    }}>

                    Change nick
                </button>
                <button className="k-font btn btn-unStyled col-12 mt-1"
                    onClick={() => {
                        MySwal.closeModal(); modalChangePass(); return false;
                    }}>

                    Change password
                </button>
            </div>,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: <><i className="fas fa-arrow-left"></i></>,
            buttonsStyling: false,
            customClass: {
                container: darkMode ? "dark-mode" : "light-mode",
                content: 'k-font p-0',
                cancelButton: 'k-font btn btn-unStyled col-12 p-0',
            }
        })
    }

    const modalChangeName = async () => {
        const res = await MySwal.fire({
            width: '60rem',
            title: 'Change nick',
            html: <>
                <div className="form-group row">
                    <label htmlFor="newNick" className="col-md-3 col-sm-4 col-form-label">New name:</label>
                    <div className="col-md-9 col-sm-8">
                        <input
                            type="text"
                            className=/* {classnames( */"form-control userConfig-input"/* , {
                                "is-invalid": spaces > 0 || newNick === user.name || error.required1,
                            })} */
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            id="newNick"
                            placeholder={user.name}
                        />
                        {/* <div className="invalid-feedback">
                            {spaces > 0 && "Please choose an username without spaces"}
                            {newNick === user.name && "Please choose a diferent username"}
                            {error.required1 && newNick === "" && "Name field is required"}
                        </div> */}
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="currentPass" className="col-md-3 col-sm-4 col-form-label">Confirm password</label>
                    <div className="col-md-9 col-sm-8">
                        <input
                            type="password"
                            className=/* {classnames( */"form-control myAccount-pass userConfig-input"/* , {
                                "is-invalid": error.incorrectPass1 || error.required1
                            })} */
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            id="currentPass"
                            placeholder="Password"
                        />
                        {/* <div className="invalid-feedback">
                            {error.incorrectPass1 && "The password is incorrect"}
                            {error.required1 && currentPass === "" && "Password field is required"}
                        </div> */}
                    </div>

                </div>
            </>,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
                container: darkMode ? "dark-mode" : "light-mode",
                header: 'align-items-start p-0',
                content: 'k-font text-left p-0',
                actions: 'justify-content-end p-0',
                title: 'r-font',
                confirmButton: 'btn btn-modal r-font mr-2',
                cancelButton: 'btn btn-modal r-font ml-2',
            },
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                const formData = {
                    newNick: document.getElementById('newNick').value,
                    currentPass: document.getElementById('currentPass').value
                }
                const message = await onSubmitName(formData)
                return message
            }
        })

        if (!res.isConfirmed) return

        if (res.value.alert === 'empty_fields'
            || res.value.alert === 'has_spaces'
            || res.value.alert === 'incorrect_pass') {

            await MySwal.fire({
                titleText: res.value.alert === 'empty_fields'
                    ? 'No deben haber campos vacíos.' : (
                        res.value.alert === 'has_spaces'
                            ? 'El nombre no puede tener campos vacíos.'
                            : (
                                res.value.alert === 'incorrect_pass' && 'La contraseña no coincide.'
                            )
                    ),
                icon: 'error',
                confirmButtonText: 'Atras',
                buttonsStyling: false,
                customClass: {
                    container: darkMode ? "dark-mode" : "light-mode",
                    title: 'k-font mx-auto',
                    confirmButton: 'btn btn-modal r-font mr-2'
                }
            })
            modalChangeName()
        }
        else if (res.value.alert === 'success') {
            MySwal.fire({
                titleText: 'Se actualizó tu nombre correctamente.',
                icon: 'success',
                confirmButtonText: 'Ok',
                buttonsStyling: false,
                customClass: {
                    container: darkMode ? "dark-mode" : "light-mode",
                    title: 'k-font mx-auto',
                    confirmButton: 'btn btn-modal r-font mr-2'
                }
            })
        }
    }

    const onSubmitName = async (formData) => {

        if (/\s/.test(formData.newNick)) {
            return { 'alert': 'has_spaces' }
        }

        if (formData.newNick.trim() !== "" && formData.currentPass.trim() !== "") {
            const data = {
                id: user.id,
                name: formData.newNick,
                pass: formData.currentPass
            }
            const res = await updateUserName(data);
            if (res) {
                updateName(formData.newNick)
                return { 'alert': 'success' }
            } else {
                return { 'alert': 'incorrect_pass' }
            }
        }
        else {
            return { 'alert': 'empty_fields' }
        }
    }

    const modalChangePass = async () => {
        const res = await MySwal.fire({
            width: '60rem',
            title: 'Change password',
            html: <>
                <div className="form-group row">
                    <label htmlFor="newPass" className="col-md-3 col-sm-4 col-form-label">New password:</label>
                    <div className="col-md-9 col-sm-8 my-auto">
                        <input
                            type="password"
                            className=/* {classnames( */"form-control myAccount-pass userConfig-input"/* , {
                                "is-valid": newPass === newPass2 && newPass !== "",
                                "is-invalid": error.required2
                            })} */
                            id="newPass"
                            placeholder=""
                        />
                        {/* <div className="invalid-feedback">
                            {error.required2 && newPass === "" && "New password is required"}
                        </div> */}
                    </div>

                </div>
                <div className="form-group row">
                    <label htmlFor="newPass2" className="col-md-3 col-sm-4 col-form-label">Confirm new password:</label>
                    <div className="col-md-9 col-sm-8 my-auto">
                        <input
                            type="password"
                            className=/* {classnames( */"form-control myAccount-pass userConfig-input"/* , {
                                "is-invalid": (newPass !== newPass2 && newPass2 !== "") || error.required2,
                                "is-valid": newPass === newPass2 && newPass2 !== ""
                            })} */
                            id="newPass2"
                            placeholder=""
                        />
                        {/* <div className="invalid-feedback">
                            {newPass !== newPass2 && "Passwords don't match"}
                            {error.required2 && newPass2 === "" && "New password confirmation is required"}
                        </div> */}
                    </div>

                </div>
                <br />
                <div className="form-group row">
                    <label htmlFor="oldPass" className="col-md-3 col-sm-4 col-form-label">Old password:</label>
                    <div className="col-md-9 col-sm-8 my-auto">
                        <input
                            type="password"
                            className=/* {classnames( */"form-control myAccount-pass userConfig-input"/* , {
                                "is-invalid": error.required2 || error.incorrectPass2,
                            })} */
                            id="currentPass"
                            placeholder=""
                        />
                        {/* <div className="invalid-feedback">
                            {error.incorrectPass2 && "The password is incorrect"}
                            {error.required2 && oldPass === "" && "Please type old password"}
                        </div> */}
                    </div>

                </div>
            </>,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
                container: darkMode ? "dark-mode" : "light-mode",
                header: 'align-items-start p-0',
                content: 'k-font text-left p-0',
                actions: 'justify-content-end p-0',
                title: 'r-font',
                confirmButton: 'btn btn-modal r-font mr-2',
                cancelButton: 'btn btn-modal r-font ml-2',
            },
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                const formData = {
                    newPass: document.getElementById('newPass').value,
                    newPass2: document.getElementById('newPass2').value,
                    currentPass: document.getElementById('currentPass').value,
                }
                const message = await onSubmitPass(formData)
                return message
            }
        })

        if (!res.isConfirmed) return

        if (res.value.alert === 'empty_fields'
            || res.value.alert === 'diff_pass'
            || res.value.alert === 'incorrect_pass') {

            await MySwal.fire({
                width: '60rem',
                titleText: res.value.alert === 'empty_fields'
                    ? 'No deben haber campos vacíos.' : (
                        res.value.alert === 'diff_pass'
                            ? 'La contraseña de verificacion no coincide.'
                            : (
                                res.value.alert === 'incorrect_pass' && 'La contraseña antigua no coincide.'
                            )
                    ),
                icon: 'error',
                confirmButtonText: 'Atras',
                buttonsStyling: false,
                customClass: {
                    container: darkMode ? "dark-mode" : "light-mode",
                    title: 'k-font mx-auto',
                    confirmButton: 'btn btn-modal r-font mr-2'
                }
            })
            modalChangePass()
        }
        else if (res.value.alert === 'success') {
            MySwal.fire({
                width: '60rem',
                titleText: 'Se actualizó tu contraseña correctamente.',
                icon: 'success',
                confirmButtonText: 'Ok',
                buttonsStyling: false,
                customClass: {
                    container: darkMode ? "dark-mode" : "light-mode",
                    title: 'k-font mx-auto',
                    confirmButton: 'btn btn-modal r-font mr-2'
                }
            })
        }
    }

    const onSubmitPass = async (formData) => {
        const { newPass, newPass2, currentPass } = formData;

        if (newPass.trim() !== "" && newPass2.trim() !== "" && currentPass.trim() !== "") {
            if (newPass === newPass2) {
                const data = {
                    id: user.id,
                    newPass,
                    currentPass
                }
                const res = await updateUserPassword(data);
                if (res) {
                    return { 'alert': 'success' }
                } else {
                    return { 'alert': 'incorrect_pass' }
                }
            }
            else {
                return { 'alert': 'diff_pass' }
            }
        }
        else {
            return { 'alert': 'empty_fields' }
        }
    }

    // Other functions

    const deletingSite = async (site) => {
        const res = await MySwal.fire({
            allowOutsideClick: false,
            titleText: `Eliminar: ${site.title}`,
            text: 'Esta acción no se puede revertir. ¿Desea continuar?',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Entiendo',
            buttonsStyling: false,
            customClass: {
                container: darkMode ? "dark-mode" : "light-mode",
                header: 'align-items-start p-0',
                content: 'k-font text-left p-0',
                actions: 'justify-content-end p-0',
                title: 'r-font',
                confirmButton: 'btn btn-modal r-font mr-2',
                cancelButton: 'btn btn-modal r-font ml-2',
            },
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                const res = await processDeleteSite(site._id);
                return res
            }

        })
        if (res.value === "Deleted") {
            MySwal.fire({
                titleText: `${site.title} eliminado con exito.`,
                icon: 'success',
                confirmButtonText: 'Ok',
                buttonsStyling: false,
                customClass: {
                    container: darkMode ? "dark-mode" : "light-mode",
                    title: 'justify-content-center',
                    content: 'k-font',
                    confirmButton: 'btn btn-modal r-font mr-2',
                    cancelButton: 'btn btn-modal r-font ml-2',
                }
            })
        }
    }

    const processDeleteSite = async (id) => {
        const task = storage.child(id + "_800x450")
        try {
            await task.delete()
            await deleteSite(id)
            return "Deleted"
        }
        catch {
            await deleteSite(id)
            return "Deleted"
        }
    }

    const onFollow = async () => {
        if (props.auth.isAuthenticated) {
            setFollowing(!following)
            if (following) {
                //Unfollow
                setUserInfo({ ...userInfo, followers: userInfo.followers - 1 })
                await followUser(user.id, id, false)
            }
            else {
                //Follow
                setUserInfo({ ...userInfo, followers: userInfo.followers + 1 })
                await followUser(user.id, id, true)
            }
        }
    }

    const followBtn = props.auth.isAuthenticated && id !== user.id && (following
        ? <button onClick={onFollow} className="k-font btn btn-styled-noColor"> Unfollow</button>
        : <button onClick={onFollow} className="k-font btn btn-styled-color"><i className="fas fa-user-plus" /> Follow</button>
    )

    const sitesToggle = React.forwardRef(({ onClick }, ref) => (
        <i className="userSite-options text-muted fas fa-ellipsis-v fa-fw"
            ref={ref}
            onClick={(e) => {
                e.preventDefault()
                onClick(e)
            }}
        />
    ));

    const userSettingsToggle =
        <Button
            variant="default"
            className="btn btn-unStyled k-font"
            id="account-preferences-sm"
            onClick={() => openAccountSettings()}>
            <i className="fas fa-user-cog fa-2x mr-1"></i>
        </Button>


    const userContainer =
        <div className="row justify-content-between mt-4 m-0">
            <div className="d-flex user-sumary">
                <i className="fas fa-user-circle text-muted fa-4x my-auto mr-3" />
                <div>
                    <p className="m-0 r-font user-name text-capitalize">
                        {userInfo.name}
                    </p>
                    <p className="m-0 k-font text-muted">Followers: {userInfo.followers}</p>
                </div>
                <span className="user-info-icon my-auto ml-3">
                    <i
                        className="fas fa-info-circle fa-2x mr-2"
                        data-tip
                        data-event='click focus'
                        data-for='infoTooltip'
                    />
                </span>
            </div>

            <div className="my-auto user-options">
                {id === user.id &&
                    <span>
                        {userSettingsToggle}
                    </span>
                }
                {followBtn}
            </div>
            <ReactTooltip
                id="infoTooltip"
                place="right"
                effect="solid"
                globalEventOff='click'
                type={bools.darkMode ? "light" : "dark"}>
                <p className="m-0 k-font text-capitalize">{userInfo.email}</p>
                <p className="m-0 k-font"> Account created {format(userInfo.createdAt)}</p>
                <p className="m-0 k-font"> Created in <span className="font-weight-bold">{userInfo.createdAt && userInfo.createdAt.substring(0, 10)}</span></p>

            </ReactTooltip>
        </div>

    const sitesContainer =
        <div className="row mt-4 m-0">
            {userSites.map(site => {
                const url = site.thumb
                    ? `https://firebasestorage.googleapis.com/v0/b/upyourlink-2556d.appspot.com/o/thumbnails%2F${site._id}_800x450?alt=media&token=d8e74adf-4ba3-4926-8deb-643afc6f5eeb`
                    : 'https://firebasestorage.googleapis.com/v0/b/upyourlink-2556d.appspot.com/o/thumbnails%2Fno_thumb_800x450.jpg?alt=media&token=d86d9caa-ebbd-4014-b453-fe4689199516'
                return <div key={site._id} className="col-12 col-sm-6 col-md-3 col-lg-2 p-1 userSite">
                    <Link to={"/Site/" + site._id}>
                        <div className="site-thumb sites-onHover thumb-preview w-100" style={{ backgroundImage: `url(${url})` }}></div>
                    </Link>

                    <div className="d-flex">
                        {/* Title */}
                        <Link to={"/Site/" + site._id}>
                            <h5 className="userSite-title k-font font-weight-bold">{site.title}</h5>
                        </Link>
                        {/* User options */}
                        {id === user.id &&
                            <Dropdown className="ml-auto" drop="right" style={{ marginTop: '8px' }}>
                                <Dropdown.Toggle as={sitesToggle} id="dropdown-options" />
                                <Dropdown.Menu style={{ position: "absolute", paddingTop: "5px", paddingBottom: "5px" }}>
                                    <Dropdown.Item eventKey="1" className="d-flex">
                                        <div className="dropdown-action" onClick={() => deletingSite(site)}>
                                            <i className="fas fa-trash-alt fa-fw" /> <span className="k-font">{getWords(language).delete}</span>
                                        </div>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>}
                    </div>

                    {/* Date and views */}
                    <p className="userSite-dateAndViews text-muted k-font">{site.rating.views} {getWords(language).views} - {format(site.createdAt)}</p>
                </div>
            })}
        </div>

    const errorMessage = <div className="container">
        <h1 className="center r-font detail-error404-title text-muted">Error 404</h1>
        <p className="center k-font detail-error404-content text-muted">Sorry!, the site that you're trying to access does not exist.
            This usually happen when the URL has been copied wrong</p>
        <div className="d-flex justify-content-center">
            <Link to="/" className="btn-unStyled r-font">
                <i className="fas fa-home fa-fw" /> Go to homepage
            </Link>
            <Link to="/" className="btn-unStyled r-font" style={{ marginLeft: "20px" }}>
                <i className="fas fa-exclamation-circle fa-fw" /> Contact us
    </Link>
        </div>
    </div>

    const userSkeleton =
        <SkeletonTheme
            color={!bools.darkMode ? null : "#383b3d"}
            highlightColor={!bools.darkMode ? null : "#4f5457"}
        >
            <div className="row justify-content-between user-sumary mt-4 m-0" style={{ alignItems: "center" }}>
                <div className="d-flex " style={{ alignItems: "center" }}>
                    <Skeleton circle={true} height={75} width={75} style={{ marginRight: "10px" }} />
                    <div >
                        <Skeleton height={25} width={120} />
                        <br />
                        <Skeleton height={15} width={100} />
                    </div>
                </div>
                <div className="d-none d-sm-block my-auto">
                    <Skeleton height={40} width={90} />
                </div>
                <div className="d-block d-sm-none my-auto mx-auto">
                    <Skeleton circle={true} height={50} width={50} />
                </div>
            </div>
        </SkeletonTheme>

    return (
        !errorLoading
            ? <>
                <div className="container">
                    {!loading ? userContainer : userSkeleton}
                </div>
                <div className="container">
                    {!loading
                        ? sitesContainer
                        : <LoadingSkeleton times={6} type={"detailUser"} numberRows="2" />
                    }
                </div>
            </>
            : errorMessage
    )
}

DetailUser.propTypes = {
    getUserSites: PropTypes.func.isRequired,
    getUserInfo: PropTypes.func.isRequired,
    getVisitorInfo: PropTypes.func.isRequired,
    updateName: PropTypes.func.isRequired,
    updateUserName: PropTypes.func.isRequired,
    updateUserPassword: PropTypes.func.isRequired,
    followUser: PropTypes.func.isRequired,
    deleteSite: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { deleteSite, getUserSites, getUserInfo, getVisitorInfo, followUser, updateName, updateUserName, updateUserPassword }
)(DetailUser);