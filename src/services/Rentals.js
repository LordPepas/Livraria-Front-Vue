import http from "../plugins/axios";

export default {
  create: (aluguel) => {
    return http.post("/aluguel", aluguel);
  },
  read: () => {
    return http.get("alugueis");
  },
  update: (aluguel) => {
    return http.put("/aluguel", aluguel);
  },
  delete: (aluguel) => {
    return http.delete("aluguel", { data: aluguel });
  },
};
