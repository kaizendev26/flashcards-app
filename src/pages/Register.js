import $ from "../utils/getSelectorDOM";
import { getHash, navigate } from "../utils/getHash";
import { register,getSessionUser } from "../utils/auth";

const Register = () => {

  const view = `<div class="login pt-12 mx-4">
                    <h1 class="text-2xl text-center mb-3">FLASHCARDS APP</h1>
                    <h2 class="mb-4">Register</h2>
                    <div class="username relative">
                        <div class="label text-left">
                            <span class="label-text">User name</span>
                        </div>
                        <input type="text" required placeholder="" 
                        class="input input-bordered w-full inputUsername " />
                          <div class="absolute label hidden errorInputUsername m-0 p-0">
                            <span class="label-text-alt text-error"></span>
                          </div>
                    </div>
                    <div class="email relative mt-3">
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
                    <a href="#/" class="link link-info link-hover text-sm">Sign In</a>

                    <div class="absolute">
                      <span class="relative label-text-alt text-error errorRegister"></span>
                    </div>
                    <button class="btn btn-neutral w-full buttonRegister mt-6">Sign Up</button>
              </div>`;

  return view;
};

export default Register;

function validateEmail(email) {
  const regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

$(".buttonRegister").on("click", async(e) => {
  const username = $(".inputUsername").get(); 
  const email = $(".inputEmail").get(); 
  const password = $(".inputPassword").get();

  if (validateFormRegister(username,email, password)) {
    e.innerHTML = `<span class="loading loading-spinner loading-md"></span> Sign Up`;
    try {
      const result = await register(username.value.trim(),email.value.trim(), password.value.trim());
      if (!result.success) {
        const { error } = JSON.parse(result.message);
        $(".errorRegister").get().innerHTML = error;
        return;
      }

      navigate("#/decks");
      
    } catch (error) {
      console.log(error);
    }
    finally{
      e.innerHTML = "Sign Up";
    }
  } 
});

const validateFormRegister = (username,email, password) => {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  const errorUsername = $(".errorInputUsername").get();
  const errorEmail = $(".errorInputEmail").get();
  const errorPassword = $(".errorInputPassword").get();

  let isValid = true;

  if (usernameValue != "") {
    errorUsername.classList.add("hidden");
    username.classList.remove("input-error");
  } else {
    errorUsername.classList.remove("hidden");
    username.classList.add("input-error");
    errorUsername.querySelector("span").innerHTML = "Enter a user name";
    isValid = false;
  }

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
