import axios from 'axios';

//funciones con lo que queremos get post...
export default {
  // recuperarId: ,
  login: async (correo, contraseña) => axios.post('http://localhost:8080/login', { correo, contraseña }),
  registro: async (usuario) => axios.post('http://localhost:8080/usuarios', usuario),
}

