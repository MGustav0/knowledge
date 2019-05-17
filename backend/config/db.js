const config = require('../knexfile.js')
// instancia o knex passando o arquivo de configuração acima para ele
const knex = require('knex')(config)

/* Executar a migrations no carregamento do back-end
*  Para um sistema maior, não é recomendado fazer, somente agendando
*/
knex.migrate.latest([config])

module.exports = knex