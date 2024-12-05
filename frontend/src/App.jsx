import { useState } from "react";
import Login from "./components/auth/Login";
// import Register from "./components/auth/Register-old";
import Register from "./components/auth/Register";
import HomePage from "./components/HomePage";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Sidebar />
                <HomePage />
              </>
            }
          ></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          {/* <Route path="/stepper" element={<Stepper />}></Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
