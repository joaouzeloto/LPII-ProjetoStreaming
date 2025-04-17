<template>
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">EMBER</h1>
          <div class="title-underline"></div>
        </div>
        
        <h2 class="login-subtitle">Entrar na sua conta</h2>
        
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="Digite seu email"
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
            <a href="#" class="forgot-password">Esqueceu sua senha?</a>
          </div>
          
          <button type="submit" class="login-button">ENTRAR</button>
          
          <div class="login-options">
            <div class="login-divider">
              <span>OU</span>
            </div>
            
            <button type="button" class="login-alternative">
              CONTINUAR COMO CONVIDADO
            </button>
            
            <p class="signup-text">
              Não tem uma conta? <a href="#">Criar agora</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  .login-container {
    background-color: #1A2026;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }
  
  .login-container::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 70% 30%, rgba(196,113,11,0.1) 0%, rgba(26,32,38,0) 70%);
    z-index: 1;
  }
  
  .login-card {
    background-color: #212A33;
    border-radius: 8px;
    width: 100%;
    max-width: 420px;
    padding: 40px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    position: relative;
    z-index: 2;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .login-title {
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
  
  .login-subtitle {
    font-family: Georgia, serif;
    font-size: 18px;
    color: #E0D2C3;
    margin: 0 0 30px;
    text-align: center;
    font-weight: normal;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 20px;
    position: relative;
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
  
  .forgot-password {
    position: absolute;
    right: 0;
    top: 0;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
    color: #A59689;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .forgot-password:hover {
    color: #E0D2C3;
  }
  
  .login-button {
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
  
  .login-button:hover {
    background-color: #9D3622;
  }
  
  .login-options {
    margin-top: 30px;
  }
  
  .login-divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
  }
  
  .login-divider::before,
  .login-divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: #2C3741;
  }
  
  .login-divider span {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
    color: #A59689;
    padding: 0 15px;
  }
  
  .login-alternative {
    width: 100%;
    height: 46px;
    background-color: transparent;
    border: 1px solid #872816;
    border-radius: 4px;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14px;
    letter-spacing: 1px;
    color: #A59689;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .login-alternative:hover {
    background-color: rgba(135, 40, 22, 0.1);
    color: #E0D2C3;
  }
  
  .signup-text {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #A59689;
    text-align: center;
    margin-top: 25px;
  }
  
  .signup-text a {
    color: #C4710B;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .signup-text a:hover {
    color: #E08A1E;
  }
  
  @media (max-width: 480px) {
    .login-card {
      padding: 30px 20px;
    }
  }
  </style>