import http from "../../public/plugins/axios";

export default {
  read: () => {
    return http.get("usuarios");
  },
  create: (usuario) => {
    return http.post("usuario", usuario);
  },
  update: (usuario) => {
    return http.put("usuario/", usuario);
  },
  delete: (usuario) => {
    return http.delete("usuario", { data: usuario });
  },
};
