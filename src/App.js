import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Switch from "./pages/Switch";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/switch" element={<Switch />} />
      </Routes>
    </BrowserRouter>
  );
}
