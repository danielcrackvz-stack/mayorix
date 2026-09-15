import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import PublishProduct from "./pages/PublishProduct";
import Messages from "./pages/Messages";
import SellerProducts from "./pages/SellerProducts";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/publicar" element={<PublishProduct />} />
          <Route path="/mensajes" element={<Messages />} />
          <Route path="/mensajes/:chatId" element={<Messages />} />
          <Route path="/mis-productos" element={<SellerProducts />} />
        </Routes>
      </div>
    </>
  );
}

export default App;