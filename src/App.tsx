import "./index.css";
import Home from "./pages/home";
import ToDoDetails from "./pages/toDoDetails";
import { BrowserRouter as Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todos/:id" element={<ToDoDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;