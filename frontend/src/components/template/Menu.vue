<template>
    <aside class="menu"></aside>
</template>

<script>
export default {
    name: 'Menu'
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
