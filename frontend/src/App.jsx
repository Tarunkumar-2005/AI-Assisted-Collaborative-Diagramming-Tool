// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import DrawShape from "./components/DrawShape";
import Gallery from "./components/Gallery";
function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/:userid" element={<DrawShape />} />
          <Route path="/gallery/:userId" element={<Gallery />} />
        </Routes>
    </Router>
  );
}

export default App;
