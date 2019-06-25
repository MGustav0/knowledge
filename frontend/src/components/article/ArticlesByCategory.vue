<template>
    <div class="articles-by-category">
        <PageTitle icon="fa fa-folder-o" :main="category.name" sub="Categoria" />
        <ul>
            <!-- Se estiver trabalhando com repetição, utilizar uma chave "key" única para que o VueJs
                atualize de forma mais otimizada exatamente o que se precisa atualizar, prinmcipalmente uma
                lista de elementos -->
            <li v-for="article in articles" :key="article.id">
                {{ article.name }}
            </li>
        </ul>
        <div class="load-more">
            <button v-if="loadMore" class="btn btn-lg btn-outline-primary" @click="getArticles">
                Carregar mais Artigos
            </button>
        </div>
    </div>
</template>

<script>
import { baseApiUrl } from '@/global'
import axios from 'axios'
import PageTitle from '../template/PageTitle'

export default {
    name: 'ArticlesByCategory',
    components: { PageTitle },
    data: function() {
        return {
            category: {},
            articles: [],
            page: 1,
            loadMore: true
        }
    },
    methods: {
        getCategory() {
            /**O id vai ser obtido quando a url for montada e será inserido no objeto category */
            const url = `${baseApiUrl}/categories/${this.category.id}`
            axios(url).then(res => this.category = res.data)
        },
        getArticles() {
            /**"?page=${this.page}" foi colocado por causa da consulta paginada */
            const url = `${baseApiUrl}/categories/${this.category.id}/articles?page=${this.page}`
            axios(url).then(res => {
                /**Recebe ele mesmo com o concat para não substituir, mas acrescentar ao anterior */
                this.articles = this.articles.concat(res.data)
                /**Acrescentando a página para pegar a próxima página na requisição */
                this.page++

                /**Caso não tenha mais artigos, ele vai ocultar o botão "Carregar mais" */
                if(res.data.length === 0) this.loadMore = false
            })
        }
    },
    mounted() {
        this.category.id = this.$route.params.id
        this.getCategory()
        this.getArticles()
    }
}
</script>

<style>
    .articles-by-category ul {
        list-style-type: none;
        padding: 0px;
    }

    .articles-by-category .load-more {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 25px;
    }
</style>
