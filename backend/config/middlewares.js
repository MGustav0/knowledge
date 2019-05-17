const bodyParser = require('body-parser')
const cors = require('cors')

/* Usando o cosign, linkando a const "app" do index.js, 
*  centraliza e concentra as dependencias entre os arquivos.
*/
module.exports = app => {
    // Interpreta o JSON qwue vem no corpo da requisição
    app.use(bodyParser.json())

    app.use(cors())
}