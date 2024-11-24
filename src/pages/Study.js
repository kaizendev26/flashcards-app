import { getSessionUser } from "../utils/auth";
import $ from "../utils/getSelectorDOM";
import { getHash, navigate } from "../utils/getHash";
import { getCardsForReview, saveChangeStudy } from "../utils/deckDetail";
import reviewCard from "../utils/sm2";

import {theme} from "../utils/theme";

let cardsForReview = [],
  currentCardReview = [],
  cardsFiltered = [],
  currentDeckId = 0,
  cardsInDeck = null,
  sessionStudy = null,
  cardsStudied = 0;

const study = async () => {
  resetGlobalVariables();

  const { userId } = getSessionUser();

  $("#app").get().classList.remove("pt-12");

  const currentRoute = getHash();
  currentDeckId = currentRoute.split("?")[1];
  cardsForReview = await getCardsForReview(userId, currentDeckId);
  currentCardReview = cardsForReview[0];
  cardsInDeck = sessionStudy == "start" ? cardsInDeck : cardsForReview.length;
  sessionStudy = "start";

  return `
          ${headerStudy(cardsInDeck)}
          ${viewFrontCard(currentCardReview)}
          ${modalEndStudy()}
         `;
};

export default study;

const headerStudy = (cardsInDeck) => {
  return `
      <div class="flex justify-between items-center py-2 px-3 bg-base-100">
        <a id="buttonCancelStudy" class="cursor-pointer"><i class="fa-solid fa-xmark text-xl"></i></a>
        <a href="javascript:;" class="progress-number">0/${cardsInDeck}</a>
        <a id="buttonSettings"><i class="fa-solid fa-ellipsis-vertical text-2xl"></i></a>
      </div>
      <progress class="study-progress progress progress-success w-full" value="" max="${cardsInDeck}"></progress>`;
};

const viewFrontCard = (cardToStudy) => {
  const { cardId, front, back, dueDate } = cardToStudy;
  return `
      <div class="section-study text-center">
        <div class="studyCard ml-2 mr-2 pt-6 mb-3 ${theme().studyContainer} h-[70vh] rounded-lg flex flex-col justify-items-start items-center">
          <div class="front mb-2">
            <p class="text-2xl">${front}</p>
          </div>
          <div class="back pt-2 border-t-2 w-[75%] hidden">
            <p class="text-2xl">${back}</p>
          </div>
        </div>
        <span class="tapToShow font-semibold text-lg">Tap to show answer</span>
      </div>
      <div class="section-rate flex mb-4" style="display:none;">
        <button class="buttonRate btn btn-error flex-1 m-2" value="0">Again</button>
        <button class="buttonRate btn btn-warning flex-1 m-2" value="2">Hard</button>
        <button class="buttonRate btn btn-info flex-1 m-2" value="3">Good</button>
        <button class="buttonRate btn btn-success flex-1 m-2" value="4">Easy</button>
      </div>
  `;
};

const updateOrderOfCards = (cards) => {
  const now = new Date();

  // // Filtra las cartas cuya fecha de revisión es menor o igual a la fecha actual
  // const cardsFiltered = cards.filter((card) => card.dueDate <= now);

  // // Ordena las cartas en orden ascendente por la fecha de revisión
  // cardsFiltered.sort((a, b) => a.dueDate - b.dueDate);

  const filteredCards = cards
    .filter((card) => !card.dueDate || card.dueDate <= now)
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

  return filteredCards;
};
const nextCardToStudy = (filteredCards) => {
  cardsStudied = cardsStudied <= cardsInDeck ? cardsStudied + 1 : 0;
  currentCardReview = filteredCards[0];
  console.log(cardsStudied);
  //header
  $(".progress-number").get().innerHTML = `${cardsStudied}/${cardsInDeck}`;
  $(".study-progress").get().value = cardsStudied;
  // section study
  if (filteredCards == 0) return;

  $(".front p").get().textContent = currentCardReview.front;
  $(".back p").get().textContent = currentCardReview.back;
  $(".back").get().classList.add("hidden");
  $(".tapToShow").get().classList.remove("hidden");
  $(".section-rate").get().style.display = "none";
};

const studyCard = async (grade) => {
  if (sessionStudy == "end") return;

  reviewCard(currentCardReview, grade);
  cardsFiltered = updateOrderOfCards(cardsForReview);
  nextCardToStudy(cardsFiltered);

  if (cardsFiltered == 0) {
    sessionStudy = "end";
    // end study

    console.log(cardsForReview);
    const response = await saveChangeStudy(cardsForReview);
    if (response == "success") $("#modalEndStudy").get().showModal();
  }
};

const cancelStudy = async () => {
  // filter only qualified cards
  const qualifiedCards = cardsForReview.filter(
    (card) => "difficultyId" in card
  );

  console.log(qualifiedCards);
  const response = await saveChangeStudy(qualifiedCards);
  if (response == "success") {
    resetGlobalVariables();
    navigate(`#/deck?${currentDeckId}`);
    // window.location.href = `#/deck?${currentDeckId}`;
  }
};

const resetGlobalVariables = () => {
  (cardsForReview = []),
    (currentCardReview = []),
    (cardsFiltered = []),
    (cardsInDeck = null),
    (sessionStudy = null),
    (cardsStudied = 0);
};

$(".studyCard").on("click", (e) => {
  $(".tapToShow").get().classList.add("hidden");
  $(".back").get().classList.remove("hidden");
  $(".section-rate").get().style.display = "flex";
});

$(".section-rate button").on("click", (e) => {
  let grade = parseInt(e.value);
  studyCard(grade);
});

$(".buttonEndStudy").on("click", (e) => {
  navigate(`#/decks`);
  // window.location.href = `#/decks`;
});

$("#buttonCancelStudy").on("click", (e) => {
  e.innerHTML = `<span class="loading loading-spinner loading-xs"></span>`;
  const buttons = [...$(".section-rate button").all()];

  buttons.forEach((button) => {
    button.setAttribute("disabled", "disabled");
  });

  cancelStudy();
});

const modalEndStudy = () => {
  return `
      <dialog id="modalEndStudy" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box modal-box-sm">
          <span class="text-6xl">🎉</span>
          <h3 class="text-lg font-bold mt-2">AMAZING</h3>
          <p class="pt-4">You have studied ${cardsInDeck} cards, continue like this</p>
          <small class="mb-4">more cards will appear soon</small>
          <button class="buttonEndStudy btn btn-info">Continue</button>
        </div>
      </dialog>
  `;
};
