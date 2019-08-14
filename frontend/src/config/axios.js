import axios from 'axios'

const success = res => res
const error = err => {
    /**Se o usuário entrar com a senha errada, ele nãocai no if de erro do axios "err.response.status",
     * com o "!window.location.pathname.includes('auth')"  faz-se o redirecionamento para "/",
     * que torna possível de ler a mensagem de erro.
     */
    if(401 === err.response.status && !window.location.pathname.includes('auth')) {
        window.location= '/'
    } else {
        return Promise.reject(err)
    }
}

axios.interceptors.response.use(success, error)

/**Ao criar o arquivo não se esqueça de ir no main.js registrar o import */