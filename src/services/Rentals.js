import http from "../../public/plugins/axios";

export default {
  read: () => {
    return http.get("alugueis");
  },
  create: (aluguel) => {
    return http.post("/aluguel", aluguel);
  },
  update: (aluguel) => {
    return http.put("/aluguel", aluguel);
  },
  delete: (aluguel) => {
    return http.delete("aluguel", { data: aluguel });
  },
};
