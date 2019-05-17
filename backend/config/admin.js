module.exports = middleware => {
    return (req, res, next) => {
        if(req.user.admin) { /**Se isso for verdadeiro, então */
            middleware(req, res, next)
        } else {
            res.status(401).send('Usuário não é Administrador.')
        }
    }
}