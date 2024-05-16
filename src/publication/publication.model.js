import mongoose from 'mongoose';

const PublicationSchema = mongoose.Schema ({
    usuario: {
        type: String,
        required: [true, 'usuario obligatorio']
    },
    titulo: {
        type: String,
        required: [true, 'titulo obligatorio']
    },
    categoria: {
        type: String,
        required: [true, 'categoria obligatoria']
    },
    texto: {
        type: String,
        required: [true, 'texto obligatorio']
    },
    comentarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    estado:{
        type: Boolean,
        default: true
    }
});

PublicationSchema.methods.toJSON = function(){
    const { __v, _id, ...publication} = this.toObject();
    publication.pid = _id;
    return publication;
}

export default mongoose.model('Publication', PublicationSchema);