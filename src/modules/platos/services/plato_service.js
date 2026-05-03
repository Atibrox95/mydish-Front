import axios from "axios";

const API_URL = 'http://localhost:8080/platos';

export default {
  // POST
  crearPlato: async (plato) => axios.post(API_URL, plato),

  // GET
  recuperarPlatos: async (idUsuario) => axios.get(API_URL, {
    params: { idUsuario }
  }),

  // PUT
  actualizarPlatos: async (id, plato) => axios.put(`${API_URL}/${id}`, plato),

  // DELETE
  borrarPlato: async (id) => axios.delete(`${API_URL}/${id}`)
}
