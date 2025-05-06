<template>
  <div class="register-wrapper">
    <div class="register-bg-overlay"></div>
    <div class="logo-container">
      <h1 class="site-logo">Net-Flix</h1>
    </div>
    
    <div class="register-container">
      <div class="register-box">
        <h2 class="register-title">Cadastre-se</h2>
        <p class="register-subtitle">Preencha os campos abaixo para criar sua conta</p>
        
        <form class="register-form" @submit.prevent="handleRegister">
          <!-- Informações pessoais -->
          <div class="form-section">
            <h3 class="section-title">Informações pessoais</h3>
            
            <div class="form-group">
              <label for="fullName">Nome completo</label>
              <input 
                type="text" 
                id="fullName" 
                v-model="form.fullName" 
                placeholder="Digite seu nome completo"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                placeholder="Digite seu email"
                required
              />
            </div>

            <div class="form-group">
              <label for="cpf">CPF</label>
              <input 
                type="text" 
                id="cpf" 
                v-model="form.cpf" 
                placeholder="000.000.000-00"
                v-mask="'###.###.###-##'"
                required
              />
            </div>
          </div>
          
          <!-- Endereço -->
          <div class="form-section">
            <h3 class="section-title">Endereço</h3>
            
            <div class="form-group">
              <label for="cep">CEP</label>
              <div class="cep-input">
                <input 
                  type="text" 
                  id="cep" 
                  v-model="form.cep" 
                  placeholder="00000-000"
                  v-mask="'#####-###'"
                  @blur="fetchAddressData"
                  required
                />
                <div v-if="loading" class="loading-spinner"></div>
              </div>
              <p v-if="cepError" class="error-message">{{ cepError }}</p>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="street">Rua</label>
                <input 
                  type="text" 
                  id="street" 
                  v-model="form.street" 
                  placeholder="Nome da rua"
                  :class="{ 'auto-filled': autoFilled }"
                  required
                />
              </div>
              
              <div class="form-group small">
                <label for="number">Número</label>
                <input 
                  type="text" 
                  id="number" 
                  v-model="form.number" 
                  placeholder="Nº"
                  required
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="neighborhood">Bairro</label>
                <input 
                  type="text" 
                  id="neighborhood" 
                  v-model="form.neighborhood" 
                  placeholder="Seu bairro"
                  :class="{ 'auto-filled': autoFilled }"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="complement">Complemento</label>
                <input 
                  type="text" 
                  id="complement" 
                  v-model="form.complement" 
                  placeholder="Apto, bloco, etc. (opcional)"
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="city">Cidade</label>
                <input 
                  type="text" 
                  id="city" 
                  v-model="form.city" 
                  placeholder="Sua cidade"
                  readonly
                  :class="{ 'auto-filled': autoFilled }"
                />
              </div>
              
              <div class="form-group small">
                <label for="state">Estado</label>
                <input 
                  type="text" 
                  id="state" 
                  v-model="form.state" 
                  placeholder="UF"
                  readonly
                  :class="{ 'auto-filled': autoFilled }"
                />
              </div>
            </div>
          </div>
          
          <!-- Segurança -->
          <div class="form-section">
            <h3 class="section-title">Segurança</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="password">Senha</label>
                <div class="password-input">
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    id="password" 
                    v-model="form.password" 
                    placeholder="Digite sua senha"
                    required
                  />
                  <button 
                    type="button" 
                    class="toggle-password" 
                    @click="showPassword = !showPassword"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path v-if="!showPassword" d="M12 5C7.5 5 3.7 7.6 2 11.5C3.7 15.4 7.5 18 12 18C16.5 18 20.3 15.4 22 11.5C20.3 7.6 16.5 5 12 5ZM12 16C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8C14.2 8 16 9.8 16 12C16 14.2 14.2 16 12 16ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="currentColor"/>
                      <path v-else d="M2 5.27L3.28 4L20 20.72L18.73 22L15.65 18.92C14.5 19.3 13.28 19.5 12 19.5C7.5 19.5 3.7 16.9 2 13C2.88 11.07 4.34 9.5 6.21 8.4L2 4.19L2 5.27ZM12 7C9.24 7 7 9.24 7 12C7 12.7 7.15 13.36 7.43 13.96L6.18 12.71C6.07 12.5 6 12.26 6 12C6 8.69 8.69 6 12 6C12.26 6 12.5 6.07 12.71 6.18L11.56 7.33C11.08 7.13 10.56 7 10 7L12 9V7ZM22 13C21.36 14.33 20.45 15.5 19.33 16.47L17.89 15.03C19.08 13.71 19.97 12.1 20.5 10.24C19.37 7.56 16.72 5.6 13.62 5.11L12.22 3.71C18.0 4.21 22 8.14 22 13ZM12 17C14.76 17 17 14.76 17 12C17 11.3 16.85 10.64 16.57 10.04L14.12 7.59C15.63 8.83 16 10.17 16 12C16 15.31 13.31 18 10 18L12 16V17Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="form-group">
                <label for="confirmPassword">Confirmar senha</label>
                <div class="password-input">
                  <input 
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    id="confirmPassword" 
                    v-model="form.confirmPassword" 
                    placeholder="Confirme sua senha"
                    required
                  />
                  <button 
                    type="button" 
                    class="toggle-password" 
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path v-if="!showConfirmPassword" d="M12 5C7.5 5 3.7 7.6 2 11.5C3.7 15.4 7.5 18 12 18C16.5 18 20.3 15.4 22 11.5C20.3 7.6 16.5 5 12 5ZM12 16C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8C14.2 8 16 9.8 16 12C16 14.2 14.2 16 12 16ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="currentColor"/>
                      <path v-else d="M2 5.27L3.28 4L20 20.72L18.73 22L15.65 18.92C14.5 19.3 13.28 19.5 12 19.5C7.5 19.5 3.7 16.9 2 13C2.88 11.07 4.34 9.5 6.21 8.4L2 4.19L2 5.27ZM12 7C9.24 7 7 9.24 7 12C7 12.7 7.15 13.36 7.43 13.96L6.18 12.71C6.07 12.5 6 12.26 6 12C6 8.69 8.69 6 12 6C12.26 6 12.5 6.07 12.71 6.18L11.56 7.33C11.08 7.13 10.56 7 10 7L12 9V7ZM22 13C21.36 14.33 20.45 15.5 19.33 16.47L17.89 15.03C19.08 13.71 19.97 12.1 20.5 10.24C19.37 7.56 16.72 5.6 13.62 5.11L12.22 3.71C18.0 4.21 22 8.14 22 13ZM12 17C14.76 17 17 14.76 17 12C17 11.3 16.85 10.64 16.57 10.04L14.12 7.59C15.63 8.83 16 10.17 16 12C16 15.31 13.31 18 10 18L12 16V17Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Termos -->
          <div class="terms-container">
            <label class="checkbox-container">
              <input type="checkbox" v-model="form.acceptTerms" required>
              <span class="checkmark"></span>
              <span class="terms-text">Concordo com os <a href="#">Termos de Uso</a> e a <a href="#">Política de Privacidade</a>.</span>
            </label>
          </div>
          
          <button type="submit" class="register-button" :disabled="!form.acceptTerms">Cadastrar</button>
          
          <p class="login-text">
            Já tem uma conta? <a href="#">Faça Login</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

// Estado reativo
const form = ref({
  fullName: '',
  email: '',
  cpf: '',
  cep: '',
  state: '',
  city: '',
  street: '',
  number: '',
  neighborhood: '',
  complement: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const cepError = ref('');
const autoFilled = ref(false);

// Métodos
const fetchAddressData = async () => {
  // Limpa o erro anterior
  cepError.value = '';
  
  // Verifica se o CEP tem pelo menos 8 dígitos
  const cep = form.value.cep.replace(/\D/g, '');
  if (cep.length !== 8) {
    return;
  }
  
  loading.value = true;
  
  try {
    // Faz a requisição para a API ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      cepError.value = 'CEP não encontrado';
      return;
    }
    
    // Preenche os campos do formulário com os dados retornados
    form.value.street = data.logradouro;
    form.value.neighborhood = data.bairro;
    form.value.city = data.localidade;
    form.value.state = data.uf;
    
    // Marca que os campos foram preenchidos automaticamente
    autoFilled.value = true;
    
    // Foca no campo número após preencher os dados
    nextTick(() => {
      document.getElementById('number').focus();
    });
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    cepError.value = 'Erro ao buscar o CEP. Tente novamente.';
  } finally {
    loading.value = false;
  }
};

const handleRegister = () => {
  // Aqui você adicionaria a lógica de cadastro
  if (form.value.password !== form.value.confirmPassword) {
    alert('As senhas não coincidem');
    return;
  }
  
  console.log('Dados do formulário:', form.value);
  // Envio para API, etc...
};
</script>

<style scoped>
.register-wrapper {
  min-height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
                    url('https://assets.nflxext.com/ffe/siteui/vlv3/c0a32732-b033-43b3-be2a-8fee037a6146/a6e5c19a-e7a5-42c3-bfc7-88a63a21dd2a/BR-pt-20231225-popsignuptwoweeks-perspective_alpha_website_large.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.register-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  z-index: 1;
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
}

.register-container {
  display: flex;
  justify-content: center;
  padding: 0 20px 60px;
  position: relative;
  z-index: 2;
}

.register-box {
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
  padding: 60px;
  max-width: 800px;
  width: 100%;
  backdrop-filter: blur(10px);
}

.register-title {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 16px;
}

.register-subtitle {
  color: #737373;
  font-size: 16px;
  margin: 0 0 32px;
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #333;
}

.section-title {
  color: #e5e5e5;
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 20px;
}

.form-group {
  margin-bottom: 20px;
  flex: 1;
}

.form-group.small {
  flex: 0.3;
}

.form-row {
  display: flex;
  gap: 20px;
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

.form-group input.auto-filled {
  background-color: #264027;
  border-left: 3px solid #2eca6a;
}

.cep-input {
  position: relative;
}

.loading-spinner {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #e50914;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: translateY(-50%) rotate(0deg); }
  to { transform: translateY(-50%) rotate(360deg); }
}

.error-message {
  color: #e50914;
  font-size: 12px;
  margin-top: 6px;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.terms-container {
  margin: 20px 0 30px;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  user-select: none;
  color: #b3b3b3;
  font-size: 14px;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #333;
  border-radius: 2px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #454545;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #e50914;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.terms-text {
  margin-top: 2px;
  line-height: 1.4;
}

.terms-text a {
  color: #0071eb;
  text-decoration: none;
}

.terms-text a:hover {
  text-decoration: underline;
}

.register-button {
  width: 100%;
  background-color: #e50914;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.register-button:hover:not(:disabled) {
  background-color: #f40612;
}

.register-button:disabled {
  background-color: #333;
  color: #737373;
  cursor: not-allowed;
}

.login-text {
  font-size: 16px;
  color: #737373;
  text-align: center;
  margin-top: 20px;
}

.login-text a {
  color: #fff;
  text-decoration: none;
}

.login-text a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-box {
    padding: 40px 30px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .logo-container {
    padding: 16px 24px;
  }
  
  .site-logo {
    font-size: 24px;
  }
}
</style>