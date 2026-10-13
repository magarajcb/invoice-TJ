import apiClient from "../../../lib/api-client";
export const getDashboard=async ()=>{
    const response=await apiClient.get("/dashboard")
     return response.data.data; 
}