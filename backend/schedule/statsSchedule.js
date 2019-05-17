const schedule = require('node-schedule')

module.exports = app => {
    schedule.scheduleJob('*/1 * * * *', async function () {
        const usersCount = await app.db('users').count('id').first()
        const categoriesCount = await app.db('categories').count('id').first()
        const articlesCount = await app.db('articles').count('id').first()

        /**Acessar o modelo de estatísiticas */
        const { Stat } = app.api.stat
        
        /**Receber a última estatística do MongoDB */
        const lastStat = await Stat.findOne({}, {},
            { sort: { 'createdAt' : -1 } })

        /**Criar a nova estatística
         * Em cima da nova e da última estatística comparamos para ver se mudou,
         * se mudou, então persistimos no MongBD
         */
        const stat = new Stat ({
            users: usersCount.count,
            categories: categoriesCount.count,
            articles: articlesCount.count,
            createdAt: new Date()
        })

        /**Se aúltima estatística não estiver setada ou o valor for diferente, consideramos que o
         * usuário mudou.
         * Testamos changeCategories e changeArticles da mesma forma que o usuário. 
         * Insere os dados mesmo com eles zerados com o "!== lastStat.*"
         */
        const changeUsers = !lastStat || stat.users !== lastStat.users
        const changeCategories = !lastStat || stat.categories !== lastStat.categories
        const changeArticles = !lastStat || stat.articles !== lastStat.articles

        /**Realizando um teste se alguma das estatísticas mudar, ela entra no MongoDB */
        if (changeUsers || changeCategories || changeArticles) {
            stat.save().then(() => console.log('[Stats] Estatísitcas atualizadas!'))
        }
    })
}