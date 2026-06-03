import "./index.css";
import Home from "./pages/home";
import ToDoDetails from "./pages/toDoDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todos/:id" element={<ToDoDetails />} />
      </Routes>
    </Router>
  );
}

export default App;