import { getSessionUser } from "../utils/auth";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Forgot from "../pages/Forgot";
import UserConfig from "../pages/user.config";
import DeckConfig from "../pages/Deck.config";
import Header from "../templates/Header";
import Decks from "../pages/Decks";
import Deck from "../pages/DeckDetail";
import NewCard from "../pages/AddCard";
import EditCard from "../pages/EditCard"
import StudyCard from "../pages/Study";
import Error404 from "../pages/Error404";
import { getHash } from "../utils/getHash";
import resolveRoutes from "../utils/resolveRoutes";

import {getThemeSaved} from "../utils/theme"

const routes = {
  "/": Login,
  "/register": Register,
  "/forgot": Forgot,
  "/user": UserConfig,
  "/deck.config:id": DeckConfig,
  "/decks": Decks, // list of decks
  "/deck:id": Deck, // deck detail (cards, progress)
  "/addcard:id": NewCard, // interface to add a new card
  "/editcard:id": EditCard, // interface to edit
  "/study:id": StudyCard, // interfaz of card study
  "/error404": Error404, // error 404
};

const router = async () => {

  getThemeSaved()

  const header = null || document.getElementById("header");
  const app = null || document.getElementById("app");

  let hash, route, render, headerContent, content;

  // validate session user
  const user = getSessionUser();
  if (user) {
    hash = getHash();
    if(hash === "/") hash = "/decks";
    route = await resolveRoutes(hash);
    render = routes[route] ? routes[route] : Error404;

    headerContent = await Header();
    content = await render();
  } else {
    // login, register and forgot
    hash = getHash();
    route = await resolveRoutes(hash);
    headerContent = "";
    render =
      route == "/register"
        ? routes[route]
        : route == "/forgot"
        ? routes[route]
        : routes["/"];

    content = await render();
  }

  // let content = (await Header()) + (await render());

  header.innerHTML = headerContent;
  app.innerHTML = content;
};

export default router;
