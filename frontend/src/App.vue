<template>
	<!-- Não exibirá o menu quando não houver usuário -->
	<div id="app" :class="{'hide-menu': !isMenuVisible || !user}">
		<Header title="Cod3r - Base de Conhecimento" 
		:hideToggle="!user"
		:hideUserDropdown="!user" />
		<!-- Mostrará o menu se houver usuário -->
		<Menu v-if="user" />
		<!-- Exibe o Loading ou o Content -->
		<Loading v-if="validatingToken" />
		<Content v-else/>
		<Footer />
		
	</div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, userKey } from "@/global"
import { mapState } from 'vuex'
import Header from "./components/template/Header"
import Menu from "@/components/template/Menu" /**Usar o @ permite começar em SRC, na raiz da pasta */
import Content from "@/components/template/Content"
import Footer from "@/components/template/Footer"
import Loading from "@/components/template/Loading"

export default {
	name: "App",
	components: { Header, Menu, Content, Footer, Loading },
	computed: mapState (['isMenuVisible', 'user']),
	/**Colocar o estado do componente */
	data: function() {
		return {
			/**flag para verificar se o token está válido */
			validatingToken: true
		}
	},
	methods: {
		async validateToken() {
			this.validatingToken = true

			/**Pegar o Json armazenado no localStorage */
			const json = localStorage.getItem(userKey)
			/**Transforma para userData */
			const userData = JSON.parse(json)
			/**Setar, inicialmente para null, caso tenha usuário validado, seta-se o valor na localStore
			 * o usuário já com o token validado
			 */
			this.$store.commit('setUser', null)

			/**Caso não tenha usuário válido, seta para falso e encaminha para a tela de login */
			if(!userData) {
				this.validatingToken = false
				return this.$router.push({ name: 'auth' })
			}

			/**Caso haja usuário válido, espera para validar */
			const res = await axios.post(`${baseApiUrl}/validateToken`, userData)

			if(res.data) { /**seta o usuário na store */
				this.$store.commit('setUser', userData)
				/**Esse teste faz uso do arquivo config/mq.js, assim que o dispositivo mudar de resolução
				* para menor, ele irá fechar o menu, logo após o clique
				*/
				if(this.$mq === 'xs' || this.$mq === 'sm') {
					this.$store.commit('toggleMenu', false)
				}
			} else { /**Para excluir, caso não tenha validado o token */
				localStorage.removeItem(userKey)
				this.$router.push({ name: 'auth' })
			}

			/**Setar para false, pois ele estará dentro da tela de login ou da aplicação */
			this.validatingToken = false
		}
	},
	/**Para que a função validateToken seja chamada, a função faz-se necessária */
	created() {
		this.validateToken()
	}
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

	/*Alterando o grid da página quando o menu estiver escondido*/
	#app.hide-menu {
		grid-template-areas: 
			"header header"
			"content content"
			"footer footer";
	}
</style>