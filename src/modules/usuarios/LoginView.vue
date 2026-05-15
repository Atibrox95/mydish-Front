<script setup>
import { ref, computed } from 'vue'
import usuariosService from './services/usuarios_service'
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '../../stores/usuarioStore'
import { useQuasar } from 'quasar';

const router = useRouter()
const usuarioStore = useUsuarioStore()
const correo = ref()
const contraseña = ref()
const esContraseña = ref(true)
const $q = useQuasar();

const deshabilitado = computed(() => !(correo.value && contraseña.value))

async function iniciarSesion() {
  try {
    const respuesta = await usuariosService.login(correo.value, contraseña.value)
    usuarioStore.setUsuario(respuesta.data)
    $q.notify({
      type: 'positive',
      message: 'Has iniciado sesión!',
      icon: 'check',
    })
    router.push({ name: 'crearPlatos' })
  } catch (error) {
    console.error("Error en el login:", error.response?.data || error.message)
    $q.notify({
      type: 'negative',
      message: '¡Usuario o contraseña incorrectos!',
      icon: 'close'
    })
  }
}
</script>

<template>
  <div class="main-layout relative-position overflow-hidden">
    <div class="background-container">
      <img src="FondoAlimentosSeparados6.svg" class="bg-image">
    </div>

    <div class="content-overlay column items-center justify-center q-pa-md">
      <div class="column items-center q-mb-lg">
        <img src="/MyDish.svg" style="width: 300px; height: auto;">
        <div class="text-h4 text-black text-weight-bold btn-font">
          <p>Inicio de sesión</p>
        </div>
      </div>

      <!-- Formulario -->
      <q-form @submit.prevent="iniciarSesion" class="form-card">
        <div class="column q-gutter-y-md">
          <q-input v-model="correo" rounded filled bg-color="white" label="Correo electrónico" class="btn-font" color="purple">
            <template #prepend>
              <q-icon name="mail" color="deep-purple-5" />
            </template>
          </q-input>
          <q-input v-model="contraseña" rounded filled bg-color="white" :type="esContraseña ? 'password' : 'text'"
            label="Contraseña" class="btn-font" color="purple">
            <template #prepend>
              <q-icon name="lock" color="deep-purple-5" />
            </template>
            <template #append>
              <q-icon :name="esContraseña ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="esContraseña = !esContraseña" />
            </template>
          </q-input>

          <div class="column q-gutter-y-sm q-mt-md">

            <!-- Botón iniciar sesión -->
            <q-btn :class="[!deshabilitado ? 'boton-activo glossy' : 'boton-inactivo']" label="Entrar"
              :disable="deshabilitado" type="submit" rounded size="lg" no-caps class="full-width" />

            <!-- Botón crear cuenta -->
            <q-btn class="btn-font text-black bg-white" label="Crear una cuenta nueva" to="/registro" rounded size="md"
              no-caps flat />
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-overlay {
  position: relative;
  z-index: 1;
  flex-grow: 1;
}

.form-card {
  width: 100%;
  max-width: 400px;
}

.btn-font {
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.boton-inactivo {
  background: rgba(150, 150, 150, 0.5) !important;
  color: rgba(255, 255, 255, 0.6) !important;
  cursor: not-allowed;
}

.boton-activo {
  background: linear-gradient(45deg, #673ab7, #9c27b0) !important;
  color: white !important;
  transition: transform 0.2s;
}

.boton-activo:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(103, 58, 183, 0.4);
}
</style>
