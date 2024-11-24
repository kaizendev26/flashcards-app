import { getHash, navigate } from "../utils/getHash";
import resolveRoutes from "../utils/resolveRoutes";
import { getSessionUser } from "../utils/auth";
import $ from "../utils/getSelectorDOM";

const routes = {
  login: "/",
  decks: "/decks",
  deck: "/deck:id",
  deckConfig : "/deck.config:id",
  addCard: "/addcard:id",
  editCard: "/editcard:id",
  study: "/study:id",
  user: "/user",
  error404: "error404",
};

const Header = async () => {
  const hash = getHash();
  const route = resolveRoutes(hash);

  const deckId = hash.split("?")[1];

  let settings = "";
  switch (route) {
    case routes.decks:
      settings = settingsUser();
      break;
    case routes.deck:
      let route = `#/deck.config?${deckId}`
      settings = `${Back("#/decks")} ${buttonSettings(route)}`;
      break;
    case routes.addCard:
      settings = `${newCard()} <span class="status text-success text-2xl invisible transition-opacity duration-300 opacity-0"><i class="fa-solid fa-check"></i></span>`;
      break;
      case routes.editCard:{
        let backRoute = `#/deck?${deckId}`
        settings = `${Back(backRoute)} ${tittle("Edit cards")} ${buttonSettings("javascript:;")}`;
        break;
      }
    case routes.user:
      settings = `${Back("#/decks")} ${tittle("Settings")} ${buttonSettings("javascript:;")}`;
    break;
    case routes.deckConfig:
      let backRoute = `#/deck?${deckId}`
      settings = `${Back(backRoute)} ${tittle("Configuration")} ${buttonSettings("javascript:;")}`;
      break;
    default:
      settings = Back("#/decks");
      break;
  }

  if (route == routes.study || route == routes.login) {
    return ""
  }

  return `
          <div class="flex justify-between items-center mb-12 bg-base-100 py-2 px-3 border-b  
          fixed top-0 left-0 w-full z-50 shadow-md">
              ${settings}
          </div>
          `;
  
};

const settingsUser = () => {

  const {userName} = getSessionUser()

    return `<div class="avatar placeholder userSettings cursor-pointer">
              <div class="bg-info text-white w-8 rounded-full">
                  <span class="text-xs">${userName?.slice(0,1).toUpperCase()}</span>
              </div>
           </div>
           ${buttonSettings("javascript:;")}
           `
};

const Back = (page) => {
  return `<a id="buttonBack" href="${page}"><i class="fa-solid fa-arrow-left text-2xl"></i></a>`;
};

const tittle = (tittle)=>{
  return `<span class="">${tittle}</span>`
}

const buttonSettings = (page) => {
  return `<a id="buttonSettings" href="${page}"><i class="fa-solid fa-ellipsis-vertical text-2xl"></i></a>`;
}

const newCard = () => {
  const currentRoute = getHash();
  const deckId = currentRoute.split("?")[1];

  return `<a id="buttonBack" href="#/deck?${deckId}"><i class="fa-solid fa-arrow-left text-2xl"></i></a>
          <span class="">Add cards</span>
          `;
};


export default Header;
