import React ,{useState}from "react";
import {useNavigate} from "react-router-dom"
import axios from "axios"
import { localStorageSetItem } from "../../utils/storage";

export default function LoginPage() {
    const navigate = useNavigate();
    const [userDetails, SetUserDetails] = useState({
        password : "",
        email : ""
    })
    const [errorMsg,setErrorMsg] = useState("")

    const handleInputEvents = (data) => {
        // console.log("data---------",data)
        SetUserDetails((prev) => ({...prev,[data.name]: data.value}))
    }

    const handleSubmit = async () => {
        console.log("userDetails------",userDetails)
        try{
            let payload = {
                "email" : userDetails.email,
                "password" : userDetails.password

            }
            let userData = await axios.post("http://localhost:4000/api/auth/login",payload)

            console.log("userDetails--------",userData)
            if(userData.data.jwtToken){
                localStorageSetItem("TOKEN",userData.jwtToken)
                navigate("/postDetails")
            }else{
                setErrorMsg(userData.data.message)
            }

        }catch(err){
            console.log("err-------------",err)
            setErrorMsg("Sorry try again later")
        }
    }

    return(
        <>
            <input type="text" placeholder="Email" name="email" value={userDetails?.name} onChange={(e) => handleInputEvents(e.target)} required/>
             <input type="password" placeholder="Password" name="password" value={userDetails.password} onChange={(e) => handleInputEvents(e.target)} required/>

             <button onClick={handleSubmit}>Submit</button>
             <p onClick={() => navigate("/register")}>Don't have an account</p>
             <span>{errorMsg}</span>
        </>
    )
}