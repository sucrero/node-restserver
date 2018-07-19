// Puerto
process.env.PORT = process.env.PORT || 3000



// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'



// BDD

let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb://usercafe:o123456.@ds141621.mlab.com:41621/cafe-ofo'
}

process.env.URLDB = urlDB