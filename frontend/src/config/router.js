import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminPages from '@/components/admin/AdminPages'
import ArticlesByCategory from '@/components/article/ArticlesByCategory'
import ArticleById from '@/components/article/ArticleById'
import Auth from '@/components/auth/Auth'

/**Validação no back-end da autorização às rotas de navegação */
import { baseApiUrl, userKey } from '@/global'
import axios from 'axios'

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
    component: AdminPages,
    /**Metadados */
    meta: { requiresAdmin: true }
}, {
    name: 'articlesByCategory',
    path: '/categories/:id/articles',
    component: ArticlesByCategory
}, {
    name: 'articleById',
    path: '/articles/:id',
    component: ArticleById
}, {
    name: 'auth',
    path: '/auth',
    component: Auth
}]

/**Instanciando e exportando o VueRouter */
const router = new VueRouter({
    mode: 'history',
    /**Passa as rotas (páginas) declaradas acima em 'routes' */
    routes: routes
})

/**Acessa o evento que irá ser chamado sempre que navegar de uma rota para outra.
 * Representando to = para onde vai, from = de onde está vindo e next = para dizer
 * se vai ou não continuar.
 * Dentro desse método aplica-se as validações de transição de tela, pode impedir usuários
 * não admin acessarem áreas restritas à admin
 * Validar no back-end em api/auth.js e em config/routes.js como um serviço
 */
router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)

    /**A função some() recebe a callback "record".
     * Dentro do registro, se atributo meta requerer o Admin (true), se não for Admin, volta para
     * a tela de login ou a inicial "next({ path: '/' })".
     */
    if(to.matched.some(record => record.meta.requiresAdmin)) {
        const user = JSON.parse(json)
        axios.post(`${baseApiUrl}/validateAdmin`, user)
        user && user.admin ? next() : next({ path: '/' })
    } else {
        next() /**Sem validação se não requerer Admin */
    }
})

export default router

/**Ao criar o arquivo não se esqueça de ir no main.js registrar o import */