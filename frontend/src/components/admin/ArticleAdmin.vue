<template>
    <div class="article-admin">
        <b-form>
            <!-- Aponta para category.id, se tiver setado ele vai marcar -->
            <input id="article-id" type="hidden" v-model="article.id" />
            <b-form-group label="Nome:" label-for="article-name">
                <b-form-input id="article-name" type="text" 
                    v-model="article.name" required :readonly="mode === 'remove'"
                    placeholder="Informe o Nome do Artigo..." />
            </b-form-group>
            <b-form-group label="Descrição:" label-for="article-description">
                <b-form-input id="article-description" type="text" 
                    v-model="article.description" required :readonly="mode === 'remove'"
                    placeholder="Informe o Nome do Artigo..." />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" label="Imagem (URL):" label-for="article-imageUrl">
                <b-form-input id="article-imageUrl" type="text" 
                    v-model="article.imageUrl" required :readonly="mode === 'remove'"
                    placeholder="Informe a URL da Imagem..." />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" label="Categoria:" label-for="article-categoryId">
            <!-- A lista de ":options" virá do script em "data" e dos "fields",
                Vai receber o categoryId, resultado da função "loadCategories()", com os items Id
                e path. 
                Não é campo obrigatório, portanto não conterá o "required" -->
                <b-form-select id="article-categoryId" :options="categories" 
                    v-model="article.categoryId" />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" label="Autor:" label-for="article-userId">
            <!-- A lista de ":options" virá do script em "data" e dos "fields",
                Vai receber o userId, resultado da função "loadCategories()", com os items Id
                e path. 
                Não é campo obrigatório, portanto não conterá o "required" -->
                <b-form-select id="article-userId" :options="users" 
                    v-model="article.userId" />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" label="Conteúdo:" label-for="article-content">
                <VueEditor v-model="article.content" placeholder="Informe o Conteúdo do Artigo..." />
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <!-- Cria a lista de ":items" virá do script em "data" e dos "fields" -->
        <b-table hover striped :items="articles" :fields="fields">
            <template slot="actions" slot-scope="data">
                <!-- O "@click" recebe os itens requeridos para edição ou exclusão -->
                <b-button variant="warning" @click="loadArticle(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadArticle(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <!-- O componente v-model="page" vai alterar de 1 (como foi definido) sempre que acionar uma
            página diferente, passando a quantidade de linhas totais :total-rows:"count" e quantas
            linhas por página :per-page="limit" -->
        <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
    </div>
</template>

<script>
import { VueEditor } from "vue2-editor"
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'ArticleAdmin',
    components: { VueEditor },
    data: function() {
        return { /**Objeto */
            mode: 'save',
            article: {}, /**Objeto vazio, dentro dele criamos, alteramos e excluímos */
            articles: [], /**Array de objetos do sistema */
            categories: [], /**Lista de categorias para preencher o combobox de categorias */
            users: [], /**Lista de usuários para preencher o combobox de usuários */
            /**Consulta paginada = paginação */
            page: 1,
            limit: 0, /**Define quantos elementos aparecerá na página */
            count: 0, /**Define quantas páginas haverá no paginador */
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'description', label: 'Descrição', sortable: true },
                { key: 'actions', label: 'Ações' }
            ]
        }
    },
    methods: {
        /**Recebe os artigos do back-end em ../api/article.js */
        loadArticles() {
            /**Adicionar o parâmetro "?page=${this.page}" para realizar a paginação */
            const url = `${baseApiUrl}/articles?page=${this.page}`
            axios.get(url).then(res => {
                this.articles = res.data.data
                this.count = res.data.count
                this.limit = res.data.limit
            })
        },
        /**Tratando os eventos de salvar, excluir e cancelar */
        reset() {
            this.mode = 'save',
            this.article = {},
            this.loadArticles()
        },
        save() {
            /**Se o id estiver setado, o método será "put", se não será "post" */
            const method = this.article.id ? 'put' : 'post'
            /**Colocar o id na url caso esteja setado */
            const id = this.article.id ? `/${this.article.id}` : ''
            axios[method](`${baseApiUrl}/articles${id}`, this.article)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.article.id
            axios.delete(`${baseApiUrl}/articles/${id}`)
                .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.reset()
                })
            .catch(showError)
        },
        loadArticle(article, mode = 'save') {
            this.mode = mode
            /**Fazendo um clone manualmente para nãp trazer o conteúdo do artigo */
            axios.get(`${baseApiUrl}/articles/${article.id}`)/**Recebe o "id" de article do parâmetro */
                .then(res => this.article = res.data)/**Traz todo o artigo */
        },
        /**Recebe as categorias do back-end em ../api/category.js */
        loadCategories() {
            const url = `${baseApiUrl}/categories`
            axios.get(url).then(res => {
                /**Necessitamos trazer apenas o atributo value e text */
                this.categories = res.data.map(category => {
                    return { value: category.id, text: category.path }
                })
                /**Montar na função "mounted()", para aparecer no front-end */
            })
        },
        /**Recebe os usuários do back-end em ../api/user.js */
        loadUsers() {
            const url = `${baseApiUrl}/users`
            axios.get(url).then(res => {
                /**Necessitamos trazer apenas o atributo value e text */
                this.users = res.data.map(user => {
                    return { value: user.id, text: `${user.name} - ${user.email}` }
                })
                /**Montar na função "mounted()", para aparecer no front-end */
            })
        }
    },
    /**Paginação, em "data: function()" o objeto "page" monitora a propriedade watch e qaundo muda
     * dispara o método "this.loadArticles()", então usa-se o parâmetro "?page=${this.page}" de acordo
     * com o que foi setado e traz a consulta paginada, ou seja, o conteúdo de "loadArticles()"
     */
    watch: {
        page() {
            this.loadArticles()
        }
    },
    mounted() {
        this.loadArticles()
        this.loadCategories()
        this.loadUsers()
    }
}
</script>

<style>

</style>