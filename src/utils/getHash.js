const getHash = () =>
  location.hash.slice(1).toLocaleLowerCase().split("/")[1] || "/";

function navigate(route) {
  if (window.location.hash !== route) {
    window.location.hash = route;
  } else {
    // Si el hash no cambió, forzamos el evento manualmente
    window.dispatchEvent(new Event("hashchange"));
  }
}

export { getHash, navigate };
