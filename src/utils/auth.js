import { baseUrl } from "./api";

const login = async (email, password) => {
  const headers = {
    "content-type": "application/json",
  };

  try {
    const response = await fetch(`${baseUrl}/user/login`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const user = await response.json();
    if (user) {
      localStorage.setItem("sessionUser", JSON.stringify(user));
      return { success: true, user };
    } else {
      throw new Error("User invalid");
    }
  } catch (error) {
    // console.error(error);
    return { success: false, message: error.message };
  }
};

const register = async (username, email, password) => {
  const headers = {
    "content-type": "application/json",
  };

  try {
    const response = await fetch(`${baseUrl}/user/register`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const user = await response.json();
    if (user) {
      localStorage.setItem("sessionUser", JSON.stringify(user));
      return { success: true, user };
    } else {
      return { success: false, message: error.message };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

function getSessionUser() {
  const userData = localStorage.getItem("sessionUser");

  if (!userData) return null;

  try {
    const user = JSON.parse(userData);
    return user;
  } catch (error) {
    console.error("Error parsing session data:", error);
    localStorage.removeItem("sessionUser");
    return null;
  }
}

export { login, register,getSessionUser };
