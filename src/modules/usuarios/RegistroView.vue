<!-- Vista de lo que será la página -->
<script setup>
//Imports
import { ref, computed, unref } from 'vue'
import usuariosService from '../usuarios/services/usuarios_service'
import { useUsuarioStore } from '../../stores/usuarioStore'

//Constantes
const aceptarTerminos = ref(false)
const usuarioStore = useUsuarioStore()
const comprobacionContraseña = ref();
const usuario = ref({
  nombre: '',
  apellidos: '',
  correo: '',
  contraseña: '',
  fechaNacimiento: ''
})
const esContraseña = ref(true)
const esContraseñaConfirm = ref(true)
const deshabilitado = computed(() => {
  const usuarioUnref = unref(usuario);
  return !(usuarioUnref.nombre && usuarioUnref.apellidos && usuarioUnref.correo && usuarioUnref.contraseña && comprobacionContraseña.value && usuarioUnref.fechaNacimiento && aceptarTerminos.value)
});
//funciones

async function registro() {
  const respuesta = await usuariosService.registro(usuario.value)
  usuarioStore.setUsuario(respuesta.data)

}
</script>

<!-- ref="" dentro de cualquier elemento del html (template)
 es una referencia a ese elemento -->

<template>
  <div class="column items-center q-mb-md">
    <img src="/MyDish.svg" style="width: 300px; height: auto;">
    <div class="text-h4 text-black text-weight-bold btn-font">
      <p>Registro de usuario</p>
    </div>
  </div>

  <q-form method="POST" class="flex flex-center q-pa-lg">
    <div class="registro-container column q-gutter-y-md" style="width: 100%; max-width: 500px; margin-top: -40px;">
      <div class="column q-gutter-y-sm">
        <q-input v-model="usuario.nombre" rounded filled label="Nombre" class="full-width" />
        <q-input v-model="usuario.apellidos" rounded filled label="Apellidos" class="full-width" />
        <q-input v-model="usuario.correo" rounded filled label="Correo" class="full-width" />

        <q-input v-model="usuario.contraseña" :type="esContraseña ? 'password' : 'text'" rounded filled
          label="Contraseña" class="full-width">
          <template #append>
            <q-icon :name="esContraseña ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="esContraseña = !esContraseña" />
          </template>
        </q-input>

        <q-input v-model="comprobacionContraseña" :type="esContraseñaConfirm ? 'password' : 'text'" rounded filled
          label="Comprobación contraseña" class="full-width">
          <template #append>
            <q-icon :name="esContraseñaConfirm ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="esContraseñaConfirm = !esContraseñaConfirm" />
          </template>
        </q-input>

        <q-input rounded filled v-model="usuario.fechaNacimiento" label="Fecha Nacimiento" class="full-width">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="usuario.fechaNacimiento" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="row justify-start">
        <q-checkbox right-label v-model="aceptarTerminos" label="I agree" checked-icon="task_alt"
          unchecked-icon="highlight_off" />
      </div>

      <q-btn :class="[
        'btn-font',
        'custom-btn',
        !deshabilitado ? 'boton-activo glossy' : 'boton-inactivo',
      ]" label="Entrar" :disable="deshabilitado" @click="registro" rounded size="lg" no-caps />
      <q-btn flat class="btn-font text-white" label="Crear una cuenta nueva" to="/registro" no-caps />


      <!-- <q-btn color="primary" label="Registrarse" :disable="deshabilitado" @click="registro" class="full-width q-py-sm"
        rounded /> -->
    </div>
  </q-form>
</template>

<style>
/* .btn-font {
  font-family: Georgia, 'Times New Roman', Times, serif;
} */

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
