const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')

const fs = require('fs') //por defecto en node
const path = require('path') //por defecto en node

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo
    let id = req.params.id


    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        })
    }



    let archivo = req.files.archivo; //archivo es el nombre del input

    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length - 1]
    extension = extension.toLowerCase()
        //console.log(extension);

    // extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    //cambiar nombre del archivo
    let nombreAcrhivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    archivo.mv(`uploads/${ tipo }/${ nombreAcrhivo }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // aqui, imagen cargada

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreAcrhivo)
        } else {
            imagenProducto(id, res, nombreAcrhivo)
        }
    });
})

function imagenUsuario(id, res, nombreAcrhivo) {

    Usuario.findById(id, (err, usuarioBD) => {

        if (err) {
            borraArchivo(nombreAcrhivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioBD) {
            borraArchivo(nombreAcrhivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }


        borraArchivo(usuarioBD.img, 'usuarios')

        usuarioBD.img = nombreAcrhivo
        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreAcrhivo

            })
        })
    })
}

function imagenProducto(id, res, nombreAcrhivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreAcrhivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borraArchivo(nombreAcrhivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        borraArchivo(productoDB.img, 'productos')
        productoDB.img = nombreAcrhivo
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreAcrhivo

            })
        })

    })
}

function borraArchivo(nombreImg, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImg }`)

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app