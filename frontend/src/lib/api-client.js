import axios from "axios"
const apiClient=axios.create({
    baseURL:"http://localhost:3001/api",
    headers:{
        "Content-Length":"application/json"
    }
})
export default apiClient;