<template>
	<div id="app">
		<Header title="Cod3r - Base de Conhecimento" :hideToggle="false" />
		<Menu />
		<Content />
		<Footer />
		
	</div>
</template>

<script>
import Header from "./components/template/Header"
import Menu from "@/components/template/Menu" /**Usar o @ permite começar em SRC, na raiz da pasta */
import Content from "@/components/template/Content"
import Footer from "@/components/template/Footer"

export default {
	name: "App",
	components: { Header, Menu, Content, Footer }
}
</script>

<style>
	* {
		font-family: "Lato", sans-serif;
	}

	body {
		margin: 0;
	}

	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		height: 100vh; /* O ID app vai estar em 100% da tela */
		display: grid; /* O grid está definido na pasta content */
		grid-template-rows: 60px 1fr 40px; /* Header, conteúdo e footer */
		grid-template-columns: 300px 1fr; /* Menu da aplicação */
		grid-template-areas:
			"header header"
			"menu content"
			"menu footer"
	}
</style>