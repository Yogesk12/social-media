import axios from "axios"


export const api = axios.create({
    baseURl : "https://localhost:4000/api",
    headers : {
        "Content-Type" : "application/json"
    }
});


