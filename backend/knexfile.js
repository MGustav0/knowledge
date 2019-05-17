/**Caso não usae db.db, colocar na const assim: { db } */
const db = require ('./.env')

module.exports = {
	client: 'postgresql',
	connection: db.db,
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		tableName: 'knex_migrations'
	}
};
