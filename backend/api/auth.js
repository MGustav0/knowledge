const { authSecret } = require ('../.env')
const jwt = require ('jwt-simple') /**Gerar token */
const bcrypt = require ('bcrypt-nodejs') /**Comparar as senhas do BD cripografada com a do front-end */

/** */
module.exports = app => {
    const signin = async (req, res) => {
        /**Validando o e-mail e senha recebidos no front-end */
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe o usuário e a senha!')
        }

        /**Obter usuário pelo e-mail */
        const user = await app.db('users')
            .where({ email: req.body.email })
            .first() /**pegar um único usuário a partir do e-mail */

        if (!user) return res.status(400).send('Usuário não encontrado!')

        /**Evitar que usuário deletado se conecte novamente */
        if(user.deletedAt) return res.status(400).send('Usuario marcado como excluido')

        /**Validação de senha */
        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if (!isMatch) return res.status(401).send('E-mail ou senha inválidos') // acesso não autorizado

        /**Gerar o token para manter o login a partir da data */
        const now = Math.floor(Date.now() / 1000)

        /**Conteúdo do token jwt */
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            /**iat e exp, são nomes padrão do jwt */
            iat: now, //iat = emitido em -> issued at
            exp: now + (60 * 60 * 24 * 365) // tokem válido por 300 dias
        }

        /**Gerando e enviando o token como resposta */
        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null /**Caso o usuário vindo do body não venha setado, valor = null */
        try {
            if (userData) { /**Se usuário estiver setado */
                const token = jwt.decode(userData.token, authSecret) // decodificando o token
                /**Multiplica por 1000 para colocar em milisegundos */
                if (new Date (token.exp * 1000) > new Date())
                    return res.send(true)
            }
        } catch (e) {
            /**Problema no token: expirado ou gerado com um authSecret diferente */
        }

        res.send(false)
    }

    /**Pode-se validar aqui se a parte que está sendo acessada é acessível pelo usuário no
    * front-end.
    */
    const validateAdmin = async (req, res) => {
        const userData = req.body || null
        try {
            const token = jwt.decode(userData.token, authSecret)
            const user = await app.db('users')
                .where({ email: token.email})
                .whereNull('deletedAt')
                .first()
            if(user.admin && token.admin){
                return res.send(true)
            }
            console.log('entrou aqui 1')
        } catch(e) {
            res.status(401).send('Você não tem permissão para acessar esta página!')
        }
        
        return res.send(false)
    }
 
    return { signin, validateToken, validateAdmin }
}