import React from "react";
import { localStorageGetItem } from "../utils/storage";
import {Navigate,Outlet} from "react-router-dom"

export default function ProtectedRoutes(){
    let token = localStorageGetItem("TOKEN")

    if(!token){
        return <Navigate to="/login" replace/>
    }
    
    return <Outlet/>
}
