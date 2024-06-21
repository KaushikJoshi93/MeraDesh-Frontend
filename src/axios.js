import axios from "axios";


const make_request = (token)=>{
    return (
        axios.create({
            baseURL:import.meta.env.VITE_BACKEND_URL,
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
    )
}

const userRequest = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL
})

export default make_request;
export {userRequest}
