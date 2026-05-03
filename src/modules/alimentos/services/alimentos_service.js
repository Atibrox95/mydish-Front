import axios from 'axios';

const API_URL = 'http://localhost:8080/alimentos';
//Funciones con lo que queremos, get post....
export default {
  recuperar: async () => axios.get('http://localhost:8080/alimentos'),
  recuperarPorTipo: async (idTipo) => axios.get(`${API_URL}/tipo/${idTipo}`)

}
