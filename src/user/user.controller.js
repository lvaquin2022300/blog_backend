import { response, request } from "express";
import bcryptjs from "bcryptjs";
import Usuario from "./user.model.js";
import { generarJWT } from "../helpers/generar-jwt.js"

export const usuariosPost = async (req, res) => {
    try {
      const { username, password, email } = req.body;
  
      const salt = bcryptjs.genSaltSync();
      const encryptedPassword = bcryptjs.hashSync(password, salt);
  
      const user = await Usuario.create({
        username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      const token = await generarJWT(user.id, user.email)
  
      return res.status(200).json({
        msg: "user has been added to database",
        userDetails: {
          user: user.username,
          email: user.email,
          token: token,
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send("No se pudo registrar el usuario");
    }
  };

export const usuariosLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      //verificar si el email existe:
      const user = await Usuario.findOne({ email: email.toLowerCase() });
  
      if(user && (await bcryptjs.compare(password, user.password))){
        const token = await generarJWT(user.id, user.email)
  
        res.status(200).json({
          msg: "Login Ok!!!",
          userDetails: {
            username: user.username,
            token: token,
            id: user.id
          },
        });
      }
  
      if (!user) {
        return res
          .status(400)
          .send(`Wrong credentials, ${email} doesn't exists en database`);
      }
  
      // verificar la contraseña
      const validPassword = bcryptjs.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).send("wrong password");
      }
     
    } catch (e) {
      res.status(500).send("Comuniquese con el administrador");
    }
  };

export const getUserSetting = async (req, res) => {
    try{
        const { userId } = req.body

        console.log(userId)

        const userData = await Usuario.findById(userId)

        return res.status(200).json({
            id: userData.id,
            username: userData.username,
            email: userData.email,
        })
    }catch(e){
        return res.status(500).send('Something went wrong')
    }
}

export const usuariosPut = async (req, res) => {
  const { userId, username, email } = req.body;

  const actualizaciones = { username: username, email: email };
  const usuarioActualizado = await Usuario.findByIdAndUpdate(userId, actualizaciones, { new: true });

  console.log(usuarioActualizado)

  res.status(200).json({
      msg: 'Tu usuario ha sido actualizado',
      usuario_nuevo: usuarioActualizado.usuario
  });
}


export const passwordPatch = async (req, res) => {
    try{
        const { userId, password, newPassword} = req.body

        const userData = await Usuario.findById(userId, {password: 1})

        const isPasswordCorrect = await bcryptjs.compare(password, userData.password)

        if(!isPasswordCorrect){
            return res.status(400).send('Invalid password. Please try again')
        }

        const encryptedPassword = await bcryptjs.hash(newPassword, 10)

        await Usuario.updateOne({_id: userId},{password: encryptedPassword})

        return res.status(200).send('Password changed succesfully')
    }catch(e){
        return res.status(500).send('Somthing went wrong')
    } 
}