import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos.js";

import {
    existeUsuarioById,
    existenteEmail, 
    existenteUsuario,
} from "../helpers/db-validators.js";

import {
    usuariosPost,
    usuariosLogin,
    usuariosPut,
    passwordPatch,
    getUserSetting
} from "./user.controller.js";

const router = Router();

router.post('/settings', getUserSetting)

router.post(
    "/",
    [
        check("email", "El correo debe ser un correo").isEmail(),
        check("email").custom(existenteEmail),
        check("user").custom(existenteUsuario),
        validarCampos,
    ], usuariosPost);

router.post(
    "/login",
    [
        validarCampos,
    ], usuariosLogin);

router.put(
    "/update",
    [
        check("usuario").custom(existenteUsuario),
        check("userId", "El id no es un formato válido de MongoDB").isMongoId(),
        check("userId").custom(existeUsuarioById),
        validarCampos,
    ], usuariosPut);

router.patch(
        "/password",
        [
            check('password', 'la password es necesaria').not().isEmpty(),
            check("userId", "El id no es un formato válido de MongoDB").isMongoId(),
            check("userId").custom(existeUsuarioById),
            validarCampos,
        ], passwordPatch);

export default router;