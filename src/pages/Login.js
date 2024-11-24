import $ from "../utils/getSelectorDOM";
import { getHash, navigate } from "../utils/getHash";
import { login,getSessionUser } from "../utils/auth";

const Login = () => {
  const user = getSessionUser();
  if (user) navigate("#/decks");

  const view = `<div class="login pt-12 mx-4">
                    <h1 class="text-2xl text-center mb-3">FLASHCARDS APP</h1>
                    <div class="email relative">
                        <div class="label text-left">
                            <span class="label-text">Email</span>
                        </div>
                        <input type="email" required placeholder="example@email.com" 
                        class="input input-bordered w-full inputEmail " />
                          <div class="absolute label hidden errorInputEmail m-0 p-0">
                            <span class="label-text-alt text-error">error email</span>
                          </div>
                    </div>
                    <div class="password relative mb-5 mt-3">
                        <div class="label text-left">
                            <span class="label-text">Password</span>
                        </div>
                        <input type="password" required placeholder="Enter a password"
                            class="input input-bordered w-full inputPassword" />
                         <div class="absolute label hidden errorInputPassword m-0 p-0">
                            <span class="label-text-alt text-error">error password</span>
                        </div>
                    </div>
                    <div class="flex flex-row justify-between">
                    <a href="#/register" class="link link-info link-hover text-sm">Or Sign Up</a>
                    <a href="#/forgot" class="link link-info link-hover text-sm">Forgot your password?</a>
                    </div>
                    
                    <div class="absolute">
                      <span class="relative label-text-alt text-error errorLogin"></span>
                    </div>
                    
                    <button class="btn btn-neutral w-full buttonLogin mt-6">Sign In</button>
              </div>`;

  return view;
};

export default Login;

function validateEmail(email) {
  const regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

$(".buttonLogin").on("click", async (e) => {
  const email = $(".inputEmail").get();
  const password = $(".inputPassword").get();
  if (validateFormLogin(email, password)) {
    e.innerHTML = `<span class="loading loading-spinner loading-md"></span> Sign In`;
    console.log("..login");
    try {
      const result = await login(email.value.trim(), password.value.trim());
      if (!result.success) {
        const { error } = JSON.parse(result.message);
        $(".errorLogin").get().innerHTML = error;
        return;
      }

      navigate("#/decks");
    } catch (error) {
      console.log(error);
    } finally {
      e.innerHTML = "Sign In";
    }
  }
});

const validateFormLogin = (email, password) => {
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  const errorEmail = $(".errorInputEmail").get();
  const errorPassword = $(".errorInputPassword").get();

  let isValid = true;

  if (emailValue != "") {
    if (validateEmail(emailValue)) {
      errorEmail.classList.add("hidden");
      email.classList.remove("input-error");
    } else {
      email.classList.add("input-error");
      errorEmail.classList.remove("hidden");
      errorEmail.querySelector("span").innerHTML = "Email invalid";
      isValid = false;
    }
  } else {
    errorEmail.classList.remove("hidden");
    email.classList.add("input-error");
    errorEmail.querySelector("span").innerHTML = "Enter an email";
    isValid = false;
  }

  if (passwordValue != "") {
    errorPassword.classList.add("hidden");
    password.classList.remove("input-error");
  } else {
    errorPassword.classList.remove("hidden");
    password.classList.add("input-error");
    errorPassword.querySelector("span").innerHTML = "Enter a password";
    isValid = false;
  }

  return isValid;
};
