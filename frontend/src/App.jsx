import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login/loginPage.jsx'
import Register from './pages/login/register.jsx'
import ProtectedRoutes from "./routes/ProtectedRoutes"
import PostDetails from "./pages/postDetails/details.jsx" 
// import './App.css'
// import 

function App() {

  return (
   <>
    <Routes>
      <Route path="/" element={<LoginPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route element={<ProtectedRoutes/>}>
          <Route path="/postDetails" element={<PostDetails/>}/>
      </Route>
      <Route path="/postDetails" element={<PostDetails/>}/>

    </Routes>

   </>
  )
}

export default App
