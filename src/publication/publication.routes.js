import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwts.js";

import {
    publiGet,
    publiPost,
    publiPut,
    publiDelete,
    findPostById,
    publiGetUser
} from "./publication.controller.js";

const router = Router();

router.get("/", [], publiGet);

router.post("/user", [], publiGetUser);

router.get("/:id", [], findPostById)

router.post(
    "/",
    [
        validarJWT,
        check("titulo", "El titulo es obligatorio").not().isEmpty(),
        check("categoria", "La categoria es obligatorio").not().isEmpty(),
        check("texto", "El texto es obligatorio").not().isEmpty(),
        validarCampos,
    ], publiPost);

router.put(
    "/:id",
    [
        validarCampos,
    ], publiPut);

router.delete(
    "/:id",
    [
        validarCampos,
    ], publiDelete);

export default router;