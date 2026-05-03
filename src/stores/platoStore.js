import { defineStore } from 'pinia';
import PlatoService from '@/modules/platos/services/plato_service'

export const usePlatoStore = defineStore('plato', {
  state: () => ({
    platos: [],
    platoSeleccionado: null,
    loading: false
  }),

  actions: {
    async cargarPlatos(idUsuario) {
      this.loading = true;
      try {
        // Llamamos al service que usa axios
        const response = await PlatoService.recuperarPlatos(idUsuario);
        // Guardamos la lista de objetos PlatoDto
        this.platos = response.data;
      } catch (error) {
        console.error("Error al traer los platos de la sesión:", error);
      } finally {
        this.loading = false;
      }
    },
    setPlato(payload) {
      this.platoSeleccionado = payload;
    }
  }
});

