import axios from 'axios'
const API_URL = 'http://localhost:8080'

export default {
  login: async (correo, contraseña) => axios.post(`${API_URL}/login`, { correo, contraseña }),
  registro: async (usuario) => axios.post(`${API_URL}/usuarios`, usuario),
  actualizar: async (idUsuario, usuario) => axios.put(`${API_URL}/usuarios/${idUsuario}`, usuario),
  borrar: async (idUsuario) => axios.delete(`${API_URL}/usuarios/${idUsuario}`),
}
