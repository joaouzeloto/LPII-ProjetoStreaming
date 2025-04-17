<template>
  <div class="register-container mt-4">
    <div class="register-card">
      <div class="register-header">
        <h1 class="register-title">EMBER</h1>
        <div class="title-underline"></div>
      </div>
      
      <h2 class="register-subtitle">Criar nova conta</h2>
      
      <form class="register-form" @submit.prevent="handleRegister">
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
        
        <div class="form-group address-group">
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
            <span v-if="loading" class="loading-icon">⟳</span>
          </div>
          <small v-if="cepError" class="error-message">{{ cepError }}</small>
        </div>
        
        <div class="form-row">
          <div class="form-group half">
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
          
          <div class="form-group half">
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
        </div>
        
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
        
        <div class="form-row">
          <div class="form-group quarter">
            <label for="number">Número</label>
            <input 
              type="text" 
              id="number" 
              v-model="form.number" 
              placeholder="Nº"
              required
            />
          </div>
          
          <div class="form-group three-quarter">
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
        
        <div class="form-row">
          <div class="form-group half">
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
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
          
          <div class="form-group half">
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
                {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="form-group terms">
          <label class="checkbox-container">
            <input type="checkbox" v-model="form.acceptTerms" required>
            <span class="checkmark"></span>
            <span class="terms-text">Li e concordo com os <a href="#">Termos de Uso</a> e <a href="#">Política de Privacidade</a></span>
          </label>
        </div>
        
        <button type="submit" class="register-button" :disabled="!form.acceptTerms">CRIAR CONTA</button>
        
        <p class="login-text">
          Já tem uma conta? <a href="#">Entrar agora</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

// Estado reativo (equivalente ao data())
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
.register-container {
  background-color: #1A2026;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.register-container::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 70% 30%, rgba(196,113,11,0.1) 0%, rgba(26,32,38,0) 70%);
  z-index: 1;
}

.register-card {
  background-color: #212A33;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  position: relative;
  z-index: 2;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-title {
  font-family: Georgia, serif;
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 1px;
  margin: 0 0 10px;
  background: linear-gradient(90deg, #C4710B, #E08A1E, #C4710B);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-underline {
  height: 2px;
  width: 80px;
  margin: 0 auto;
  background: linear-gradient(90deg, #C4710B, #E08A1E, #C4710B);
}

.register-subtitle {
  font-family: Georgia, serif;
  font-size: 18px;
  color: #E0D2C3;
  margin: 0 0 30px;
  text-align: center;
  font-weight: normal;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.half {
  flex: 1;
}

.quarter {
  flex: 0.3;
}

.three-quarter {
  flex: 0.7;
}

.form-group label {
  display: block;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #E0D2C3;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  height: 46px;
  background-color: #1A2026;
  border: 1px solid #2C3741;
  border-radius: 4px;
  padding: 0 15px;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #E0D2C3;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #872816;
}

.form-group input::placeholder {
  color: #A59689;
  opacity: 0.7;
}

.form-group input.auto-filled {
  background-color: rgba(196, 113, 11, 0.08);
  border-color: rgba(196, 113, 11, 0.3);
}

.cep-input {
  position: relative;
}

.loading-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #C4710B;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: translateY(-50%) rotate(0deg); }
  to { transform: translateY(-50%) rotate(360deg); }
}

.error-message {
  color: #9D3622;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #A59689;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
}

.terms {
  margin-top: 10px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  color: #A59689;
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
  background-color: #1A2026;
  border: 1px solid #2C3741;
  border-radius: 3px;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: #872816;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #872816;
  border-color: #872816;
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
  border: solid #E0D2C3;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.terms-text {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #A59689;
  margin-left: 5px;
}

.terms-text a {
  color: #C4710B;
  text-decoration: none;
  transition: color 0.3s ease;
}

.terms-text a:hover {
  color: #E08A1E;
}

.register-button {
  height: 46px;
  background-color: #872816;
  border: none;
  border-radius: 4px;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  color: #E0D2C3;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.register-button:hover:not(:disabled) {
  background-color: #9D3622;
}

.register-button:disabled {
  background-color: #3A3A3A;
  cursor: not-allowed;
  opacity: 0.7;
}

.login-text {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #A59689;
  text-align: center;
  margin-top: 25px;
}

.login-text a {
  color: #C4710B;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-text a:hover {
  color: #E08A1E;
}

@media (max-width: 600px) {
  .register-card {
    padding: 30px 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 20px;
    margin-bottom: 0;
  }
  
  .half, .quarter, .three-quarter {
    width: 100%;
  }
}
</style>