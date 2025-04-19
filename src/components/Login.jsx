import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Inicializa el hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser(username, password);
      localStorage.setItem("token", result.access_token); // si devuelves un token
      navigate("/banks");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Iniciar sesion</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
      <p>
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </p>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
