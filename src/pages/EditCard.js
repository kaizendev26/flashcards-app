import { getSessionUser } from "../utils/auth";
import $ from "../utils/getSelectorDOM";
import { getHash, navigate } from "../utils/getHash";
import { editCard } from "../utils/deckDetail";
import Swal from "sweetalert2";

let front = false,
  back = false;

const EditCard = () => {
  const currentRoute = getHash();
  const currentDeckId = currentRoute.split("?")[1];

  const {cardId,front,back} = JSON.parse(localStorage.getItem("cardEdit"))



  const view = `               
                 <div class="addCard mx-4 pt-14">
                 
                    <div class="front">
                    <div class="label text-left">
                        <span class="label-text">Front side</span>
                    </div>
                    <input type="text" placeholder="Front" value="${front}" class="input input-bordered w-full inputEditCardFront" />
                    </div>
                    <div class="back mb-4">
                    <div class="label text-left">
                        <span class="label-text">Back side</span>
                    </div>
                    <input type="text" placeholder="Back" value="${back}" class="input input-bordered w-full inputEditCardBack" />
                    </div>

                    <button data-cardid="${cardId}" class="btn btn-neutral w-full buttonEditCard">Edit</button>
                 </div>`;

  return view;
};

export default EditCard;

$(".inputEditCardFront").on("input", (e) => {
  const buttonEdit = $(".buttonEditCard").get();
  if (e.value.trim() != "") {
    front = true;
    if (back) {
        buttonEdit.removeAttribute("disabled");
    }
    return;
  }
  front = false;
  buttonEdit.setAttribute("disabled", "disabled");
});

$(".inputEditCardBack").on("input", (e) => {
  const buttonEdit = $(".buttonEditCard").get();
  if (e.value.trim() != "") {
    back = true;
    if (front) {
        buttonEdit.removeAttribute("disabled");
    }
    return;
  }
  back = false;
  buttonEdit.setAttribute("disabled", "disabled");
});



$(".buttonEditCard").on("click", async (e) => {
  e.innerHTML = `<span class="loading loading-spinner loading-md"></span> Edit`;
  $(".buttonEditCard").get().setAttribute("disabled", "disabled");
  const currentRoute = getHash();
  const currentDeckId = currentRoute.split("?")[1];
  const {userId} = getSessionUser()

  const inputFront = $(".inputEditCardFront").get();
  const inputBack = $(".inputEditCardBack").get();

  const cardId = e.dataset.cardid
  console.log(cardId);

  try {
    const response = await editCard(
      userId,
      currentDeckId,
      cardId,
      inputFront.value.trim(),
      inputBack.value.trim()
    );
  
    if (response) {
      // localStorage.removeItem("cardEdit");
      Swal.fire({
        icon: "success",
        title: "Card updated successfully",
        showConfirmButton: true,
        // timer: 1000
      });
    }
    
  } catch (error) {
    console.log(error);
  }
  finally{
    e.innerHTML = "Edit";
    $(".buttonEditCard").get().removeAttribute("disabled");
  }

  
});
