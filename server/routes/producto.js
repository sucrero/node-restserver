const express = require('express')


const { verificaToken } = require('../middlewares/autenticacion')

let app = express();
let Producto = require('../models/producto')



// OBTENER TODOS LOS PRODUCTOS

app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario, categoria
    //paginado

    let desde = req.query.desde || 0
    desde = Number(desde)

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })


})

// OBTENER PRODUCTOS por id
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario, categoria
    //paginado

    let id = req.params.id

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                })
            }
            res.json({
                ok: true,
                productos: productDB
            })


        })
})

// Buscar poductos

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino
    let regex = new RegExp(termino, 'i'); //expresión regular
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos
            })
        })


})




// CREAR NUEVO PRODUCTOS
app.post('/productos/', verificaToken, (req, res) => {

    let body = req.body
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    })

    producto.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productDB
        })

    })


})

// ACTUALIZAR UN PRODUCTOS
app.put('/productos/:id', verificaToken, (req, res) => {
    //GRABAR EL USUAURI
    //GRABAR UNA CATEGRA DEL LISTADO QUE TENEMOS

    let id = req.params.id
    let body = req.body

    Producto.findById(id, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            })
        }

        productDB.nombre = body.nombre
        productDB.precioUni = body.precioUni
        productDB.categoria = body.categoria
        productDB.descripcion = body.descripcion
        productDB.disponible = body.disponible

        productDB.save((err, productDBGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productDBGuardado
            })
        })



    })


})

// BORRAR UN PRODUCTOS
app.delete('/productos/:id', verificaToken, (req, res) => {
    //GRABAR EL USUAURI
    //GRABAR UNA CATEGRA DEL LISTADO QUE TENEMOS
    //borrar lógicamente. disponible pasar a falso

    let id = req.params.id

    Producto.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "ID no existe"
                }
            })
        }
        productDB.disponible = false
        productDB.save((err, productDBDel) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            req.json({
                ok: true,
                producto: productDBDel,
                mensaje: "Producto borrado"
            })
        })
    })
})

module.exports = app;