import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token"); // Verifica si hay token

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token
    navigate("/login"); // Redirige al login
  };

  return (
    <header className="header">
      <Link to="/Login" className="header_logo">
        <h2>PWA APP</h2>
      </Link>

      <nav className="header_nav">
        {isAuthenticated && (
          <button className="header_logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        )}
      </nav>
    </header>
  );
};
