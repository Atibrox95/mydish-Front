import { defineStore } from 'pinia'

// Pinia es un manejador de estados y se dividen en stores.

//Las stories tienen un estado (states) dodne puedo guardar información
export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    usuario: JSON.parse(localStorage.getItem('usuario_dish')) || null,
  }),

  // Las actions es la manera de interactuar con el estado
  actions: {
    setUsuario(datos) {
      this.usuario = datos

      if (datos) {
        localStorage.setItem('usuario_dish', JSON.stringify(datos))
      } else {
        localStorage.removeItem('usuario_dish')
      }
    },
  },
})
