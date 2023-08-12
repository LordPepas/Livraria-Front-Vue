import axios from "axios";

const http = axios.create({
  baseURL: "http://wdaw.hopto.org:8185/api/",
});

export default http;
