import { createRouter, createWebHistory } from 'vue-router'
import DashLogin from '@/components/DashLogin_Ember.vue'
import DashCadastro from '@/components/DashCadastro_Ember.vue'
import DashFilmes from '@/components/DashFilmes_Ember.vue'

const routes = [
  {path: '/', component: DashLogin},
  {path: '/cadastro', component: DashCadastro},
  {path: '/filmes', component: DashFilmes},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
