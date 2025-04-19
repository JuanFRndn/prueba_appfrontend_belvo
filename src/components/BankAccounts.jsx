// Componente BankAccounts.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BankAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigation = useNavigate();

  const linkId = useMemo(
    () => location.state?.linkId,
    [location.state?.linkId]
  );

  const selectedBank = useMemo(
    () => location.state?.selectedBank,
    [location.state?.selectedBank]
  );

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/accounts?link_id=${linkId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al obtener cuentas");
      }

      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const returnToBanks = () => navigation("/banks");
  useEffect(() => {
    if (linkId) fetchAccounts();
    else returnToBanks();
  }, [linkId]);

  if (loading) return <div className="loading-indicator">Cargando...</div>;
  if (error)
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchAccounts();
          }}
          className="retry-button"
        >
          Reintentar
        </button>
      </div>
    );

  return (
    <div className="accounts-section">
      <h3>Cuentas de {selectedBank}</h3>
      <ul className="account-list">
        {accounts.results.length == 0 && (
          <div className="loading-indicator">No se encontraron resultados!</div>
        )}
        {accounts.results.map((account) => (
          <li key={account.id} className="account-item">
            <div className="account-header">
              <h4>{account.name}</h4>
              <span className="account-type">{account.type}</span>
            </div>
            <div className="account-balance">
              {account.balance?.available?.toLocaleString()} {account.currency}
            </div>
            <button
              onClick={() =>
                navigation("/transactions", {
                  state: {
                    selectedBank: selectedBank,
                    selectedAcount: account.name,
                    linkId: linkId,
                    accountId: account.id,
                  },
                })
              }
              className="connect-button"
            >
              Ver Transacciones
            </button>
          </li>
        ))}
      </ul>
      <button className="back-button" onClick={returnToBanks}>
        Volver a bancos
      </button>
    </div>
  );
}
export default BankAccounts;
