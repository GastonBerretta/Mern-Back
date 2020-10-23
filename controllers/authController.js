const bcrypt = require("bcryptjs")
const Usuario = require("../models/Usuario")
const {generarJWT} = require("../helpers/jwt")
authController = {
  crearUsuario: async(req, res) => {
    const { email, password } = req.body;
    try {
      let usuario = await Usuario.findOne({email})
      
      if(usuario){
        res.status(400).json({
          ok: false,
          msg: "Un usuario existe con ese Correo"
        })
      }
     usuario = new Usuario( req.body);

     // Encriptar contraseña
     const salt = bcrypt.genSaltSync()
     usuario.password = bcrypt.hashSync(password,salt)
     await usuario.save();     

     //Generar JWT
     const token = await generarJWT(usuario.id,usuario.name)
        res.status(201).json({
          ok: "true",
          uid: usuario.id,
          name:usuario.name,
          token
    });
    } catch (error) {
      console.log("Error")
      res.status(500).json({
        ok:false,
        msg: "Error"
      }) 
    }
    
  },

  loginUsuario:async (req, res) => {
    const { email, password } = req.body;

    try {
      
      const usuario = await Usuario.findOne({email})
      
      if(!usuario){
        res.status(400).json({
          ok: false,
          msg: "Un usuario y contraseña no Valido"
        })
      }
      //Confirmar contra
      const validPass = bcrypt.compareSync(password,usuario.password)
      
      if(!validPass){
        return res.status(400).json({
          ok:"false",
          msg:"Error"
        })
      }

      //Generar JWT
      const token = await generarJWT(usuario.id,usuario.name)
       return res.json({
        ok: "true",
          uid: usuario.id,
          name:usuario.name,
          token
      })
    } catch (error) {
      console.log("Error")
      return res.status(500).json({
        ok:false,
        msg: "Errora"
      }) 
    }

  },
  revalidarToken: async (req, res) => {
    const uid = req.uid
    const name = req.name

    const token = await generarJWT(uid,name)
    res.json({
      ok: true,
      token
    });
  },
};

module.exports = authController;
