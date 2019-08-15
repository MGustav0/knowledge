import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

/**Área de armazenamento para compartilhar dados entre os componentes */

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        /**false para indicar que não irá mostrar para qualquer usuário */
        isMenuVisible: false,
        user: null
    },
    mutations: {
        toggleMenu(state, isVisible) {
            /**Teste para evitar que o menu apareça quando user não estiver setado */
            if(!state.user) {
                state.isMenuVisible = false
                return // retorna a partir daqui
            }

            if (isVisible === undefined) {
                /**Estrutura para verificar se estiver visível, alternar para invisível e vice-versa */
                state.isMenuVisible = !state.isMenuVisible
            } else {
                state.isMenuVisible = isVisible
            }
        },
        setUser(state, user) {
            state.user = user
            if(user) {
                axios.defaults.headers.common['Authorization'] = `bearer ${user.token}`
                state.isMenuVisible = true
            } else {
                delete axios.defaults.headers.common['Authorization'] // deleta a propriedade
                state.isMenuVisible = false
            }
        }
    }
})

/**Ao criar o arquivo não se esqueça de ir no main.js registrar o import */