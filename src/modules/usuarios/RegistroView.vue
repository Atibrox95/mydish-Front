<script setup>
import { ref, computed, unref } from 'vue'
import usuariosService from '../usuarios/services/usuarios_service'
import { useUsuarioStore } from '../../stores/usuarioStore'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const aceptarTerminos = ref(false)
const usuarioStore = useUsuarioStore()
const comprobacionContraseña = ref('')
const esContraseña = ref(true)
const esContraseñaConfirm = ref(true)
const $q = useQuasar()
const usuario = ref({
  nombre: '',
  apellidos: '',
  correo: '',
  contraseña: '',
  fechaNacimiento: '',
})

const deshabilitado = computed(() => {
  const u = unref(usuario)
  return !(
    u.nombre &&
    u.apellidos &&
    u.correo &&
    u.contraseña &&
    comprobacionContraseña.value === u.contraseña &&
    u.fechaNacimiento &&
    aceptarTerminos.value
  )
})

async function registro() {
  try {
    const respuesta = await usuariosService.registro(usuario.value)
    usuarioStore.setUsuario(respuesta.data)
    $q.notify({
      type: 'positive',
      message: '¡Usuario registrado con éxito!',
      icon: 'check',
    })
    router.push({ name: 'crearPlatos' })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Este correo ya está en uso',
      icon: 'error',
    })
  }
}

</script>

<template>
  <div class="col relative-position overflow-hidden">
    <div class="background-container">
      <img src="FondoAlimentosSeparados5.svg" class="bg-image" />
    </div>

    <div class="content-overlay column items-center q-pa-lg">
      <div class="column items-center q-mb-md">
        <img src="/MyDish.svg" style="width: 230px; height: 80px" />
        <div class="text-h4 text-black text-weight-light btn-font">
          <p>Registro de usuario</p>
        </div>
      </div>

      <q-form @submit.prevent="registro" class="full-width flex flex-center">
        <div class="form-card column q-gutter-y-md">
          <div class="column q-gutter-y-sm">
            <q-input
              v-model="usuario.nombre"
              rounded
              filled
              label="Nombre"
              bg-color="white"
              color="purple"
              :rules="[
                (val) => !!val || 'Campo obligatorio',
                (val) => /^[\p{L}\s]+$/u.test(val) || 'Solo debe contener letras',
              ]"
            />

            <q-input
              v-model="usuario.apellidos"
              rounded
              filled
              label="Apellidos"
              bg-color="white"
              color="purple"
              :rules="[
                (val) => !!val || 'Campo obligatorio',
                (val) => /^[\p{L}\s]+$/u.test(val) || 'Solo debe contener letras',
              ]"
            />

            <q-input
              v-model="usuario.correo"
              rounded
              filled
              label="Correo"
              bg-color="white"
              color="purple"
              lazy-rules
              :rules="[
                (val) => !!val || 'Campo obligatorio',
                (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Correo no válido',
              ]"
            />

            <q-input
              v-model="usuario.contraseña"
              :type="esContraseña ? 'password' : 'text'"
              rounded
              filled
              label="Contraseña"
              bg-color="white"
              color="purple"
              lazy-rules
              :rules="[
                (val) => !!val || 'Campo obligatorio',
                (val) =>
                  /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(val) ||
                  'Debe tener 8 caracteres, una mayúscula, un número y un símbolo',
              ]"
            >
              <template #append>
                <q-icon
                  :name="esContraseña ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="esContraseña = !esContraseña"
                />
              </template>
            </q-input>

            <q-input
              v-model="comprobacionContraseña"
              :type="esContraseñaConfirm ? 'password' : 'text'"
              rounded
              filled
              label="Comprobación contraseña"
              bg-color="white"
              color="purple"
              lazy-rules
              :rules="[
                (val) => !!val || 'Campo obligatorio',
                (val) => val === usuario.contraseña || 'Las contraseñas no coinciden',
              ]"
            >
              <template #append>
                <q-icon
                  :name="esContraseñaConfirm ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="esContraseñaConfirm = !esContraseñaConfirm"
                />
              </template>
            </q-input>

            <q-input
              rounded
              filled
              v-model="usuario.fechaNacimiento"
              label="Fecha Nacimiento"
              bg-color="white"
              color="purple"
              :rules="[(val) => !!val || 'Campo obligatorio']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="usuario.fechaNacimiento" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="row justify-start">
            <q-checkbox
              v-model="aceptarTerminos"
              label="Aceptar términos y condiciones"
              color="purple"
            />
          </div>

          <q-btn
            :class="[!deshabilitado ? 'boton-activo' : 'boton-inactivo']"
            label="Registrarse"
            :disable="deshabilitado"
            type="submit"
            rounded
            size="lg"
            no-caps
            class="full-width"
          />

          <q-btn
            flat
            class="text-white q-mt-sm"
            label="¿Ya tienes cuenta? Inicia sesión"
            to="/login"
            no-caps
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<style scoped>
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
  transition: all 0.3s ease-in-out;
}

.content-overlay {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

.form-card {
  width: 100%;
  max-width: 500px;
}

.boton-activo {
  background: linear-gradient(45deg, #673ab7, #9c27b0) !important;
  color: white !important;
  transition: transform 0.2s;
  box-shadow: 0 4px 15px rgba(103, 58, 183, 0.4);
}

.boton-activo:hover {
  transform: scale(1.02);
}

.boton-inactivo {
  background: rgba(150, 150, 150, 0.5) !important;
  color: rgba(255, 255, 255, 0.7) !important;
  cursor: not-allowed;
}

.btn-font {
  font-family: Georgia, 'Times New Roman', Times, serif;
}
</style>
