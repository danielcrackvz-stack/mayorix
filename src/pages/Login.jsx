import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2>Iniciar sesión</h2>
      {error && <p style={{ color: "var(--amber)", fontSize: "0.9rem" }}>{error}</p>}

      <input className="field" type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="field" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />

      <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Ingresar</button>

      <p style={{ fontSize: "0.9rem", marginTop: "1rem", textAlign: "center" }}>
        ¿No tienes cuenta? <Link to="/registro" style={{ color: "var(--teal-dark)" }}>Crear cuenta</Link>
      </p>
    </form>
  );
}