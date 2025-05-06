<template>
  <header class="main-header" :class="{ 'scrolled': isScrolled }">
    <div class="header-content">
      <div class="left-section">
        <div class="brand-logo">
          <h1>ㅤㅤㅤㅤ</h1>
        </div>
        
        <nav class="main-nav">
          <ul class="nav-list">
            <li class="nav-item active">
              <a href="#" class="nav-link">Início</a>
              <div class="active-marker"></div>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">Séries</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">Filmes</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">Lançamentos</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">Minha Lista</a>
            </li>
          </ul>
        </nav>
      </div>
      
      <div class="right-section">
        <div class="search-container" :class="{ 'active': searchActive }">
          <button class="search-toggle" @click="toggleSearch">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor" />
            </svg>
          </button>
          <input 
            type="text" 
            class="search-input" 
            placeholder="Títulos, pessoas, gêneros..." 
            v-model="searchQuery"
            v-show="searchActive"
            ref="searchInput"
            @blur="hideSearchIfEmpty"
          />
        </div>
        
        <div class="notifications-bell">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill="currentColor" />
          </svg>
          <div class="notification-badge" v-if="notificationCount > 0">
            {{ notificationCount }}
          </div>
        </div>
        
        <div class="user-profile">
          <div class="profile-avatar">
            <span>A</span>
          </div>
          <div class="profile-caret">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const searchQuery = ref('')
const searchActive = ref(false)
const isScrolled = ref(false)
const notificationCount = ref(3)
const searchInput = ref(null)

const toggleSearch = () => {
  searchActive.value = !searchActive.value
  if (searchActive.value) {
    // Focus the input after a short delay to allow for the animation
    setTimeout(() => {
      searchInput.value.focus()
    }, 100)
  }
}

const hideSearchIfEmpty = () => {
  if (!searchQuery.value) {
    setTimeout(() => {
      searchActive.value = false
    }, 200)
  }
}

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
})
</script>

<style scoped>
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 16px 0;
  background: transparent;
  background-image: linear-gradient(180deg, 
                    rgba(0, 0, 0, 0.7) 0%, 
                    rgba(0, 0, 0, 0.4) 50%, 
                    rgba(0, 0, 0, 0) 100%);
  transition: all 0.3s ease;
}

.main-header.scrolled {
  background: rgb(20, 20, 20);
  background-image: none;
  padding: 12px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1920px;
  padding: 0 4%;
  margin: 0 auto;
}

.left-section {
  display: flex;
  align-items: center;
}

.brand-logo h1 {
  font-size: 28px;
  font-weight: 700;
  color: #e50914;
  margin: 0;
  letter-spacing: -1px;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.main-nav {
  margin-left: 40px;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-right: 20px;
  position: relative;
}

.nav-link {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.nav-item.active .nav-link {
  color: #ffffff;
  font-weight: 500;
}

.nav-link:hover {
  color: #ffffff;
}

.active-marker {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background-color: #e50914;
  border-radius: 50%;
}

.right-section {
  display: flex;
  align-items: center;
}

.search-container {
  position: relative;
  margin-right: 20px;
  display: flex;
  align-items: center;
}

.search-toggle {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  position: relative;
  z-index: 2;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.search-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.search-input {
  position: absolute;
  right: 0;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 40px 8px 12px;
  border-radius: 4px;
  width: 240px;
  font-size: 14px;
  opacity: 0;
  transform: scaleX(0);
  transform-origin: right;
  transition: all 0.3s ease;
}

.search-container.active .search-input {
  opacity: 1;
  transform: scaleX(1);
}

.search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.7);
}

.notifications-bell {
  position: relative;
  color: #fff;
  margin-right: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.notifications-bell:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #e50914;
  color: white;
  font-size: 11px;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.profile-avatar {
  width: 32px;
  height: 32px;
  background-color: #e50914;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.profile-caret {
  margin-left: 8px;
}

@media (max-width: 1024px) {
  .nav-item:nth-child(n+4) {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-nav {
    margin-left: 20px;
  }
  
  .nav-item:nth-child(n+3) {
    display: none;
  }
  
  .search-input {
    width: 200px;
  }
}

@media (max-width: 576px) {
  .brand-logo h1 {
    font-size: 24px;
  }
  
  .main-nav {
    margin-left: 10px;
  }
  
  .nav-item:not(.active) {
    display: none;
  }
  
  .search-input {
    width: 160px;
  }
}
</style>