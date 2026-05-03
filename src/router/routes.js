import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../modules/common/HomeView.vue'
// import { useUsuarioStore } from '../stores/usuarioStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/alimentos',
      name: 'alimentos',
      component: () => import('../modules/alimentos/AlimentosView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../modules/usuarios/LoginView.vue')
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('../modules/usuarios/RegistroView.vue')
    },
    {
      path: '/crear_platos',
      name: 'crearPlatos',
      component: () => import('../modules/platos/CrearPlatosView.vue')
    },
    {
      path: '/platos_guardados',
      name: 'platosGuardados',
      component: () => import('../modules/platos/PlatosGuardadosView.vue')
    }
  ],
})

// --- Vamos a crear un "navegation guard" para que no deje movernos por ciertas paginas  ---
// router.beforeEach((to, from, next) => {
//   const usuarioStore = useUsuarioStore()

//   // Rutas públicas
//   const rutasPublicas = ['login', 'registro', 'home']

//   // Comprobaciones de páginas y usuario logueado
//   const esRutaPublica = rutasPublicas.includes(to.name)
//   const estaLogueado = usuarioStore.usuario !== null

//   //
//   if (!esRutaPublica && !estaLogueado) {
//     next({ name: 'login' })
//   } else if (estaLogueado && (to.name === 'login' || to.name === 'registro')) {
//     // OPCIONAL: Si ya está logueado e intenta ir a login o registro -> Al Home o Crear Platos
//     next({ name: 'crearPlatos' })
//   } else {
//     // En cualquier otro caso -> Permitir el paso
//     next()
//   }
// })

export default router
