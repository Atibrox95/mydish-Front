<script setup>
import { ref, onMounted } from 'vue'
import { useUsuarioStore } from '@/stores/usuarioStore'
import platoService from '../platos/services/plato_service'
import { useQuasar } from 'quasar'

const usuarioStore = useUsuarioStore()
const platos = ref([])
const $q = useQuasar()

async function cargarPlatos() {
  const idUsuario = usuarioStore.usuario?.idUsuario

  if (idUsuario) {
    const response = await platoService.recuperarPlatos(idUsuario)
    platos.value = response.data
  }
}

function getIconParams(tipo) {
  const icons = {
    1: { icon: 'mdi-food-drumstick', color: 'red-8' },
    2: { icon: 'mdi-leaf', color: 'green-8' },
    3: { icon: 'grain', color: 'yellow-8' },
  }
  return icons[tipo]
}

async function eliminarPlato(idPlato) {
  $q.dialog({
    title: 'Eliminar plato',
    message: '¿Eliminar plato?.',
    cancel: true,
    persistent: true,
    ok: { label: 'Borrar', color: 'negative', flat: true },
  }).onOk(async () => {
    await platoService.borrarPlato(idPlato)
    const index = platos.value.findIndex((plato) => plato.idPlato === idPlato)
    platos.value.splice(index, 1)
  })

  //Vue componentes tienen ciclo de vida, onMounted es un ciclo en el que se "montan" componentes.
}
onMounted(() => {
  cargarPlatos()
})
</script>

<template>
  <div class="main-container">
    <div class="background-wrapper">
      <img src="FondoAlimentos.svg" class="bg-image" />
    </div>

    <div class="content-overlay q-pa-md">
      <h1 class="text-h4 q-mb-md text-weight-light text-title text-center">Mis Platos Guardados</h1>

      <div
        v-if="platos.length === 0"
        class="text-h4 q-mb-md text-weight-light text-black text-title text-center"
      >
        <q-icon name="no_food" size="60px" color="grey-5" />
        <p class="text-grey-7">Aún no tienes platos guardados.</p>
      </div>

      <!-- Grid de platos -->
      <div v-else class="row q-col-gutter-md justify-start">
        <div v-for="plato in platos" :key="plato.id" class="col-12 col-sm-6 col-md-3">
          <q-card class="my-card text-center bg-deep-purple-1">
            <q-card-section>
              <div class="text-h6 q-mb-md text-weight-gold text-black text-title text-capitalize">
                {{ plato.nombrePlato || 'Plato sin nombre' }}
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section align="left">
              <div v-for="alimento in plato.alimentos" :key="alimento.nombre">
                <div
                  class="text-h6 q-mb-sm text-weight-light text-black text-title text-capitalize"
                >
                  <q-icon
                    :name="getIconParams(alimento.idTipo).icon"
                    size="50px"
                    :color="getIconParams(alimento.idTipo).color"
                  />
                  {{ alimento.nombre || 'Sin alimento' }}
                </div>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                @click="eliminarPlato(plato.idPlato)"
              />
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                :to="{ name: 'crearPlatos', params: { id: plato.idPlato } }"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.main-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.background-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.9);
}

.content-overlay {
  position: relative;
  z-index: 1;
}

.my-card {
  width: 100%;
  aspect-ratio: 1 / 1;
}

.text-title {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
