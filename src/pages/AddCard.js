import { getSessionUser } from "../utils/auth";
import $ from "../utils/getSelectorDOM";
import { getHash } from "../utils/getHash";
import { addCard } from "../utils/deckDetail";

let front = false,
  back = false;

const NewCard = () => {
  const currentRoute = getHash();
  const currentDeckId = currentRoute.split("?")[1];

  const view = `               
                 <div class="addCard mx-4 pt-14">
                 
                    <div class="front">
                    <div class="label text-left">
                        <span class="label-text">Front side</span>
                    </div>
                    <input type="text" placeholder="Front" class="input input-bordered w-full inputCardFront" />
                    </div>
                    <div class="back mb-4">
                    <div class="label text-left">
                        <span class="label-text">Back side</span>
                    </div>
                    <input type="text" placeholder="Back" class="input input-bordered w-full inputCardBack" />
                    </div>

                    <button disabled=disabled class="btn btn-neutral w-full buttonAddCard">Add</button>
                 </div>`;

  return view;
};

export default NewCard;

$(".inputCardFront").on("input", (e) => {
  const buttonAdd = $(".buttonAddCard").get();
  if (e.value.trim() != "") {
    front = true;
    if (back) {
      buttonAdd.removeAttribute("disabled");
    }
    return;
  }
  front = false;
  buttonAdd.setAttribute("disabled", "disabled");
});

$(".inputCardBack").on("input", (e) => {
  const buttonAdd = $(".buttonAddCard").get();
  if (e.value.trim() != "") {
    back = true;
    if (front) {
      buttonAdd.removeAttribute("disabled");
    }
    return;
  }
  back = false;
  buttonAdd.setAttribute("disabled", "disabled");
});



$(".buttonAddCard").on("click", async (e) => {
  $(".buttonAddCard").get().setAttribute("disabled", "disabled");
  const currentRoute = getHash();
  const currentDeckId = currentRoute.split("?")[1];
  const {userId} = getSessionUser()

  const inputFront = $(".inputCardFront").get();
  const inputBack = $(".inputCardBack").get();

  const { lastIdCardAdded } = await addCard(
    userId,
    currentDeckId,
    inputFront.value.trim(),
    inputBack.value.trim()
  );

  if (lastIdCardAdded >= 0) {
    inputFront.value = "";
    inputBack.value = "";
    back = false;
    front = false;

    const checked = $(".status").get()
    checked.classList.remove("opacity-0", "invisible");
    checked.classList.add("opacity-100");
    setTimeout(() => {
      checked.classList.add("opacity-0", "invisible");
      checked.classList.remove("opacity-100");
    },1000)

  }
});
