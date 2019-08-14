<template>
    <!-- Tela de Login -->
    <div class="auth-content">
        <div class="auth-modal">
            <img src="@/assets/logo.png" width="200" alt="Logo">
            <hr>
            <div class="auth-title">{{ showSignup ? 'Cadastro' : 'Login' }}</div>

            <input v-if="showSignup" v-model="user.name" type="text" placeholder="Nome">
            <input v-model="user.email" name="email" type="text" placeholder="E-mail">
            <input v-model="user.password" name="password" type="password" placeholder="Senha">
            <input v-if="showSignup" v-model="user.confirmPassword" type="password" 
                placeholder="Confirme a Senha">
            <button v-if="showSignup" @click="signup">Registrar</button>
            <button v-else @click="signin">Entrar</button>

            <a href @click.prevent="showSignup = !showSignup">
                <span v-if="showSignup">Está cadastrado? Logue-se</span>
                <!-- Caso esteja na tela de login -->
                <span v-else>Não tem cadastro? Registre-se aqui!</span>
            </a>
        </div>
    </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from '@/global'
import axios from 'axios'

export default {
    name: 'Auth',
    data: function() {
        return {
            /**Flag para alternar entre tela de Cadstro e login */
            showSignup: false,
            user: {}
        }
    },
    methods: {
        signin() {
            axios.post(`${baseApiUrl}/signin`, this.user)
                .then(res => {
                    this.$store.commit('setUser', res.data) /**Pega o dado da requisição e seta o usuário */
                    /**Persistência no LocalStorage - Este salva como string, quando o usuário sair do
                     * navegador os dados são recuperados.
                     */
                    localStorage.setItem(userKey, JSON.stringify(res.data))
                    /**Fazer a navegação para a raiz da aplicação */
                    this.$router.push( { path: '/' })
                })
                .catch(showError)
        },
        signup() {
            axios.post(`${baseApiUrl}/signup`, this.user)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.user = {} //Deve ser vazio porque vai ficar pronto para um novo login.
                    /**Se ele se cadastrou de forma bem sucedida o usuário vai para a tela de login */
                    this.showSignup = false
                })
                .catch(showError)
        }
    }
}
</script>

<style>
    .auth-content {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .auth-modal {
        background-color: #fff;
        width: 350px;
        padding: 35px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
        
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .auth-modal input {
        border: 1px solid #BBB;
        width: 100%; /*Vai respeitar o padding do container auth-modal*/
        margin-bottom: 5px;
        padding: 3px 3px;
        /*outline: none;*/ /*Serve para retirar a linha azul na borda selecionada*/
    }

    .auth-modal button {
        align-self: flex-end;
        background-color: #2460ae;
        color: #fff;
        padding: 5px 15px;
    }

    .auth-modal a {
        margin-top: 35px;
    }

    .auth-modal hr {
        border: 0;
        width: 100%;
        height: 1px;
        /*Degradê na linha abaixo da imagem e acima de "Login" */
        background-image: linear-gradient(to right, 
            rgba(120, 120, 120, 0),
            rgba(120, 120, 120, 0.75),
            rgba(120, 120, 120, 0))
    }

    .auth-title {
        font-size: 1.2rem;
        font-weight: 100;
        margin-top: 10px;
        margin-bottom: 15px;
    }
</style>
