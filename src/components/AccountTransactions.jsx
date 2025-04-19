// Componente BankAccounts.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AccountTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total: 0,
  });

  const linkId = useMemo(
    () => location.state?.linkId,
    [location.state?.linkId]
  );

  const selectedBank = useMemo(
    () => location.state?.selectedBank,
    [location.state?.selectedBank]
  );

  const selectedAccount = useMemo(
    () => location.state?.selectedAccount,
    [location.state?.selectedAccount]
  );

  const accountId = useMemo(
    () => location.state?.accountId,
    [location.state?.accountId]
  );

  const fetchTransactions = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/transactions?page=${page}&page_size=${
          pagination.page_size
        }&link=${linkId}&account=${accountId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Error al obtener las transacciones de la cuenta"
        );
      }

      const data = await response.json();
      setTransactions(data);
      setPagination({
        page: data.pagination?.page || page,
        page_size: data.pagination?.page_size || pagination.page_size,
        count: data.pagination?.count,
      });
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const returnToAccounts = () =>
    navigate("/accounts", {
      state: {
        selectedBank: selectedBank,
        linkId: linkId,
      },
    });
  useEffect(() => {
    if (linkId) fetchTransactions(pagination.page);
    else returnToAccounts();
  }, [linkId]);

  const totalPages = Math.ceil(pagination.count / pagination.page_size);

  if (loading) return <div className="loading-indicator">Cargando...</div>;
  if (error)
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchTransactions(pagination.page);
          }}
          className="retry-button"
        >
          Reintentar
        </button>
      </div>
    );

  return (
    <div className="Transactions-section">
      <h3>
        Transacciones de la {selectedAccount} de {selectedBank}
        <p>KPI: {transactions.account_flows.net_balance}</p>
        <p>TOTAL INFLOWS: {transactions.account_flows.total_inflows}</p>
        <p>TOTAL OUTFLOWS: {transactions.account_flows.total_outflows}</p>
        {pagination.total > 0 && `(Página ${pagination.page} de ${totalPages})`}
      </h3>
      <ul className="account-list">
        {transactions.data.length == 0 && (
          <div className="loading-indicator">No se encontraron resultados!</div>
        )}
        {transactions.data.map((transaction) => (
          <li key={transaction.id} className="account-item">
            <div className="account-header">
              <h4>{transaction.description}</h4>
              <span className="account-type">{transaction.type}</span>
            </div>
            <div className="account-balance contenedor-tabla">
              <table className="tabla-estilizada">
                <thead>
                  <tr>
                    <th>Monto</th>
                    <th>Balance</th>
                    <th>Moneda</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{transaction.amount?.toLocaleString()}</td>
                    <td>{transaction.balance?.toLocaleString()}</td>
                    <td>{transaction.currency}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>
        ))}
      </ul>
      <button className="back-button" onClick={returnToAccounts}>
        Volver a bancos
      </button>
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => fetchTransactions(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="pagination-button"
          >
            Anterior
          </button>
          <span className="page-info">
            Página {pagination.page} de {totalPages}
          </span>
          <button
            onClick={() => fetchTransactions(pagination.page + 1)}
            disabled={pagination.page >= totalPages}
            className="pagination-button"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
export default AccountTransactions;
