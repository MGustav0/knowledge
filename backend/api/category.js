module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        // o save inclui ou altera a categoria 
        const category = {
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId /**Para selecionar a categoria pai */
        }

        // Caso o "id" nos parâmetros da requisição
        if(req.params.id) category.id = req.params.id

        try {
            existsOrError(category.name, "Nome não informado.")
        } catch(msg) {
            return res.status(400).send(msg)
        }

        if(category.id) {
            app.db('categories')
                .update(category)
                .where({ id: category.id }) // seleciona a categoria pelo id
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código da categoria não informado.')

            const subcategory = await app.db('categories') // consultar DB usando await
                /**parentId é igual ao Id que recebeu dos parâmetros da requisição para ser excluído */
                .where({ parentId: req.params.id })
            /**Se existir categoria, dá erro */
            notExistsOrError(subcategory, 'Categoria possui subcategorias.')
            /**Verificar se existem artigos associados */
            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            notExistsOrError(articles, 'Categoria possui artigos.')
            // excluindo a categoria selecionada
            const rowsDeleted = await app.db('categories')
                    .where({ id: req.params.id }).del()
            // Se não conseguir excluir
            existsOrError(rowsDeleted, 'Categoria não foi encontrada.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    /**função para receber uma lista de categorias e subcategorias,
     * irá retornar a lista de categorias com esse atributo a mais */
    const withPath = categories => {
        // faz um filtro pegando exatamente o parent que está procurando
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId) // retorna a categoria do pai
            return parent.length ? parent[0] : null
        }
        // transforar um arry de categorias em outro com a adição do atributo path
        const categoriesWithPath = categories.map(category => {
            let path = category.name // começa com o nome da categoria
            // procura em category.parentId o parent, se existir
            let parent = getParent(categories, category.parentId)

            /**enquanto existir parent, continue procurando em parent e concatenando em path
             * para montar o caminho (path) completo */
            while(parent) {
                path = `${parent.name} > ${path}` // concatenando com o path atual
                parent = getParent(categories, parent.parentId) // procura o próximo parent
            }

            // retornando o objeto
            return { ...category, path }
        })

        // Ordenando alfabeticamente a lista de categorias e subcategorias
        categoriesWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    // retornar as categorias
    const get = (req, res) => {
        app.db('categories')
            // recupera um array de categorias com path em json
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('categories')
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    /**Transformar o array de categorias em uma estrutura de árvore */
    const toTree = (categories, tree) => {
        // setar o atributo árvore em quem não possui o "parentId"
        if(!tree) tree = categories.filter(c => !c.parentId)
        // faremos uma transformação na árvore pegando os nós pai
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })

        return tree
    }

    /**Criando um serviço que será mapeado para a função get da url '/categories/tree' */
    const getTree = (req, res) => {
        /**Realizaremos uma consulta e enviaremos para getTree.
         * Para obter todos os atributos e campos ta tabela categoria 
         * não é necessário usar o "select" e se for obter todas as categorias da tabela
         * também não é necessário usar o "where" */
        app.db('categories')
            /**Recebe a lista de categorias do BD, responde a lista com um JSON.
             * Verificar se há necessidade de receber o path na árvore, caso vá usar (arquivo mais leve).
             * Passamos "categories" para a função "withPath", ele então gera todas as categorias
             * com o atributo path, o resultado vai ser chamado para a função "toTree" que converte
             * em árvore, e passa o objeto gerado com todas as categorias para ser transformado em JSON
             * para ser enviado para o front-end.
             */
            .then(categories => res.json(toTree(withPath(categories)))) // (toTree(categories))
            .catch(err => res.status(500).send(err))
    }

    /**Todos os métodos e serviços são declarados aqui! */
    return { save, remove, get, getById, getTree }
    // após aqui, crie as rotas! Mapeando as funções
}