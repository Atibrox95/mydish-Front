import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog } from 'quasar'

// Estilos de Quasar
import 'quasar/dist/quasar.css' // <-- ESTA LÍNEA ES VITAL

// Iconos
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/mdi-v5/mdi-v5.css'

import App from './App.vue'
import router from './router/routes'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog
  },
  config: {
    notify: {
      position: 'top',
      timeout: 2500,
      textColor: 'white'
    },
    iconSet: 'mdi-v5',
  } // Todo Aquí  añadir plugins de Quasar como Notify o Dialog
})

app.mount('#app')
