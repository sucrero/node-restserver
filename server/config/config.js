//====================
// Puerto
//====================
process.env.PORT = process.env.PORT || 3000


//====================
// ENTORNO
//====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//====================
//VENCIMIENTO DEL TOKEN
//====================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

//====================
//SEED DE autenticación
//====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'


//====================
// BDD
//====================
let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB


//====================
// Google ClientID
//====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '6749900720-ksqqbtsfj53h6gfh3bk2ivoi2lmsvbfd.apps.googleusercontent.com'