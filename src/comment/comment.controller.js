import { response, request } from "express";
import Comment from "./comment.model.js";
import jwt from 'jsonwebtoken'
import Usuario from "../user/user.model.js"

export const commentPost = async (req, res) => {
    const { publicacion, texto } = req.body;

    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "No hay token en el encabezado",
        });
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await Usuario.findById(uid);

    console.log('coment.controller')
    console.log(user)

    if (!user) {
        return res.status(401).json({
            msg: "Usuario no existe en la base de datos",
        });
    }
    if (!user.estado) {
        return res.status(401).json({
            msg: "Token no válido - usuario con estado:false",
        });
    }

    const comment = new Comment({ usuario: user.username, publicacion, texto });

    await comment.save();
    res.status(200).json({
        comment
    });
}

export const commentPut = async (req, res) => {
    const { id } = req.params;
    const { _id, usuario, publicacion, ...resto } = req.body;

    const comment = await Comment.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json({
        msg: 'comentario actualizado',
        comment
    })
}

export const commentDelete = async (req, res) => {
    const { id } = req.params;

    const comment = await Comment.findByIdAndUpdate(id, { estado: false }).lean();

    res.status(200).json({
        msg: 'Comentario eliminado',
        comment
    });
}