<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'
import { useUsuarioStore } from './stores/usuarioStore'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const usuarioStore = useUsuarioStore()
const usuarioActivo = useUsuarioStore()
const rightDrawerOpen = ref(false)
const $q = useQuasar()

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

async function cerrarSesion() {
  $q.dialog({
    title: 'Cerrar sesión',
    message: '¿Estás seguro de que quieres cerrar la sesión?',
    cancel: true,
    persistent: true,
    ok: { label: 'Cerrar', color: 'negative', flat: true },
  }).onOk(async () => {
    usuarioStore.setUsuario(null)
    localStorage.removeItem('usuario_dish')
    router.replace({ name: 'login' })
    // Al salir, redirige a login
  })
}
</script>

<template>
  <q-layout view="hhh lpR fFf">
    <q-header reveal elevated class="bg-deep-purple-1 text-white">
      <q-toolbar>
        <q-toolbar-title
          ><img src="/MDish.svg" alt="icono" style="height: 45px; vertical-align: middle" />
        </q-toolbar-title>
        <q-btn
          size="18px"
          dense
          flat
          round
          icon="menu"
          color="deep-purple-10"
          @click="toggleRightDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right">
      <template v-if="!usuarioActivo.usuario">
        <!-- * Cabecera sin login -->
        <q-list style="min-width: 10px" class="text">
          <q-item clickable v-close-popup to="/">
            <q-item-section>Inicio</q-item-section>
          </q-item>
          <q-item clickable v-close-popup to="/login">
            <q-item-section>Iniciar sesión</q-item-section>
          </q-item>
          <q-item clickable v-close-popup to="/registro">
            <q-item-section>Crear una cuenta nueva</q-item-section>
          </q-item>
        </q-list>
      </template>
      <!-- * Cabecera después de login-->
      <template v-else>
        <q-list style="min-width: 10px">
          <q-item clickable v-close-popup to="/crear_platos">
            <q-item-section>Crear platos</q-item-section>
          </q-item>
          <q-item clickable v-close-popup to="/platos_guardados">
            <q-item-section>Platos guardados</q-item-section>
          </q-item>
          <q-item clickable v-close-popup to="/perfil_usuario">
            <q-item-section>Perfil</q-item-section>
          </q-item>
          <q-item clickable v-close-popup class="bg-red-6 text-white" @click="cerrarSesion">
            <q-item-section>Cerrar sesión</q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.text {
  font-family: Georgia, 'Times New Roman', Times, serif;
}
</style>
