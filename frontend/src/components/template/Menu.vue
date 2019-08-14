<template>
    <aside class="menu" v-show="isMenuVisible">
        <!-- Filtro de categorias -->
        <div class="menu-filter">
            <i class="fa fa-search fa-lg"></i>
            <input type="text" placeholder="Digite para filtrar..." v-model="treeFilter"
                class="filter-field">
        </div>
        <!-- Árvore de categorias -->
        <Tree :data="treeData" :options="treeOptions" :filter="treeFilter" ref="tree" />
    </aside>
</template>

<script>
import { mapState } from 'vuex'
import Tree from 'liquor-tree'
import { baseApiUrl } from '@/global'
import axios from 'axios'

export default {
    name: 'Menu',
    components: { Tree },
    /** Mapeamos apenas o 'isMenuVisible', assim podemos passar um array com todas
     * as propriedades do estado da aplicação da store.js que se quer mapear dentro
     * do componente.
     */
    computed: mapState(['isMenuVisible']),
    data: function() {
        return {
            treeFilter: '',
            /**Configurando a árvore de categorias */
            treeData: this.getTreeData(),
            treeOptions: {
                propertyNames: { 'text': 'name' },
                filter: { emptyText: 'Categoria não encontrada' }
            }
        }
    },
    methods: {
        getTreeData() {
            const url = `${baseApiUrl}/categories/tree`
            return axios.get(url).then(res => res.data)
        },
        /**Pega o ID do node e seta na rota para carregar a rota que diz respeito ao ID
         * da categoria.
         * Fazendo uma navegação programática, sem usar o router link, dentro do código faz com que uma
         * rota seja executada e haja a navegação.
         */
        onNodeSelect(node) {
            this.$router.push({
                name: 'articlesByCategory',
                params: { id: node.id }
            })

            /**Esse teste faz uso do arquivo config/mq.js, assim que o dispositivo mudar de resolução
             * para menor, ele irá fechar o menu, logo após o clique
             */
            if(this.$mq === 'xs' || this.$mq === 'sm') {
                this.$store.commit('toggleMenu', false)
            }
        }
    },
    mounted() {
        /**Vicula o evento de selecionar o nó. "$refs" é a forma de acessar a referência de um elemento
         * que está dentro do template.
         * ".tree" é o nome do componente. "$on" é o vinculador do evento, onde se coloca o evento.
         */
        this.$refs.tree.$on('node:selected', this.onNodeSelect)
    }
}
</script>
    
<style>
    .menu {
        grid-area: menu;
        background: linear-gradient(to right, #232526, #414345);

        display: flex;
        flex-direction: column; /* Colocar o flexbox para trabalhar com as colunas */
        flex-wrap: wrap; /* Permitir quebra de linhas */
    }

    .menu a,
    .menu a:hover {
        color: #fff;
        text-decoration: none;
    }

    /* O ".tree-node.selected" foi obtido após inspecionar o HTML */
    .menu .tree-node.selected > .tree-content,
    .menu .tree-node .tree-content:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .tree-arrow.has-child {
        filter: brightness(2);
    }

    .menu .menu-filter {
        display: flex;
        justify-content: center;
        align-items: center;

        margin: 20px;
        padding-bottom: 8px;
        border-bottom: 1px solid #AAA;
    }

    /*ícone*/
    .menu .menu-filter i {
        color: #AAA;
        margin-right: 10px;
    }

    .menu input {
        color: #CCC;
        font-size: 1.3rem;
        border: 0;
        outline: 0;
        width: 100%;
        background: transparent;
    }

    .tree-filter-empty {
        color: #CCC;
        margin-left: 20px;
    }

    .tree-anchor {
        color: #fff
    }
</style>
