import axios from "axios";

export const api = axios.create({
    baseURL: "https://crud-cadastro-simples.onrender.com/"
})