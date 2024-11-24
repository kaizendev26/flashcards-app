import { getSessionUser } from "../utils/auth";
import $ from "../utils/getSelectorDOM";
import { getHash, navigate } from "../utils/getHash";

const UserConfig = ()=>{

const {userName,email} = getSessionUser()

const view = `<div class="pt-12 mx-4 flex flex-col">
    <section class="header mt-4 flex flex-col items-center gap-1 bg-base-200 rounded-box p-4">
        <div class="avatar placeholder">
            <div class="bg-info text-white w-12 rounded-full">
                <span class="">${userName?.slice(0,1).toUpperCase()}</span>
            </div>
        </div>
        <span>${userName}</span>
        <span>${email}</span>
    </section>
    <section class="configurations bg-base-200 rounded-box p-4 mt-4">
        <ul>
            <li class="active:text-slate-400">
                <div class="flex flex-row justify-between items-center">
                    <span>Update password</span>
                    <i class="fa-solid fa-angle-right text-2xl hover:bg-inherit"></i>
                </div>


            </li>
        </ul>

    </section>
    <select class="mode select select-bordered w-full mt-2">
        <option disabled selected>Mode</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
    </select>
    <a href="javascript:;" class="logout p-5 mt-8 text-center"><i class="fa-solid fa-arrow-right-from-bracket"></i>
        Logout</a>

</div>`

return view
}

export default UserConfig


$(".logout").on("click",()=>{
    localStorage.removeItem("sessionUser");
    navigate('#/')
})

$(".mode").on("change",(e)=>{
    const mode = e.value
    localStorage.setItem("theme",mode)
    $("html").get().setAttribute("data-theme",mode)
})