<script setup>
import { ref, onMounted } from 'vue'
import { useUsuarioStore } from '@/stores/usuarioStore';
import platoService from '../platos/services/plato_service'


const usuarioStore = useUsuarioStore();
const platos = ref([]);

async function cargarPlatos() {
  // Obtenemos el ID del store de Pinia
  console.log(usuarioStore.usuario);
  const idUsuario = usuarioStore.usuario?.idUsuario;

  if (idUsuario) {
    const response = await platoService.recuperarPlatos(idUsuario);
    platos.value = response.data;
    // Asignamos la lista que devuelve el controller de Java
  }
}

function getIconParams(tipo) {
  const icons = {
    1: { icon: "mdi-food-drumstick", color: "red-8" },
    2: { icon: "mdi-leaf", color: "green-8" },
    3: { icon: "grain", color: "yellow-8" }
  }
  return icons[tipo];
}

//Vue componentes tienen ciclo de vida, onMounted es un ciclo en el que se "montan" componentes.
onMounted(() => {
  cargarPlatos();
})
</script>

<template>
  <div class="q-pa-md">
    <h1 class="text-h4 q-mb-md">Mis Platos Guardados</h1>

    <!-- Mensaje si no hay platos -->
    <div v-if="platos.length === 0" class="text-center q-pa-xl">
      <q-icon name="no_food" size="60px" color="grey-5" />
      <p class="text-grey-7">Aún no tienes platos guardados.</p>
    </div>
    <!-- Grid de platos -->
    <!-- todo info key -->
    <div v-else class="row q-col-gutter-md justify-start">
      <div v-for="plato in platos" :key="plato.id" class="col-12 col-sm-6 col-md-3">
        <q-card class="my-card text-center bg-deep-purple-1">
          <q-card-section>
            <div class="text-h6 text-capitalize">{{ plato.nombre || 'Plato sin nombre' }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="flex flex-center" style="height: 200px">
            <!-- Aquí podrías poner una imagen si el plato la tiene, si no, el icono -->
            <q-img v-if="plato.imagen" :src="plato.imagen" />
            <q-icon v-else name="restaurant" size="50px" color="deep-purple" />
          </q-card-section>

          <q-separator />
          <q-card-section align="left">
            <div v-for="alimento in plato.alimentos" :key="alimento.nombre" class="col-12 col-sm-6 col-md-3">
              <div class="text-h6 text-capitalize">
                <q-icon :name="getIconParams(alimento.idTipo).icon" size="50px"
                  :color="getIconParams(alimento.idTipo).color" />
                {{ alimento.nombre || 'Sin alimento' }}
              </div>
            </div>
          </q-card-section>


          <q-card-actions align="right">
            <q-btn flat round color="negative" icon="delete" @click="eliminarPlato(plato.id)" />
            <q-btn flat round color="primary" icon="edit" :to="`/plato/${plato.id}`" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style>
.my-card {
  width: 100%;
  aspect-ratio: 1 / 1;
  /* Esto lo mantiene cuadrado perfecto */
}
</style>
