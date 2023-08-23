import http from "../plugins/axios";

export default {
  create: (livro) => {
    return http.post("/livro", livro);
  },
  read: () => {
    return http.get("/livros");
  },
  update: (livro) => {
    return http.put("/livro/", livro);
  },
  delete: (livro) => {
    return http.delete("livro", { data: livro });
  },
};
