const admin = require('./admin')
/**Essas são as únicas URLs que Não estarão sujeitas à validação do token, são públicas */
module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    /**Adicionar o ".all(app.config.passport.authenticate())" em todas as rotas/serviços que
     * dependam de autenticação.
     */
    app.route('/users')
        .all(app.config.passport.authenticate())
        /**localização da função save para a rota (arquivo user.js).
         * Cada um desses aponta para uma função dentro dos arquivos */
        .post(admin(app.api.user.save))
        .get(admin(app.api.user.get))

    // O parâmetro :id, indica se ele está inserindo ou alterando
    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save))
        .get(admin(app.api.user.getById))
        .delete(admin(app.api.user.remove))

    app.route('/categories')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.category.get))
        .post(admin(app.api.category.save))

    /**Cuidado com a ordem! Rotas genéricas devem vir antes das específicas como o ('categories/:id')*/
    app.route('/categories/tree')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getTree)

    app.route('/categories/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getById)
        .put(admin(app.api.category.save))
        .delete(admin(app.api.category.remove))

    app.route('/articles')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.article.get))
        .post(admin(app.api.article.save))
    
    app.route('/articles/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getById)
        .put(admin(app.api.article.save))
        .delete(admin(app.api.article.remove)) /**Verifica se é administrador antes de executar */

    app.route('/categories/:id/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getByCategory)

    app.route('/stats')
        .all(app.config.passport.authenticate())
        .get(app.api.stat.get)

    /**Execução da validação de entrada nas rotas do back-end */
    app.post('/validateAdmin', app.api.auth.validateAdmin)
}