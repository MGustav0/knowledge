<template>
    <header class="header">
        <!-- Para chamar a função "toggleMenu" dentro de "methods" é necessário utilizar o @ 
             com o nome do evento -->
        <a class="toggle" @click="toggleMenu" v-if="!hideToggle">
            <!-- Usando a fonte awesome
                 "icon" está dentro de script -->
            <i class="fa fa-lg" :class="icon"></i>
        </a>
        <h1 class="title">
            {{ title }}
        </h1>
    </header>
</template>

<script>
export default {
    name: 'Header',
    /**Parâmetros para o componente */
    props: {
        title: String,
        hideToggle: Boolean
    },
    /**Para alternar entre duas imagens toggle (menu) */
    computed: {
        icon() {
            return "fa-angle-left"
        }
    },
    methods: {
        toggleMenu() {
            
        }
    }
}
</script>

<style>
    .header {
        grid-area: header;
        background: linear-gradient(to right, #1e469a, #49a7c1);

        display: flex;
        justify-content: center; /* O alinhamento é pela linha (x) no flexbox */
        align-items: center; /* Alinhando pelo eixo (y) */
    }

    .title {
        font-size: 1.2rem;
        color: #fff;
        font-weight: 100;
        flex-grow: 1; /* Possibilita que o título cresça dentro do flex containter */
        text-align: center;
    }

    .title a {
        color: #FFF;
        text-decoration: none; /* Para que não fique com cara de link */
    }

    /* Estilo do toggle */
    header.header > a.toggle {
        width: 60px;
        height: 100%;
        color: #fff;
        justify-self: flex-start;
        text-decoration: none;

        display: flex; /* Para centralizar o ícone */
        justify-content: center;
        align-items: center; /* Para colocar o ícone no meio */
    }

    header.header > a.toggle:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }
</style>
