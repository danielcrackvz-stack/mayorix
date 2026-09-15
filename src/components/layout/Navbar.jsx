import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">Mayorix</Link>

        <nav className="navbar-links">
          {currentUser ? (
            <>
              <Link to="/mis-productos">Mis productos</Link>
              <Link to="/publicar" className="btn btn-primary">Publicar producto</Link>
              <Link to="/mensajes">Mensajes</Link>
              <button onClick={logout} className="navbar-link-btn">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login">Ingresar</Link>
              <Link to="/registro" className="btn btn-outline">Crear cuenta</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}