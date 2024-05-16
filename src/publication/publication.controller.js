import { response, request } from "express";
import Publication from "./publication.model.js";
import Comment from "../comment/comment.model.js";
import jwt from 'jsonwebtoken';
import Usuario from "../user/user.model.js"

export const publiGet = async (req, res) => {
    const { limite, desde } = req.query;

    try {
        const total = await Publication.countDocuments({ estado: true });

        const posts = await Publication.find({ estado: true })
            .skip(Number(desde) || 0)
            .limit(Number(limite) || 10)
            .lean();
        for (const publication of posts) {
            const id = publication._id
            const comments = await Comment.find({ publicacion: id, estado: true }).lean();
            publication.comentarios = comments;
            publication.comentariosCount = comments.length;
        }

        res.status(200).json({
            total,
            posts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const publiGetUser = async (req, res) => {
    const { limite, desde } = req.query

    try {
        const { user } = req.body
        console.log('publi: '+user)
        const total = await Publication.countDocuments({ estado: true, usuario: user });

        const posts = await Publication.find({ estado: true, usuario: user })
            .skip(Number(desde) || 0)
            .limit(Number(limite) || 10)
            .lean();
        for (const publication of posts) {
            const id = publication._id
            const comments = await Comment.find({ publicacion: id, estado: true }).lean();
            publication.comentarios = comments;
            publication.comentariosCount = comments.length;
        }

        res.status(200).json({
            total,
            user,
            posts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const findPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Publication.findById(id).lean();

        if (!post) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        const comments = await Comment.find({ publicacion: id, estado: true }).lean();
        post.comentarios = comments;
        post.comentariosCount = comments.length;

        res.status(200).json({ post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const publiPost = async (req, res) => {
    const { titulo, categoria, texto } = req.body;

    const token = req.header("x-token");


    if (!token) {
        return res.status(401).json({
            msg: "No hay token en el encabezado",
        });
    }

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await Usuario.findById(uid);


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

    const posts = new Publication({ usuario: user.username, titulo, categoria, texto });

    await posts.save();
    res.status(200).json({
        posts
    });
}

export const publiPut = async (req, res) => {
    const { id } = req.params;
    const { _id, titulo, categoria, usuario, ...resto } = req.body;

    const posts = await Publication.findByIdAndUpdate(id, resto, { new: true });

    res.status(200).json({
        msg: 'Publicación actualizada',
        posts
    })
}

export const publiDelete = async (req, res) => {
    const { id } = req.params;

    const posts = await Publication.findByIdAndUpdate(id, { estado: false });

    res.status(200).json({
        msg: 'Publicación eliminada',
        posts
    })
}