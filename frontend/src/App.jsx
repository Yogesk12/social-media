import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login/loginPage.jsx'
import Register from './pages/login/register.jsx'
import ProtectedRoutes from "./routes/ProtectedRoutes"
import PostDetails from "./pages/postDetails/details.jsx" 
import './App.css'
// import 

function App() {

  return (
   <>
    <Routes>
      <Route path="/" element={<Navigate to={localStorage.getItem('TOKEN') ? '/feed' : '/login'} replace/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route element={<ProtectedRoutes/>}>
          <Route path="/feed" element={<PostDetails/>}/>
          <Route path="/postDetails" element={<PostDetails/>}/>
      </Route>
      <Route path="*" element={<Navigate to="/" replace/>}/>

    </Routes>

   </>
  )
}

export default App
