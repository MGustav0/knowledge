import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminPages from '@/components/admin/AdminPages'

/**Registrando o componente */
Vue.use(VueRouter)

/**Criando as rotas do site, neste caso contém duas, que é a página de admin e a home */

const routes = [{
     name: 'home',
     path: '/',
     component: Home
}, {
    name: 'adminPages',
    path: '/admin',
    component: AdminPages
}]

/**Instanciando e exportando o VueRouter */
export default new VueRouter({
    mode: 'history',
    /**Passa as rotas (páginas) declaradas acima em 'routes' */
    routes: routes
})