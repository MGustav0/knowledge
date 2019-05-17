
exports.up = function(knex, Promise) { // o "up" é sempre para novas versões do bd
	// criar schema de tabelas
	return knex.schema.createTable('users', table => {
		table.increments('id').primary()
		table.string('name').notNull()
		table.string('email').notNull().unique()
		table.string('password').notNull()
		table.boolean('admin').notNull().defaultTo(false)
	})
};

// o "down" é sempre para as antigas versões do bd
exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users')  
};
