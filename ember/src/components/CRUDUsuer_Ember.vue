<template>
  <div class="netflix-wrapper">
    <div class="netflix-bg-overlay"></div>
    
    <!-- Header -->
    <header class="netflix-header">
      <div class="logo-container">
        <h1 class="site-logo">Net-Flix Users</h1>
      </div>
      <div class="search-container">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar usuários..."
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
            :class="{ active: activeFilter === 'name' }"
            @click="setFilter('name')"
          >
            Nome
          </button>
          <button 
            class="filter-button" 
            :class="{ active: activeFilter === 'email' }"
            @click="setFilter('email')"
          >
            Email
          </button>
        </div>
      </div>
      <div class="actions-container">
        <button class="add-movie-button" @click="showAddUsuario = true">
          Adicionar Usuário
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
        <p>Carregando usuários...</p>
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
        <button class="retry-button" @click="loadUsuarios">Tentar novamente</button>
      </div>
      
      <!-- No Results State -->
      <div v-else-if="usuarios.length === 0" class="no-results-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h2>Nenhum usuário encontrado</h2>
        <p v-if="searchQuery">Nenhum resultado para "{{ searchQuery }}"</p>
        <p v-else>Adicione usuários para começar</p>
      </div>
      
      <!-- Usuarios Table -->
      <div v-else class="users-table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome Completo</th>
              <th>Email</th>
              <th>Apelido</th>
              <th>Data de Nascimento</th>
              <th>Idade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario._id">
              <td class="user-image">
                <div class="avatar-container">
                  <img 
                    v-if="usuario.caminho" 
                    :src="getImageUrl(usuario.caminho)" 
                    :alt="usuario.nome"
                  />
                  <div v-else class="avatar-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
              </td>
              <td class="user-name">{{ usuario.nome }}</td>
              <td class="user-email">{{ usuario.email }}</td>
              <td class="user-nickname">{{ usuario.apelido || '-' }}</td>
              <td class="user-birthdate">{{ formatDate(usuario.dtNascimento) }}</td>
              <td class="user-age">{{ calculateAge(usuario.dtNascimento) }} anos</td>
              <td class="user-actions">
                <div class="actions-wrapper">
                  <button class="action-button view" @click="selectUsuario(usuario)" title="Ver detalhes">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                  <button class="action-button edit" @click="editUsuario(usuario)" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </button>
                  <button class="action-button delete" @click="confirmDelete(usuario)" title="Excluir">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
    
    <!-- Modal for usuario details -->
    <div v-if="selectedUsuario" class="modal-overlay" @click="closeModal">
      <div class="modal-content film-details" @click.stop>
        <button class="modal-close" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="film-header">
          <div class="film-poster">
            <img 
              v-if="selectedUsuario.caminho" 
              :src="getImageUrl(selectedUsuario.caminho)" 
              :alt="selectedUsuario.nome"
            />
            <div v-else class="film-poster-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
          <div class="film-main-info">
            <h2 class="film-title">{{ selectedUsuario.nome }}</h2>
            <div class="film-meta">
              <span class="film-year">{{ calculateAge(selectedUsuario.dtNascimento) }} anos</span>
              <span class="film-genre" v-if="selectedUsuario.apelido">{{ selectedUsuario.apelido }}</span>
            </div>
            <p class="user-email">{{ selectedUsuario.email }}</p>
            <p class="user-birthdate">Data de Nascimento: {{ formatDate(selectedUsuario.dtNascimento) }}</p>
            <p class="user-id">ID: {{ selectedUsuario._id }}</p>
          </div>
        </div>
        
        <div class="film-body">
          <div class="film-actions">
            <button class="action-btn edit" @click="editUsuario(selectedUsuario)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
              Editar
            </button>
            <button class="action-btn delete" @click="confirmDelete(selectedUsuario)">
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
    
    <!-- Modal for add/edit usuario -->
    <div v-if="showAddUsuario || editingUsuario" class="modal-overlay" @click="closeModal">
      <div class="modal-content film-form" @click.stop>
        <button class="modal-close" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <h2 class="form-title">{{ editingUsuario ? 'Editar Usuário' : 'Adicionar Usuário' }}</h2>
        
        <form class="movie-form" @submit.prevent="saveUsuario">
          <div class="form-group">
            <label for="nome">Nome Completo</label>
            <input 
              type="text" 
              id="nome" 
              v-model="formUsuario.nome" 
              placeholder="Digite o nome completo"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="formUsuario.email" 
              placeholder="Digite o email"
              required
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="dtNascimento">Data de Nascimento</label>
              <input 
                type="date" 
                id="dtNascimento" 
                v-model="formUsuario.dtNascimento" 
                required
              />
            </div>
            
            <div class="form-group">
              <label for="apelido">Apelido (opcional)</label>
              <input 
                type="text" 
                id="apelido" 
                v-model="formUsuario.apelido" 
                placeholder="Apelido"
              />
            </div>
          </div>
          
          <div class="form-group" v-if="!editingUsuario">
            <label for="senha">Senha</label>
            <input 
              type="password" 
              id="senha" 
              v-model="formUsuario.senha" 
              placeholder="Digite a senha"
              minlength="6"
              required
            />
          </div>
          
          <div class="form-group" v-if="editingUsuario">
            <label for="senha">Nova Senha (opcional)</label>
            <input 
              type="password" 
              id="senha" 
              v-model="formUsuario.senha" 
              placeholder="Deixe em branco para manter a senha atual"
              minlength="6"
            />
          </div>
          
          <div class="form-group">
            <label for="imagem">Foto de Perfil</label>
            <div class="file-input-container">
              <input 
                type="file" 
                id="imagem" 
                ref="fileInput"
                @change="handleFileChange" 
                accept="image/*"
              />
              <label for="imagem" class="file-input-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                {{ selectedFileName || 'Escolher arquivo' }}
              </label>
            </div>
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Preview" />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="cancel-button" @click="closeModal">Cancelar</button>
            <button type="submit" class="save-button">
              {{ editingUsuario ? 'Atualizar' : 'Salvar' }}
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
          Tem certeza que deseja excluir o usuário <strong>{{ deleteUsuario?.nome }}</strong>?
          <br>Esta ação não pode ser desfeita.
        </p>
        <div class="confirm-actions">
          <button class="cancel-button" @click="cancelDelete">Cancelar</button>
          <button class="delete-button" @click="deleteUsuarioConfirmed">
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

// API base URL - Corrected to match the Express routes
const API_URL = 'http://localhost:3000/usuario';

// Estado reativo
const usuarios = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const activeFilter = ref('all');
const selectedUsuario = ref(null);
const showAddUsuario = ref(false);
const editingUsuario = ref(null);
const formUsuario = ref({
  nome: '',
  email: '',
  dtNascimento: '',
  apelido: '',
  senha: '',
  caminho: null
});
const showDeleteConfirm = ref(false);
const deleteUsuario = ref(null);
const imagePreview = ref(null);
const selectedFileName = ref('');
const selectedFile = ref(null);
const toasts = ref([]);

// Métodos
const loadUsuarios = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Corrected route to match the Express backend - visualizeUsuarios route
    const response = await fetch(`${API_URL}/`);
    if (!response.ok) throw new Error('Erro ao carregar usuários');
    usuarios.value = await response.json();
  } catch (err) {
    console.error('Erro ao carregar usuários:', err);
    error.value = 'Não foi possível carregar os usuários. Por favor, tente novamente.';
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    await loadUsuarios();
    return;
  }
  
  loading.value = true;
  error.value = null;
  
  try {
    let endpoint = `${API_URL}/`;
    
    if (activeFilter.value === 'email') {
      // Busca por email - Corrected route to match findUsuarioByEmail
      endpoint = `${API_URL}/email/${searchQuery.value}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Usuário não encontrado');
      const usuario = await response.json();
      usuarios.value = [usuario];
    } else {
      // Busca por todos ou por nome (filtragem no cliente)
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Erro na busca');
      const allUsuarios = await response.json();
      
      if (activeFilter.value === 'name') {
        // Filtrar por nome no lado do cliente
        usuarios.value = allUsuarios.filter(usuario => 
          usuario.nome.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      } else {
        // Filtrar em todos os campos
        usuarios.value = allUsuarios.filter(usuario => 
          usuario.nome.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          usuario.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (usuario.apelido && usuario.apelido.toLowerCase().includes(searchQuery.value.toLowerCase()))
        );
      }
    }
  } catch (err) {
    console.error('Erro na busca:', err);
    error.value = 'Não foi possível realizar a busca. Por favor, tente novamente.';
    usuarios.value = [];
  } finally {
    loading.value = false;
  }
};

const setFilter = (filter) => {
  activeFilter.value = filter;
  handleSearch();
};

const selectUsuario = (usuario) => {
  selectedUsuario.value = usuario;
};

const closeModal = () => {
  selectedUsuario.value = null;
  showAddUsuario.value = false;
  editingUsuario.value = null;
  showDeleteConfirm.value = false;
  deleteUsuario.value = null;
  resetForm();
};

const editUsuario = (usuario) => {
  selectedUsuario.value = null;
  editingUsuario.value = usuario;
  
  // Preencher o formulário com os dados do usuário
  formUsuario.value = {
    nome: usuario.nome,
    email: usuario.email,
    dtNascimento: formatDateForInput(usuario.dtNascimento),
    apelido: usuario.apelido || '',
    senha: '', // Deixamos a senha em branco para edição
    caminho: usuario.caminho
  };
  
  if (usuario.caminho) {
    imagePreview.value = getImageUrl(usuario.caminho);
  }
};

const resetForm = () => {
  formUsuario.value = {
    nome: '',
    email: '',
    dtNascimento: '',
    apelido: '',
    senha: '',
    caminho: null
  };
  
  imagePreview.value = null;
  selectedFileName.value = '';
  selectedFile.value = null;
  
  if (document.getElementById('imagem')) {
    document.getElementById('imagem').value = '';
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  selectedFile.value = file;
  selectedFileName.value = file.name;
  
  // Criar preview da imagem
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const saveUsuario = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // For regular data (without file upload)
    if (!selectedFile.value) {
      // Use JSON instead of FormData when there's no file
      const userData = {
        nome: formUsuario.value.nome,
        email: formUsuario.value.email,
        dtNascimento: formUsuario.value.dtNascimento,
        senha: formUsuario.value.senha
      };
      
      if (formUsuario.value.apelido) {
        userData.apelido = formUsuario.value.apelido;
      }
      
      let response;
      
      if (editingUsuario.value) {
        // Atualizar usuário existente
        response = await fetch(`${API_URL}/${editingUsuario.value._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
      } else {
        // Criar novo usuário
        response = await fetch(`${API_URL}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
      }
      
      if (!response.ok) throw new Error('Erro ao salvar usuário');
      await response.json();
      showToast(editingUsuario.value ? 'Usuário atualizado com sucesso!' : 'Usuário adicionado com sucesso!', 'success');
    } 
    // For FormData (with file upload)
    else {
      const formData = new FormData();
      formData.append('nome', formUsuario.value.nome);
      formData.append('email', formUsuario.value.email);
      formData.append('dtNascimento', formUsuario.value.dtNascimento);
      
      if (formUsuario.value.apelido) {
        formData.append('apelido', formUsuario.value.apelido);
      }
      
      if (formUsuario.value.senha) {
        formData.append('senha', formUsuario.value.senha);
      }
      
      if (selectedFile.value) {
        formData.append('imagem', selectedFile.value);
      }
      
      // Log form data to console for debugging
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      let response;
      
      if (editingUsuario.value) {
        // Atualizar usuário existente
        response = await fetch(`${API_URL}/${editingUsuario.value._id}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        // Criar novo usuário
        response = await fetch(`${API_URL}/`, {
          method: 'POST',
          body: formData
        });
      }
      
      if (!response.ok) throw new Error('Erro ao salvar usuário');
      await response.json();
      showToast(editingUsuario.value ? 'Usuário atualizado com sucesso!' : 'Usuário adicionado com sucesso!', 'success');
    }
    
    // Recarregar a lista de usuários
    await loadUsuarios();
    
    // Fechar o modal
    closeModal();
  } catch (err) {
    console.error('Erro ao salvar usuário:', err);
    error.value = 'Não foi possível salvar o usuário. Por favor, tente novamente.';
    showToast('Erro ao salvar o usuário!', 'error');
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (usuario) => {
  deleteUsuario.value = usuario;
  showDeleteConfirm.value = true;
  selectedUsuario.value = null;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  deleteUsuario.value = null;
};

const deleteUsuarioConfirmed = async () => {
  if (!deleteUsuario.value) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(`${API_URL}/${deleteUsuario.value._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Erro ao excluir usuário');
    await response.json();
    
    // Remover o usuário da lista local
    usuarios.value = usuarios.value.filter(u => u._id !== deleteUsuario.value._id);
    
    showToast('Usuário excluído com sucesso!', 'success');
    
    // Fechar o modal de confirmação
    showDeleteConfirm.value = false;
    deleteUsuario.value = null;
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    error.value = 'Não foi possível excluir o usuário. Por favor, tente novamente.';
    showToast('Erro ao excluir o usuário!', 'error');
  } finally {
    loading.value = false;
  }
};

const calculateAge = (birthdate) => {
  if (!birthdate) return '';
  
  const birthDate = new Date(birthdate);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10);
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

// Carregar usuários ao montar o componente
onMounted(() => {
  loadUsuarios();
});

// Observar mudanças no filtro ativo
watch(activeFilter, () => {
  handleSearch();
});
</script>

<style scoped>
.netflix-wrapper {
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
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 20, 1) 100%);
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
  border-radius: 4px;
  transition: all 0.2s;
}

.filter-button:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.filter-button.active {
  color: #fff;
  border-bottom: 2px solid #e50914;
}

.actions-container {
  flex: 0 0 auto;
}

.add-movie-button {
  background-color: #e50914;
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

.add-movie-button:hover {
  background-color: #f40612;
}

/* Main Content Styles */
.netflix-content {
  padding: 30px 4%;
}

/* Users Table Styles */
.users-table-container {
  width: 100%;
  overflow-x: auto;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  color: #fff;
}

.users-table thead tr {
  background-color: rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid #e50914;
}

.users-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #e50914;
  text-transform: uppercase;
}

.users-table td {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
}

.users-table tbody tr {
  transition: background-color 0.2s;
}

.users-table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.user-image {
  width: 80px;
}

.avatar-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #333;
}

.avatar-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.user-name {
  font-weight: 500;
  color: #fff;
}

.user-email {
  color: #aaa;
}

.user-nickname {
  color: #e50914;
  font-style: italic;
}

.user-birthdate, .user-age {
  color: #aaa;
}

.user-actions {
  width: 120px;
}

.actions-wrapper {
  display: flex;
  gap: 10px;
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

.action-button.view:hover {
  background-color: rgba(0, 128, 128, 0.7);
}

.action-button.edit:hover {
  background-color: rgba(0, 0, 255, 0.7);
}

.action-button.delete:hover {
  background-color: rgba(255, 0, 0, 0.7);
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
.no-results-container h2 {
  font-size: 24px;
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

/* Film Details Modal */
.film-details {
  padding: 0;
}

.film-header {
  position: relative;
  display: flex;
  background-color: #333;
}

.film-poster {
  flex: 0 0 300px;
  height: 450px;
}

.film-poster img,
.film-poster-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.film-poster-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #444;
  color: #777;
}

.film-main-info {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent);
}

.film-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px;
}

.film-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.film-meta > span {
  font-size: 16px;
}

.film-genre {
  color: #fff;
  background-color: rgba(229, 9, 20, 0.7);
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
}

.film-body {
  padding: 40px;
}

.user-email, .user-birthdate, .user-id {
  font-size: 16px;
  line-height: 1.5;
  color: #aaa;
  margin-bottom: 8px;
}

.film-actions {
  display: flex;
  gap: 16px;
  margin-top: 20px;
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

/* Film Form Modal */
.film-form {
  padding: 40px;
  max-width: 700px;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 30px;
  text-align: center;
}

.movie-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  color: #b3b3b3;
  font-size: 14px;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 16px;
  font-size: 16px;
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
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #f40612;
}

/* Confirmation Dialog */
.confirm-dialog {
  padding: 30px;
  max-width: 400px;
  text-align: center;
}

.confirm-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px;
}

.confirm-message {
  font-size: 14px;
  line-height: 1.5;
  color: #aaa;
  margin-bottom: 24px;
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
  padding: 12px;
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
@media (max-width: 1200px) {
  .users-table-container {
    overflow-x: auto;
  }
  
  .users-table {
    min-width: 800px;
  }
}

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
  
  .film-header {
    flex-direction: column;
  }
  
  .film-poster {
    flex: 0 0 auto;
    height: 300px;
  }
  
  .film-main-info {
    padding: 20px;
  }
  
  .film-title {
    font-size: 24px;
  }
  
  .film-body {
    padding: 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
  
  .film-form {
    padding: 20px;
  }
}
</style>