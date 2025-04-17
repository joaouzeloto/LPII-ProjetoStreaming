<template>
    <header class="header">
      <div class="container">
        <div class="logo">
          <h1>EMBER</h1>
        </div>
        
        <nav class="navigation">
          <ul>
            <li class="active"><a href="#">Início</a></li>
            <li><a href="#">Filmes</a></li>
            <li><a href="#">Séries</a></li>
            <li><a href="#">Originais</a></li>
          </ul>
        </nav>
        
        <div class="user-actions">
          <div class="search-icon">
            <span>🔍</span>
          </div>
          
          <div class="notification">
            <span>3</span>
          </div>
          
          <div class="user-avatar">
            <span>A</span>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
 
  
  </script>
  
  <style scoped>
  .header {
    background-color: #212A33;
    height: 70px;
    border-bottom: 2px solid #872816;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 100;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }
  
  .logo h1 {
    font-family: Georgia, serif;
    font-size: 30px;
    font-weight: bold;
    letter-spacing: 1px;
    margin: 0;
    background: linear-gradient(90deg, #C4710B, #E08A1E, #C4710B);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .navigation ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .navigation li {
    margin: 0 15px;
  }
  
  .navigation li a {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #A59689;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .navigation li.active a {
    color: #E0D2C3;
  }
  
  .navigation li a:hover {
    color: #E0D2C3;
  }
  
  .user-actions {
    display: flex;
    align-items: center;
  }
  
  .search-icon {
    width: 22px;
    height: 22px;
    border: 1.5px solid #872816;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    cursor: pointer;
  }
  
  .search-icon span {
    color: #A59689;
    font-size: 16px;
  }
  
  .notification {
    width: 32px;
    height: 32px;
    border: 1.5px solid #872816;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    cursor: pointer;
  }
  
  .notification span {
    color: #A59689;
    font-size: 13px;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    background-color: #872816;
    opacity: 0.9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .user-avatar span {
    color: #E0D2C3;
    font-family: Georgia, serif;
    font-size: 14px;
  }
  </style>