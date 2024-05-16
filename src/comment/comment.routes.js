import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT, validarUsuario } from "../middlewares/validar-jwts.js";

import {
    existeComenById,
    existePubliById
} from "../helpers/db-validators.js";

import {
    commentPost,
    commentPut,
    commentDelete
} from "./comment.controller.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("publicacion", "La publicacion es obligatorio").not().isEmpty(),
        check("publicacion").custom(existePubliById),
        check("texto", "El texto es obligatorio").not().isEmpty(),
        validarCampos,
    ], commentPost);

    router.put(
        "/:id",
        [
            validarUsuario,
            validarCampos,
        ], commentPut);
    
    router.delete(
        "/:id",
        [
            validarUsuario,
            validarCampos,
        ], commentDelete);

export default router;