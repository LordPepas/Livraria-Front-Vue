import http from "../../public/plugins/axios";

export default {
  read: () => {
    return http.get("editoras");
  },
  create: (editora) => {
    return http.post("editora", editora);
  },
  update: (editora) => {
    return http.put("editora/", editora);
  },
  delete: (editora) => {
    return http.delete("editora", { data: editora });
  },
};
