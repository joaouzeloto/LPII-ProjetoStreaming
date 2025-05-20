<template>
  <div class="netflix-home">
    <div class="netflix-bg-overlay"></div>
    
    <!-- Header -->
    <header class="netflix-header">
      <div class="logo-container">
        <h1 class="site-logo">NET-FLIX</h1>
      </div>
      <div class="nav-container">
        <div class="tabs">
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'todos' }"
            @click="setActiveTab('todos')"
          >
            Todos
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'filmes' }"
            @click="setActiveTab('filmes')"
          >
            Filmes
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'series' }"
            @click="setActiveTab('series')"
          >
            Séries
          </button>
        </div>
      </div>
      <div class="search-container">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar títulos..."
            @input="handleSearch" 
          />
          <button class="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="netflix-content">
      <!-- Featured Content -->
      <section v-if="!searchQuery && activeTab === 'todos' && featuredItem" class="featured-content">
        <div class="featured-backdrop">
          <img :src="'../uploads/'+featuredItem.caminho" :alt="featuredItem.nome" class="featured-backdrop-image">
          <div class="featured-gradient"></div>
        </div>
        <div class="featured-info">
          <h2 class="featured-title">{{ featuredItem.nome }}</h2>
          <div class="featured-meta">
            <span class="featured-year">{{ featuredItem.anoLancamento }}</span>
            <span v-if="featuredItem.duracao" class="featured-duration">{{ formatDuration(featuredItem.duracao) }}</span>
            <span v-if="featuredItem.temporadas" class="featured-seasons">{{ featuredItem.temporadas }} Temporadas</span>
            <span class="featured-genre">{{ featuredItem.genero }}</span>
          </div>
          <p class="featured-synopsis">{{ featuredItem.sinopse }}</p>
          <button class="play-button" @click="showDetails(featuredItem)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Ver detalhes
          </button>
        </div>
      </section>
      
      <!-- Categorias - Apenas na página inicial -->
      <section v-if="!searchQuery && activeTab === 'todos' && genres.length > 0" class="content-section">
        <h2 class="section-title">Gêneros em Alta</h2>
        <div class="genre-list">
          <button 
            v-for="genre in genres" 
            :key="genre" 
            class="genre-button"
            @click="filterByGenre(genre)"
          >
            {{ genre }}
          </button>
        </div>
      </section>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando conteúdo...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2>Ocorreu um erro</h2>
        <p>{{ error }}</p>
        <button class="retry-button" @click="loadContent">Tentar novamente</button>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredContent.length === 0" class="empty-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h2>Nenhum conteúdo encontrado</h2>
        <p v-if="searchQuery">Nenhum resultado para "{{ searchQuery }}"</p>
        <p v-else-if="activeGenre">Nenhum conteúdo do gênero "{{ activeGenre }}"</p>
        <p v-else>Não há {{ getTabLabel() }} disponíveis no momento</p>
      </div>
      
      <!-- Main Content Grid -->
      <section v-else class="content-section">
        <h2 v-if="searchQuery" class="section-title">Resultados de pesquisa para "{{ searchQuery }}"</h2>
        <h2 v-else-if="activeGenre" class="section-title">{{ activeGenre }}</h2>
        <h2 v-else class="section-title">{{ getSectionTitle() }}</h2>
        
        <div class="content-grid">
          <div 
            v-for="item in filteredContent" 
            :key="item._id" 
            class="content-card"
            @click="showDetails(item)"
          >
            <div class="content-poster">
              <img 
                v-if="item.caminho" 
                :src="getImageUrl(item.caminho)" 
                :alt="item.nome"
              />
              <div v-else class="content-poster-placeholder">
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
              <div class="content-badge" v-if="item.type">
                {{ item.type === 'filme' ? 'Filme' : 'Série' }}
              </div>
            </div>
            <div class="content-info">
              <h3 class="content-title">{{ item.nome }}</h3>
              <div class="content-meta">
                <span class="content-year">{{ item.anoLancamento }}</span>
                <span v-if="item.duracao && !item.temporadas" class="content-duration">{{ formatDuration(item.duracao) }}</span>
                <span v-if="item.temporadas" class="content-seasons">{{ item.temporadas }} Temp</span>
              </div>
              <span class="content-genre">{{ item.genero }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Details Modal -->
    <div v-if="selectedItem" class="modal-overlay" @click="closeDetails">
      <div class="modal-content details-modal" @click.stop>
        <button class="modal-close" @click="closeDetails">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="details-header">
          <div class="details-poster">
            <img 
              v-if="selectedItem.caminho" 
              :src="getImageUrl(selectedItem.caminho)" 
              :alt="selectedItem.nome"
            />
            <div v-else class="details-poster-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          </div>
          <div class="details-main-info">
            <h2 class="details-title">{{ selectedItem.nome }}</h2>
            <div class="details-meta">
              <span class="details-year">{{ selectedItem.anoLancamento }}</span>
              <span v-if="selectedItem.duracao" class="details-duration">{{ formatDuration(selectedItem.duracao) }}</span>
              <span class="details-genre">{{ selectedItem.genero }}</span>
              <span v-if="selectedItem.type" class="details-type-badge">
                {{ selectedItem.type === 'filme' ? 'Filme' : 'Série' }}
              </span>
            </div>
            <div v-if="selectedItem.temporadas" class="details-seasons-info">
              <span class="seasons-badge">{{ selectedItem.temporadas }} Temporadas</span>
              <span v-if="selectedItem.episodios" class="episodes-badge">{{ selectedItem.episodios }} Episódios</span>
            </div>
          </div>
        </div>
        
        <div class="details-body">
          <h3 class="section-title">Sinopse</h3>
          <p class="details-synopsis">{{ selectedItem.sinopse }}</p>
          
          <div class="details-actions">
            <button class="play-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Assistir agora
            </button>
            <button class="add-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Minha Lista
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// API base URL
const API_URL = 'http://localhost:3000';

// Estado reativo
const filmes = ref([]);
const series = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const activeTab = ref('todos');
const activeGenre = ref('');
const selectedItem = ref(null);
const featuredItem = ref(null);

// Função auxiliar para obter o token de autenticação
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Verificar se o token existe
const checkAuthentication = () => {
  const token = getAuthToken();
  if (!token) {
    error.value = 'Usuário não autenticado. Faça login para continuar.';
    return false;
  }
  return true;
};

// Carregar conteúdo (filmes e séries)
const loadContent = async () => {
  if (!checkAuthentication()) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    // Carregar filmes
    const filmesResponse = await fetch(`${API_URL}/filmes`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      }
    });
    
    if (!filmesResponse.ok) {
      if (filmesResponse.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.');
      }
      throw new Error('Erro ao carregar filmes');
    }
    
    const filmesData = await filmesResponse.json();
    filmes.value = filmesData.map(filme => ({
      ...filme,
      type: 'filme'
    }));
    
    // Carregar séries
    const seriesResponse = await fetch(`${API_URL}/series`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      }
    });
    
    if (!seriesResponse.ok) {
      if (seriesResponse.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.');
      }
      throw new Error('Erro ao carregar séries');
    }
    
    const seriesData = await seriesResponse.json();
    series.value = seriesData.map(serie => ({
      ...serie,
      type: 'serie'
    }));
    
    // Selecionar um item em destaque aleatoriamente
    const allContent = [...filmes.value, ...series.value];
    if (allContent.length > 0) {
      const randomIndex = Math.floor(Math.random() * allContent.length);
      featuredItem.value = allContent[randomIndex];
    }
    
  } catch (err) {
    console.error('Erro ao carregar conteúdo:', err);
    error.value = err.message || 'Não foi possível carregar o conteúdo. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};

// Lista filtrada de conteúdo com base na aba ativa e busca
const filteredContent = computed(() => {
  let content = [];
  
  // Filtrar por tipo (aba)
  if (activeTab.value === 'todos') {
    content = [...filmes.value, ...series.value];
  } else if (activeTab.value === 'filmes') {
    content = [...filmes.value];
  } else if (activeTab.value === 'series') {
    content = [...series.value];
  }
  
  // Filtrar por busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    content = content.filter(item => 
      item.nome.toLowerCase().includes(query) || 
      item.genero.toLowerCase().includes(query) ||
      item.sinopse.toLowerCase().includes(query)
    );
  }
  
  // Filtrar por gênero
  if (activeGenre.value) {
    content = content.filter(item => 
      item.genero.toLowerCase() === activeGenre.value.toLowerCase()
    );
  }
  
  return content;
});

// Lista de gêneros únicos
const genres = computed(() => {
  const allContent = [...filmes.value, ...series.value];
  const genreSet = new Set(allContent.map(item => item.genero));
  return Array.from(genreSet);
});

// Métodos de UI
const setActiveTab = (tab) => {
  activeTab.value = tab;
  // Limpar filtros e busca ao mudar de aba
  activeGenre.value = '';
  searchQuery.value = '';
};

const handleSearch = () => {
  // A filtragem é feita automaticamente pelo computed property
  // Este método existe para possíveis extensões futuras
};

const filterByGenre = (genre) => {
  activeGenre.value = genre === activeGenre.value ? '' : genre;
};

const showDetails = (item) => {
  selectedItem.value = item;
};

const closeDetails = () => {
  selectedItem.value = null;
};

const formatDuration = (minutes) => {
  if (!minutes) return '';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  
  return `${mins}min`;
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Verificar se a imagem já é uma URL completa
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Caso contrário, construir a URL com base no caminho da API
  return `../uploads/${imagePath}`;
};

const getSectionTitle = () => {
  if (activeTab.value === 'todos') return 'Todos os Títulos';
  if (activeTab.value === 'filmes') return 'Filmes';
  if (activeTab.value === 'series') return 'Séries';
  return '';
};

const getTabLabel = () => {
  if (activeTab.value === 'todos') return 'títulos';
  if (activeTab.value === 'filmes') return 'filmes';
  if (activeTab.value === 'series') return 'séries';
  return 'conteúdos';
};

// Carregar conteúdo ao montar o componente
onMounted(() => {
  loadContent();
});

// Observar mudanças na aba ativa
watch(activeTab, () => {
  // Se mudar para a aba "todos", pode-se atualizar o item em destaque
  if (activeTab.value === 'todos' && !searchQuery.value && !activeGenre.value) {
    const allContent = [...filmes.value, ...series.value];
    if (allContent.length > 0) {
      const randomIndex = Math.floor(Math.random() * allContent.length);
      featuredItem.value = allContent[randomIndex];
    }
  }
});
</script>

<style scoped>
.netflix-home {
  min-height: 100vh;
  background-color: #141414;
  color: #fff;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  position: relative;
}

.netflix-bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(20, 20, 20, 0.8) 100%);
  z-index: -1;
}

/* Header Styles */
.netflix-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 4%;
  background-color: rgba(0, 0, 0, 0.9);
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo-container {
  flex: 0 0 auto;
}

.site-logo {
  color: #e50914;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -1px;
  text-transform: uppercase;
  margin: 0;
}

.nav-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.tabs {
  display: flex;
  gap: 20px;
}

.tab-button {
  background: none;
  border: none;
  color: #aaa;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 12px;
  cursor: pointer;
  transition: color 0.2s;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: #fff;
}

.tab-button.active {
  color: #fff;
  border-bottom: 2px solid #e50914;
}

.search-container {
  flex: 0 0 250px;
}

.search-box {
  display: flex;
  position: relative;
}

.search-box input {
  flex: 1;
  background-color: #333;
  border: none;
  border-radius: 4px;
  color: #fff;
  padding: 8px 40px 8px 16px;
  font-size: 14px;
}

.search-box input:focus {
  background-color: #454545;
  outline: none;
}

.search-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 5px;
}

/* Featured Content */
.featured-content {
  position: relative;
  height: 70vh;
  max-height: 700px;
  min-height: 400px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.featured-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.featured-backdrop-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.featured-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(20, 20, 20, 1) 0%, rgba(20, 20, 20, 0.7) 50%, rgba(20, 20, 20, 0.4) 100%);
}

.featured-info {
  width: 50%;
  padding: 0 4% 60px;
  z-index: 1;
}

.featured-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.featured-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.featured-year,
.featured-duration,
.featured-seasons {
  color: #aaa;
  font-size: 16px;
}

.featured-genre {
  color: #fff;
  background-color: rgba(229, 9, 20, 0.7);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.featured-synopsis {
  color: #ddd;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.play-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #e50914;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.play-button:hover {
  background-color: #f40612;
}

/* Content Section */
.netflix-content {
  padding: 0 4% 30px;
}

.content-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px;
}

.genre-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.genre-button {
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.genre-button:hover {
  background-color: #454545;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.content-card {
  background-color: #2f2f2f;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
}

.content-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.content-poster {
  position: relative;
  width: 100%;
  height: 250px;
  background-color: #222;
}

.content-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-poster-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #333;
  color: #666;
}

.content-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(229, 9, 20, 0.8);
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.content-info {
  padding: 12px;
}

.content-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content-meta {
  display: flex;
  font-size: 14px;
  color: #aaa;
  margin-bottom: 4px;
  gap: 10px;
}

.content-genre {
  font-size: 12px;
  color: #0071eb;
  background-color: rgba(0, 113, 235, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

/* Loading, Error, Empty States */
.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: #e50914;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-container h2,
.empty-container h2 {
  font-size: 24px;
  margin: 20px 0 10px;
}

.error-container p,
.empty-container p {
  color: #aaa;
  max-width: 500px;
  margin-bottom: 20px;
}

.retry-button {
  background-color: #e50914;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: #181818;
  border-radius: 6px;
  position: relative;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  z-index: 10;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* Details Modal */
.details-modal {
  padding: 0;
}

.details-header {
  position: relative;
  display: flex;
  background-color: #333;
}

.details-poster {
  flex: 0 0 300px;
  height: 450px;
}

.details-poster img,
.details-poster-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details-main-info {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent);
}

.details-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px;
}

.details-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.details-meta > span {
  font-size: 16px;
}

.details-type-badge {
  color: #fff;
  background-color: rgba(229, 9, 20, 0.7);
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
}

.details-seasons-info {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.seasons-badge,
.episodes-badge {
  background-color: rgba(0, 113, 235, 0.2);
  color: #0071eb;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.details-body {
  padding: 40px;
}

.details-synopsis {
  font-size: 16px;
  line-height: 1.5;
  color: #aaa;
  margin-bottom: 30px;
}

.details-actions {
  display: flex;
  gap: 16px;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #454545;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .netflix-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .logo-container {
    display: flex;
    justify-content: center;
  }
  
  .search-container {
    flex: 1;
    max-width: none;
  }
  
  .featured-content {
    height: auto;
    min-height: 300px;
  }
  
  .featured-info {
    width: 100%;
    padding: 0 4% 30px;
  }
  
  .featured-title {
    font-size: 32px;
  }
  
  .content-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .details-header {
    flex-direction: column;
  }
  
  .details-poster {
    flex: 0 0 auto;
    height: 300px;
  }
  
  .details-main-info {
    padding: 20px;
  }
  
  .details-title {
    font-size: 24px;
  }
  
  .details-body {
    padding: 20px;
  }
  
  .details-actions {
    flex-direction: column;
  }
}
</style>