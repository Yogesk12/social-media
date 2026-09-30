import React from "react";
import { localStorageGetItem } from "../utils/storage";
import {Outlet} from "react-router-dom"

export default function ProtectedRoutes(){
    let token = localStorageGetItem("TOKEN")

    if(!token){
        return <Navigation to="/login" replace/>
    }
    
    return <Outlet/>
}