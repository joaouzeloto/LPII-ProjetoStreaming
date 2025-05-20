<template> 
  <div class="login-wrapper">
    <div class="login-bg-overlay"></div>
    <div class="logo-container">
      <!-- Logo aqui -->
    </div>
    
    <div class="login-container">
      <div class="login-box">
        <h2 class="login-title">Entrar</h2>
        
        <form class="login-form" @submit.prevent="handleLogin">
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          
          <div class="form-group">
            <label for="email">Email ou telefone</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="Digite seu email ou telefone"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              v-model="password"
              placeholder="Digite sua senha"
              required
            />
          </div>
          
          <button type="submit" class="login-button" :disabled="loading">
            {{ loading ? 'Carregando...' : 'Entrar' }}
          </button>
        </form>
        
        <div class="register-link">
          <a href="/cadastro">Cadastre-se</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const router = useRouter()

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        senha: password.value
      })
    })

    const data = await res.json()

    if (!res.ok) {
      // Exibe a mensagem de erro do backend
      errorMessage.value = data.msg || 'Erro ao fazer login.'
      loading.value = false
      return
    }

    // Salva no localStorage
    localStorage.setItem('token', data.token)
    localStorage.setItem('isFuncionario', data.isFuncionario)
    localStorage.setItem('pessoa_id', data.pessoa_id)

    // Redireciona para a rota desejada após o login
    if (data.isFuncionario) {
      window.location.href = '/homeAdmin';
    } else {
      window.location.href = '/home';
    }
    

  } catch (err) {
    console.error(err)
    errorMessage.value = 'Erro de conexão. Tente novamente mais tarde.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
                    url('https://assets.nflxext.com/ffe/siteui/vlv3/c0a32732-b033-43b3-be2a-8fee037a6146/a6e5c19a-e7a5-42c3-bfc7-88a63a21dd2a/BR-pt-20231225-popsignuptwoweeks-perspective_alpha_website_large.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.login-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 60%,
    rgba(0, 0, 0, 0.9) 100%
  );
}

.logo-container {
  position: relative;
  padding: 24px 48px;
  z-index: 2;
}

.site-logo {
  color: #e50914;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -1px;
  text-transform: uppercase;
  margin: 0;
  filter: drop-shadow(0 0 5px rgba(229, 9, 20, 0.3));
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  position: relative;
  z-index: 2;
  padding: 0 20px;
}

.login-box {
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
  padding: 60px 68px 40px;
  max-width: 450px;
  width: 100%;
  backdrop-filter: blur(10px);
}

.login-title {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 28px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  color: #b3b3b3;
  font-size: 14px;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 16px;
  font-size: 16px;
  height: 50px;
  outline: none;
  box-sizing: border-box;
  transition: background-color 0.2s;
}

.form-group input:focus {
  background-color: #454545;
  outline: none;
}

.form-group input::placeholder {
  color: #8c8c8c;
  opacity: 1;
}

.login-button {
  width: 100%;
  background-color: #e50914;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  padding: 16px;
  margin-top: 24px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #f40612;
}

.register-link {
  margin-top: 20px;
  text-align: center;
}

.register-link a {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
}

.register-link a:hover {
  text-decoration: underline;
}

.error-message {
  color: #e87c03;
  background: #333;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  text-align: center;
}

@media (max-width: 480px) {
  .login-box {
    padding: 30px 20px;
  }
  
  .site-logo {
    font-size: 24px;
  }
}
</style>