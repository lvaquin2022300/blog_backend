import Usuario from "../user/user.model.js";
import Publication from "../publication/publication.model.js";
import Comentario from "../comment/comment.model.js";

export const existenteEmail = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El email ${ correo } ya fue registrado`);
    }
}

export const existenteUsuario = async (usuario = '') => {
    const existeUsuario = await Usuario.findOne({usuario});
    if(existeUsuario){
        throw new Error(`El usuario ${ usuario } ya fue registrado`);
    }
}

export const noExistenteUsuario = async (usuario = '') => {
    const existeUsuario = await Usuario.findOne({usuario});
    if(!existeUsuario){
        throw new Error(`El usuario ${ usuario } no existe`);
    }
}

export const noExistenteEmail = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if(!existeEmail){
        throw new Error(`El email ${ correo } no existe`);
    }
}

export const existeUsuarioById = async ( id = '') => {
    const existeUsuario = await Usuario.findOne({id});
    if(existeUsuario){
        throw new Error(`El usuario con el id: ${ id } no existe`);
    }
}

export const existePubliById = async ( id = '') => {
    const existePubli = await Publication.findOne({id});
    if(existePubli){
        throw new Error(`La publicación con el id: ${ id } no existe`);
    }
}

export const existeComenById = async ( id = '') => {
    const existeComen = await Comentario.findOne({id});
    if(existeComen){
        throw new Error(`La comentario con el id: ${ id } no existe`);
    }
}