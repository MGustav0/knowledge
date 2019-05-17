const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    // função para criptografar a senha do usuário
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        /* Manda no body da requisição um JSON (representa o usuário), esse body 
        *  foi interceptado pelo bodyParser, este gerou um objeto configurado.
        *  Pega o body usando o operado spread "..." espalhando todos os atributos
        *  que vieram no body e coloco dentro de outro objeto criado (um clone).
        *  O ID pode vir da requisição.
        *  O método save serve para salvar o usuário e para alterar um existente.
        */
        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id

        /**Validando
         * if01 - caso não tenha a URL /users, não terá acesso para criar usuário
         * if02 - caso o usuário não estiver logado ou a flag da requisição estiver marcada como
         * falsa (não tem acesso administrado ou não é usuário)
         */
        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha inválida')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            // saber se o usuário já está cadastrado
            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
            if (!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch(msg) {
            return res.status(400).send(msg) // erro do lado do cliente
        }

        // encriptando
        user.password = encryptPassword(user.password)
        // deletar a confirmação da senha
        delete user.confirmPassword

        if(user.id) {
            // update no BD. Status 204 = tudo certo, mas sem retorno de dados
            // 500 = erro no servidor
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            // caso o ID não tenha sido setado
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    // Obtém a lista de usuários do sistema
    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .where({ id: req.params.id })
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    /**Função para remover usuários sem tirar do banco de dados (Soft Delete) */
    const remove = async (req, res) => {
        /**Verificar se há vinculo do usuário com artigos */
        try {
            const articles = await app.db('articles')
                .where({ userId: req.params.id })
            notExistsOrError(articles, 'Usuário possui artigos, não pode ser excluído.')

            const rowsUpdated = await app.db('users')
                .update({ deletedAt: new Date() })
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    /**Adicionar o caminho em "routes.js" */
    return { save, get, getById, remove }
}