import http from "../plugins/axios";

export default {
  create: (usuario) => {
    return http.post("usuario", usuario);
  },
  read: () => {
    return http.get("usuarios");
  },
  update: (usuario) => {
    return http.put("usuario/", usuario);
  },
  delete: (usuario) => {
    return http.delete("usuario", { data: usuario });
  },
};
