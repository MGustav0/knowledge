const queries = require('./queries')

module.exports = app => {
    /**Usando o destructuring, acessando os atributos dentro deste objeto e expondo as duas
     * variáveis com os mesmos nomes das funções que estão dentro de "app.api.validation"
      */
    const { existsOrError } = app.api.validation

    /**Salva e altera */
    const save = (req, res) => {
        /**Pegaremos o body da requisição e fazer o teste: */
        const article = { ...req.body }
        if(req.params.id) article.id = req.params.id

        /**Validações */
        try {
            existsOrError(article.name, 'Nome não informado')
            existsOrError(article.description, 'Descrição não informada')
            existsOrError(article.categoryId, 'categoria não informada')
            existsOrError(article.userId, 'Autor não informado')
            existsOrError(article.content, 'Conteúdo não informado')
        } catch(msg) { /**Tudo isso cai dentro do "catch" para capturar a mensagem */
            res.status(400).send(msg)
        }

        /**Para persistir, precisa-se saber se: */
        if(article.id) {
            app.db('articles') // passamos a tabela 'articles'
                .update(article)
                /**Para ter certeza que estamos alterando apenas o artigo em específico */
                .where({ id: article.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else { // incluir o artigo
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('articles')
                /**Para ter certeza que estamos excluindo apenas o artigo em específico */
                .where({ id: req.params.id }).del()
            
            try {
                existsOrError(rowsDeleted, 'Artigo não encontrado.')
            } catch(msg) {
                return res.status(400).send(msg) // return usado para não seguir na parte de baixo
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

        /**Construindo a paginação do sistema (somente para artigos).
         * Pode ser replicado para outros módulos como o de usuários.
         */
    const limit = 10 // usado para paginação e limita a quantidade de artigos (registros)
    const get = async (req, res) => {
        /**Esperando a página a ser exibida a partir da requisição da query (não dos params),
         * se não estiver setado, o padrão é 1.
        */
        const page = req.query.page || 1
        
        /**Importante ter o "count" para definir quantas páginas serão geradas a partir
         * da quantidade de elementos (artigos) por página.
         */
        const result = await app.db('articles').count('id').first()
        const count = parseInt(result.count)

        app.db('articles')
            .select('id', 'name', 'description') // trazendo resultados da consulta
            /**ofset realiza o cálculo em cima do page e do limit, para trazer os números da paginação */
            .limit(limit).offset(page * limit - limit)
            /**Não retornamos o artigo diretamente, criamos o objeto "data" para receber três atributos em uma única chamada*/
            .then(articles => res.json({ data: articles, count, limit }))
            .catch(err => res.status(500).send(err))
    }

        /**Retornará apenas um artigo, sem paginação */
    const getById = (req, res) => {
        app.db('articles')
            .where({ id: req.params.id })
            /**Toda consulta retorna um array, ele retorna o primeiro resultado com o first() */
            .first()
            /**O artigo vêm no formato binário, é necessária a conversão antes de retornar para o usuário */
            .then(article => {
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }

    /**Pegar os artigos por 'id', importando do arquivo queries.js. Esta consulta, também será paginada,
     * espera-se receber o atributo page, para saber em qua página queremos obter a consulta paginada.
     */
    const getByCategory = async (req, res) => {
        /**Pegar todos os artigos da catergoria que foi informada e os filhos. Obetendo como resposta objetos com apenas os IDs */
        const categoryId = req.params.id
        const page = req.query.page || 1
        /**Consulta crua (raw), a partir do knex */
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
        /**Extraindo os IDs para um Aarray de IDs */
        const ids = categories.rows.map(c => c.id)
        
        /**Construir as consultas para obter os artigos e autor em outra tabela, a "users". Inserindo alias (apelido) para as tabelas "a: ''articles" */
        app.db({ a: 'articles', u: 'users' })
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
            .limit(limit).offset(page * limit - limit)
            /**Deve-se igualar as duas tabelas para encontrar o autor do artigo */
            .whereRaw('?? = ??', ['u.id', 'a.userId'])
            /**Selecionar especificamente os artigos */
            .whereIn('categoryId', ids)
            .orderBy('a.id', 'desc') /**Ordenação decrecente por ID */
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByCategory }
}