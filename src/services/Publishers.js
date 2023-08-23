import http from "../plugins/axios";

export default {
  create: (editora) => {
    return http.post("editora", editora);
  },
  read: () => {
    return http.get("editoras");
  },
  update: (editora) => {
    return http.put("editora/", editora);
  },
  delete: (editora) => {
    return http.delete("editora", { data: editora });
  },
};
