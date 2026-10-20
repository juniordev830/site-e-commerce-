import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="entrar" element={<Login />} />
        <Route path="cadastro" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
