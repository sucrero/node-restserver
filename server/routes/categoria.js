const express = require('express')
const Categoria = require('../models/categoria')

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')

const app = express()




//========================================
// Mostrar todas las categorías
//========================================

app.get('/categoria', verificaToken, (req, res) => {
    // mostrar todas las categorías

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 0
    limite = Number(limite)

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                })
            })
        })

})

//========================================
// Mostrar una categoría por id
//========================================

app.get('/categoria/:id', verificaToken, (req, res) => {
    // mostrar una categoría
    //Categoria.findById(......)
    let cod = req.params.id

    Categoria.findById(cod, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es válido'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

})

//========================================
// Crear una nueva categoría
//========================================

app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id

    let body = req.body

    // console.log(req.usuario._id);
    // return;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })



})

//========================================
// actualizar una nueva categoría
//========================================

app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })


    })

})

//========================================
// actualizar una nueva categoría
//========================================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un administrador puede borrar categorías
    // Categoria.findByIdAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            returnres.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoría borrada'
        })


    })
})

module.exports = app