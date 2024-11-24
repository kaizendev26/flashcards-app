import { getSessionUser } from "../utils/auth";
import { getDecks, addNewDeck, importDeck } from "../utils/deck";
import { navigate } from "../utils/getHash";
import $ from "../utils/getSelectorDOM";
import { readFile, validateTypeFileInput } from "../utils/csv";
import { theme } from "../utils/theme";

let csvFile = null;

const Decks = async () => {
const { userId } = getSessionUser();
const decks = await getDecks(userId);

let listOfDecks = ""

if(decks.length <= 0) {
 listOfDecks = `
      <div class="flex justify-center text-center items-center h-screen">
        <div class="text-1xl text-gray-600">
          You don't have any decks yet. <br>
          Click on the button below to add a new deck.
        </div>
      </div>
    `;
}else{
  listOfDecks = `
          <ul class="bg-base-100 sm:bg-base-200 rounded-lg">
            ${decks.map((deck,i) =>{
              const border = decks.length == i + 1 ? "sm:border-none border-b" : "border-b"
              
              return `<li data-id="${deck.deckId}" class=" deckItem p-3 ${border} ">
                <div class="p-1 flex items-center justify-between active:text-gray-600 
                ${theme().hoverBackground} sm:hover:rounded-md sm:hover:p-1">
                  <div>
                    <h2 class="text-base font-semibold">${deck.deck}</h2>
                    <small class="">
                      ${
                        deck.cardsInDeck > 0
                        ? `Cards for study: ${deck.cardsInDeck}`
                        : "Not cards yet"
                      }
                    </small>
                  </div>
                  <a href="javascript:;" class="">
                    <i class="fa-solid fa-angle-right text-xl" aria-hidden="true"></i>
                  </a>
                </div>
              </li>`
            }).join("")}
          </ul>
  `
}

return `
        <div class="sm:pt-16 pt-12 mb-2 pb-5">
          ${listOfDecks}
        </div>

      <button onclick="modalAddDeck.showModal()" class="btn btn-circle btn-lg fixed bottom-4 right-4 z-50">
        <i class="fa-solid fa-plus"></i>
      </button>
      ${await modalDeck()}
      ${await errorFile()}
      ${await erroNewDeck()}
      ${await fileEmpty()}
      `;

};
export default Decks;

const modalDeck = async () => {
const view = `
<dialog id="modalAddDeck" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-2xl">✕</button>
    </form>
    <h3 class="text-lg font-bold text-center mb-2">New deck</h3>
    <div class="formNewDeck">
      <div role="tablist" class="tabs tabs-boxed">
        <a role="tab" class="tab tab-active optionAddDeck">Create</a>
        <a role="tab" class="tab  optionImportDeck">Import</a>
      </div>
      <label class="form-control w-full mt-1 formDeck">
        ${await formNewDeck()}
      </label>
    </div>
  </div>
</dialog>
`;

return view;
};

const formNewDeck = async () => {
const view = `
<div class="label">
  <span class="label-text">Write the name of your deck</span>
</div>
<input type="text" placeholder="Name of deck.." class="input input-bordered w-full inputNewDeck" />
<div class="label messageErrorNameDeck">
</div>
<button class="btn btn-neutral w-full buttonAddDeck">Create deck</button>
`;
return view;
};

const formImportDeck = async () => {
const view = `
<div class="label">
  <span class="label-text">upload a .csv file with all cards</span>
</div>
<input type="file" id="inputFileImportDeck" class="file-input file-input-bordered file-input-md w-full" />
<div class="label messageErrorFile text-sm text-red-600">
</div>
<button class="btn btn-neutral w-full buttonImportDeck">Import deck</button>

`;
return view;
};

const errorFile = async () => {
const view = `
<dialog id="modalErrorDeck" class="modal">
  <div class="modal-box">
    <p class="py-4">
      <i class="fa-solid fa-triangle-exclamation" style="color: #f74040;"></i>
      Incorrect file type, you need to upload a .csv file
    </p>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
`;
return view;
};

const erroNewDeck = async () => {
const view = `
<dialog id="modalErrorDeckInput" class="modal">
  <div class="modal-box">
    <p class="py-4">
      <i class="fa-solid fa-triangle-exclamation" style="color: #f74040;"></i>
      You need a name deck first
    </p>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
`;
return view;
};

const fileEmpty = async () => {
const view = `
<dialog id="modalErrorDeckFile" class="modal">
  <div class="modal-box">
    <p class="py-4">
      <i class="fa-solid fa-triangle-exclamation" style="color: #f74040;"></i>
      You need to upload a .csv file valid first
    </p>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
`;
return view;
};

// show between create an empty deck or import a list of cards
$(".optionAddDeck").on("click", async (tabAdd) => {
csvFile = null;
let tabImport = $(".optionImportDeck").get();

tabAdd.classList.add("tab-active");
tabImport.classList.remove("tab-active");

$(".formDeck").get().innerHTML = await formNewDeck();
});
$(".optionImportDeck").on("click", async (tabImport) => {
let tabAdd = $(".optionAddDeck").get();

tabImport.classList.add("tab-active");
tabAdd.classList.remove("tab-active");

$(".formDeck").get().innerHTML = await formImportDeck();
});

$("#inputFileImportDeck").on("change", async (e) => {
const file = e.files[0];
const { name, type } = file;

csvFile = null;
if (validateTypeFileInput(file)) {
csvFile = {
deck: name,
csv: await readFile(file),
};
} else {
$("#modalErrorDeck").get().showModal();
}
});

$(".buttonAddDeck").on("click", async (e) => {
try {
e.innerHTML = `<span class="loading loading-spinner loading-md"></span> Create deck`;
const deck = $(".inputNewDeck").get().value;

if (deck && deck.trim() != "") {
const { userId } = getSessionUser();
const response = await addNewDeck(userId, deck);
if (response) {
$("#app").get().innerHTML = await Decks();
}
} else {
$("#modalErrorDeckInput").get().showModal();
}
} catch (error) {
} finally {
e.innerHTML = `Create deck`;
}
});

$(".buttonImportDeck").on("click", async (e) => {
try {
e.innerHTML = `<span class="loading loading-spinner loading-md"></span> Import deck`;

if (csvFile == null) return $("#modalErrorDeckFile").get().showModal();
const { deck, csv } = csvFile;
// console.log(csv);

const { userId } = getSessionUser();
const response = await importDeck(userId, deck, csv);
console.log(response);
if (response) {
$("#app").get().innerHTML = await Decks();
}
} catch (error) {
console.log(error);
} finally {
e.innerHTML = `Import deck`;
}
});

$(".deckItem").on("click", async (e) => {
const idDeck = e.dataset.id;
navigate(`#/deck?${idDeck}`);

});


$(".userSettings").on("click",()=>{
navigate('#/user')
})