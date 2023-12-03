import axios from "axios";

const http = axios.create({
  baseURL: "https://livraria-api-linux.altislabtech.com.br/swagger-ui.html/api/",
});

export default http;
