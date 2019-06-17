<template>
    <aside class="menu" v-show="isMenuVisible"></aside>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Menu',
    /** Mapeamos apenas o 'isMenuVisible', assim podemos passar um array com todas
     * as propriedades do estado da aplicação da store.js que se quer mapear dentro
     * do componente.
     */
    computed: mapState(['isMenuVisible'])
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
</style>
