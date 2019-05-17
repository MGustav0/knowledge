const app = require('express')()
const consign = require('consign')
const db = require('./config/db') // esse db é o knex do module.exports no arquivo db.js
const mongoose = require('mongoose')

require('./config/mongodb')

/* Utilizaremos apenas este aquivo para chamar quaisquer arquivos, funções e
*  objetos na nossa aplicação
*/

// adicionando db dentro de app, com app.db voce pode utilizar as funções do banco de dados
app.db = db
app.mongoose = mongoose

/**Arquivos de configuração adicionados manualmente */
consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    // todos os arquivos da pasta api serão carregados
    .then('./api')
    .then('./schedule')
    .then('./config/routes.js')
    // injeta como parâmetro a variável app
    .into(app)

app.listen(4000, () => {
    console.log("Back-end executando...")
})