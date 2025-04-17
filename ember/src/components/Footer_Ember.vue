<template>
    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-logo">
            <h2>EMBER</h2>
          </div>
          
          <div class="footer-nav">
            <div class="footer-nav-col">
              <h3>Navegar</h3>
              <ul>
                <li><a href="#">Início</a></li>
                <li><a href="#">Filmes</a></li>
                <li><a href="#">Séries</a></li>
                <li><a href="#">Originais</a></li>
              </ul>
            </div>
            
            <div class="footer-nav-col">
              <h3>Conta</h3>
              <ul>
                <li><a href="#">Perfil</a></li>
                <li><a href="#">Configurações</a></li>
                <li><a href="#">Assinatura</a></li>
                <li><a href="#">Ajuda</a></li>
              </ul>
            </div>
            
            <div class="footer-nav-col">
              <h3>Legal</h3>
              <ul>
                <li><a href="#">Termos de Uso</a></li>
                <li><a href="#">Privacidade</a></li>
                <li><a href="#">Cookies</a></li>
                <li><a href="#">Sobre</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-divider"></div>
        
        <div class="footer-bottom">
          <p class="copyright">© 2025 EMBER. Todos os direitos reservados.</p>
          
          <div class="social-links">
            <a href="#" class="social-link">
              <span>𝕏</span>
            </a>
            <a href="#" class="social-link">
              <span>ⓕ</span>
            </a>
            <a href="#" class="social-link">
              <span>ⓘ</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
 
  </script>
  
  <style scoped>
  .footer {
    background-color: #1A2026;
    padding: 60px 0 30px;
    color: #A59689;
    position: relative;
  }
  
  .footer::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #2C3741;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .footer-top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 40px;
  }
  
  .footer-logo h2 {
    font-family: Georgia, serif;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 1px;
    margin: 0 0 20px;
    background: linear-gradient(90deg, #C4710B, #E08A1E, #C4710B);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .footer-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 60px;
  }
  
  .footer-nav-col h3 {
    font-family: Georgia, serif;
    font-size: 16px;
    color: #E0D2C3;
    margin: 0 0 15px;
    position: relative;
  }
  
  .footer-nav-col h3::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #C4710B, #E08A1E, #C4710B);
  }
  
  .footer-nav-col ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .footer-nav-col li {
    margin-bottom: 10px;
  }
  
  .footer-nav-col a {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #A59689;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer-nav-col a:hover {
    color: #E0D2C3;
  }
  
  .footer-divider {
    height: 1px;
    background-color: #2C3741;
    margin: 20px 0;
  }
  
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
  }
  
  .copyright {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
    color: #A59689;
  }
  
  .social-links {
    display: flex;
    gap: 15px;
  }
  
  .social-link {
    width: 36px;
    height: 36px;
    border: 1px solid #872816;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #A59689;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .social-link:hover {
    background-color: rgba(135, 40, 22, 0.3);
    color: #E0D2C3;
  }
  
  .social-link span {
    font-size: 18px;
  }
  
  @media (max-width: 768px) {
    .footer-top {
      flex-direction: column;
    }
    
    .footer-nav {
      margin-top: 30px;
      gap: 30px;
    }
    
    .footer-bottom {
      flex-direction: column;
      gap: 20px;
    }
  }
  </style>