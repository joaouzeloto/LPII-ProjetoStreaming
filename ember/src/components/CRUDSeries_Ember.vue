<template>
  <div class="netflix-wrapper">
    <div class="netflix-bg-overlay"></div>
    
    <!-- Header -->
    <header class="netflix-header">
      <div class="logo-container">
        <h1 class="site-logo">NET-FLIX</h1>
      </div>
      <div class="search-container">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar séries..."
            @input="handleSearch" 
          />
          <button class="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        <div class="filter-options">
          <button 
            class="filter-button" 
            :class="{ active: activeFilter === 'all' }"
            @click="setFilter('all')"
          >
            Todos
          </button>
          <button 
            class="filter-button" 
            :class="{ active: activeFilter === 'genre' }"
            @click="setFilter('genre')"
          >
            Gênero
          </button>
          <button 
            class="filter-button" 
            :class="{ active: activeFilter === 'year' }"
            @click="setFilter('year')"
          >
            Ano
          </button>
        </div>
      </div>
      <div class="actions-container">
        <button class="add-series-button" @click="showAddSeries = true">
          Adicionar Série
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="netflix-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando séries...</p>
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
        <button class="retry-button" @click="loadSeries">Tentar novamente</button>
      </div>
      
      <!-- No Results State -->
      <div v-else-if="series.length === 0" class="no-results-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h2>Nenhuma série encontrada</h2>
        <p v-if="searchQuery">Nenhum resultado para "{{ searchQuery }}"</p>
        <p v-else>Adicione séries para começar</p>
        <button class="add-first-button" @click="showAddSeries = true">
          Adicionar Série
        </button>
      </div>
      
      <!-- Series Grid -->
      <div v-else class="series-grid">
        <div 
          v-for="serie in series" 
          :key="serie._id" 
          class="series-card"
          @click="selectSerie(serie)"
        >
          <div class="series-poster">
            <img 
              v-if="serie.caminho" 
              :src="'../uploads/'+serie.caminho" 
              :alt="serie.nome"
            />
            <div v-else class="series-poster-placeholder">
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
            <div class="series-actions">
              <button class="action-button edit" @click.stop="editSerie(serie)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>
              <button class="action-button delete" @click.stop="confirmDelete(serie)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
              <button v-if="serie.caminhoSerie" class="action-button play" @click.stop="playSerie(serie)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            </div>
          </div>
          <div class="series-info">
            <h3 class="series-title">{{ serie.nome }}</h3>
            <div class="series-meta">
              <span class="series-year">{{ serie.anoLancamento }}</span>
              <span class="series-duration">{{ serie.temporadas }} Temp</span>
            </div>
            <span class="series-genre">{{ serie.genero }}</span>
            <div v-if="serie.caminhoSerie" class="series-status">
              <span class="video-available">📺 Vídeo Disponível</span>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Modal for series details -->
    <div v-if="selectedSerie" class="modal-overlay" @click="closeModal">
      <div class="modal-content series-details" @click.stop>
        <button class="modal-close" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="series-header">
          <div class="series-poster">
            <img 
              v-if="selectedSerie.caminho" 
              :src="'../uploads/'+selectedSerie.caminho" 
              :alt="selectedSerie.nome"
            />
            <div v-else class="series-poster-placeholder">
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
          <div class="series-main-info">
            <h2 class="series-title">{{ selectedSerie.nome }}</h2>
            <div class="series-meta">
              <span class="series-year">{{ selectedSerie.anoLancamento }}</span>
              <span class="series-duration">{{ formatDuration(selectedSerie.duracao) }}</span>
              <span class="series-genre">{{ selectedSerie.genero }}</span>
            </div>
            <div class="series-seasons-info">
              <span class="seasons-badge">{{ selectedSerie.temporadas }} Temporadas</span>
              <span class="episodes-badge">{{ selectedSerie.episodios }} Episódios</span>
            </div>
            <div v-if="selectedSerie.caminhoSerie" class="play-section">
              <button class="play-button" @click="playSerie(selectedSerie)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Assistir
              </button>
            </div>
          </div>
        </div>
        
        <div class="series-body">
          <h3 class="section-title">Sinopse</h3>
          <p class="series-synopsis">{{ selectedSerie.sinopse }}</p>
          
          <div class="series-actions">
            <button class="action-btn edit" @click="editSerie(selectedSerie)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
              Editar
            </button>
            <button class="action-btn delete" @click="confirmDelete(selectedSerie)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for video player -->
    <div v-if="showVideoPlayer" class="modal-overlay" @click="closeVideoPlayer">
      <div class="modal-content video-player-modal" @click.stop>
        <button class="modal-close" @click="closeVideoPlayer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h3 class="video-title">{{ playingSerie?.nome }}</h3>
        <video 
          v-if="playingSerie?.caminhoSerie" 
          :src="'../uploads/' + playingSerie.caminhoSerie"
          controls
          width="100%"
          height="400"
        >
          Seu navegador não suporta o elemento de vídeo.
        </video>
      </div>
    </div>
    
    <!-- Modal for add/edit series -->
    <div v-if="showAddSeries || editingSerie" class="modal-overlay" @click="closeModal">
      <div class="modal-content series-form" @click.stop>
        <button class="modal-close" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <h2 class="form-title">{{ editingSerie ? 'Editar Série' : 'Adicionar Série' }}</h2>
        
        <form class="series-form" @submit.prevent="saveSerie">
          <div class="form-group">
            <label for="nome">Nome da Série</label>
            <input 
              type="text" 
              id="nome" 
              v-model="formSerie.nome" 
              placeholder="Digite o nome da série"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="genero">Gênero</label>
            <select 
              id="genero" 
              v-model="formSerie.genero" 
              required
            >
              <option value="" disabled>Selecione um gênero</option>
              <option value="Ação">Ação</option>
              <option value="Aventura">Aventura</option>
              <option value="Comédia">Comédia</option>
              <option value="Drama">Drama</option>
              <option value="Ficção Científica">Ficção Científica</option>
              <option value="Romance">Romance</option>
              <option value="Terror">Terror</option>
              <option value="Documentário">Documentário</option>
              <option value="Animação">Animação</option>
              <option value="Suspense">Suspense</option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="anoLancamento">Ano de Lançamento</label>
              <input 
                type="number" 
                id="anoLancamento" 
                v-model="formSerie.anoLancamento" 
                placeholder="Ano"
                min="1900"
                :max="new Date().getFullYear()"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="duracao">Duração (minutos por episódio)</label>
              <input 
                type="number" 
                id="duracao" 
                v-model="formSerie.duracao" 
                placeholder="Minutos"
                min="1"
                required
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="temporadas">Temporadas</label>
              <input 
                type="number" 
                id="temporadas" 
                v-model="formSerie.temporadas" 
                placeholder="Número de temporadas"
                min="1"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="episodios">Episódios</label>
              <input 
                type="number" 
                id="episodios" 
                v-model="formSerie.episodios" 
                placeholder="Total de episódios"
                min="1"
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="sinopse">Sinopse</label>
            <textarea 
              id="sinopse" 
              v-model="formSerie.sinopse" 
              placeholder="Digite a sinopse da série"
              rows="5"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="imagem">Imagem da Série</label>
            <div class="file-input-container">
              <input 
                type="file" 
                id="imagem" 
                ref="imageInput"
                @change="handleImageChange" 
                accept="image/*"
              />
              <label for="imagem" class="file-input-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                {{ selectedImageName || 'Escolher imagem' }}
              </label>
            </div>
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Preview" />
            </div>
          </div>

          <div class="form-group">
            <label for="serie">Arquivo da Série (Vídeo)</label>
            <div class="file-input-container">
              <input 
                type="file" 
                id="serie" 
                ref="videoInput"
                @change="handleVideoChange" 
                accept="video/*"
              />
              <label for="serie" class="file-input-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                {{ selectedVideoName || 'Escolher vídeo' }}
              </label>
            </div>
            <div v-if="videoPreview" class="video-preview">
              <video :src="videoPreview" controls width="100%" height="200">
                Seu navegador não suporta o elemento de vídeo.
              </video>
            </div>
            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{width: uploadProgress + '%'}"></div>
              </div>
              <span class="progress-text">{{ uploadProgress }}% carregado</span>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="cancel-button" @click="closeModal">Cancelar</button>
            <button type="submit" class="save-button" :disabled="uploading">
              {{ uploading ? 'Salvando...' : (editingSerie ? 'Atualizar' : 'Salvar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Confirmation dialog for delete -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content confirm-dialog" @click.stop>
        <h3 class="confirm-title">Confirmar exclusão</h3>
        <p class="confirm-message">
          Tem certeza que deseja excluir a série <strong>{{ deleteSerie?.nome }}</strong>?
          <br>Esta ação não pode ser desfeita.
        </p>
        <div class="confirm-actions">
          <button class="cancel-button" @click="cancelDelete">Cancelar</button>
          <button class="delete-button" @click="deleteSerieConfirmed">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Excluir
          </button>
        </div>
      </div>
    </div>
    
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
import { ref, computed, onMounted, watch } from 'vue';

// API base URL
const API_URL = 'http://localhost:3000';

// Estado reativo
const series = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const activeFilter = ref('all');
const selectedSerie = ref(null);
const showAddSeries = ref(false);
const editingSerie = ref(null);
const formSerie = ref({
  nome: '',
  genero: '',
  sinopse: '',
  anoLancamento: new Date().getFullYear(),
  duracao: '',
  temporadas: 1,
  episodios: 1
});
const showDeleteConfirm = ref(false);
const deleteSerie = ref(null);
const imagePreview = ref(null);
const videoPreview = ref(null);
const selectedImageName = ref('');
const selectedVideoName = ref('');
const selectedImageFile = ref(null);
const selectedVideoFile = ref(null);
const toasts = ref([]);
const uploading = ref(false);
const uploadProgress = ref(0);
const showVideoPlayer = ref(false);
const playingSerie = ref(null);

// Função auxiliar para obter o token de autenticação
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Verificar se o token existe
const checkAuthentication = () => {
  const token = getAuthToken();
  if (!token) {
    showToast('Usuário não autenticado. Faça login para continuar.', 'error');
    return false;
  }
  return true;
};

// Métodos
const loadSeries = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/series`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.');
      }
      throw new Error('Erro ao carregar séries');
    }
    
    series.value = await response.json();
    console.log('Séries carregadas:', series.value);
  } catch (err) {
    console.error('Erro ao carregar séries:', err);
    error.value = err.message || 'Não foi possível carregar as séries. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    await loadSeries();
    return;
  }
  
  loading.value = true;
  error.value = null;
  
  try {
    let endpoint = `${API_URL}/series`;
    const token = getAuthToken();
    
    if (activeFilter.value === 'all') {
      endpoint = `${API_URL}/series/search/${searchQuery.value}`;
    } else if (activeFilter.value === 'genre') {
      endpoint = `${API_URL}/series/genre/${searchQuery.value}`;
    } else if (activeFilter.value === 'year') {
      endpoint = `${API_URL}/series/year/${searchQuery.value}`;
    }
    
    console.log('Buscando séries em:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.');
      }
      throw new Error('Erro na busca');
    }
    
    const data = await response.json();
    console.log('Resultados da busca:', data);
    series.value = data;
  } catch (err) {
    console.error('Erro na busca:', err);
    error.value = err.message || 'Não foi possível realizar a busca. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};

const setFilter = (filter) => {
  activeFilter.value = filter;
  handleSearch();
};

const selectSerie = (serie) => {
  selectedSerie.value = serie;
};

const playSerie = (serie) => {
  if (serie.caminhoSerie) {
    playingSerie.value = serie;
    showVideoPlayer.value = true;
    selectedSerie.value = null;
  } else {
    showToast('Arquivo de vídeo não disponível para esta série.', 'error');
  }
};

const closeVideoPlayer = () => {
  showVideoPlayer.value = false;
  playingSerie.value = null;
};

const closeModal = () => {
  selectedSerie.value = null;
  showAddSeries.value = false;
  editingSerie.value = null;
  showDeleteConfirm.value = false;
  deleteSerie.value = null;
  resetForm();
};

const editSerie = (serie) => {
  if (!checkAuthentication()) return;
  
  selectedSerie.value = null;
  editingSerie.value = serie;
  
  // Preencher o formulário com os dados da série
  formSerie.value = {
    nome: serie.nome,
    genero: serie.genero,
    sinopse: serie.sinopse,
    anoLancamento: serie.anoLancamento,
    duracao: serie.duracao,
    temporadas: serie.temporadas,
    episodios: serie.episodios
  };
  
  if (serie.caminho) {
    imagePreview.value = getImageUrl(serie.caminho);
  }
  if (serie.caminhoSerie) {
    videoPreview.value = getVideoUrl(serie.caminhoSerie);
  }
};

const resetForm = () => {
  formSerie.value = {
    nome: '',
    genero: '',
    sinopse: '',
    anoLancamento: new Date().getFullYear(),
    duracao: '',
    temporadas: 1,
    episodios: 1
  };
  
  imagePreview.value = null;
  videoPreview.value = null;
  selectedImageName.value = '';
  selectedVideoName.value = '';
  selectedImageFile.value = null;
  selectedVideoFile.value = null;
  uploadProgress.value = 0;
  
  if (document.getElementById('imagem')) {
    document.getElementById('imagem').value = '';
  }
  if (document.getElementById('serie')) {
    document.getElementById('serie').value = '';
  }
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  selectedImageFile.value = file;
  selectedImageName.value = file.name;
  
  // Criar preview da imagem
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const handleVideoChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  selectedVideoFile.value = file;
  selectedVideoName.value = file.name;
  
  // Criar preview do vídeo
  const reader = new FileReader();
  reader.onload = (e) => {
    videoPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const saveSerie = async () => {
  if (!checkAuthentication()) return;
  
  uploading.value = true;
  uploadProgress.value = 0;
  error.value = null;
  
  try {
    const formData = new FormData();
    formData.append('nome', formSerie.value.nome);
    formData.append('genero', formSerie.value.genero);
    formData.append('sinopse', formSerie.value.sinopse);
    formData.append('anoLancamento', formSerie.value.anoLancamento.toString());
    formData.append('duracao', formSerie.value.duracao.toString());
    formData.append('temporadas', formSerie.value.temporadas.toString());
    formData.append('episodios', formSerie.value.episodios.toString());
    
    if (selectedImageFile.value) {
      formData.append('imagem', selectedImageFile.value);
    }
    
    if (selectedVideoFile.value) {
      formData.append('serie', selectedVideoFile.value);
    }
    
    // Log para depuração
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    let response;
    const token = getAuthToken();
    
    // Simular progresso de upload
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
      }
    }, 200);
    
    if (editingSerie.value) {
      // Atualizar série existente
      response = await fetch(`${API_URL}/series/${editingSerie.value._id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Não autorizado. Faça login novamente.');
        }
        throw new Error('Erro ao atualizar série');
      }
      
      await response.json();
      showToast('Série atualizada com sucesso!', 'success');
    } else {
      // Criar nova série
      response = await fetch(`${API_URL}/series`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Não autorizado. Faça login novamente.');
        }
        throw new Error('Erro ao adicionar série');
      }
      
      await response.json();
      showToast('Série adicionada com sucesso!', 'success');
    }
    
    clearInterval(progressInterval);
    uploadProgress.value = 100;
    
    // Recarregar a lista de séries
    await loadSeries();
    
    // Fechar o modal
    closeModal();
  } catch (err) {
    console.error('Erro ao salvar série:', err);
    error.value = err.message || 'Não foi possível salvar a série. Por favor, tente novamente.';
    showToast('Erro ao salvar a série: ' + err.message, 'error');
  } finally {
    uploading.value = false;
    uploadProgress.value = 0;
  }
};

const confirmDelete = (serie) => {
  if (!checkAuthentication()) return;
  
  deleteSerie.value = serie;
  showDeleteConfirm.value = true;
  selectedSerie.value = null;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  deleteSerie.value = null;
};

const deleteSerieConfirmed = async () => {
  if (!deleteSerie.value || !checkAuthentication()) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/series/${deleteSerie.value._id}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.');
      }
      throw new Error('Erro ao excluir série');
    }
    
    await response.json();
    
    // Remover a série da lista local
    series.value = series.value.filter(s => s._id !== deleteSerie.value._id);
    
    showToast('Série excluída com sucesso!', 'success');
    
    // Fechar o modal de confirmação
    showDeleteConfirm.value = false;
    deleteSerie.value = null;
  } catch (err) {
    console.error('Erro ao excluir série:', err);
    error.value = err.message || 'Não foi possível excluir a série. Por favor, tente novamente.';
    showToast('Erro ao excluir a série: ' + err.message, 'error');
  } finally {
    loading.value = false;
  }
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
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  return `../uploads/${imagePath}`;
};

const getVideoUrl = (videoPath) => {
  if (!videoPath) return '';
  
  if (videoPath.startsWith('http')) {
    return videoPath;
  }
  
  return `../uploads/${videoPath}`;
};

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

// Carregar séries ao montar o componente
onMounted(() => {
  if (checkAuthentication()) {
    loadSeries();
  }
});

// Observar mudanças no filtro ativo
watch(activeFilter, () => {
  if (checkAuthentication()) {
    handleSearch();
  }
});
</script>

<style scoped>
.netflix-wrapper {
  min-height: 100vh;
  background-color: #000;
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
  background: #000;
  z-index: -1;
}

/* Header Styles */
.netflix-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 4%;
  background-color: #000;
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

.search-container {
  flex: 1;
  max-width: 600px;
  margin: 0 20px;
}

.search-box {
  display: flex;
  position: relative;
  margin-bottom: 12px;
}

.search-box input {
  flex: 1;
  background-color: #333;
  border: none;
  border-radius: 4px;
  color: #fff;
  padding: 10px 40px 10px 16px;
  font-size: 14px;
  height: 36px;
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

.filter-options {
  display: flex;
  gap: 12px;
}

.filter-button {
  background: none;
  border: none;
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 0;
  transition: all 0.2s;
  position: relative;
}

.filter-button:hover {
  color: #fff;
}

.filter-button.active {
  color: #fff;
  border-bottom: 2px solid #e50914;
}

.actions-container {
  flex: 0 0 auto;
}

.add-series-button {
  background-color: #e50914;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.add-series-button:hover {
  background-color: #f40612;
}

/* Main Content Styles */
.netflix-content {
  padding: 30px 4%;
}

/* Series Grid */
.series-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.series-card {
  background-color: #000;
  border-radius: 0;
  overflow: hidden;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.series-card:hover {
  transform: scale(1.05);
}

.series-poster {
  position: relative;
  width: 100%;
  height: 280px;
  background-color: #222;
}

.series-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.series-poster-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #333;
  color: #666;
}

.series-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.series-card:hover .series-actions {
  opacity: 1;
}

.action-button {
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button.edit:hover {
  background-color: rgba(0, 0, 255, 0.7);
}

.action-button.delete:hover {
  background-color: rgba(229, 9, 20, 0.7);
}

.action-button.play:hover {
  background-color: rgba(46, 204, 113, 0.7);
}

.series-info {
  padding: 12px;
}

.series-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.series-meta {
  display: flex;
  font-size: 14px;
  color: #aaa;
  margin-bottom: 4px;
}

.series-year {
  margin-right: 10px;
}

.series-genre {
  font-size: 12px;
  color: #0071eb;
  background-color: rgba(0, 113, 235, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.series-status {
  margin-top: 8px;
}

.video-available {
  font-size: 12px;
  color: #2ecc71;
  background-color: rgba(46, 204, 113, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.play-section {
  margin-top: 20px;
}

.play-button {
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.play-button:hover {
  background-color: #27ae60;
}

.add-first-button {
  background-color: #e50914;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  padding: 8px 16px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-first-button:hover {
  background-color: #f40612;
}

/* Loading, Error, No Results States */
.loading-container,
.error-container,
.no-results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
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
.no-results-container h2 {
  font-size: 22px;
  margin: 20px 0 10px;
}

.error-container p,
.no-results-container p {
  color: #aaa;
  max-width: 500px;
  margin-bottom: 20px;
}

.retry-button {
  background-color: #e50914;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
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
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background-color: #141414;
  border-radius: 4px;
  position: relative;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
}

.video-player-modal {
  max-width: 1200px;
  background-color: #000;
}

.video-title {
  color: #fff;
  margin: 0 0 20px;
  padding: 20px 20px 0;
  font-size: 24px;
  font-weight: 600;
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

/* Series Details Modal */
.series-details {
  padding: 0;
}

.series-header {
  position: relative;
  display: flex;
  background-color: #333;
}

.series-poster {
  flex: 0 0 300px;
  height: 450px;
}

.series-poster img,
.series-poster-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.series-main-info {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent);
}

.series-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px;
}

.series-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.series-meta > span {
  font-size: 16px;
}

.series-genre {
  color: #fff;
  background-color: rgba(229, 9, 20, 0.7);
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
}

.series-seasons-info {
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

.series-body {
  padding: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 16px;
  color: #e5e5e5;
}

.series-synopsis {
  font-size: 16px;
  line-height: 1.5;
  color: #aaa;
  margin-bottom: 30px;
}

.series-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.action-btn.edit:hover {
  background-color: #0071eb;
}

.action-btn.delete:hover {
  background-color: #e50914;
}

/* Series Form Modal */
.series-form {
  padding: 30px;
  max-width: 700px;
}

.form-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 24px;
  text-align: center;
}

.series-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  color: #b3b3b3;
  font-size: 14px;
  margin-bottom: 6px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 14px;
  font-size: 14px;
  outline: none;
  transition: background-color 0.2s;
  height: auto;
}

.form-group select {
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  background-color: #454545;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

.file-input-container {
  position: relative;
}

.file-input-container input[type="file"] {
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
}

.file-input-label {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #333;
  color: #fff;
  border: 2px dashed #555;
  border-radius: 4px;
  padding: 14px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.file-input-label:hover {
  background-color: #454545;
  border-color: #777;
}

.image-preview {
  margin-top: 16px;
  border-radius: 4px;
  overflow: hidden;
  max-height: 200px;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

.video-preview {
  margin-top: 16px;
  border-radius: 4px;
  overflow: hidden;
}

.upload-progress {
  margin-top: 10px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #333;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #e50914;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #aaa;
  margin-top: 4px;
  display: block;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 10px;
}

.cancel-button {
  flex: 1;
  background-color: transparent;
  color: #aaa;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.save-button {
  flex: 2;
  background-color: #e50914;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover:not(:disabled) {
  background-color: #f40612;
}

.save-button:disabled {
  background-color: #666;
  cursor: not-allowed;
}

/* Confirmation Dialog */
.confirm-dialog {
  padding: 24px;
  max-width: 400px;
  text-align: center;
}

.confirm-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 14px;
}

.confirm-message {
  font-size: 14px;
  line-height: 1.5;
  color: #aaa;
  margin-bottom: 20px;
}

.confirm-message strong {
  color: #fff;
}

.confirm-actions {
  display: flex;
  gap: 16px;
}

.confirm-actions button {
  flex: 1;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-button {
  background-color: #e50914;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.delete-button:hover {
  background-color: #f40612;
}

/* Toast Notifications */
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
  .netflix-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .search-container {
    margin: 0;
    max-width: none;
  }
  
  .series-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .series-header {
    flex-direction: column;
  }
  
  .series-poster {
    flex: 0 0 auto;
    height: 300px;
  }
  
  .series-main-info {
    padding: 20px;
  }
  
  .series-title {
    font-size: 24px;
  }
  
  .series-body {
    padding: 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .series-form {
    padding: 20px;
  }
}
</style>