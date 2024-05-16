import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema ({
    usuario: {
        type: String,
        required: [true, 'usuario obligatorio']
    },
    publicacion: {
        type: String,
        required: [true, 'titulo obligatorio']
    },
    texto: {
        type: String,
        required: [true, 'texto obligatorio']
    },
    estado:{
        type: Boolean,
        default: true
    }
});

CommentSchema.methods.toJSON = function(){
    const { __v, _id, ...enterprise} = this.toObject();
    enterprise.cid = _id;
    return enterprise;
}

export default mongoose.model('Comment', CommentSchema);