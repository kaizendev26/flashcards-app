import { getSessionUser } from "../utils/auth";
import $ from "../utils/getSelectorDOM";
import { getHash, navigate } from "../utils/getHash";
import {
  hasDeck,
  getDeckDetail,
  getCardsByDeck,
  hasCardsToReview,
  getNextReviewDate,
  getCardsForToday,
  deleteCard
} from "../utils/deckDetail";

import {theme} from "../utils/theme";
// const thm = theme()

let currentDeckId = 0;
let currentCardsInDeck = 0;
let currentCardId = 0

const Deck = async () => {
  const currentRoute = getHash();
  currentDeckId = currentRoute.split("?")[1];

  localStorage.removeItem("cardEdit")

  const { userId } = getSessionUser();
  const deckExist = await hasDeck(userId, currentDeckId);
  if (deckExist === 0) {
    navigate("#/error404");
    return;
  }

  const deck = await getDeckDetail(userId, currentDeckId);

  const deckDetail = deck[0];
  if (deckDetail.cardsInDeck == 0) {
    return emptyDeck(deckDetail);
  } else {
    return deckWithCards(deckDetail);
  }
};

const emptyDeck = async (_deck) => {
  const { deck, message } = _deck;
  return `
<div id="deck" class="container pl-4 pr-4 pt-12  wipe-in-left">
  <h3 class="mt-1 font-semibold">${deck}</h3>
  <div id="deckDetail" class="min-h-screen flex justify-center items-center">
    <div class="empty flex flex-col justify-center gap-1">
      <p class="font-semibold">${message}</p>
      <button class="btn btn-neutral btnAddCard">Add</button>
    </div>
  </div>
</div>
`;
};

{
  /* <div class="radial-progress" style="--value:0; --size:6rem; --thickness: 4px;" role="progressbar">
  0%
</div> */
}

{
  /* <button class="btn buttonStartStudy btn-info w-[90%]">Study cards</button> */
}

const deckWithCards = async (_deck) => {
  const { deck, cardsInDeck, toReview, notStudied } = _deck;
  currentCardsInDeck = cardsInDeck;
  return `
<div class="container pl-4 pr-4 pt-14  wipe-in-left">
  <h3 class="mt-1 font-semibold">${deck}</h3>
  <div id="deckDetail" class="flex flex-col mt-4">
    <span class="text-sm font-semibold">Cards for today</span>
    <section class="study-cards flex flex-col justify-center items-center mb-4 mt-2">

      ${await hasCardsForReview()}

    </section>

    <section class="statistics">
      <small class="text-sm mb-1 font-semibold">Cards in deck (${cardsInDeck})</small>
      <progress class="progress progress-success w-full" value="${toReview}" max="${cardsInDeck}"></progress>
      <div class="flex gap-4 w-full mt-2">
        <div class="flex items-center gap-2">
          <span class="bg-success h-2 w-4 rounded"></span>
          <small>${toReview} To review</small>
        </div>
        <div class="flex items-center gap-2">
          <span class="${theme().colorNotStudied} h-2 w-4 rounded"></span>
          <small>${notStudied} Not Studied</small>
        </div>
      </div>
    </section>

    <section class="cards mt-5">
      ${await cardList()}
    </section>
  </div>

  <div class="sticky inset-x-0 bottom-0 flex justify-center">
    <button class="btn btnAddCard  btn-info mb-4">
      Add card
    </button>
  </div>

  ${modalOptionsCard()}
  ${modalDeleteCard()}

</div>
`;
};

{
  /* <button class="btn btn-info fixed bottom-4 left-1/2 transform -translate-x-1/2">
Add card
</button> */
}

const cardList = async (pageInit = 1) => {
  const { userId } = getSessionUser();
  const cards = await getCardsByDeck(userId, currentDeckId, pageInit);


  return cards
    .map(
      (card) =>
        `
<div class="mb-2 card rounded-lg ${theme().bgColor} ${theme().border}" data-rowNumber="${card.rowNumber}" data-cardId="${card?.cardId}">
  <div class="card-body p-3">
    <div class="flex justify-between">
      <small class="font-semibold text-info">${card?.timeUntil}</small>
      <a class="cardOptions cursor-pointer" data-cardId="${card?.cardId}"><i class="fa-solid fa-ellipsis-vertical"></i></a>
    </div>
    <div class="">
      <p class="front">${card?.front}</p>
      <small class="back text-sm">${card?.back}</small>
    </div>
  </div>
</div>`
    )
    .join("");
};

const hasCardsForReview = async () => {
  const { userId } = getSessionUser();
  const { cardsForReview } = await hasCardsToReview(userId, currentDeckId);

  if (cardsForReview == 0) {
    return empyCardsForReview();
  } else {
    const { cardsToReview, notStudied, cardsForToday } = await getCardsForToday(
      userId,
      currentDeckId
    );

    const progressColor =
      cardsForToday == notStudied ? "text-gray-400" : "text-success";

    let percentage = (cardsToReview * 100) / cardsForToday;
    percentage = cardsForToday == notStudied ? 100 : percentage;

    return `
    <div class="radial-progress text-2xl ${progressColor}" style="--value:${percentage}; --size:6rem; --thickness: 6px;"
      role="progressbar">
      <span class="${theme().textProgress} font-semibold">${cardsForToday}</span>
    </div>
    <div class="cardsForToday p-2 w-[90%] my-3 rounded-2xl text-center ${theme().bgColor} ${theme().border} flex flex-row justify-evenly">
      <div class="flex flex-col">
        <span class="text-sm">${notStudied}
          <i class="fa-solid fa-lock"></i>
        </span>
        <span class="text-sm">Not Studied</span>
      </div>
      <div class="flex flex-col">
        <span class="text-sm">${cardsToReview}
          <i class="fa-solid fa-clipboard-check" style="color:#22c55e;"></i>
        </span>
        <span class="text-sm">To Review</span></span>
      </div>
    </div>
    <button class="btn buttonStartStudy btn-info w-[90%]">Study cards</button>
`;
  }
};

const empyCardsForReview = async () => {
  const { userId } = getSessionUser();
  const time = await getNextReviewDate(userId, currentDeckId);

  return `
<div class="emptyCardsForReview ${theme().colorNotStudied} ${theme().border} p-5 rounded-lg flex justify-center flex-col items-center text-center">
  <i class="fa-regular fa-circle-check text-3xl" style="color:#22c55e;"></i>
  <h2 class="text-xl mt-2 font-semibold ">that's all for the moment</h2>
  <span class="text-sm text-gray-400">you'll have more cards to practice ${time}</span>
</div>
`;
};

const modalOptionsCard = ()=>{
  return `
        <dialog id="modalOptionsCard" class="modal modal-bottom sm:modal-middle">
          <div class="modal-box">
            <section class="">
              <ul>
                  <li class="editCard cursor-pointer active:text-slate-400 bg-base-200 rounded-lg p-2 mt-4">
                      <div class="flex flex-row justify-between items-center">
                          <span>Edit</span>
                          <i class="fa-solid fa-angle-right text-1xl hover:bg-inherit"></i>
                      </div>
                  </li>
                  <li class="optionDeleteCard cursor-pointer active:text-red-300 text-red-500 bg-base-200 rounded-lg p-2 mt-4">
                      <div class="flex flex-row justify-between items-center ">
                          <span class="">Delete</span>
                          <i class="fa-solid fa-angle-right text-1xl  hover:bg-inherit"></i>
                      </div>
                  </li>
              </ul>
          </section>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      `
}

const modalDeleteCard = ()=> {
  return `<dialog id="modalDeleteCard" class="modal">
            <div class="modal-box">
              <p class="py-4">Are you sure you want to delete the card?</p>
              <div class="modal-action">
                  <form method="dialog" class="flex">
                      <button class="btn btn-sm btn-neutral w-[95px] mr-1">Cancel</button>
                      <button class="btn btn-sm btn-error w-[95px] buttonDeleteCard" type="button">Delete</button>
                  </form>
              </div>
            </div>
          </dialog>`
}


// window.addEventListener("", async () => {
//   if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
//     // console.log("¡Has llegado al final de la página!");

//     const lastCard = $(".cards .card").all();
//     const lastCardIndex = lastCard[lastCard.length - 1].dataset.rownumber;
//     // console.log(lastCardIndex);

//     // se incrementa + 1 para obtener el index de la carta que sigues despues de la ultima
//     const pageInit = parseInt(lastCardIndex) + 1;

//     const listOfNextCards = await cardList(pageInit);
//     const cardContainer = $(".cards").get();
//     cardContainer.innerHTML += listOfNextCards; // agregar el siguiente grupo de cartas
//   }
// });

const callback = async (entries, observer) => {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      const lastCardIndex = entry.target.dataset.rownumber;
      const pageInit = parseInt(lastCardIndex) + 1;

      // significa que ya se trajeron todas las cartas en el mazo
      if (pageInit > currentCardsInDeck) {
        observer.disconnect();
        return;
      }

      const listOfNextCards = await cardList(pageInit);
      const cardContainer = $(".cards").get();

      entry.target.insertAdjacentHTML(
        "afterend",
        loading(".loadingCards", "loading-sm")
      );

      setTimeout(() => {
        const loadingCards = entry.target.nextElementSibling;
        loadingCards.remove();
        cardContainer.innerHTML += listOfNextCards;
      }, 500);
    }
  });
};

const options = {
  root: document,
  rootMargin: "0px",
  threshold: 0.5,
};

let mutationObserver = new MutationObserver((mutationRecords) => {
  let element = $(".cards").get();
  // console.log(element);
  if (element != null) {
    let lastCard = element.querySelectorAll(".card");
    lastCard = lastCard[lastCard.length - 1];
    // console.log(lastCard);
    observer.observe(lastCard);
  }
});

const observer = new IntersectionObserver(callback, options);

mutationObserver.observe($("#app").get(), {
  childList: true,
  subtree: true,
});

export default Deck;

const loading = (idClass, size) => {
  return `<div class="${idClass} text-center">
            <span class="loading loading-spinner ${size}"></span>
         </div>`;
};

$(".buttonStartStudy").on("click", (e) => {
  e.innerHTML = `<span class="loading loading-spinner loading-md"></span> Study cards`;
  navigate(`#/study?${currentDeckId}`);
  // window.location.href = `#/study?${currentDeckId}`;
});

$(".btnAddCard").on("click", (e) => {
  navigate(`#/addcard?${currentDeckId}`);
  // window.location.href = `#/addcard?${currentDeckId}`;
});

$(".cardOptions").on("click", (e) => {
  currentCardId = e.dataset.cardid
  $("#modalOptionsCard").get().showModal();
});

$(".editCard").on("click", (e) => {

  const currentCard = $(`[data-cardid="${currentCardId}"]`).get()
  const front = currentCard.querySelector(".front").innerHTML
  const back = currentCard.querySelector(".back").innerHTML

  const cardJSON = {
    cardId: currentCardId,
    front,
    back,
  }

  localStorage.setItem("cardEdit", JSON.stringify(cardJSON))

  navigate(`#/editcard?${currentDeckId}`);
});

$(".optionDeleteCard").on("click", (e) => {
  $("#modalOptionsCard").get().close();
  $("#modalDeleteCard").get().showModal();
});

$(".buttonDeleteCard").on("click", async (e) => {
  try {
    const {userId} = getSessionUser()
    e.innerHTML = `<span class="loading loading-spinner loading-xs"></span> Delete`;
    const {success,message} = await deleteCard(userId,currentDeckId,currentCardId)
    if(success){
      $("#modalDeleteCard").get().close()
      $("#app").get().innerHTML = await Deck() // reload the deck
    }
    else console.log(message)

  } catch (error) {
    console.log(error)
  }finally{
    e.innerHTML = "Delete"
  }

  
})