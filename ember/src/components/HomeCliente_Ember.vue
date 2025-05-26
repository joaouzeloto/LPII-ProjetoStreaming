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
          <button class="tab-button" :class="{ active: activeTab === 'todos' }" @click="setActiveTab('todos')">
            Todos
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'filmes' }" @click="setActiveTab('filmes')">
            Filmes
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'series' }" @click="setActiveTab('series')">
            Séries
          </button>
          <button class="tab-button" :class="{ active: activeTab === 'lista' }" @click="setActiveTab('lista')">
            <span>Minha Lista</span>
            <span v-if="minhaListaCount > 0" class="list-count">{{ minhaListaCount }}</span>
          </button>
        </div>
      </div>
      <div class="search-container">
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="Buscar títulos..." @input="handleSearch" />
          <button class="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <img :src="'../uploads/' + featuredItem.caminho" :alt="featuredItem.nome" class="featured-backdrop-image">
          <div class="featured-gradient"></div>
        </div>
        <div class="featured-info">
          <h2 class="featured-title">{{ featuredItem.nome }}</h2>
          <div class="featured-meta">
            <span class="featured-year">{{ featuredItem.anoLancamento }}</span>
            <span v-if="featuredItem.duracao" class="featured-duration">{{ formatDuration(featuredItem.duracao)
            }}</span>
            <span v-if="featuredItem.temporadas" class="featured-seasons">{{ featuredItem.temporadas }}
              Temporadas</span>
            <span class="featured-genre">{{ featuredItem.genero }}</span>
          </div>
          <p class="featured-synopsis">{{ featuredItem.sinopse }}</p>
          <div class="featured-actions">
            <button class="play-button smooth-btn" @click="showDetails(featuredItem)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Ver detalhes
            </button>
            <button class="add-button-featured smooth-btn"
              :class="{ 'in-list': isInMinhaLista(featuredItem), 'loading': isItemLoading(featuredItem._id) }"
              @click="toggleMinhaLista(featuredItem)" :disabled="isItemLoading(featuredItem._id)">
              <div class="btn-content">
                <svg v-if="!isItemLoading(featuredItem._id)" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <line v-if="!isInMinhaLista(featuredItem)" x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <div v-else class="btn-spinner"></div>
                <span>{{ getListButtonText(featuredItem) }}</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      <!-- Categorias - Apenas na página inicial -->
      <section v-if="!searchQuery && activeTab === 'todos' && genres.length > 0" class="content-section">
        <h2 class="section-title">Gêneros em Alta</h2>
        <div class="genre-list">
          <button v-for="genre in genres" :key="genre" class="genre-button smooth-btn" @click="filterByGenre(genre)">
            {{ genre }}
          </button>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando conteúdo...</p>
      </div>

      <!-- Loading Minha Lista -->
      <div v-else-if="loadingMinhaLista && activeTab === 'lista'" class="loading-container">
        <div class="skeleton-grid">
          <div v-for="n in 8" :key="n" class="skeleton-card">
            <div class="skeleton-poster"></div>
            <div class="skeleton-info">
              <div class="skeleton-title"></div>
              <div class="skeleton-meta"></div>
              <div class="skeleton-genre"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e50914"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2>Ocorreu um erro</h2>
        <p>{{ error }}</p>
        <button class="retry-button smooth-btn" @click="loadContent">Tentar novamente</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredContent.length === 0" class="empty-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#777"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h2>{{ getEmptyStateTitle() }}</h2>
        <p>{{ getEmptyStateMessage() }}</p>
        <button v-if="activeTab === 'lista'" class="browse-button smooth-btn" @click="setActiveTab('todos')">
          Navegar Catálogo
        </button>
      </div>

      <!-- Main Content Grid -->
      <section v-else class="content-section">
        <div class="section-header">
          <div class="title-section">
            <h2 class="section-title">{{ getSectionTitle() }}</h2>
            <small v-if="activeTab === 'lista' && lastUpdateText" class="last-update">
              {{ lastUpdateText }}
            </small>
          </div>
          <div class="header-actions">
            <button v-if="activeTab === 'lista' && !loadingMinhaLista" class="refresh-button smooth-btn"
              @click="refreshMinhaLista" :disabled="refreshing">
              <svg :class="{ spinning: refreshing }" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              Atualizar Lista
            </button>
            <button v-if="activeTab === 'lista'" class="force-refresh-button smooth-btn" @click="forceFullRefresh"
              :disabled="loading || loadingMinhaLista" title="Recarregar todos os dados">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M21 21v-5h-5" />
              </svg>
              Sincronizar
            </button>
          </div>
        </div>

        <div class="content-grid">
          <div v-for="item in filteredContent" :key="item._id" class="content-card smooth-card"
            @click="showDetails(item)">
            <div class="content-poster">
              <img v-if="item.caminho" :src="getImageUrl(item.caminho)" :alt="item.nome" @load="onImageLoad"
                @error="onImageError" />
              <div v-else class="content-poster-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              <!-- Indicador de item na lista - CORRIGIDO -->
              <div v-if="isInMinhaLista(item)" class="list-indicator" :key="`indicator-${item._id}`">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <!-- Quick action button -->
              <button v-if="activeTab !== 'lista'" class="quick-add-btn smooth-btn"
                :class="{ 'in-list': isInMinhaLista(item), 'loading': isItemLoading(item._id) }"
                @click.stop="toggleMinhaLista(item)" :disabled="isItemLoading(item._id)">
                <svg v-if="!isItemLoading(item._id)" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <line v-if="!isInMinhaLista(item)" x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <div v-else class="btn-spinner-small"></div>
              </button>
            </div>
            <div class="content-info">
              <h3 class="content-title">{{ item.nome }}</h3>
              <div class="content-meta">
                <span class="content-year">{{ item.anoLancamento }}</span>
                <span v-if="item.duracao && !item.temporadas" class="content-duration">{{ formatDuration(item.duracao)
                }}</span>
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
        <button class="modal-close smooth-btn" @click="closeDetails">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="details-header">
          <div class="details-poster">
            <img v-if="selectedItem.caminho" :src="getImageUrl(selectedItem.caminho)" :alt="selectedItem.nome" />
            <div v-else class="details-poster-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              <span v-if="selectedItem.duracao" class="details-duration">{{ formatDuration(selectedItem.duracao)
              }}</span>
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
            <button class="play-button smooth-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Assistir agora
            </button>
            <button class="add-button smooth-btn"
              :class="{ 'in-list': isInMinhaLista(selectedItem), 'loading': isItemLoading(selectedItem._id) }"
              @click="toggleMinhaLista(selectedItem)" :disabled="isItemLoading(selectedItem._id)">
              <div class="btn-content">
                <svg v-if="!isItemLoading(selectedItem._id)" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <line v-if="!isInMinhaLista(selectedItem)" x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <div v-else class="btn-spinner"></div>
                <span>{{ getListButtonText(selectedItem) }}</span>
              </div>
            </button>
          </div>

          <!-- Sistema de Avaliação Corrigido -->
          <div class="rating-section">
            <h3 class="section-title">Avaliação</h3>
            <div class="rating">
              <label v-for="star in 5" :key="star" 
                     :class="{ filled: star <= selectedRating }" 
                     @click="handleRating(star)"
                     class="star-label">
                ★
              </label>
              <button v-if="avaliacaoId" 
                      @click="deleteRating" 
                      class="delete-button"
                      :disabled="!avaliacaoId">
                Remover Avaliação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast para feedback -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <div class="toast-content">
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

// API base URL
const API_URL = 'http://localhost:3000';

// Estado reativo principal
const filmes = ref([]);
const series = ref([]);
const minhaLista = ref({ filmes: [], series: [] });
const loading = ref(true);
const loadingMinhaLista = ref(false);
const refreshing = ref(false);
const loadingItems = ref(new Set()); // Track individual item loading states
const error = ref(null);
const searchQuery = ref('');
const activeTab = ref('todos');
const activeGenre = ref('');
const selectedItem = ref(null);
const featuredItem = ref(null);
const userId = ref(null);
const toast = ref({ show: false, message: '', type: 'success' });
const minhaListaCache = ref({ data: null, timestamp: null });
const CACHE_DURATION = 1 * 60 * 1000; // 1 minuto
const autoRefreshInterval = ref(null);

// ===== SISTEMA DE AVALIAÇÃO CORRIGIDO =====
const selectedRating = ref(0);
const avaliacaoId = ref(null);

// Debounce timer
let debounceTimer = null;

// Função auxiliar para obter o token de autenticação
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Função para obter o userId do token ou localStorage
const getUserId = () => {
  try {
    const token = getAuthToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload.id || payload.userId || payload.user?._id;

      // Verificar se o ID é válido
      if (id && typeof id === 'string' && id !== 'undefined' && id !== 'null' && id.length === 24) {
        return id;
      }
    }

    // Alternativa: buscar userId do localStorage
    const localUserId = localStorage.getItem('userId');
    if (localUserId && localUserId !== 'undefined' && localUserId !== 'null' && localUserId.length === 24) {
      return localUserId;
    }

    return null;
  } catch (error) {
    console.error('Erro ao obter userId:', error);
    return null;
  }
};

// Verificar se o token existe
const checkAuthentication = () => {
  const token = getAuthToken();
  const userIdValue = getUserId();

  console.log('🔐 Verificando autenticação:', {
    temToken: !!token,
    userId: userIdValue,
    tipoUserId: typeof userIdValue
  });

  if (!token || !userIdValue) {
    error.value = 'Usuário não autenticado. Faça login para continuar.';
    return false;
  }

  if (!isValidId(userIdValue)) {
    error.value = 'ID de usuário inválido. Faça login novamente.';
    return false;
  }

  userId.value = userIdValue;
  return true;
};

// Validar se um ID é válido
const isValidId = (id) => {
  return id &&
    id !== 'undefined' &&
    id !== 'null' &&
    id !== undefined &&
    id !== null &&
    typeof id === 'string' &&
    id.length === 24 &&
    /^[0-9a-fA-F]{24}$/.test(id);
};

// ===== FUNÇÕES DO SISTEMA DE AVALIAÇÃO =====

// Funções auxiliares para obter dados do item selecionado
const getCurrentUserId = () => {
  return userId.value;
};

const getCurrentItemId = () => {
  if (!selectedItem.value) return null;
  return selectedItem.value._id;
};

const getCurrentItemType = () => {
  if (!selectedItem.value) return null;
  return selectedItem.value.type; // 'filme' ou 'serie'
};

// Função para obter URL da avaliação
const getAvaliacaoUrl = () => {
  const currentUserId = getCurrentUserId();
  const currentItemId = getCurrentItemId();
  const currentItemType = getCurrentItemType();
  
  if (!currentUserId || !currentItemId || !currentItemType) {
    return null;
  }
  
  if (currentItemType === 'filme') {
    return `${API_URL}/avaliacao/usuario/${currentUserId}/filme/${currentItemId}`;
  } else if (currentItemType === 'serie') {
    return `${API_URL}/avaliacao/usuario/${currentUserId}/serie/${currentItemId}`;
  }
  return null;
};

// Buscar avaliação existente do usuário - CORRIGIDO
const fetchUserRating = async () => {
  if (!selectedItem.value) {
    console.warn('⚠️ fetchUserRating: Nenhum item selecionado');
    return;
  }

  const url = getAvaliacaoUrl();
  if (!url) {
    console.warn('⚠️ fetchUserRating: URL inválida para buscar avaliação');
    selectedRating.value = 0;
    avaliacaoId.value = null;
    return;
  }

  try {
    console.log(`📡 Buscando avaliação: ${url}`);
    console.log(`📋 Item selecionado:`, {
      nome: selectedItem.value.nome,
      id: selectedItem.value._id,
      type: selectedItem.value.type
    });
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    console.log(`📡 Resposta avaliação: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      if (data && data.nota) {
        selectedRating.value = data.nota;
        avaliacaoId.value = data._id;
        console.log('✅ Avaliação encontrada:', {
          nota: data.nota,
          avaliacaoId: data._id
        });
      } else {
        console.log('📝 Avaliação existe mas sem nota válida:', data);
        selectedRating.value = 0;
        avaliacaoId.value = null;
      }
    } else if (response.status === 404) {
      console.log('📝 Nenhuma avaliação encontrada para este item');
      selectedRating.value = 0;
      avaliacaoId.value = null;
    } else {
      console.warn('⚠️ Erro ao buscar avaliação:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.warn('⚠️ Detalhes do erro:', errorData);
      selectedRating.value = 0;
      avaliacaoId.value = null;
    }
  } catch (error) {
    console.error('❌ Erro ao buscar avaliação:', error);
    selectedRating.value = 0;
    avaliacaoId.value = null;
  }
};

// Salvar/atualizar avaliação
const handleRating = async (rating) => {
  const currentUserId = getCurrentUserId();
  const currentItemId = getCurrentItemId();
  const currentItemType = getCurrentItemType();
  
  // Validações
  if (!currentUserId) {
    console.error('❌ userId não encontrado');
    showToast('Erro: Usuário não identificado', 'error');
    return;
  }

  if (!currentItemId || !currentItemType) {
    console.error('❌ Item não identificado');
    showToast('Erro: Item não identificado', 'error');
    return;
  }

  if (!rating || rating < 1 || rating > 5) {
    console.error('❌ Nota inválida:', rating);
    showToast('Erro: Nota deve ser entre 1 e 5', 'error');
    return;
  }

  selectedRating.value = rating;

  // Preparar payload baseado no tipo do item
  const payload = {
    userId: currentUserId,
    nota: rating
  };

  if (currentItemType === 'filme') {
    payload.filmeId = currentItemId;
  } else if (currentItemType === 'serie') {
    payload.serieId = currentItemId;
  }

  console.log('📡 Enviando avaliação:', payload);

  try {
    const response = await fetch(`${API_URL}/avaliacao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(payload),
    });

    console.log(`📡 Resposta: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      avaliacaoId.value = data.resultado._id;
      console.log('✅ Avaliação salva com sucesso:', data);
      showToast('Avaliação salva com sucesso!', 'success');
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      console.error('❌ Erro na resposta:', errorData);
      showToast(`Erro: ${errorData.message}`, 'error');
      selectedRating.value = 0; // Reset em caso de erro
    }
  } catch (error) {
    console.error('❌ Erro ao salvar avaliação:', error);
    showToast(`Erro ao salvar avaliação: ${error.message}`, 'error');
    selectedRating.value = 0; // Reset em caso de erro
  }
};

// Deletar avaliação
const deleteRating = async () => {
  if (!avaliacaoId.value) {
    console.warn('⚠️ Nenhuma avaliação para deletar');
    return;
  }

  try {
    console.log(`🗑️ Deletando avaliação: ${avaliacaoId.value}`);
    
    const response = await fetch(`${API_URL}/avaliacao/${avaliacaoId.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    console.log(`📡 Resposta delete: ${response.status} ${response.statusText}`);

    if (response.ok) {
      console.log('✅ Avaliação deletada com sucesso');
      selectedRating.value = 0;
      avaliacaoId.value = null;
      showToast('Avaliação removida com sucesso!', 'success');
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      console.error('❌ Erro ao deletar:', errorData);
      showToast(`Erro ao remover avaliação: ${errorData.message}`, 'error');
    }
  } catch (error) {
    console.error('❌ Erro ao deletar avaliação:', error);
    showToast(`Erro ao remover avaliação: ${error.message}`, 'error');
  }
};

// Watch para carregar avaliação quando selectedItem mudar - CORRIGIDO
watch(selectedItem, async (newItem, oldItem) => {
  console.log('🔄 selectedItem mudou:', {
    anterior: oldItem?.nome || 'nenhum',
    novo: newItem?.nome || 'nenhum'
  });

  if (newItem) {
    // Reset imediato
    selectedRating.value = 0;
    avaliacaoId.value = null;
    
    // Aguardar um pouco para garantir que o modal renderizou
    await nextTick();
    
    // Pequeno delay adicional para garantir estabilidade
    setTimeout(() => {
      console.log('🔄 Iniciando busca de avaliação...');
      fetchUserRating();
    }, 200);
  } else {
    // Item foi fechado
    selectedRating.value = 0;
    avaliacaoId.value = null;
  }
}, { immediate: false });

// ===== FUNÇÕES PRINCIPAIS DO SISTEMA =====

// Auto-refresh da lista a cada 2 minutos quando estiver na aba "lista"
const startAutoRefresh = () => {
  // Limpar intervalo anterior se existir
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value);
  }

  autoRefreshInterval.value = setInterval(() => {
    if (activeTab.value === 'lista' && !loadingMinhaLista.value && !refreshing.value) {
      console.log('🔄 Auto-refresh da lista...');
      loadMinhaLista(true);
    }
  }, 120000); // 2 minutos
};

// Parar auto-refresh
const stopAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value);
    autoRefreshInterval.value = null;
  }
};

// Update timestamp display
const updateTimeDisplay = ref(Date.now());
setInterval(() => {
  updateTimeDisplay.value = Date.now();
}, 60000); // Update every minute

// Função para forçar atualização completa (última alternativa)
const forceFullRefresh = () => {
  console.log('🔄 Forçando atualização completa...');

  // Limpar todos os caches
  minhaListaCache.value = { data: null, timestamp: null };

  // Recarregar tudo
  loadContent();

  showToast('Dados atualizados', 'success');
};

// Verificar se item específico está carregando
const isItemLoading = (itemId) => {
  return loadingItems.value.has(itemId);
};

// Mostrar toast com animação
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3500);
};

// Verificar se cache é válido
const isCacheValid = () => {
  if (!minhaListaCache.value.timestamp) return false;
  return Date.now() - minhaListaCache.value.timestamp < CACHE_DURATION;
};

// Carregar minha lista com cache inteligente - CORRIGIDO
const loadMinhaLista = async (forceRefresh = false) => {
  if (!userId.value) {
    console.warn('⚠️ Tentativa de carregar lista sem userId');
    return;
  }

  if (!isValidId(userId.value)) {
    console.error('❌ UserId inválido:', userId.value);
    showToast('Erro: ID de usuário inválido', 'error');
    return;
  }

  // Usar cache se válido e não forçar refresh
  if (!forceRefresh && isCacheValid() && minhaListaCache.value.data) {
    console.log('📦 Usando cache para minha lista');
    minhaLista.value = minhaListaCache.value.data;
    
    // Log detalhado do cache
    console.log('📋 Cache da lista:', {
      filmesCount: minhaLista.value.filmes?.length || 0,
      seriesCount: minhaLista.value.series?.length || 0,
      filmes: minhaLista.value.filmes?.map(f => ({ id: f._id, nome: f.nome, type: f.type })) || [],
      series: minhaLista.value.series?.map(s => ({ id: s._id, nome: s.nome, type: s.type })) || []
    });
    
    return;
  }

  if (forceRefresh) {
    refreshing.value = true;
    console.log('🔄 Forçando refresh da lista...');
  } else {
    loadingMinhaLista.value = true;
    console.log('📥 Carregando minha lista...');
  }

  try {
    console.log(`📡 GET ${API_URL}/listausuario/${userId.value}`);

    const response = await fetch(`${API_URL}/listausuario/${userId.value}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      }
    });

    console.log(`📡 Resposta: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const lista = await response.json();
      
      // Log da resposta bruta
      console.log('📄 Resposta bruta da API:', lista);
      
      const listaData = {
        filmes: lista.filmes || [],
        series: lista.series || []
      };

      // Garantir que todos os itens tenham o campo 'type' correto
      listaData.filmes = listaData.filmes.map(filme => ({
        ...filme,
        type: 'filme'
      }));
      
      listaData.series = listaData.series.map(serie => ({
        ...serie,
        type: 'serie'
      }));

      console.log('✅ Lista processada:', {
        filmes: listaData.filmes.length,
        series: listaData.series.length,
        total: listaData.filmes.length + listaData.series.length,
        filmesDetalhes: listaData.filmes.map(f => ({ 
          id: f._id, 
          nome: f.nome, 
          type: f.type 
        })),
        seriesDetalhes: listaData.series.map(s => ({ 
          id: s._id, 
          nome: s.nome, 
          type: s.type 
        }))
      });

      minhaLista.value = listaData;
      minhaListaCache.value = {
        data: listaData,
        timestamp: Date.now()
      };
      
      // Force re-render dos indicadores
      await nextTick();
      
    } else if (response.status === 404) {
      console.log('📝 Lista não existe, criando nova...');
      await criarLista();
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || 'Erro ao carregar lista');
    }
  } catch (err) {
    console.error('❌ Erro ao carregar minha lista:', err);
    if (forceRefresh) {
      showToast('Erro ao atualizar lista', 'error');
    }
  } finally {
    loadingMinhaLista.value = false;
    refreshing.value = false;
  }
};

// Refresh manual da lista
const refreshMinhaLista = () => {
  loadMinhaLista(true);
};

// Criar lista do usuário
const criarLista = async () => {
  if (!userId.value) {
    console.error('❌ Tentativa de criar lista sem userId');
    return;
  }

  if (!isValidId(userId.value)) {
    console.error('❌ UserId inválido para criar lista:', userId.value);
    return;
  }

  try {
    console.log('📝 Criando nova lista para usuário:', userId.value);

    const response = await fetch(`${API_URL}/listausuario/criar`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ userId: userId.value })
    });

    console.log(`📡 Resposta criação: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const lista = await response.json();
      const listaData = {
        filmes: lista.filmes || [],
        series: lista.series || []
      };

      console.log('✅ Lista criada com sucesso');

      minhaLista.value = listaData;
      minhaListaCache.value = {
        data: listaData,
        timestamp: Date.now()
      };
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(errorData.message || 'Erro ao criar lista');
    }
  } catch (err) {
    console.error('❌ Erro ao criar lista:', err);
    showToast('Erro ao criar lista', 'error');
  }
};

// Verificar se um item está na minha lista - CORRIGIDO
const isInMinhaLista = (item) => {
  if (!item || !item._id || !minhaLista.value) {
    console.log('❌ isInMinhaLista: dados inválidos', { item: !!item, itemId: item?._id, minhaLista: !!minhaLista.value });
    return false;
  }

  // Log para debug (remover em produção)
  console.log('🔍 Verificando se item está na lista:', {
    itemId: item._id,
    itemNome: item.nome,
    itemType: item.type,
    listaFilmes: minhaLista.value.filmes?.length || 0,
    listaSeries: minhaLista.value.series?.length || 0
  });

  let isInList = false;

  if (item.type === 'filme') {
    isInList = minhaLista.value.filmes && minhaLista.value.filmes.some(filme => {
      const match = filme._id === item._id;
      if (match) {
        console.log('✅ Filme encontrado na lista:', filme.nome);
      }
      return match;
    });
  } else if (item.type === 'serie') {
    isInList = minhaLista.value.series && minhaLista.value.series.some(serie => {
      const match = serie._id === item._id;
      if (match) {
        console.log('✅ Série encontrada na lista:', serie.nome);
      }
      return match;
    });
  }

  console.log(`🎯 Item "${item.nome}" está na lista:`, isInList);
  return isInList;
};

// Count de itens na lista
const minhaListaCount = computed(() => {
  return (minhaLista.value.filmes?.length || 0) + (minhaLista.value.series?.length || 0);
});

// Helper para mostrar tempo da última atualização
const lastUpdateText = computed(() => {
  if (!minhaListaCache.value.timestamp) return '';

  const now = Date.now();
  const diff = now - minhaListaCache.value.timestamp;

  if (diff < 60000) return 'Atualizado agora';
  if (diff < 3600000) return `Atualizado há ${Math.floor(diff / 60000)}min`;
  return `Atualizado há ${Math.floor(diff / 3600000)}h`;
});

// ⭐ FUNÇÃO PRINCIPAL MODIFICADA - Adicionar/Remover item da minha lista com RELOAD
const toggleMinhaLista = async (item) => {
  if (!userId.value || isItemLoading(item._id)) return;

  // Validações extras
  if (!item || !item._id) {
    console.error('Item inválido:', item);
    showToast('Erro: Item inválido', 'error');
    return;
  }

  if (!isValidId(item._id)) {
    console.error('ID do item inválido:', item._id);
    showToast('Erro: ID do item inválido', 'error');
    return;
  }

  if (!isValidId(userId.value)) {
    console.error('ID do usuário inválido:', userId.value);
    showToast('Erro: Usuário não autenticado', 'error');
    return;
  }

  if (!item.type || (item.type !== 'filme' && item.type !== 'serie')) {
    console.error('Tipo de item inválido:', item.type);
    showToast('Erro: Tipo de item inválido', 'error');
    return;
  }

  // Clear previous debounce
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Add debounce
  debounceTimer = setTimeout(async () => {
    loadingItems.value.add(item._id);
    const isCurrentlyInList = isInMinhaLista(item);
    const action = isCurrentlyInList ? 'DELETE' : 'POST';
    const actionText = isCurrentlyInList ? 'remover' : 'adicionar';

    console.log(`🎬 ${actionText.toUpperCase()} ${item.type.toUpperCase()}:`, {
      itemId: item._id,
      userId: userId.value,
      nome: item.nome,
      tipo: item.type,
      acao: action
    });

    try {
      const endpoint = item.type === 'filme'
        ? `/listausuario/filme/${item._id}`
        : `/listausuario/serie/${item._id}`;

      console.log(`📡 Fazendo requisição: ${action} ${API_URL}${endpoint}`);

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: action,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ userId: userId.value })
      });

      console.log(`📡 Resposta: ${response.status} ${response.statusText}`);

      if (response.ok) {
        console.log(`✅ Operação ${actionText} realizada com sucesso!`);

        // Mostrar feedback de sucesso
        const successMessage = isCurrentlyInList
          ? `"${item.nome}" removido da sua lista`
          : `"${item.nome}" adicionado à sua lista`;
        showToast(successMessage, 'success');

        // 🔄 RELOAD DA PÁGINA após operação bem-sucedida
        setTimeout(() => {
          console.log('🔄 Recarregando página...');
          window.location.reload();
        }, 1500); // Pequeno delay para mostrar o toast

      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        console.error(`❌ Erro na resposta:`, errorData);
        showToast(`Erro: ${errorData.message}`, 'error');
        throw new Error(errorData.message || `Erro ao ${actionText} item`);
      }
    } catch (err) {
      console.error(`❌ Erro ao ${actionText} item:`, err);
      showToast(`Erro ao ${actionText} "${item.nome}": ${err.message}`, 'error');
    } finally {
      loadingItems.value.delete(item._id);
    }
  }, 200);
};

// Get button text helper
const getListButtonText = (item) => {
  if (isItemLoading(item._id)) return 'Processando...';
  return isInMinhaLista(item) ? 'Remover da Lista' : 'Adicionar à Lista';
};

// Carregar conteúdo (filmes e séries)
const loadContent = async () => {
  if (!checkAuthentication()) return;

  loading.value = true;
  error.value = null;

  try {
    // Carregar filmes e séries em paralelo
    const [filmesResponse, seriesResponse] = await Promise.all([
      fetch(`${API_URL}/filmes`, {
        method: 'GET',
        headers: { "Authorization": `Bearer ${getAuthToken()}` }
      }),
      fetch(`${API_URL}/series`, {
        method: 'GET',
        headers: { "Authorization": `Bearer ${getAuthToken()}` }
      })
    ]);

    if (!filmesResponse.ok || !seriesResponse.ok) {
      if (filmesResponse.status === 401 || seriesResponse.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.');
      }
      throw new Error('Erro ao carregar conteúdo');
    }

    const [filmesData, seriesData] = await Promise.all([
      filmesResponse.json(),
      seriesResponse.json()
    ]);

    filmes.value = filmesData.map(filme => ({ ...filme, type: 'filme' }));
    series.value = seriesData.map(serie => ({ ...serie, type: 'serie' }));

    // Selecionar item em destaque
    const allContent = [...filmes.value, ...series.value];
    if (allContent.length > 0) {
      const randomIndex = Math.floor(Math.random() * allContent.length);
      featuredItem.value = allContent[randomIndex];
    }

    // Carregar minha lista
    await loadMinhaLista();

  } catch (err) {
    console.error('Erro ao carregar conteúdo:', err);
    error.value = err.message || 'Não foi possível carregar o conteúdo. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};

// Lista filtrada de conteúdo
const filteredContent = computed(() => {
  let content = [];

  if (activeTab.value === 'todos') {
    content = [...filmes.value, ...series.value];
  } else if (activeTab.value === 'filmes') {
    content = [...filmes.value];
  } else if (activeTab.value === 'series') {
    content = [...series.value];
  } else if (activeTab.value === 'lista') {
    content = [...minhaLista.value.filmes, ...minhaLista.value.series];
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    content = content.filter(item =>
      item.nome.toLowerCase().includes(query) ||
      item.genero.toLowerCase().includes(query) ||
      item.sinopse.toLowerCase().includes(query)
    );
  }

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
  activeGenre.value = '';
  searchQuery.value = '';

  // Auto-refresh quando entrar na aba "Minha Lista"
  if (tab === 'lista') {
    console.log('🔄 Entrando na aba "Minha Lista", verificando dados...');

    // Se o cache for muito antigo (mais de 30 segundos), force refresh
    const cacheAge = minhaListaCache.value.timestamp
      ? Date.now() - minhaListaCache.value.timestamp
      : Infinity;

    if (cacheAge > 30000) { // 30 segundos
      console.log('📅 Cache antigo, forçando refresh...');
      loadMinhaLista(true);
    } else {
      console.log('📦 Cache ainda válido, usando dados locais');
      loadMinhaLista(false);
    }
  }
};

const handleSearch = () => {
  // A filtragem é feita automaticamente pelo computed property
};

const filterByGenre = (genre) => {
  activeGenre.value = genre === activeGenre.value ? '' : genre;
};

const showDetails = async (item) => {
  console.log('🎬 Abrindo detalhes do item:', item.nome);
  
  selectedItem.value = item;
  
  // Aguardar renderização do modal
  await nextTick();
  
  // Buscar avaliação após modal estar pronto
  setTimeout(() => {
    fetchUserRating();
  }, 300);
};

const closeDetails = () => {
  console.log('❌ Fechando modal de detalhes');
  selectedItem.value = null;
  // Reset avaliação quando fechar modal
  selectedRating.value = 0;
  avaliacaoId.value = null;
};

const formatDuration = (minutes) => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `../uploads/${imagePath}`;
};

const getSectionTitle = () => {
  if (searchQuery.value) return `Resultados para "${searchQuery.value}"`;
  if (activeGenre.value) return activeGenre.value;
  if (activeTab.value === 'todos') return 'Todos os Títulos';
  if (activeTab.value === 'filmes') return 'Filmes';
  if (activeTab.value === 'series') return 'Séries';
  if (activeTab.value === 'lista') return `Minha Lista (${minhaListaCount.value})`;
  return '';
};

const getEmptyStateTitle = () => {
  if (activeTab.value === 'lista') return 'Sua lista está vazia';
  if (searchQuery.value) return 'Nenhum resultado encontrado';
  if (activeGenre.value) return 'Nenhum conteúdo encontrado';
  return 'Nenhum conteúdo disponível';
};

const getEmptyStateMessage = () => {
  if (activeTab.value === 'lista') return 'Adicione filmes e séries aos favoritos para acessá-los rapidamente';
  if (searchQuery.value) return `Nenhum resultado para "${searchQuery.value}"`;
  if (activeGenre.value) return `Nenhum conteúdo do gênero "${activeGenre.value}"`;
  return 'Não há conteúdo disponível no momento';
};

// Image loading handlers
const onImageLoad = (event) => {
  event.target.style.opacity = '1';
};

const onImageError = (event) => {
  event.target.style.display = 'none';
};

// Carregar conteúdo ao montar
onMounted(async () => {
  await loadContent();
  startAutoRefresh();
  
  // Debug inicial (remover em produção)
  setTimeout(() => {
    debugListaState();
  }, 2000);
});

// ===== FUNÇÃO DE DEBUG =====
const debugListaState = () => {
  console.log('🐛 DEBUG - Estado atual da lista:', {
    minhaLista: minhaLista.value,
    filmesNaLista: minhaLista.value.filmes?.map(f => ({ 
      id: f._id, 
      nome: f.nome, 
      type: f.type 
    })) || [],
    seriesNaLista: minhaLista.value.series?.map(s => ({ 
      id: s._id, 
      nome: s.nome, 
      type: s.type 
    })) || [],
    userId: userId.value,
    activeTab: activeTab.value
  });
};

// Função para testar primeiro item (chamar no console)
window.testarPrimeiroItem = () => {
  const primeiroFilme = minhaLista.value.filmes?.[0];
  if (primeiroFilme) {
    console.log('🧪 Testando primeiro filme:', {
      filme: primeiroFilme,
      estaInMinhaLista: isInMinhaLista(primeiroFilme)
    });
  } else {
    console.log('❌ Nenhum filme na lista para testar');
  }
};

// Função para debug no console
window.debugNetflix = () => {
  debugListaState();
};

// Cleanup ao desmontar
onUnmounted(() => {
  stopAutoRefresh();
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});

// Watch para mudanças na aba ativa
watch(activeTab, () => {
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

/* ===== ESTILOS SISTEMA DE AVALIAÇÃO ===== */
.rating-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #333;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.star-label {
  font-size: 28px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.star-label:hover {
  color: #ffd700;
  transform: scale(1.1);
}

.star-label.filled {
  color: #ffd700;
}

.delete-button {
  background: rgba(220, 53, 69, 0.8);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 16px;
  transition: all 0.3s ease;
}

.delete-button:hover:not(:disabled) {
  background: rgba(220, 53, 69, 1);
  transform: translateY(-1px);
}

.delete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== RESTO DOS ESTILOS ORIGINAIS ===== */

.netflix-bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(20, 20, 20, 0.8) 100%);
  z-index: -1;
}

/* Smooth button animations */
.smooth-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.smooth-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.smooth-btn:hover::before {
  left: 100%;
}

.smooth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.smooth-btn:active {
  transform: translateY(0);
}

.smooth-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.smooth-card:hover {
  transform: scale(1.05) translateY(-5px);
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
  backdrop-filter: blur(10px);
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
  transition: all 0.3s ease;
}

.site-logo:hover {
  transform: scale(1.05);
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 2px solid transparent;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-button:hover {
  color: #fff;
  transform: translateY(-1px);
}

.tab-button.active {
  color: #fff;
  border-bottom: 2px solid #e50914;
}

.list-count {
  background-color: #e50914;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
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
  transition: all 0.3s ease;
}

.search-box input:focus {
  background-color: #454545;
  outline: none;
  transform: scale(1.02);
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
  transition: all 0.3s ease;
}

.search-button:hover {
  color: #fff;
  transform: translateY(-50%) scale(1.1);
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
  transition: transform 0.3s ease;
}

.featured-content:hover .featured-backdrop-image {
  transform: scale(1.02);
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
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.featured-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
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
  backdrop-filter: blur(5px);
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
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.featured-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.6s both;
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
  box-shadow: 0 2px 8px rgba(229, 9, 20, 0.3);
}

.play-button:hover {
  background-color: #f40612;
  box-shadow: 0 4px 16px rgba(229, 9, 20, 0.5);
}

.add-button-featured {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(51, 51, 51, 0.8);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.add-button-featured.in-list {
  background-color: rgba(34, 139, 34, 0.8);
  border-color: rgba(34, 139, 34, 0.3);
}

.add-button-featured:hover:not(:disabled) {
  background-color: rgba(68, 68, 68, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
}

.add-button-featured.in-list:hover:not(:disabled) {
  background-color: rgba(34, 139, 34, 0.9);
}

.add-button-featured:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Content Section */
.netflix-content {
  padding: 0 4% 30px;
}

.content-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.title-section {
  flex: 1;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.last-update {
  color: #aaa;
  font-size: 12px;
  font-weight: 400;
  display: block;
  margin-top: 2px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
}

.refresh-button,
.force-refresh-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(51, 51, 51, 0.8);
  color: #aaa;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.refresh-button:hover:not(:disabled),
.force-refresh-button:hover:not(:disabled) {
  color: #fff;
  background-color: rgba(68, 68, 68, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
}

.force-refresh-button {
  background-color: rgba(0, 113, 235, 0.2);
  color: #0071eb;
  border-color: rgba(0, 113, 235, 0.3);
}

.force-refresh-button:hover:not(:disabled) {
  background-color: rgba(0, 113, 235, 0.3);
  color: #fff;
  border-color: rgba(0, 113, 235, 0.5);
}

.refresh-button:disabled,
.force-refresh-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

.genre-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.genre-button {
  background-color: rgba(51, 51, 51, 0.8);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.genre-button:hover {
  background-color: rgba(68, 68, 68, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.content-card {
  background-color: #2f2f2f;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.content-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.content-poster {
  position: relative;
  width: 100%;
  height: 250px;
  background-color: #222;
  overflow: hidden;
}

.content-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: all 0.3s ease;
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
  background-color: rgba(229, 9, 20, 0.9);
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  backdrop-filter: blur(5px);
}

.list-indicator {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(34, 139, 34, 0.9);
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  backdrop-filter: blur(5px);
  animation: bounceIn 0.5s ease;
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

.quick-add-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(51, 51, 51, 0.9);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.content-card:hover .quick-add-btn {
  opacity: 1;
  transform: translateY(0);
}

.quick-add-btn.in-list {
  background-color: rgba(34, 139, 34, 0.9);
}

.quick-add-btn:hover:not(:disabled) {
  transform: scale(1.1);
}

.quick-add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

/* Button content and spinners */
.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-spinner,
.btn-spinner-small {
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

.btn-spinner {
  width: 16px;
  height: 16px;
}

.btn-spinner-small {
  width: 12px;
  height: 12px;
  border-width: 1.5px;
}

/* Skeleton Loading */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.skeleton-card {
  background-color: #2f2f2f;
  border-radius: 8px;
  overflow: hidden;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-poster {
  width: 100%;
  height: 250px;
  background-color: #404040;
}

.skeleton-info {
  padding: 12px;
}

.skeleton-title {
  height: 16px;
  background-color: #404040;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-meta {
  height: 12px;
  background-color: #404040;
  border-radius: 4px;
  width: 60%;
  margin-bottom: 6px;
}

.skeleton-genre {
  height: 10px;
  background-color: #404040;
  border-radius: 4px;
  width: 40%;
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
  to {
    transform: rotate(360deg);
  }
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
  line-height: 1.5;
}

.retry-button,
.browse-button {
  background-color: #e50914;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}

.browse-button {
  background-color: #0071eb;
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
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.modal-content {
  background-color: #181818;
  border-radius: 8px;
  position: relative;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
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
  backdrop-filter: blur(10px);
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

.details-meta>span {
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
  margin-bottom: 20px;
}

.add-button {
  display: flex;
  align-items: center;
  background-color: rgba(51, 51, 51, 0.8);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.add-button.in-list {
  background-color: rgba(34, 139, 34, 0.8);
  border-color: rgba(34, 139, 34, 0.3);
}

.add-button:hover:not(:disabled) {
  background-color: rgba(68, 68, 68, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
}

.add-button.in-list:hover:not(:disabled) {
  background-color: rgba(34, 139, 34, 0.9);
}

.add-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
}

.toast.success {
  background-color: rgba(34, 139, 34, 0.9);
  border-color: rgba(34, 139, 34, 0.3);
}

.toast.error {
  background-color: rgba(220, 53, 69, 0.9);
  border-color: rgba(220, 53, 69, 0.3);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) translateY(-20px);
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

  .featured-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .title-section {
    text-align: center;
  }

  .header-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .tabs {
    flex-wrap: wrap;
    gap: 12px;
  }

  .toast {
    bottom: 80px;
    left: 20px;
    right: 20px;
  }

  .rating {
    flex-wrap: wrap;
    gap: 8px;
  }

  .star-label {
    font-size: 24px;
  }

  .delete-button {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>