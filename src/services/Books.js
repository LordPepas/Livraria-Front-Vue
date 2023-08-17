import http from "../plugins/axios";

export default {
  read: () => {
    return http.get("/livros");
  },
  create: (livro) => {
    return http.post("/livro", livro);
  },
  update: (livro) => {
    return http.put("/livro/", livro);
  },
  delete: (livro) => {
    return http.delete("livro", { data: livro });
  },
};
