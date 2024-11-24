import { baseUrl } from "./api";
import { navigate } from "./getHash";

// const baseUrl = api;

const getDecks = async (userId) => {
  try {
    const response = await fetch(`${baseUrl}/decks/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getDeck = async (idDeck) => {
  try {
    const response = await fetch(`${baseUrl}/?idDeck=${idDeck}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const addNewDeck = async (userId, deck) => {
  const headers = {
    "content-type": "application/json",
  };

  try {
    const response = await fetch(`${baseUrl}/decks`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        userId,
        deck,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const importDeck = async (userId, deck, csv) => {
  const headers = {
    "content-type": "application/json",
  };

  try {
    const response = await fetch(`${baseUrl}/decks/import`, {
      method: "POST",
      headers,
      body: JSON.stringify({ userId, deck, csv }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export { getDecks, getDeck, addNewDeck, importDeck };
