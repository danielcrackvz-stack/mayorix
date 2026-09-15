import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(email, password, name, phone);
      navigate("/");
    } catch (err) {
      setError("No se pudo crear la cuenta. Verifica los datos e intenta de nuevo.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2>Crear cuenta en Mayorix</h2>
      {error && <p style={{ color: "var(--amber)", fontSize: "0.9rem" }}>{error}</p>}

      <input className="field" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} required />
      <input className="field" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <input className="field" type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="field" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />

      <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Registrarme</button>

      <p style={{ fontSize: "0.9rem", marginTop: "1rem", textAlign: "center" }}>
        ¿Ya tienes cuenta? <Link to="/login" style={{ color: "var(--teal-dark)" }}>Iniciar sesión</Link>
      </p>
    </form>
  );
}