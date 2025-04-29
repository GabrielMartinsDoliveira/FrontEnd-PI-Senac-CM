// Esse arquivo vem do CRA (cra-template-pwa)

const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
      // [::1] é o localhost em IPv6.
      window.location.hostname === "[::1]" ||
      // 127.0.0.0/8 são endereços localhost IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/
      )
  );
  
  export function register(config) {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) return;
  
      window.addEventListener("load", () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          checkValidServiceWorker(swUrl, config);
          navigator.serviceWorker.ready.then(() => {
            console.log("App está sendo servido por um service worker (localhost).");
          });
        } else {
          registerValidSW(swUrl, config);
        }
      });
    }
  }
  
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                console.log("Novo conteúdo está disponível; recarregue a página.");
                if (config && config.onUpdate) config.onUpdate(registration);
              } else {
                console.log("Conteúdo está armazenado em cache para uso offline.");
                if (config && config.onSuccess) config.onSuccess(registration);
              }
            }
          };
        };
      })
      .catch((error) => {
        console.error("Erro ao registrar service worker:", error);
      });
  }
  
  function checkValidServiceWorker(swUrl, config) {
    fetch(swUrl, {
      headers: { "Service-Worker": "script" },
    })
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf("javascript") === -1)
        ) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log("Sem conexão com a internet. App em modo offline.");
      });
  }
  
  export function unregister() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  }
  