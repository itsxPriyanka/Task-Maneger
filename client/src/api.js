import axios from "axios";

const API_URL= 'https://task-master-2.onrender.com/api';

const api = axios.create({
    baseURL: API_URL
})


export default api;