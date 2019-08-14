import Vue from 'vue'
import Toasted from 'vue-toasted'
/**Esta config realiza a configuração do vue-toasted para mostrar notificação de mensagens ao usuário
 * ela parecerá em preto como mensagem de aviso.
 * Link: https://madewithvuejs.com/vue-toasted
 */

/**Configuração do toasted */
Vue.use(Toasted, {
    iconPack: 'fontawesome',
    duration: 3000
})

/**Registrando mensagens */
Vue.toasted.register(
    'defaultSuccess',
    payload => !payload.msg ? 'Operação realizada com sucesso!' : payload.msg,
    /**O ícone é chamado da fonte awesome */
    { type: 'Success', icon: 'check' }
)

Vue.toasted.register(
    'defaultError',
    payload => !payload.msg ? 'Ops... Erro inesperado.' : payload.msg,
    { type : 'error', icon : 'times' }
)

/**Ao criar o arquivo não se esqueça de ir no main.js registrar o import */