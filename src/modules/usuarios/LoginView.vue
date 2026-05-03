<script setup>
import { ref, computed } from 'vue'
import usuariosService from './services/usuarios_service'
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '../../stores/usuarioStore'

// en vue es raro que haga let

const router = useRouter() //Usamos la ruta
const usuarioStore = useUsuarioStore() //Importamos el store
const correo = ref() //Datos que recogeremos
const contraseña = ref()
const esContraseña = ref(true)
const recordar = ref(false)
const deshabilitado = computed(() => !(correo.value && contraseña.value))

//Funciónes
async function iniciarSesion() {
  try {
    const respuesta = await usuariosService.login(correo.value, contraseña.value)
    usuarioStore.setUsuario(respuesta.data)
    if (recordar.value) {
      localStorage.setItem('usuario_recordado', correo.value)
    } else {
      localStorage.removeItem('usuario_recordado')
    }
    router.push({ name: 'crearPlatos' })
  } catch (error) {
    console.error("Error en el login:", error.response?.data || error.message)
  }
}
</script>

<template>
  <div class="column items-center q-mb-md">
    <img src="/MyDish.svg" style="width: 300px; height: auto;">
    <div class="text-h4 text-black text-weight-bold btn-font">
      <p>Inicio de sesión</p>
    </div>
  </div>
  <q-form @submit="iniciarSesion" class="column q-gutter-y-md">
    <div class="login-container flex flex-center" style="margin-top: -30px">
      <!-- <div class="animated-bg"></div> -->
      <div class="content-card q-pa-xl">
        <!-- <div class="text-h4 text-white text-weight-bold q-mb-xl text-center btn-font">MyDish</div> -->

        <div class="column q-gutter-y-md">
          <q-input v-model="correo" rounded filled bg-color="blue-grey-1" label="Correo electrónico" class="btn-font">
            <template #prepend>
              <q-icon name="mail" color="deep-purple-5" />
            </template>
          </q-input>
          <q-input v-model="contraseña" rounded filled bg-color="blue-grey-1" :type="esContraseña ? 'password' : 'text'"
            label="Contraseña" class="btn-font">
            <template #prepend>
              <q-icon name="lock" color="deep-purple-5" />
            </template>
            <template #append>
              <q-icon :name="esContraseña ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="esContraseña = !esContraseña" />
            </template>
          </q-input>
          <!-- <div class="row items-center q-mb-md">
            <q-checkbox v-model="recordar" label="Recordar usuario" color="deep-purple-5" dark keep-color />
            <span class="btn-font text-white q-ml-sm" style="font-size: 0.9rem">
              Recordar usuario
            </span>
          </div> -->
          <div class="column q-gutter-y-sm q-mt-lg">

            <!-- boton iniciar sesion -->
            <q-btn :class="[
              'btn-font',
              'custom-btn',
              !deshabilitado ? 'boton-activo glossy' : 'boton-inactivo',
            ]" label="Entrar" :disable="deshabilitado" type="submit" @click="iniciarSesion" rounded size="lg"
              no-caps />

            <!-- Botón crear cuenta nueva -->
            <q-btn class="btn-font custom-btn text-black" label="Crear una cuenta nueva" to="/registro" rounded
              size="mg" no-caps />
          </div>
        </div>
      </div>
    </div>
  </q-form>
</template>

<style>
.btn-font {
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.custom-btn {
  background-color: white;
  color: #673ab7;
  transition: all 0.3s ease;
}

.boton-inactivo {
  background: rgba(150, 150, 150, 0.5) !important;
  color: rgba(255, 255, 255, 0.6) !important;
  cursor: not-allowed;
  transition: all 0.5s ease;
}

.boton-activo {
  background: linear-gradient(45deg, #673ab7, #9c27b0) !important;
  color: white !important;
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(103, 58, 183, 0.4);
}

.custom-btn:disabled {
  opacity: 0.6;
  background-color: #e0e0e0 !important;
  color: black !important;
}
</style>
