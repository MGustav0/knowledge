import Vue from 'vue'
import VueMQ from 'vue-mq'

/**Adicionando mais responsividade à aplicação baseado nas resoluções do Bootstrap 4.
 * Será aplicado ao menu da aplicação, pode ser aplicados em outros casos.
*/

Vue.use(VueMQ, {
    breakpoints: {
        xs: 576,
        sm: 768,
        md: 960,
        lg: 1140,
        xl: Infinity
    }
})

/**Está em uso nos seguintes arquivos:
 * /template/Menu.vue
 * /App.vue
 */

/**Ao criar o arquivo não se esqueça de ir no main.js registrar o import */