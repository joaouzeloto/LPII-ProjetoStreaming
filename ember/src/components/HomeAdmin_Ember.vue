<template>
  <div class="admin-dashboard">
    <div class="bg-overlay"></div>
    
    <!-- Header -->
    <header class="dashboard-header">
      <div class="logo-container">
        <h1 class="site-logo">NET-FLIX</h1>
        <span class="admin-label">Área Administrativa</span>
      </div>
      <div class="user-container">
        <div class="user-info" v-if="userData">
          <span class="welcome-text">Olá, {{ userData.nome || 'Administrador' }}</span>
          <button class="logout-button" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sair
          </button>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="dashboard-content">
      <!-- Welcome Section -->
      <section class="welcome-section">
        <div class="welcome-card">
          <h2 class="welcome-title">Bem-vindo ao painel administrativo</h2>
          <p class="welcome-message">Aqui você pode gerenciar todos os aspectos do sistema. Selecione uma das opções abaixo para começar.</p>
        </div>
      </section>
      
      <!-- Statistics Section -->
      <section class="stats-section" v-if="!loading">
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon film-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="2" y1="7" x2="7" y2="7"></line>
                <line x1="2" y1="17" x2="7" y2="17"></line>
                <line x1="17" y1="17" x2="22" y2="17"></line>
                <line x1="17" y1="7" x2="22" y2="7"></line>
              </svg>
            </div>
            <div class="stat-info">
              <h3 class="stat-title">Filmes</h3>
              <p class="stat-value">{{ stats.filmes }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon series-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
            </div>
            <div class="stat-info">
              <h3 class="stat-title">Séries</h3>
              <p class="stat-value">{{ stats.series }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon user-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="stat-info">
              <h3 class="stat-title">Usuários</h3>
              <p class="stat-value">{{ stats.usuarios }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Admin Sections -->
      <section class="admin-sections">
        <div class="section-cards">
          <!-- Filmes Management -->
          <div class="section-card" @click="navigateTo('/filmes')">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="2" y1="7" x2="7" y2="7"></line>
                <line x1="2" y1="17" x2="7" y2="17"></line>
                <line x1="17" y1="17" x2="22" y2="17"></line>
                <line x1="17" y1="7" x2="22" y2="7"></line>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title">Gerenciar Filmes</h3>
              <p class="card-description">Adicione, edite e remova filmes do catálogo</p>
              <div class="card-actions">
                <span class="action-link">Acessar</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Séries Management -->
          <div class="section-card" @click="navigateTo('/series')">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title">Gerenciar Séries</h3>
              <p class="card-description">Adicione, edite e remova séries do catálogo</p>
              <div class="card-actions">
                <span class="action-link">Acessar</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Users Management -->
          <div class="section-card" @click="navigateTo('/user')">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title">Gerenciar Usuários</h3>
              <p class="card-description">Adicione, edite e gerencie contas de usuários</p>
              <div class="card-actions">
                <span class="action-link">Acessar</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Public View -->
          <div class="section-card" @click="navigateTo('/home')">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title">Visualizar Site Cliente</h3>
              <p class="card-description">Veja como os clientes visualizam seu conteúdo</p>
              <div class="card-actions">
                <span class="action-link">Acessar</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Recent Activity -->
      <section class="activity-section">
        <h2 class="section-title">Atividade Recente</h2>
        <div class="activity-list" v-if="!loading && activities.length > 0">
          <div v-for="(activity, index) in activities" :key="index" class="activity-item">
            <div class="activity-icon" :class="getActivityIconClass(activity.type)">
              <svg v-if="activity.type === 'filme'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
              <svg v-else-if="activity.type === 'serie'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="activity-details">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="!loading" class="empty-activity">
          <p>Nenhuma atividade recente para exibir.</p>
        </div>
        <div v-else class="loading-activity">
          <div class="loading-spinner"></div>
          <p>Carregando atividades...</p>
        </div>
      </section>
    </main>
    
    <!-- Toast notifications -->
    <div class="toast-container">
      <div 
        v-for="(toast, index) in toasts" 
        :key="index" 
        :class="['toast', toast.type]"
        :style="{ bottom: `${index * 60 + 20}px` }"
      >
        <div class="toast-icon">
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="toast-content">{{ toast.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// API base URL
const API_URL = 'http://localhost:3000';

// Estado reativo
const loading = ref(true);
const userData = ref(null);
const stats = ref({
  filmes: 0,
  series: 0,
  usuarios: 0
});
const activities = ref([]);
const toasts = ref([]);

// Função auxiliar para obter o token de autenticação
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Verificar se o token existe
const checkAuthentication = () => {
  const token = getAuthToken();
  if (!token) {
    showToast('Usuário não autenticado. Faça login para continuar.', 'error');
    // Redirecionamento para a página de login
    window.location.href = '/login';
    return false;
  }
  return true;
};

// Carregar dados do usuário
const loadUserData = async () => {
  if (!checkAuthentication()) return;
  const userId = localStorage.getItem('pessoa_id');
  try {
    const response = await fetch(`${API_URL}/usuario/${userId}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Não foi possível carregar dados do usuário');
    }
    
    userData.value = await response.json();
  } catch (err) {
    console.error('Erro ao carregar dados do usuário:', err);
    showToast('Erro ao carregar perfil de usuário', 'error');
  }
};

// Carregar estatísticas
const loadStats = async () => {
  if (!checkAuthentication()) return;
  
  try {
    // Carregar filmes
    const filmesResponse = await fetch(`${API_URL}/filmes`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      }
    });
    
    if (filmesResponse.ok) {
      const filmesData = await filmesResponse.json();
      stats.value.filmes = filmesData.length;
    }
    
    // Carregar séries
    const seriesResponse = await fetch(`${API_URL}/series`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      }
    });
    
    if (seriesResponse.ok) {
      const seriesData = await seriesResponse.json();
      stats.value.series = seriesData.length;
    }
    
    // Carregar usuários (simulado, você pode precisar implementar esta API)
    const usuariosResponse = await fetch(`${API_URL}/usuario`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      }
    }).catch(() => {
      // Se a API não existir, use um valor simulado
      stats.value.usuarios = 15;
      return { ok: false };
    });
    
    if (usuariosResponse.ok) {
      const usuariosData = await usuariosResponse.json();
      stats.value.usuarios = usuariosData.length;
    }
  } catch (err) {
    console.error('Erro ao carregar estatísticas:', err);
    showToast('Erro ao carregar estatísticas', 'error');
  } finally {
    loading.value = false;
  }
};

// Carregar atividades recentes (simulado)
const loadActivities = () => {
  // Dados simulados - em produção, você teria uma API para isso
  activities.value = [
    {
      type: 'filme',
      text: 'Filme "Sonic" foi adicionado ao catálogo',
      time: '20 minutos atrás'
    },
    {
      type: 'serie',
      text: 'Série "Stranger Things" foi atualizada',
      time: '1 hora atrás'
    },
    {
      type: 'user',
      text: 'Novo usuário registrado: Maria Silva',
      time: '3 horas atrás'
    },
    {
      type: 'filme',
      text: 'Filme "Homem-Aranha" foi removido do catálogo',
      time: 'ontem'
    },
    {
      type: 'serie',
      text: 'Série "La Casa de Papel" foi adicionada ao catálogo',
      time: 'ontem'
    }
  ];
};

// Método para navegação
const navigateTo = (path) => {
  window.location.href = path;
};

// Método para logout
const handleLogout = () => {
  localStorage.removeItem('token');
  showToast('Logout realizado com sucesso!', 'success');
  setTimeout(() => {
    window.location.href = '/';
  }, 1500);
};

// Helper para obter a classe do ícone de atividade
const getActivityIconClass = (type) => {
  switch (type) {
    case 'filme': return 'film-icon';
    case 'serie': return 'series-icon';
    default: return 'user-icon';
  }
};

// Mostrar notificações toast
const showToast = (message, type = 'success') => {
  const toast = { message, type };
  toasts.value.push(toast);
  
  // Remover o toast após 5 segundos
  setTimeout(() => {
    const index = toasts.value.indexOf(toast);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  }, 5000);
};

// Carregar dados ao montar o componente
onMounted(() => {
  if (checkAuthentication()) {
    loadUserData();
    loadStats();
    loadActivities();
  }
});
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: #141414;
  color: #fff;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  position: relative;
}

.bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 1) 100%);
  z-index: -1;
}

/* Header Styles */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 4%;
  background-color: rgba(0, 0, 0, 0.8);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.site-logo {
  color: #e50914;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -1px;
  text-transform: uppercase;
  margin: 0;
}

.admin-label {
  font-size: 14px;
  color: #aaa;
  padding: 4px 8px;
  border: 1px solid #333;
  border-radius: 4px;
}

.user-container {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-text {
  font-size: 14px;
  color: #ddd;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(229, 9, 20, 0.1);
  color: #e50914;
  border: 1px solid rgba(229, 9, 20, 0.3);
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-button:hover {
  background-color: rgba(229, 9, 20, 0.2);
}

/* Main Content */
.dashboard-content {
  padding: 30px 4%;
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 30px;
}

.welcome-card {
  background-color: rgba(0, 113, 235, 0.1);
  border-left: 4px solid #0071eb;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 30px;
}

.welcome-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 10px;
  color: #fff;
}

.welcome-message {
  font-size: 16px;
  margin: 0;
  color: #aaa;
}

/* Stats Section */
.stats-section {
  margin-bottom: 40px;
}

.stats-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 200px;
  background-color: #1f1f1f;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.film-icon {
  background-color: rgba(229, 9, 20, 0.1);
  color: #e50914;
}

.series-icon {
  background-color: rgba(0, 113, 235, 0.1);
  color: #0071eb;
}

.user-icon {
  background-color: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px;
  color: #ddd;
}

.stat-value {
  font-size: 30px;
  font-weight: 700;
  margin: 0;
  color: #fff;
}

/* Admin Sections */
.admin-sections {
  margin-bottom: 40px;
}

.section-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.section-card {
  background-color: #1f1f1f;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.section-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
}

.card-icon {
  width: 70px;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #e50914;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #fff;
}

.card-description {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 16px;
  flex: 1;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e50914;
  font-size: 14px;
  font-weight: 500;
}

.action-link {
  text-decoration: none;
  color: inherit;
}

/* Activity Section */
.activity-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 20px;
  color: #fff;
}

.activity-list {
  background-color: #1f1f1f;
  border-radius: 8px;
  overflow: hidden;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-details {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  margin: 0 0 4px;
  color: #ddd;
}

.activity-time {
  font-size: 12px;
  color: #777;
}

.empty-activity,
.loading-activity {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  text-align: center;
  color: #aaa;
  background-color: #1f1f1f;
  border-radius: 8px;
  padding: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: #e50914;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toast notifications */
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: rgba(24, 24, 24, 0.9);
  border-left: 4px solid;
  border-radius: 4px;
  padding: 16px;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 300px;
  backdrop-filter: blur(10px);
  animation: slideIn 0.3s ease forwards;
  position: absolute;
  right: 0;
  transition: transform 0.3s ease;
}

.toast.success {
  border-color: #2ecc71;
}

.toast.error {
  border-color: #e74c3c;
}

.toast-icon {
  flex: 0 0 auto;
}

.toast.success .toast-icon {
  color: #2ecc71;
}

.toast.error .toast-icon {
  color: #e74c3c;
}

.toast-content {
  flex: 1;
  font-size: 14px;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
  
  .logo-container {
    justify-content: center;
  }
  
  .user-container {
    width: 100%;
  }
  
  .user-info {
    width: 100%;
    justify-content: space-between;
  }
  
  .stats-container {
    flex-direction: column;
  }
  
  .section-cards {
    grid-template-columns: 1fr;
  }
}
</style>