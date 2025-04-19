import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function BankList() {
  // Estados para bancos
  const [banks, setBanks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total: 0,
  });

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 1. Obtener lista de bancos
  const fetchBanks = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const responseLinks = await fetch(
        `${import.meta.env.VITE_API_URL}/api/links?page=${page}&page_size=${
          pagination.page_size
        }`
      );

      if (!responseLinks.ok) {
        const errorData = await responseLinks.json();
        throw new Error(errorData.detail || `Error ${responseLinks.status}`);
      }

      const dataLinks = await responseLinks.json();

      try {
        const responseBanks = await fetch(
          `${import.meta.env.VITE_API_URL}/api/banks`
        );

        const dataBanks = await responseBanks.json();
        const data = dataLinks.data.map((link) => {
          const bank =
            dataBanks.data.find((bank) => {
              return bank.name === link.institution;
            }) ?? {};
          return {
            ...link,
            bank_details: bank,
          };
        });

        const enrichmentDataLinks = { ...dataLinks, data };

        if (!Array.isArray(enrichmentDataLinks?.data)) {
          throw new Error("Formato de respuesta inválido");
        }

        setBanks(enrichmentDataLinks.data);
        setPagination({
          page: enrichmentDataLinks.pagination?.page || page,
          page_size:
            enrichmentDataLinks.pagination?.page_size || pagination.page_size,
          count: data.pagination?.count,
        });
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks(pagination.page);
  }, []);

  const totalPages = Math.ceil(pagination.count / pagination.page_size);

  return (
    <div className="bank-list-container">
      <h2>
        Bancos{" "}
        {pagination.total > 0 && `(Página ${pagination.page} de ${totalPages})`}
      </h2>

      {loading ? (
        <div className="loading-indicator">Cargando...</div>
      ) : error ? (
        <div className="error-message">
          <p>Error: {error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchBanks(pagination.page);
            }}
            className="retry-button"
          >
            Reintentar
          </button>
        </div>
      ) : (
        // 1. Lista de bancos
        <>
          {banks.length == 0 && (
            <div className="loading-indicator">
              No se encontraron resultados!
            </div>
          )}
          <ul className="bank-list">
            {banks.map((bank) => (
              <li key={bank.id} className="bank-item">
                <div className="bank-info">
                  <span className="bank-name">
                    {bank.bank_details?.display_name}
                  </span>
                  <span className="bank-country">
                    {bank.bank_details?.country_code}
                  </span>
                </div>
                <button
                  onClick={() =>
                    navigate("/accounts", {
                      state: {
                        selectedBank: bank.bank_details.display_name,
                        linkId: bank.id,
                      },
                    })
                  }
                  className="connect-button"
                >
                  Ver cuentas
                </button>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                onClick={() => fetchBanks(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="pagination-button"
              >
                Anterior
              </button>
              <span className="page-info">
                Página {pagination.page} de {totalPages}
              </span>
              <button
                onClick={() => fetchBanks(pagination.page + 1)}
                disabled={pagination.page >= totalPages}
                className="pagination-button"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BankList;
