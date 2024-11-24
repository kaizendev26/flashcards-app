import { getSessionUser } from "../utils/auth";
import $ from "../utils/getSelectorDOM";
import { getHash, navigate } from "../utils/getHash";
import { resetProgress,deleteDeck } from "../utils/deckDetail";

const DeckConfig = ()=>{

    
    const view = `<div class="pt-12 mx-4 flex flex-col">
        <section class="configurations">
            <ul>
                <li class="active:text-slate-400 bg-base-200 rounded-lg p-2 mt-4 optionResetProgress">
                    <div class="flex flex-row justify-between items-center">
                        <span>Reset progress</span>
                        <i class="fa-solid fa-angle-right text-1xl hover:bg-inherit"></i>
                    </div>
                </li>
                <li class="optionDeleteDeck active:text-red-300 text-red-500 bg-base-200 rounded-lg p-2 mt-4">
                    <div class="flex flex-row justify-between items-center ">
                        <span class="">Delete deck</span>
                        <i class="fa-solid fa-angle-right text-1xl  hover:bg-inherit"></i>
                    </div>
                </li>
            </ul>
    
        </section>
    
    </div>
    ${modalResetProgress()}
    ${modalDeleteDeck()}
    `
    
    return view
}

export default DeckConfig;


$(".optionResetProgress").on("click",(button) => {
    $("#modalResetProgress").get().showModal();
})

$(".buttonResetProgress").on("click",async(button) => {
    button.innerHTML = `<span class="loading loading-spinner loading-xs"></span> Reset`;
    try {

            const {userId} = getSessionUser();
            const deckId = getHash().split("?")[1];
            const response = await resetProgress(userId,deckId);
            if(response){
               navigate(`#/deck?${deckId}`)
            }
        
    } catch (error) {
        console.log(error);
    }
    finally{
        button.innerHTML = "Reset";
    }
})

$(".optionDeleteDeck").on("click", async(button) => {
    $("#modalDeleteDeck").get().showModal();
})


$(".buttonDeleteDeck").on("click",async(button) => {
    button.innerHTML = `<span class="loading loading-spinner loading-xs"></span> Delete`;
    try {

            const {userId} = getSessionUser();
            const deckId = getHash().split("?")[1];
            const response = await deleteDeck(userId,deckId);
            if(response){
               navigate(`#/decks`)
            }
        
    } catch (error) {
        console.log(error);
    }
    finally{
        button.innerHTML = "Delete"
    }
})


const modalResetProgress = () => {
    return `
            <dialog id="modalResetProgress" class="modal modal-bottom sm:modal-middle">
                <div class="modal-box">
                    <p class="py-4">Are you sure you want to restart all your study progress?</p>
                    <small class="text-gray-500">The cards will go to Not Studied status.</small></br>
                    <small class="text-gray-500">This action cannot be undone.</small>
                    <div class="modal-action">
                    <form method="dialog" class="flex">
                        <button class="btn btn-sm btn-neutral w-[90px] mr-1">Cancel</button>
                        <button class="btn btn-sm btn-error w-[90px] buttonResetProgress" type="button">Reset</button>
                    </form>
                    </div>
                </div>
            </dialog>`
} 

const modalDeleteDeck = () => {
    return `
            <dialog id="modalDeleteDeck" class="modal sm:modal-middle">
                <div class="modal-box">
                    <p class="py-4">Are you sure you want to delete the deck?</p>
                    <small class="text-gray-500">All your cards going to be deleted.</small></br>
                    <small class="text-gray-500">This action cannot be undone.</small>
                    <div class="modal-action">
                    <form method="dialog" class="flex">
                        <button class="btn btn-sm btn-neutral w-[95px] mr-1">Cancel</button>
                        <button class="btn btn-sm btn-error w-[95px] buttonDeleteDeck" type="button">Delete</button>
                    </form>
                    </div>
                </div>
            </dialog>`
} 


