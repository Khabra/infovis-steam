import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import LandingPage from './Pages/LandingPage/LandingPage'
import Navbar from './Components/Navbar/Navbar'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Navbar/>
      <Routes>
        <Route path={"/"} element={<LandingPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
