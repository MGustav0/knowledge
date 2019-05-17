module.exports = app => {
    function existsOrError(value, msg) { // existe ou gera erro (msg)
        // se for falso ele envia a mensagem
        if(!value) throw msg
        // se o array for 0 ele indica que value não existe
        if(Array.isArray(value) && value.length === 0) throw msg
        // strings com espaço em branco, considera-se como valor inexistente
        if(typeof value === 'string' && !value.trim()) throw msg
    }
    
    // se não existir o erro
    function notExistsOrError(value, msg) {
        try {
            existsOrError(value, msg) // 1 - Se não der erro aqui
        } catch(msg) {
            return // 3 - se não, simplesmente retorna
        }
        throw msg // 2 - lança o erro aqui
    }
    
    // testar se os dois valores são iguais ou não
    function equalsOrError(valueA, valueB, msg){
        if(valueA !== valueB) throw msg
        // abaixo pode-se criar validações para qualquer coisa: id, e-mail, senha, etc. 
    }

    // depois pode-se acessar essas funções através de app.api.validation.nome_da_função
    return { existsOrError, notExistsOrError, equalsOrError }
}