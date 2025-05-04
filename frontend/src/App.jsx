import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/header/Naviagtion";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateProject from "./components/project/CreateProject";
import ShowProjects from "./components/project/ShowProjects";
import ShowTasks from "./components/Task/ShowTasks";

function App() {

  return (
    <BrowserRouter>
      <header>
        <Navigation />
      </header>

      <main>
        <Routes>
          <Route path='/' element={<CreateProject />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/show-projects' element={<ShowProjects />} />
          <Route path='/show-tasks/:id' element={<ShowTasks />} />

        </Routes>
      </main>

      <footer></footer>
    </BrowserRouter>
  )
}

export default App
