import Vue from 'vue'
/**Terá coisas que serão usadas em vários componentes */

/**Criar variável para acesso ao local storage (browser) */
export const userKey = '__kowledge_user'
/**Apontando para API do backend. Alterar quando colocar em produção */
export const baseApiUrl = 'http://localhost:4000'

/**Mostrar mensagens de erro, ligado ao arquivo ./config/msgs.js, exportará a variável "e" */
export function showError(e) {
    if(e && e.response && e.response.data) {
        Vue.toasted.global.defaultError({ msg : e.response.data })
    } else if(typeof e === 'string') {
        Vue.toasted.global.defaultError({ msg : e })
    } else {
        Vue.toasted.global.defaultError()
    }
}

export default { baseApiUrl, showError, userKey }