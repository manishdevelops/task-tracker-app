import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/header/Naviagtion"
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

function App() {

  return (
    <BrowserRouter>
      <header>
        <Navigation />
      </header>

      <main>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

        </Routes>
      </main>

      <footer></footer>
    </BrowserRouter>
  )
}

export default App
