import React, { useState } from 'react'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import {  } from '../../actions/authActions'

import { Modal, Button } from 'react-bootstrap'
import classnames from "classnames"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const DetailUserSettings = ({ modalIsOpen, optionsModal, user, darkMode, switchModal, updateName }) => {

    const [spaces, setSpaces] = useState(0)
    const [error, setError] = useState({ required1: false, incorrectPass1: false, required2: false, incorrectPass2: false }) // 1:Change name, 2:Change Pass 

    const [changeNickValues, setNickValues] = useState({ newNick: "", currentPass: "" })
    const [changePassValues, setPassValues] = useState({ newPass: "", newPass2: "", oldPass: "" })

    function resetErrors() {
        setError({ required1: false, incorrectPass1: false, required2: false, incorrectPass2: false })
    }

    const onChangeName = (e) => {
        const { id, value } = e.target;
        if (id === "newNick") {
            const exp = /\s+/g
            const spaces = value.match(exp)
            spaces ? setSpaces(spaces.length) : setSpaces(0)
        }
        setNickValues({ ...changeNickValues, [id]: value })
    }

    const onChangePass = (e) => {
        const { id, value } = e.target;
        setPassValues({ ...changePassValues, [id]: value })
    }

    const onSubmitName = async (e) => {
        e.preventDefault();
        if (changeNickValues.newNick !== "" && changeNickValues.currentPass !== "") {
            const data = {
                id: user.id,
                name: changeNickValues.newNick,
                pass: changeNickValues.currentPass
            }
            const res = await updateUserName(data);
            if (res) {
                updateName(newNick)
                setNickValues({ newNick: "", currentPass: "" })
                resetErrors()
            } else {
                setError({ ...error, incorrectPass1: true })
            }
        }
        if (changeNickValues.newNick === "" || changeNickValues.currentPass === "") {
            setError({ ...error, required1: true })
        }
    }

    const onSubmitPass = async (e) => {
        const { newPass, newPass2, oldPass } = changePassValues;
        e.preventDefault();
        if (newPass !== "" && newPass2 !== "" && oldPass !== "") {
            if (newPass === newPass2) {
                const data = {
                    id: user.id,
                    newPass,
                    oldPass
                }
                const res = await updateUserPassword(data);
                if (res) {
                    setPassValues({ newPass: "", newPass2: "", oldPass: "" })
                    resetErrors()
                    switchModal()
                } else {
                    setError({ ...error, incorrectPass2: true })
                }
            }
        }
        if (newPass === "" || newPass2 === "" || oldPass === "") {
            setError({ ...error, required2: true })
        }
    }

    const onCancel = () => {
        resetErrors()
        setNickValues({ newNick: "", currentPass: "" })
        setPassValues({ newPass: "", newPass2: "", oldPass: "" })
    }

    const { newNick, currentPass } = changeNickValues;
    const { newPass, newPass2, oldPass } = changePassValues;

    const errorName = newNick === user.name || spaces > 0;
    const errorPass = newPass !== newPass2;
    
    optionsModal === "nick"
        ? MySwal.fire({
            title: 'Change nick',
            html: <>
                <div className="form-group row">
                    <label htmlFor="newNick" className="col-md-3 col-sm-4 col-form-label">New name:</label>
                    <div className="col-md-9 col-sm-8">
                        <input
                            type="text"
                            className={classnames("form-control userConfig-input", {
                                "is-invalid": spaces > 0 || newNick === user.name || error.required1,
                            })}
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            id="newNick"
                            placeholder={user.name}
                            value={newNick ? newNick : ""}
                            onChange={onChangeName}
                        />
                        <div className="invalid-feedback">
                            {spaces > 0 && "Please choose an username without spaces"}
                            {newNick === user.name && "Please choose a diferent username"}
                            {error.required1 && newNick === "" && "Name field is required"}
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="currentPass" className="col-md-3 col-sm-4 col-form-label">Confirm password</label>
                    <div className="col-md-9 col-sm-8">
                        <input
                            type="password"
                            className={classnames("form-control myAccount-pass userConfig-input", {
                                "is-invalid": error.incorrectPass1 || error.required1
                            })}
                            autoCapitalize="none"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            id="currentPass"
                            placeholder="Password"
                            value={currentPass || ""}
                            onChange={onChangeName}
                        />
                        <div className="invalid-feedback">
                            {error.incorrectPass1 && "The password is incorrect"}
                            {error.required1 && currentPass === "" && "Password field is required"}
                        </div>
                    </div>

                </div>
            </>,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            buttonsStyling: false,
            customClass: {
                container: darkMode ? "dark-mode" : "light-mode",
                content: 'k-font',
                confirmButton: 'btn btn-modal r-font mr-2',
                cancelButton: 'btn btn-modal r-font ml-2',
            }
        })
        : MySwal.fire({

        })

    /* <Modal
        size="lg"
        className={darkMode ? "dark-mode" : "light-mode"}
        show={modalIsOpen}
        backdrop="static"
        keyboard={true}
        centered>
        {optionsModal.type === "nick"
            ? <form noValidate onSubmit={onSubmitName} autoComplete="off" className="change-nick">
                <Modal.Header className="r-font">
                    <Modal.Title>
                        Change nick
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="k-font">
                    <div className="form-group row">
                        <label htmlFor="newNick" className="col-md-3 col-sm-4 col-form-label">New name:</label>
                        <div className="col-md-9 col-sm-8">
                            <input
                                type="text"
                                className={classnames("form-control userConfig-input", {
                                    "is-invalid": spaces > 0 || newNick === user.name || error.required1,
                                })}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                id="newNick"
                                placeholder={user.name}
                                value={newNick ? newNick : ""}
                                onChange={onChangeName}
                            />
                            <div className="invalid-feedback">
                                {spaces > 0 && "Please choose an username without spaces"}
                                {newNick === user.name && "Please choose a diferent username"}
                                {error.required1 && newNick === "" && "Name field is required"}
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="currentPass" className="col-md-3 col-sm-4 col-form-label">Confirm password</label>
                        <div className="col-md-9 col-sm-8">
                            <input
                                type="password"
                                className={classnames("form-control myAccount-pass userConfig-input", {
                                    "is-invalid": error.incorrectPass1 || error.required1
                                })}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                                id="currentPass"
                                placeholder="Password"
                                value={currentPass || ""}
                                onChange={onChangeName}
                            />
                            <div className="invalid-feedback">
                                {error.incorrectPass1 && "The password is incorrect"}
                                {error.required1 && currentPass === "" && "Password field is required"}
                            </div>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="default"
                        className="btn-unStyled r-font"
                        onClick={() => {
                            switchModal()
                            onCancel()
                        }}
                    >
                        Cancel
                         </Button>
                    <Button
                        variant="default"
                        type="submit"
                        disabled={errorName}
                        className="btn-unStyled r-font">
                        Update
                        </Button>
                </Modal.Footer>
            </form>
            : <form noValidate onSubmit={onSubmitPass} autoComplete="off" className="change-pass">
                <Modal.Header className="r-font">
                    <Modal.Title>
                        Change password
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="k-font">
                    <div className="form-group row">
                        <label htmlFor="newPass" className="col-md-3 col-sm-4 col-form-label">New password:</label>
                        <div className="col-md-9 col-sm-8 my-auto">
                            <input
                                type="password"
                                className={classnames("form-control myAccount-pass userConfig-input", {
                                    "is-valid": newPass === newPass2 && newPass !== "",
                                    "is-invalid": error.required2
                                })}
                                id="newPass"
                                placeholder=""
                                value={newPass || ""}
                                onChange={onChangePass}
                            />
                            <div className="invalid-feedback">
                                {error.required2 && newPass === "" && "New password is required"}
                            </div>
                        </div>

                    </div>
                    <div className="form-group row">
                        <label htmlFor="newPass2" className="col-md-3 col-sm-4 col-form-label">Confirm new password:</label>
                        <div className="col-md-9 col-sm-8 my-auto">
                            <input
                                type="password"
                                className={classnames("form-control myAccount-pass userConfig-input", {
                                    "is-invalid": (newPass !== newPass2 && newPass2 !== "") || error.required2,
                                    "is-valid": newPass === newPass2 && newPass2 !== ""
                                })}
                                id="newPass2"
                                placeholder=""
                                value={newPass2 || ""}
                                onChange={onChangePass}
                            />
                            <div className="invalid-feedback">
                                {newPass !== newPass2 && "Passwords don't match"}
                                {error.required2 && newPass2 === "" && "New password confirmation is required"}
                            </div>
                        </div>

                    </div>
                    <br />
                    <div className="form-group row">
                        <label htmlFor="oldPass" className="col-md-3 col-sm-4 col-form-label">Old password:</label>
                        <div className="col-md-9 col-sm-8 my-auto">
                            <input
                                type="password"
                                className={classnames("form-control myAccount-pass userConfig-input", {
                                    "is-invalid": error.required2 || error.incorrectPass2,
                                })}
                                id="oldPass"
                                placeholder=""
                                value={oldPass || ""}
                                onChange={onChangePass}
                            />
                            <div className="invalid-feedback">
                                {error.incorrectPass2 && "The password is incorrect"}
                                {error.required2 && oldPass === "" && "Please type old password"}
                            </div>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="default"
                        className="btn-unStyled r-font"
                        onClick={() => {
                            switchModal()
                            onCancel()
                        }}
                    >
                        Cancel
                        </Button>
                    <Button
                        variant="default"
                        type="submit"
                        className={classnames("r-font", {
                            "btn-invalid": errorPass,
                            "btn-unStyled": !errorPass
                        })}>
                        Update
                        </Button>
                </Modal.Footer>
            </form>
        }
    </Modal> */

    return (<></>)
}

DetailUserSettings.propTypes = {
    updateName: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { updateName }
)(DetailUserSettings);


