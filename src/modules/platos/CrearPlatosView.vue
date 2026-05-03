<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar';
import alimentosService from '../alimentos/services/alimentos_service.js'
import plato_service from './services/plato_service';
import { useUsuarioStore } from '@/stores/usuarioStore'
console.log("Service cargado:", alimentosService);

const size = 300
const center = size / 2
const radius = size / 2 - 2
const usuarioStore = useUsuarioStore()
const alimentos = ref({
  vegetales: [],
  carbohidratos: [],
  proteinas: []
})

const plato = ref({
  vegetales: null,
  carbohidratos: null,
  proteinas: null
})

const platoCompleto = computed(() => {
  return plato.value.vegetales && plato.value.carbohidratos && plato.value.proteinas
})

const $q = useQuasar();

async function cargarDatosDelPlato() {
  try {
    const [resProt, resVeg, resCarb] = await Promise.all([
      alimentosService.recuperarPorTipo(1),
      alimentosService.recuperarPorTipo(2),
      alimentosService.recuperarPorTipo(3)
    ])
    alimentos.value.proteinas = resProt.data
    alimentos.value.vegetales = resVeg.data
    alimentos.value.carbohidratos = resCarb.data
  } catch (error) {
    console.error("Error cargando alimentos:", error)
  }
}

function crearPlatoAleatorio() {
  // Función auxiliar para obtener un elemento al azar de un array
  const obtenerAzar = (lista) => {
    if (lista.length === 0) return null;
    const indice = Math.floor(Math.random() * lista.length);
    return lista[indice];
  };
  // Asignamos uno de cada categoría
  plato.value.vegetales = obtenerAzar(alimentos.value.vegetales);
  plato.value.carbohidratos = obtenerAzar(alimentos.value.carbohidratos);
  plato.value.proteinas = obtenerAzar(alimentos.value.proteinas);
}
onMounted(() => {
  cargarDatosDelPlato()
})

// función gguardar plato
const handleGuardarPlato = async () => {
  try {
    const usuarioActual = usuarioStore.usuario?.idUsuario;

    if (!usuarioActual) {
      $q.notify({
        type: 'negative',
        message: 'Debes iniciar sesión para guardar un plato',
        icon: 'lock'
      })
      return;
    }

    const platoDto = {
      idUsuario: usuarioActual,
      alimentos: [
        { idAlimento: plato.value.vegetales.idAlimento },
        { idAlimento: plato.value.carbohidratos.idAlimento },
        { idAlimento: plato.value.proteinas.idAlimento }
      ]
    };

    await plato_service.crearPlato(platoDto);

    $q.notify({
      type: 'positive',
      message: '¡Plato guardado con éxito!',
      icon: 'check'
    })

  } catch (error) {
    console.error("Error al guardar el plato:", error);
  }
};


</script>

<template>
  <div class="q-pa-md flex flex-center column">
    <div class="text-h5 q-mb-xl btn-font">Configura tu Plato Harvard</div>

    <div class="row items-center justify-center q-gutter-xl">
      <!-- LADO IZQUIERDO: Selector de Vegetales -->
      <div class="col-auto">
        <q-select v-model="plato.vegetales" :options="alimentos.vegetales" option-label="nombre" label="Vegetales"
          filled rounded color="green-8" style="width: 250px">
          <template v-slot:prepend>
            <q-icon name="mdi-leaf" color="green-8" />
          </template>
        </q-select>
      </div>

      <!-- CENTRO: El Plato SVG -->
      <div class="col-auto">
        <svg :viewBox="`0 0 ${size} ${size}`" :width="size" :height="size" class="plato-svg">
          <defs>
            <clipPath id="circularMask">
              <circle :cx="center" :cy="center" :r="radius" />
            </clipPath>
          </defs>

          <g clip-path="url(#circularMask)">
            <!-- Se pinta de verde si hay vegetal seleccionado, si no, gris -->
            <rect x="0" y="0" :width="size / 2" :height="size" :fill="plato.vegetales ? '#aed581' : '#e0e0e0'"
              class="transition-color" />

            <!-- Se pinta de naranja para carbohidratos -->
            <rect :x="size / 2" :y="size / 2" :width="size / 2" :height="size / 2"
              :fill="plato.carbohidratos ? '#ffd54f ' : '#eeeeee'" class="transition-color" />

            <!-- Se pinta de rojo para proteínas -->
            <rect :x="size / 2" y="0" :width="size / 2" :height="size / 2"
              :fill="plato.proteinas ? '#e57373 ' : '#f5f5f5'" class="transition-color" />

          </g>

          <!-- Divisores blancos -->
          <line :x1="center" y1="0" :x2="center" :y2="size" stroke="white" stroke-width="3" />
          <line :x1="center" :y1="center" :x2="size" :y2="center" stroke="white" stroke-width="3" />
          <circle :cx="center" :cy="center" :r="radius" fill="none" stroke="#333" stroke-width="2" />
        </svg>
      </div>

      <!-- LADO DERECHO: Selectores de Carbohidratos y Proteínas -->
      <div class="col-auto column q-gutter-y-md">
        <q-select v-model="plato.proteinas" :options="alimentos.proteinas" option-label="nombre" label="Proteínas"
          filled rounded color="red-8" style="width: 250px">
          <template v-slot:prepend>
            <q-icon name="mdi-food-drumstick" color="red-8" />
          </template>
        </q-select>
        <q-select v-model="plato.carbohidratos" :options="alimentos.carbohidratos" option-label="nombre"
          label="Carbohidratos" filled rounded color="amber-8" style="width: 250px">
          <template v-slot:prepend>
            <q-icon name="grain" color="amber-8" />
          </template>
        </q-select>
      </div>
    </div>

    <div class="col-auto column q-gutter-y-md">
      <!-- Botón guardar -->
      <q-btn :class="[
        'btn-font',
        'custom-btn',
        platoCompleto ? 'boton-activo glossy' : 'boton-inactivo',
      ]" label="Guardar Plato" rounded size="lg" no-caps @click="handleGuardarPlato" />

      <!-- Botón Aleatorio -->
      <q-btn label="Crear plato aleatorio" class="btn-font custom-btn text-black" @click="crearPlatoAleatorio" rounded
        size="lg" no-caps height="" />
    </div>
  </div>


</template>

<style scoped>
.plato-svg {
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
}

.transition-color {
  transition: fill 0.5s ease;
}

.btn-font {
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.custom-btn:disabled {
  opacity: 0.6;
  background-color: #e0e0e0 !important;
  color: black !important;
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
</style>
