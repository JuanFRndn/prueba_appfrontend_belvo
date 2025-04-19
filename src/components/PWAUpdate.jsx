import { useRegisterSW } from "virtual:pwa-register/react";

export function PWAUpdate() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registrado:", r);
    },
    onRegisterError(error) {
      console.log("Error en registro SW:", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className="pwa-update" role="alert">
      {(offlineReady || needRefresh) && (
        <div className="pwa-update-banner">
          {offlineReady ? (
            <span>App lista para trabajar offline</span>
          ) : (
            <span>
              Nueva versión disponible!
              <button onClick={() => updateServiceWorker(true)}>
                Actualizar
              </button>
            </span>
          )}
          <button onClick={close}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

export default PWAUpdate;
