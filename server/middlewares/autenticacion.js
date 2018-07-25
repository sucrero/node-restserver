const jwt = require('jsonwebtoken')

//====================
// Verificar token
//====================

let verificaToken = (req, res, next) => {
    //leer parametros desde los headers
    let token = req.get('Authorization')
        //     // console.log(token);
    jwt.verify(token, process.env.SEED, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: "Token no válido"
                    }
                })
            }

            req.usuario = decoded.usuario
            next()
        })
        // res.json({
        //     token: token
        // })


    //permite ocntinuar con el resto de la funcion donde se esta llamando


}

module.exports = {
    verificaToken
}