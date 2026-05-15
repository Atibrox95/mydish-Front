<script setup>
// Imports
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import usuariosService from '../usuarios/services/usuarios_service'
import { useUsuarioStore } from '../../stores/usuarioStore'
import { useQuasar } from 'quasar'

// Constantes y Store
const usuarioStore = useUsuarioStore()
const comprobacionContraseña = ref('')
const esContraseña = ref(true)
const esContraseñaConfirm = ref(true)
const $q = useQuasar()

// Modo Edición: detectamos si hay un usuario cargado en el store
const esEdicion = computed(() => !!usuarioStore.usuario?.correo)

const usuario = ref({
  idUsuario: null, // Importante para la edición
  nombre: '',
  apellidos: '',
  correo: '',
  contraseña: '',
  fechaNacimiento: '',
  peso: '',
  altura: '',
  imc: '',
  nuevaContraseña: '',
})

onMounted(() => {
  if (esEdicion.value) {
    usuario.value = {
      ...usuario.value,
      idUsuario: usuarioStore.usuario.idUsuario, // Cargamos el ID
      nombre: usuarioStore.usuario.nombre,
      apellidos: usuarioStore.usuario.apellidos,
      correo: usuarioStore.usuario.correo,
      contraseña: usuarioStore.usuario.contraseña,
      fechaNacimiento: usuarioStore.usuario.fechaNacimiento,
      peso: usuarioStore.usuario.peso,
      altura: usuarioStore.usuario.altura,
      imc: usuarioStore.usuario.imc,
    }
  }
})

const deshabilitado = computed(() => {
  const u = usuario.value
  const original = usuarioStore.usuario

  // Verificación básica de campos obligatorios
  const camposCompletos = u.nombre && u.apellidos && u.correo && u.fechaNacimiento

  if (esEdicion.value) {
    // Detectar si el usuario ha modificado algún valor respecto al store
    const haCambiadoAlgo =
      u.nombre !== original.nombre ||
      u.apellidos !== original.apellidos ||
      u.fechaNacimiento !== original.fechaNacimiento ||
      u.peso !== original.peso ||
      u.altura !== original.altura ||
      u.nuevaContraseña !== ''

    // En edición, si la contraseña está vacía no pasa nada, pero si escribe algo debe coincidir con la confirmación
    const contraseñaValida =
      !u.nuevaContraseña || u.nuevaContraseña === comprobacionContraseña.value

    // Se deshabilita si: NO ha cambiado nada O faltan campos O la contraseña no es válida
    return !(haCambiadoAlgo && camposCompletos && contraseñaValida)
  }

  // Lógica para Registro: requiere que exista nuevaContraseña y que coincida
  return !(
    camposCompletos &&
    u.nuevaContraseña &&
    comprobacionContraseña.value === u.nuevaContraseña
  )
})

async function guardar() {
  try {
    let respuesta
    if (esEdicion.value) {
      if (usuario.value.nuevaContraseña) {
        usuario.value.contraseña = usuario.value.nuevaContraseña
      }
      // Pasamos el ID y el objeto (Exactamente como pide tu service: idUsuario, usuarioDto)
      respuesta = await usuariosService.actualizar(usuario.value.idUsuario, usuario.value)
    } else {
      respuesta = await usuariosService.registro(usuario.value)
    }

    usuarioStore.setUsuario(respuesta.data)

    $q.notify({
      type: 'positive',
      message: '¡Usuario cambiado con éxito!',
      icon: 'check',
    })
  } catch (error) {
    console.error('Error en la operación:', error)

    $q.notify({
      type: 'negative',
      message: '¡Error al guardar el usuario!',
      icon: 'close',
    })
  }
}

async function eliminarCuenta() {
  // Confirmación de seguridad
  $q.dialog({
    title: 'Eliminar cuenta',
    message: '¿Estás seguro de que quieres borrar tu cuenta? Esta acción no se puede deshacer.',
    cancel: true,
    persistent: true,
    ok: { label: 'Borrar', color: 'negative', flat: true },
  }).onOk(async () => {
    try {
      await usuariosService.borrar(usuario.value.idUsuario)
      usuarioStore.setUsuario(null)
      localStorage.removeItem('usuario_dish')
      $q.notify({
        type: 'warning',
        message: 'Cuenta eliminada correctamente',
        icon: 'delete',
      })
      router.push('/')
    } catch (error) {
      console.error('Error al eliminar:', error)
      $q.notify({
        type: 'negative',
        message: 'No se pudo eliminar la cuenta',
        icon: 'error',
      })
    }
  })
}
</script>

<template>
  <div class="col relative-position overflow-hidden">
    <div class="background-container">
      <img src="FondoAlimentosSeparados6.svg" class="bg-image" />
    </div>

    <div class="content-overlay column items-center q-pa-lg">
      <div class="column items-center q-mb-md">
        <img src="/MyDish.svg" style="width: 230px; height: 80px" />
        <div class="text-h4 text-black text-weight-light btn-font text-center">
          <span>{{ esEdicion ? 'Editar Perfil' : 'Registro de usuario' }}</span>
        </div>
      </div>

      <q-form class="full-width flex flex-center" @submit="guardar">
        <div class="form-card column q-gutter-y-md">
          <div class="column q-gutter-y-sm">
            <q-input v-model="usuario.nombre" rounded filled label="Nombre" bg-color="white" color="purple"
              :rules="[(val) => /^[\p{L}\s]+$/u.test(val) || 'Solo debe contener letras']" />
            <q-input v-model="usuario.apellidos" rounded filled label="Apellidos" bg-color="white" color="purple"
              :rules="[(val) => /^[\p{L}\s]+$/u.test(val) || 'Solo debe contener letras']" />
            <q-input v-model="usuario.correo" rounded filled label="Correo" :disable="esEdicion" bg-color="white"
              color="purple" lazy-rules
              :rules="[(val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Correo no válido']" />

            <q-input v-model="usuario.nuevaContraseña" :type="esContraseña ? 'password' : 'text'" rounded filled
              :label="esEdicion ? 'Nueva Contraseña (opcional)' : 'Contraseña'" bg-color="white" color="purple"
              lazy-rules :rules="[
                (val) =>
                  /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(val) ||
                  'Debe tener 8 caracteres, una mayúscula, un número y un símbolo',
              ]">
              <template #append>
                <q-icon :name="esContraseña ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="esContraseña = !esContraseña" />
              </template>
            </q-input>

            <q-input v-model="comprobacionContraseña" :type="esContraseñaConfirm ? 'password' : 'text'" rounded filled
              label="Confirmar contraseña" bg-color="white" color="purple" lazy-rules
              :rules="[(val) => val === usuario.contraseña || 'Las contraseñas no coinciden']">
              <template #append>
                <q-icon :name="esContraseñaConfirm ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="esContraseñaConfirm = !esContraseñaConfirm" />
              </template>
            </q-input>

            <q-input rounded filled v-model="usuario.fechaNacimiento" label="Fecha Nacimiento" bg-color="white"
              color="purple">
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

            <q-input v-model.number="usuario.peso" type="number" rounded filled label="Peso (kg)" bg-color="white"
              color="purple" />

            <q-input v-model.number="usuario.altura" type="number" rounded filled label="Altura (cm)" bg-color="white"
              color="purple" />
          </div>

          <q-btn :class="[!deshabilitado ? 'boton-activo' : 'boton-inactivo']" type="submit"
            :label="esEdicion ? 'Guardar Cambios' : 'Registrarse'" rounded size="lg" no-caps class="full-width" />

          <q-btn v-if="esEdicion" label="Eliminar Cuenta" color="negative" flat rounded no-caps
            class="full-width q-mt-sm" @click="eliminarCuenta" />
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
}

.boton-activo:hover {
  transform: scale(1.02);
}

.boton-inactivo {
  background: rgba(150, 150, 150, 0.5) !important;
  color: white !important;
  cursor: not-allowed;
}

.btn-font {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
