<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import alimentosService from '../alimentos/services/alimentos_service.js'
import plato_service from './services/plato_service'
import { useUsuarioStore } from '@/stores/usuarioStore'

const route = useRoute()
const idPlatoAEditar = route.params.id
const size = 300
const center = size / 2
const radius = size / 2 - 2
const usuarioStore = useUsuarioStore()
const $q = useQuasar()
const alimentos = ref({
  vegetales: [],
  carbohidratos: [],
  proteinas: [],
})
const plato = ref({
  vegetales: null,
  carbohidratos: null,
  proteinas: null,
})

const platoCompleto = computed(() => {
  return plato.value.vegetales && plato.value.carbohidratos && plato.value.proteinas
})

async function cargarDatosDelPlato() {
  try {
    const [resProt, resVeg, resCarb] = await Promise.all([
      alimentosService.recuperarPorTipo(1),
      alimentosService.recuperarPorTipo(2),
      alimentosService.recuperarPorTipo(3),
    ])
    alimentos.value.proteinas = resProt.data
    alimentos.value.vegetales = resVeg.data
    alimentos.value.carbohidratos = resCarb.data

    if (idPlatoAEditar) {
      // Usamos el ID del usuario para traer sus platos
      const response = await plato_service.recuperarPlatoPorId(idPlatoAEditar)

      // Buscamos el plato dentro de la lista que devuelve tu GET
      const platoEncontrado = response.data

      if (platoEncontrado) {
        plato.value.nombrePlato = platoEncontrado.nombrePlato
        // Mapeamos los alimentos por su idTipo
        plato.value.proteinas = platoEncontrado.alimentos.find((a) => a.idTipo === 1)
        plato.value.vegetales = platoEncontrado.alimentos.find((a) => a.idTipo === 2)
        plato.value.carbohidratos = platoEncontrado.alimentos.find((a) => a.idTipo === 3)
      }
    }
  } catch (error) {
    console.error('Error cargando alimentos:', error)
  }
}

function crearPlatoAleatorio() {
  // Función obtener un elemento al azar para elegir aliemntos aleatorios
  const obtenerAzar = (lista) => {
    if (lista.length === 0) return null
    const indice = Math.floor(Math.random() * lista.length)
    return lista[indice]
  }
  // Asignamos uno de cada tipo
  plato.value.vegetales = obtenerAzar(alimentos.value.vegetales)
  plato.value.carbohidratos = obtenerAzar(alimentos.value.carbohidratos)
  plato.value.proteinas = obtenerAzar(alimentos.value.proteinas)
}

// Función gguardar plato
const GuardarPlato = async () => {
  try {
    const idUsuario = usuarioStore.usuario?.idUsuario
    if (!idUsuario) return

    const platoDto = {
      idUsuario: idUsuario,
      nombrePlato: plato.value.nombrePlato,
      alimentos: [
        { idAlimento: plato.value.vegetales.idAlimento },
        { idAlimento: plato.value.carbohidratos.idAlimento },
        { idAlimento: plato.value.proteinas.idAlimento },
      ],
    }

    if (idPlatoAEditar) {
      await plato_service.actualizarPlatos(idPlatoAEditar, platoDto)
    } else {
      await plato_service.crearPlato(platoDto)
    }
    $q.notify({
      type: 'positive',
      message: '¡Plato guardado con éxito!',
      icon: 'check',
    })
  } catch (error) {
    console.error('Error al guardar el plato:', error)
  }
}
onMounted(() => {
  cargarDatosDelPlato()
})
</script>

<template>
  <div class="row no-wrap">
    <div class="col relative-position overflow-hidden">
      <div class="background-container">
        <img src="FondoAlimentosSeparados5.svg" class="bg-image" />
      </div>
      <div class="content-overlay column items-center q-pa-lg">
        <div class="column items-center q-mb-md">
          <img src="/MyDish.svg" style="width: 230px; height: auto" />
          <div class="text-h4 text-title">
            <!-- v-if en caso de que está logado y existe un nombre-->
            <span v-if="usuarioStore.usuario?.nombre" class="text-black q-mb-sm">
              Hola, {{ usuarioStore.usuario.nombre }}, crea tu plato:
            </span>
          </div>
        </div>

        <div class="row items-center justify-center q-gutter-xl">
          <!-- Vegetales -->
          <div class="col-auto btn-font">
            <q-select
              v-model="plato.vegetales"
              :options="alimentos.vegetales"
              option-label="nombre"
              label="Vegetales"
              filled
              rounded
              color="green-8"
              style="width: 220px"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-leaf" color="green-8" />
              </template>
            </q-select>
          </div>

          <!-- Plato SVG -->
          <div class="col-auto">
            <svg :viewBox="`0 0 ${size} ${size}`" :width="size" :height="size" class="plato-svg">
              <defs>
                <clipPath id="circularMask">
                  <circle :cx="center" :cy="center" :r="radius" />
                </clipPath>
              </defs>

              <g clip-path="url(#circularMask)">
                <!-- Se pinta de verde si hay vegetal seleccionado, si no, gris -->
                <rect
                  x="0"
                  y="0"
                  :width="size / 2"
                  :height="size"
                  :fill="plato.vegetales ? '#aed581' : '#e0e0e0'"
                  class="transition-color"
                />

                <rect
                  :x="size / 2"
                  :y="size / 2"
                  :width="size / 2"
                  :height="size / 2"
                  :fill="plato.carbohidratos ? '#ffd54f ' : '#eeeeee'"
                  class="transition-color"
                />

                <rect
                  :x="size / 2"
                  y="0"
                  :width="size / 2"
                  :height="size / 2"
                  :fill="plato.proteinas ? '#e57373 ' : '#f5f5f5'"
                  class="transition-color"
                />
              </g>

              <line :x1="center" y1="0" :x2="center" :y2="size" stroke="white" stroke-width="3" />
              <line
                :x1="center"
                :y1="center"
                :x2="size"
                :y2="center"
                stroke="white"
                stroke-width="3"
              />
              <circle
                :cx="center"
                :cy="center"
                :r="radius"
                fill="none"
                stroke="#333"
                stroke-width="2"
              />
            </svg>
          </div>

          <!-- Carbohidratos y Proteínas -->
          <div class="col-auto column q-gutter-y-md btn-font">
            <q-select
              v-model="plato.proteinas"
              :options="alimentos.proteinas"
              option-label="nombre"
              label="Proteínas"
              filled
              rounded
              color="red-8"
              style="width: 220px"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-food-drumstick" color="red-8" />
              </template>
            </q-select>
            <q-select
              v-model="plato.carbohidratos"
              :options="alimentos.carbohidratos"
              option-label="nombre"
              label="Carbohidratos"
              filled
              rounded
              color="amber-8"
              style="width: 220px"
            >
              <template v-slot:prepend>
                <q-icon name="grain" color="amber-8" />
              </template>
            </q-select>
          </div>
        </div>

        <div class="col-auto column q-gutter-y-md">
          <q-input
            v-model="plato.nombrePlato"
            rounded
            filled
            label="Nombre del plato"
            class="full-width"
          />
          <!-- Botón guardar -->
          <q-btn
            :disable="!platoCompleto"
            :class="[
              'btn-font',
              'custom-btn',
              platoCompleto ? 'boton-activo glossy' : 'boton-inactivo',
            ]"
            label="Guardar Plato"
            rounded
            size="lg"
            no-caps
            @click="GuardarPlato"
          />

          <!-- Botón Aleatorio -->
          <q-btn
            label="Crear plato aleatorio"
            class="btn-font custom-btn text-black"
            @click="crearPlatoAleatorio"
            rounded
            size="lg"
            no-caps
            height=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plato-svg {
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
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
  transition: all 0.3s ease-in-out;
}

.content-overlay {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

.transition-color {
  transition: fill 0.5s ease;
}

.text-title {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 300;
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

@media (max-width: 1023px) {
  .flex-direction-container {
    flex-direction: column !important;
  }
}
</style>
