import axios, { AxiosInstance } from "axios";

let api:AxiosInstance

api = axios.create({
    baseURL: "https://crud-cadastro-simples.onrender.com/"  
})
export {api}
