import { createRouter, createWebHistory } from 'vue-router'
import DashLogin from '@/components/DashLogin_Ember.vue'
import DashCadastro from '@/components/DashCadastro_Ember.vue'
import DashFilmes from '@/components/DashFilmes_Ember.vue'
import DashUser from '@/components/DashUser_Ember.vue'
import DashSeries from '@/components/DashSeries_Ember.vue'
import DashHome from '@/components/DashHome_Ember.vue'
import DashHomeAdmin from '@/components/DashHomeAdmin_Ember.vue'

const routes = [
  {path: '/', component: DashLogin},
  {path: '/cadastro', component: DashCadastro},
  {path: '/filmes', component: DashFilmes, meta: { requiresAuth: true, requiresFuncionario: true }},
  {path: '/series', component: DashSeries, meta: { requiresAuth: true, requiresFuncionario: true }},
  {path: '/user', component: DashUser, meta: { requiresAuth: true,  }},
  {path: '/home', component: DashHome, meta: { requiresAuth: true }},
  {path: '/homeAdmin', component: DashHomeAdmin, meta: { requiresAuth: true, requiresFuncionario: true }},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware para verificar as permissões de rota
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");
    const isFuncionario = localStorage.getItem("isFuncionario") === "true";

    if (to.meta.requiresAuth && !token) {
        next("/");
    } else if (to.meta.requiresFuncionario && !isFuncionario) {
        alert("Acesso restrito a funcionários!");
        next("/");
    } else {
        next();
    }
});

export default router;
