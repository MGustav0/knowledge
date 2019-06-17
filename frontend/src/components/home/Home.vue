<template>
    <div class="home">
        <PageTitle icon="fa fa-home" main="Dashboard" sub="Base de Conhecimento" />
        <div id="" class="stats">
            <Stat title="Categorias" :value="stat.categories" icon="fa fa-folder" color="#d54d50" />
            <Stat title="Artigos" :value="stat.articles" icon="fa fa-file" color="#3bc480" />
            <Stat title="Usuários" :value="stat.users" icon="fa fa-user" color="#3282cd" />
        </div>
    </div>
</template>

<script>
import PageTitle from '@/components/template/PageTitle'
/**Para realizar a comunicação com o back-end */
import Stat from './Stat'
import axios from 'axios'
import { baseApiUrl } from '@/global'

export default {
    name: 'Home',
    components: { PageTitle, Stat },
    /**Obtendo o estado da requisição no back-end e retornando o que está sendo requerido */
    data: function() {
        return {
            stat: {}
        }
    },
    methods: {
        /**Requisição ao back-end */
        getStats() {
            /**Chama o axios, faz a requisição e seta dentro de this.stat, é ele quem vai mudar as 
             * estatísiticas lá no template.
             */
            axios.get(`${baseApiUrl}/stats`).then(res => this.stat = res.data)
        }
    },
    /**Quando o componente for montado ele faz a requisição abaixo */
    mounted() {
        this.getStats()
    }
}
</script>

<style>
    .stats {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap; /*Permite quebrar a linha ao reduzir tamanho da janela*/
    }
</style>
