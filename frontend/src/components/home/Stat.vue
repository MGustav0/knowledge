<template>
    <div id="" class="stat">
        <div id="" class="stat-icon">
            <i :class="icon" :style="style"></i>
        </div>
        <div id="" class="stat-info">
            <span class="stat-title">{{ title }}</span>
            <span class="stat-value">{{ value }}</span>
        </div>
    </div>
</template>

<script>
/**Esta página é para o conteúdo (estatísticas) da home page */
export default {
    name: 'Stat',
    /**propriedades refenenciadas do template acima */
    props: ['title', 'value', 'icon', 'color'],
    /**Caso não tenha cor no ícone, coloque-o preto */
    computed: {
        style() {
            return "color:" + (this.color || "#000")
        }
    }
}
</script>

<style>
    .stat {
        flex: 1;
        display: flex;
        border-radius: 8px;
        margin-right: 20px;
        margin-bottom: 20px;
        background-color: #fff;
        padding: 20px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
        display: flex;
        align-items: center;
    }

    .stat-icon i {
        font-size: 5rem;
    }

    .stat-info {
        flex: 1; /*Vai crescer dentro do flex container a classe .stat*/
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .stat-title {
        font-size: 1.2rem;
    }

    .stat-value {
        font-size: 3rem;
    }
</style>
