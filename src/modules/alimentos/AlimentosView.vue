<script setup>
import alimentosService from './services/alimentos_service'
import { ref } from 'vue'

const alimentos = ref([]);

async function recuperar() {
  alimentos.value = (await alimentosService.recuperar()).data;
}


</script>
<template>
  <h1>Hola</h1>
  <button @click="recuperar">Prueba</button>
  <ul>
    <li v-for="alimento in alimentos" :key="alimento.id">{{ alimento.nombre }}</li>
  </ul>
</template>
