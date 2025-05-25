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
              <th>Cidade/Estado</th>
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
              <td class="user-location">{{ getLocationInfo(usuario) }}</td>
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
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"></path>
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
              <span class="film-role">{{ selectedUsuario.role || 'admin' }}</span>
            </div>
            <p class="user-email">{{ selectedUsuario.email }}</p>
            <p class="user-birthdate">Data de Nascimento: {{ formatDate(selectedUsuario.dtNascimento) }}</p>
            <p class="user-id">ID: {{ selectedUsuario._id }}</p>
          </div>
        </div>
        
        <div class="film-body">
          <div class="user-address-section" v-if="selectedUsuario.endereco">
            <h3>Endereço</h3>
            <div class="address-details">
              <p>{{ selectedUsuario.endereco }}</p>
            </div>
          </div>
          
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
          <!-- Informações pessoais -->
          <div class="form-section">
            <h3 class="section-title">Informações pessoais</h3>
            
            <div class="form-group">
              <label for="nome">Nome completo</label>
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
            
            <!-- Campo de papel/role -->
            <div class="form-group">
              <label for="role">Função do Usuário</label>
              <select id="role" v-model="formUsuario.role">
                <option value="admin">Administrador</option>
                <option value="user">Usuário</option>
              </select>
            </div>
          </div>
          
          <!-- Endereço -->
          <div class="form-section">
            <h3 class="section-title">Endereço</h3>
            
            <div class="form-group">
              <label for="cep">CEP</label>
              <div class="cep-input">
                <input 
                  type="text" 
                  id="cep" 
                  v-model="formUsuario.endereco.cep" 
                  placeholder="00000-000"
                  @blur="fetchAddressData"
                  required
                />
                <div v-if="cepLoading" class="loading-spinner"></div>
              </div>
              <p v-if="cepError" class="error-message">{{ cepError }}</p>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="rua">Rua</label>
                <input 
                  type="text" 
                  id="rua" 
                  v-model="formUsuario.endereco.rua" 
                  placeholder="Nome da rua"
                  :class="{ 'auto-filled': autoFilled }"
                  required
                />
              </div>
              
              <div class="form-group small">
                <label for="numero">Número</label>
                <input 
                  type="text" 
                  id="numero" 
                  v-model="formUsuario.endereco.numero" 
                  placeholder="Nº"
                  required
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="bairro">Bairro</label>
                <input 
                  type="text" 
                  id="bairro" 
                  v-model="formUsuario.endereco.bairro" 
                  placeholder="Seu bairro"
                  :class="{ 'auto-filled': autoFilled }"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="complemento">Complemento</label>
                <input 
                  type="text" 
                  id="complemento" 
                  v-model="formUsuario.endereco.complemento" 
                  placeholder="Apto, bloco, etc. (opcional)"
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="cidade">Cidade</label>
                <input 
                  type="text" 
                  id="cidade" 
                  v-model="formUsuario.endereco.cidade" 
                  placeholder="Sua cidade"
                  :class="{ 'auto-filled': autoFilled }"
                  required
                />
              </div>
              
              <div class="form-group small">
                <label for="estado">Estado</label>
                <input 
                  type="text" 
                  id="estado" 
                  v-model="formUsuario.endereco.estado" 
                  placeholder="UF"
                  :class="{ 'auto-filled': autoFilled }"
                  required
                />
              </div>
            </div>
          </div>
          
          <!-- Segurança -->
          <div class="form-section">
            <h3 class="section-title">Segurança</h3>
            
            <div class="form-group" v-if="!editingUsuario">
              <label for="senha">Senha</label>
              <div class="password-input">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="senha" 
                  v-model="formUsuario.senha" 
                  placeholder="Digite a senha (mínimo 6 caracteres)"
                  minlength="6"
                  required
                />
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showPassword = !showPassword"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path v-if="!showPassword" d="M12 5C7.5 5 3.7 7.6 2 11.5C3.7 15.4 7.5 18 12 18C16.5 18 20.3 15.4 22 11.5C20.3 7.6 16.5 5 12 5ZM12 16C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8C14.2 8 16 9.8 16 12C16 14.2 14.2 16 12 16ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="currentColor"/>
                    <path v-else d="M2 5.27L3.28 4L20 20.72L18.73 22L15.65 18.92C14.5 19.3 13.28 19.5 12 19.5C7.5 19.5 3.7 16.9 2 13C2.88 11.07 4.34 9.5 6.21 8.4L2 4.19L2 5.27ZM12 7C9.24 7 7 9.24 7 12C7 12.7 7.15 13.36 7.43 13.96L6.18 12.71C6.07 12.5 6 12.26 6 12C6 8.69 8.69 6 12 6C12.26 6 12.5 6.07 12.71 6.18L11.56 7.33C11.08 7.13 10.56 7 10 7L12 9V7ZM22 13C21.36 14.33 20.45 15.5 19.33 16.47L17.89 15.03C19.08 13.71 19.97 12.1 20.5 10.24C19.37 7.56 16.72 5.6 13.62 5.11L12.22 3.71C18.0 4.21 22 8.14 22 13ZM12 17C14.76 17 17 14.76 17 12C17 11.3 16.85 10.64 16.57 10.04L14.12 7.59C15.63 8.83 16 10.17 16 12C16 15.31 13.31 18 10 18L12 16V17Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
            </div>
            
            <div class="form-group" v-if="editingUsuario">
              <label for="senha">Nova Senha (opcional)</label>
              <div class="password-input">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="senha" 
                  v-model="formUsuario.senha" 
                  placeholder="Deixe em branco para manter a senha atual"
                  minlength="6"
                />
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showPassword = !showPassword"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path v-if="!showPassword" d="M12 5C7.5 5 3.7 7.6 2 11.5C3.7 15.4 7.5 18 12 18C16.5 18 20.3 15.4 22 11.5C20.3 7.6 16.5 5 12 5ZM12 16C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8C14.2 8 16 9.8 16 12C16 14.2 14.2 16 12 16ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="currentColor"/>
                    <path v-else d="M2 5.27L3.28 4L20 20.72L18.73 22L15.65 18.92C14.5 19.3 13.28 19.5 12 19.5C7.5 19.5 3.7 16.9 2 13C2.88 11.07 4.34 9.5 6.21 8.4L2 4.19L2 5.27ZM12 7C9.24 7 7 9.24 7 12C7 12.7 7.15 13.36 7.43 13.96L6.18 12.71C6.07 12.5 6 12.26 6 12C6 8.69 8.69 6 12 6C12.26 6 12.5 6.07 12.71 6.18L11.56 7.33C11.08 7.13 10.56 7 10 7L12 9V7ZM22 13C21.36 14.33 20.45 15.5 19.33 16.47L17.89 15.03C19.08 13.71 19.97 12.1 20.5 10.24C19.37 7.56 16.72 5.6 13.62 5.11L12.22 3.71C18.0 4.21 22 8.14 22 13ZM12 17C14.76 17 17 14.76 17 12C17 11.3 16.85 10.64 16.57 10.04L14.12 7.59C15.63 8.83 16 10.17 16 12C16 15.31 13.31 18 10 18L12 16V17Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
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
            <button type="button" class="cancel-button" @click="closeModal" :disabled="showModalLoading">Cancelar</button>
            <button type="submit" class="save-button" :disabled="showModalLoading">
              <span v-if="showModalLoading" class="button-spinner"></span>
              <span v-else>{{ editingUsuario ? 'Atualizar' : 'Salvar' }}</span>
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
          <svg v-else-if="toast.type === 'info'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
        <div class="toast-content">{{ toast.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';

// API base URL
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
  caminho: null,
  role: 'admin',
  endereco: {
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    complemento: '',
    cidade: '',
    estado: ''
  }
});
const showDeleteConfirm = ref(false);
const deleteUsuario = ref(null);
const imagePreview = ref(null);
const selectedFileName = ref('');
const selectedFile = ref(null);
const toasts = ref([]);
const showModalLoading = ref(false);
const showPassword = ref(false);
const cepLoading = ref(false);
const cepError = ref('');
const autoFilled = ref(false);
const passwordError = ref('');

// Função para fazer parse da string de endereço
const parseEnderecoString = (enderecoString) => {
  if (!enderecoString || typeof enderecoString !== 'string') {
    return {
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      complemento: '',
      cidade: '',
      estado: ''
    };
  }

  console.log('Parsing endereço:', enderecoString);

  const endereco = {
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    complemento: '',
    cidade: '',
    estado: ''
  };

  // Extrair CEP (sempre no final)
  const cepMatch = enderecoString.match(/CEP:\s*(\d{5}-?\d{3})/i);
  if (cepMatch) {
    endereco.cep = cepMatch[1];
  }

  // Extrair cidade/estado (formato Cidade/Estado)
  const cidadeEstadoMatch = enderecoString.match(/([^-/]+)\/([A-Z]{2})/);
  if (cidadeEstadoMatch) {
    endereco.cidade = cidadeEstadoMatch[1].trim();
    endereco.estado = cidadeEstadoMatch[2];
  }

  // Dividir o resto por traços para extrair rua, número, complemento, bairro
  const partes = enderecoString.split(' - ');
  
  if (partes.length >= 1) {
    // Primeira parte: Rua, número e possivelmente complemento
    const ruaNumero = partes[0];
    const ruaNumeroMatch = ruaNumero.match(/^(.+?),\s*(\d+)(?:,\s*(.+))?/);
    
    if (ruaNumeroMatch) {
      endereco.rua = ruaNumeroMatch[1].trim();
      endereco.numero = ruaNumeroMatch[2];
      if (ruaNumeroMatch[3]) {
        endereco.complemento = ruaNumeroMatch[3].trim();
      }
    } else {
      endereco.rua = ruaNumero;
    }
  }

  if (partes.length >= 2) {
    // Segunda parte: Bairro
    const bairro = partes[1].trim();
    if (!bairro.includes('/') && !bairro.includes('CEP')) {
      endereco.bairro = bairro;
    }
  }

  console.log('Endereço parseado:', endereco);
  return endereco;
};

// Função para converter o objeto endereço de volta para string
const formatEnderecoString = (endereco) => {
  if (!endereco) return '';
  
  let enderecoFormatado = '';
  
  // Rua, número, complemento
  if (endereco.rua) {
    enderecoFormatado += endereco.rua;
    if (endereco.numero) {
      enderecoFormatado += `, ${endereco.numero}`;
      if (endereco.complemento) {
        enderecoFormatado += `, ${endereco.complemento}`;
      }
    }
  }
  
  // Bairro
  if (endereco.bairro) {
    enderecoFormatado += ` - ${endereco.bairro}`;
  }
  
  // Cidade/Estado
  if (endereco.cidade && endereco.estado) {
    enderecoFormatado += ` - ${endereco.cidade}/${endereco.estado}`;
  }
  
  // CEP
  if (endereco.cep) {
    enderecoFormatado += ` - CEP: ${endereco.cep}`;
  }
  
  return enderecoFormatado;
};

// Função auxiliar para obter o token de autenticação
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Função auxiliar para criar headers com autenticação
const getAuthHeaders = (contentType = 'application/json') => {
  const token = getAuthToken();
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  return headers;
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
const loadUsuarios = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.');
      }
      throw new Error('Erro ao carregar usuários');
    }
    
    usuarios.value = await response.json();
  } catch (err) {
    console.error('Erro ao carregar usuários:', err);
    error.value = err.message || 'Não foi possível carregar os usuários. Por favor, tente novamente.';
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
    if (activeFilter.value === 'email') {
      const endpoint = `${API_URL}/email/${searchQuery.value}`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Não autorizado. Faça login novamente.');
        }
        throw new Error('Usuário não encontrado');
      }
      
      const usuario = await response.json();
      usuarios.value = [usuario];
    } else {
      const response = await fetch(`${API_URL}/`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Não autorizado. Faça login novamente.');
        }
        throw new Error('Erro na busca');
      }
      
      const allUsuarios = await response.json();
      
      if (activeFilter.value === 'name') {
        usuarios.value = allUsuarios.filter(usuario => 
          usuario.nome.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      } else {
        usuarios.value = allUsuarios.filter(usuario => 
          usuario.nome.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          usuario.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (usuario.apelido && usuario.apelido.toLowerCase().includes(searchQuery.value.toLowerCase()))
        );
      }
    }
  } catch (err) {
    console.error('Erro na busca:', err);
    error.value = err.message || 'Não foi possível realizar a busca. Por favor, tente novamente.';
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
  if (!checkAuthentication()) return;
  
  selectedUsuario.value = null;
  editingUsuario.value = usuario;
  
  // Parse do endereço da string para objeto
  const enderecoParseado = parseEnderecoString(usuario.endereco);
  
  // Preencher o formulário com os dados do usuário
  formUsuario.value = {
    nome: usuario.nome,
    email: usuario.email,
    dtNascimento: formatDateForInput(usuario.dtNascimento),
    apelido: usuario.apelido || '',
    senha: '', // Deixamos a senha em branco para edição
    caminho: usuario.caminho,
    role: usuario.role || 'admin',
    endereco: enderecoParseado
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
    caminho: null,
    role: 'admin',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      complemento: '',
      cidade: '',
      estado: ''
    }
  };
  
  imagePreview.value = null;
  selectedFileName.value = '';
  selectedFile.value = null;
  cepError.value = '';
  autoFilled.value = false;
  
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

// Função para buscar dados do CEP
const fetchAddressData = async () => {
  cepError.value = '';
  
  const cep = formUsuario.value.endereco.cep.replace(/\D/g, '');
  if (cep.length !== 8) {
    return;
  }
  
  cepLoading.value = true;
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      cepError.value = 'CEP não encontrado';
      return;
    }
    
    formUsuario.value.endereco.rua = data.logradouro;
    formUsuario.value.endereco.bairro = data.bairro;
    formUsuario.value.endereco.cidade = data.localidade;
    formUsuario.value.endereco.estado = data.uf;
    
    autoFilled.value = true;
    
    nextTick(() => {
      document.getElementById('numero').focus();
    });
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    cepError.value = 'Erro ao buscar o CEP. Tente novamente.';
  } finally {
    cepLoading.value = false;
  }
};

const saveUsuario = async () => {
  if (!checkAuthentication()) return;
  
  console.log("Iniciando saveUsuario");
  showToast('Processando...', 'info');
  showModalLoading.value = true;
  
  // Validações
  if (!formUsuario.value.nome || !formUsuario.value.email || !formUsuario.value.dtNascimento) {
    showToast('Preencha todos os campos obrigatórios', 'error');
    showModalLoading.value = false;
    return;
  }
  
  if (!editingUsuario.value && (!formUsuario.value.senha || formUsuario.value.senha.length < 6)) {
    passwordError.value = 'A senha deve ter pelo menos 6 caracteres';
    showToast('A senha deve ter pelo menos 6 caracteres', 'error');
    showModalLoading.value = false;
    return;
  } else {
    passwordError.value = '';
  }
  
  if (!formUsuario.value.endereco.cep || !formUsuario.value.endereco.rua || 
      !formUsuario.value.endereco.numero || !formUsuario.value.endereco.bairro || 
      !formUsuario.value.endereco.cidade || !formUsuario.value.endereco.estado) {
    showToast('Preencha todos os campos de endereço', 'error');
    showModalLoading.value = false;
    return;
  }
  
  loading.value = true;
  error.value = null;
  
  try {
    const formData = new FormData();
    formData.append('nome', formUsuario.value.nome);
    formData.append('email', formUsuario.value.email);
    formData.append('dtNascimento', formUsuario.value.dtNascimento);
    formData.append('role', formUsuario.value.role);
    
    if (formUsuario.value.apelido) {
      formData.append('apelido', formUsuario.value.apelido);
    }
    
    if (formUsuario.value.senha) {
      formData.append('senha', formUsuario.value.senha);
    }
    
    // Converter o objeto endereço para string formatada
    const enderecoFormatado = formatEnderecoString(formUsuario.value.endereco);
    formData.append('endereco', enderecoFormatado);
    
    if (selectedFile.value) {
      formData.append('imagem', selectedFile.value);
    }
    
    console.log("Endereço formatado:", enderecoFormatado);
    
    let response;
    const headers = {
      'Authorization': `Bearer ${getAuthToken()}`
    };
    
    if (editingUsuario.value) {
      response = await fetch(`${API_URL}/${editingUsuario.value._id}`, {
        method: 'PUT',
        headers: headers,
        body: formData
      });
    } else {
      response = await fetch(`${API_URL}/`, {
        method: 'POST',
        headers: headers,
        body: formData
      });
    }
    
    console.log("Status da resposta:", response.status);
    const responseText = await response.text();
    console.log("Resposta completa:", responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("Erro ao parsear resposta como JSON:", e);
      responseData = { message: 'Erro no formato da resposta do servidor' };
    }
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.');
      }
      throw new Error(responseData.message || 'Erro ao salvar usuário');
    }
    
    showToast(editingUsuario.value ? 'Usuário atualizado com sucesso!' : 'Usuário adicionado com sucesso!', 'success');
    
    await loadUsuarios();
    closeModal();
  } catch (err) {
    console.error('Erro ao salvar usuário:', err);
    error.value = err.message || 'Não foi possível salvar o usuário. Por favor, tente novamente.';
    showToast('Erro ao salvar o usuário: ' + err.message, 'error');
  } finally {
    loading.value = false;
    showModalLoading.value = false;
  }
};

const confirmDelete = (usuario) => {
  if (!checkAuthentication()) return;
  
  deleteUsuario.value = usuario;
  showDeleteConfirm.value = true;
  selectedUsuario.value = null;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  deleteUsuario.value = null;
};

const deleteUsuarioConfirmed = async () => {
  if (!deleteUsuario.value || !checkAuthentication()) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(`${API_URL}/${deleteUsuario.value._id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.');
      }
      throw new Error('Erro ao excluir usuário');
    }
    
    await response.json();
    
    usuarios.value = usuarios.value.filter(u => u._id !== deleteUsuario.value._id);
    
    showToast('Usuário excluído com sucesso!', 'success');
    
    showDeleteConfirm.value = false;
    deleteUsuario.value = null;
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    error.value = err.message || 'Não foi possível excluir o usuário. Por favor, tente novamente.';
    showToast('Erro ao excluir o usuário: ' + err.message, 'error');
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
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  return `../uploads/${imagePath}`;
};

const showToast = (message, type = 'success') => {
  const toast = { message, type };
  toasts.value.push(toast);
  
  setTimeout(() => {
    const index = toasts.value.indexOf(toast);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  }, 5000);
};

// Função para obter informações de localização formatadas
const getLocationInfo = (usuario) => {
  if (!usuario.endereco) return '-';
  
  if (typeof usuario.endereco === 'string') {
    const match = usuario.endereco.match(/([^-/]+)\/([A-Z]{2})(?:\s*-|$)/);
    if (match) {
      return `${match[1].trim()}/${match[2]}`;
    }
    
    const partes = usuario.endereco.split('-');
    if (partes.length >= 3) {
      const cidadeEstado = partes[2].trim();
      if (cidadeEstado.includes('/')) {
        return cidadeEstado.trim();
      }
    }
  }
  
  return '-';
};

// Verificar alterações na senha para validação
watch(() => formUsuario.value.senha, (newValue) => {
  if (newValue && newValue.length > 0 && newValue.length < 6) {
    passwordError.value = 'A senha deve ter pelo menos 6 caracteres';
  } else {
    passwordError.value = '';
  }
});

// Carregar usuários ao montar o componente
onMounted(() => {
  if (checkAuthentication()) {
    loadUsuarios();
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
.toast-content {
  flex: 1;
  font-size: 14px;
}

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

.user-birthdate, .user-age, .user-location {
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

.film-genre, .film-role {
  color: #fff;
  background-color: rgba(229, 9, 20, 0.7);
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
}

.film-role {
  background-color: rgba(0, 128, 128, 0.7);
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

.form-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #333;
}

.section-title {
  color: #e5e5e5;
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 20px;
}

.form-group {
  margin-bottom: 16px;
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

.form-group.small {
  flex: 0.3;
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

.button-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

.toast.info {
  border-color: #3498db;
}

.toast.info .toast-icon {
  color: #3498db;
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

/* Novo estilo para seção de endereço */
.user-address-section {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 20px;
}

.user-address-section h3 {
  font-size: 18px;
  margin: 0 0 16px;
  color: #e5e5e5;
}

.address-details p {
  margin: 8px 0;
  color: #aaa;
  line-height: 1.5;
}

.address-details strong {
  color: #e5e5e5;
}

.cep-input {
  position: relative;
}

.loading-spinner {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #e50914;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.form-group input.auto-filled {
  background-color: #1e3b25;
  border-left: 3px solid #2ecc71;
}

.error-message {
  color: #e50914;
  font-size: 12px;
  margin-top: 5px;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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