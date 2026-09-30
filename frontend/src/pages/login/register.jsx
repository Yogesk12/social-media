import React, {useState} from "react";
import {useNavigate} from "react-router-dom"
import axios from "axios"

export default function Register(){
    const navigate = useNavigate();
    const [userDetails, SetUserDetails] = useState({
        name : "",
        password : "",
        email : ""
    })
    const [errorMsg,setErrorMsg] = useState("")
    

    const handleInputEvents = (data) => {
        console.log("data---------",data)
        SetUserDetails((prev) => ({...prev,[data.name]: data.value}))
    }

    const handleSubmit = async() => {
        try{
            console.log("register-------",userDetails)
            let payload = {
                "name" : userDetails.name,
                "email" : userDetails.email,
                "password" : userDetails.password

            }
            console.log("payload----",payload)
            let userResp = await axios.post("http://localhost:4000/api/auth/register",payload)

            console.log("userDetails--------",userResp)
            if(userResp.data.user){
                navigate("/login")
            }else{
                console.log("yes---")
                setErrorMsg(userResp.data.message)
            }

        }catch(err){
            console.log("err-------------",err)
            setErrorMsg("Sorry try again later")
        }
        
    }

    return(
        <>
            <h1>ddddd</h1>
            <input type="text" placeholder="Name" name="name" value={userDetails.name} onChange={(e) => handleInputEvents(e.target)} required/>
             <input type="text" placeholder="Email" name="email" value={userDetails?.email} onChange={(e) => handleInputEvents(e.target)} required/>
             <input type="password" placeholder="Password" name="password" value={userDetails.password} onChange={(e) => handleInputEvents(e.target)} required/>

             <button onClick={handleSubmit}>Register</button>
             <p onClick={() => navigate("/login")}>Already have an account</p>
             <span>{errorMsg}</span>
        </>
    )
}




