import "./src/styles/styles.css";
import "./main.css";
import router from "./src/routes";

window.addEventListener("load", router);
window.addEventListener("hashchange", router);
