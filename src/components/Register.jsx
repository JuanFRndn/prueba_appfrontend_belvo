import { useState } from "react";
import { registerUser } from "../api/auth";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(username, password);
      setMessage("¡Usuario registrado exitosamente!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Registrar cuenta</h2>
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
        <button type="submit">Crear cuenta</button>
      </form>
      <p>
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
      </p>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
