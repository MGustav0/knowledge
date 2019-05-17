const { authSecret } = require('../.env') /**Ler o token e verificar se foi assinado de forma correta */
const passport = require('passport') /**Pode validar com outros provedores, como google e facebook */
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt /**Extrair token jwt da requisição com o passport-jwt */

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() /**Recupera o token */
    }

    /**Estratégia com função callback.
     * O payload vem definido do arquivo auth.js
     */
    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => done (null, user ? { ...payload } : false)) /**Se usuário não está setado = false */
            .catch(err => done(err, false))
    })

    passport.use(strategy)

    /**O authenticate será usado nas rotas (routes.js), para filtrar as requisições e não permitir
     * que sejam feitas em cima dos webservices que precisam passa pelo passport, 
     * ou seja, ter o usuário logado.
     * Não teremos nenhum tipo de controle de sessão associado a essa autenticação.
     */
    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}