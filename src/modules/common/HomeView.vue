<script setup>
import { useUsuarioStore } from '../../stores/usuarioStore'
const userStore = useUsuarioStore()
const isLoggedIn = userStore.usuario
const nombreUsuario = userStore.usuario?.nombre
</script>

<template>
  <div class="main-container flex flex-center">
    <div class="background-wrapper">
      <img src="FondoAlimentos.svg" class="bg-image" />
    </div>

    <div class="content-card q-pa-xl">
      <div>
        <div v-if="!isLoggedIn" class="column q-gutter-y-md">
          <q-btn
            class="btn-inicioSesión btn-font boton-glass"
            label="Iniciar Sesión"
            to="/login"
            rounded
            size="lg"
            no-caps
            unelevated
          />
          <q-btn
            class="btn-registro btn-font boton-secundario-glass"
            color="white"
            text-color="black"
            label="Crear cuenta nueva"
            rounded
            size="lg"
            to="/registro"
            no-caps
            unelevated
          />
        </div>
        <div v-else class="text-bienvenida-container q-mb-sm">
          <div v-if="userStore.usuario?.nombre" class="text-wrapper">
            <div class="frase-bienvenida">
              <span class="text-white">Hola, </span>
              <span class="nombre-usuario">{{ nombreUsuario }}</span>
              <span class="text-white">, bienvenid@ </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: customfont;
  src: url(./fonts/customfont.woff);
}

.text-bienvenida-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}

.text-wrapper {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.text-white {
  color: #ffffff;
}

.nombre-usuario {
  color: #d1b3ff;
  font-weight: 800;
  text-transform: uppercase;
}

.logo-mydish {
  width: 130px;
  height: auto;
  margin-left: 4px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.boton-glass {
  background: rgba(103, 58, 183, 0.7) !important;
  backdrop-filter: blur(4px);
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.boton-glass:hover {
  background: linear-gradient(45deg, #673ab7, #9c27b0) !important;
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(103, 58, 183, 0.4);
  border-color: rgba(255, 255, 255, 0.5);
  opacity: 1 !important;
}

.boton-glass:active {
  transform: scale(0.98);
}

.boton-secundario-glass {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(2px);
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s ease;
}

.boton-secundario-glass:hover {
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.4), rgba(209, 196, 233, 0.4)) !important;
  color: #f3e5f5 !important;
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}

.btn-font {
  font-family:
    'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-weight: bolder;
}

.main-container {
  height: 100vh;
  overflow: hidden;
  position: relative;
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

.content-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  padding: 60px 40px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.btn-hover:hover,
.btn-hover-white:hover {
  transform: translateY(-3px);
  transition: transform 0.3s ease;
}
</style>
