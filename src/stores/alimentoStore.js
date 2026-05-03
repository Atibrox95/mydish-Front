import { defineStore } from 'pinia'

export const useAliemntoStore = defineStore('Alimento', {
  state: () => ({
    alimento: ''
  }),

  actions: {
    setAlimento(playload) {
      this.alimento = playload;
    }
  }
});
