<template>
  <header class="main-header" :class="{ 'scrolled': isScrolled }">
    <div class="header-content">
      <div class="brand-logo">
        <h1>NET-FLIX</h1>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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
  justify-content: center;
  align-items: center;
  max-width: 1920px;
  padding: 0 4%;
  margin: 0 auto;
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

@media (max-width: 768px) {
  .brand-logo h1 {
    font-size: 24px;
  }
}

@media (max-width: 576px) {
  .brand-logo h1 {
    font-size: 20px;
  }
}
</style>