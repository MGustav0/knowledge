module.exports = app => { /**Modelo contendo as informações de usuário, definindo a data de criação */
    const Stat = app.mongoose.model('Stat', { // Stat = estatística
        /**O modelo contém essas propriedades */
        users: Number,
        categories: Number,
        articles: Number,
        createAt: Date
    })

    /**Criar o método que vai obter do MongoDB a última estatística`.
     * Acessaremos o Stat, que é o model, e faremos ele buscar no MongoDB as estatísticas.
     * Recupera os elementos de forma decrescente a última estatística cadastrada no MongoDB.
     */
    const get = (req, res) => {
        Stat.findOne({}, {}, { sort: { 'createdAt' : -1 } })
            /**Pega o resultado e devolve como JSON */
            .then(stat => {
                const defaultStat = {
                    users: 0,
                    categories: 0,
                    articles: 0
                }
                /**Retorna o defaultStat caso o que ele tenha recebido do BD
                 * não tenha sido uma estatística válida 
                 */
                res.json(stat || defaultStat)
            })
    }

    return { Stat, get }
}