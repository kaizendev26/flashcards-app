import { baseUrl } from "./api";

// const baseUrl = api;

const getDeckDetail = async (userId, deckId) => {
  try {
    const response = await fetch(`${baseUrl}/deckDetail/${userId}/${deckId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const hasDeck = async (userId, deckId) => {
  try {
    const response = await fetch(`${baseUrl}/has/deck/${userId}/${deckId}`);
    const { exist } = await response.json();
    return parseInt(exist);
  } catch (error) {
    console.log(error);
  }
};

const getCardsByDeck = async (userId, deckId, pageInit = 1) => {
  try {
    const response = await fetch(
      `${baseUrl}/deck/cards-by-deck/${userId}/${deckId}/${pageInit}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getCardsForToday = async (userId, deckId) => {
  try {
    const response = await fetch(
      `${baseUrl}/deck/cards-for-today/${userId}/${deckId}`
    );
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.log(error);
  }
};

const getCardsForReview = async (userId, deckId) => {
  try {
    const response = await fetch(
      `${baseUrl}/study/review-cards/${userId}/${deckId}`
    );
    const data = await response.json();
    return data.map((card) => {
      return {
        ...card,
        dueDate: card.dueDate != null ? new Date(card.dueDate) : null,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

const hasCardsToReview = async (userId, deckId) => {
  try {
    const response = await fetch(
      `${baseUrl}/has/cards-for-review/${userId}/${deckId}`
    );
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.log(error);
  }
};

const getNextReviewDate = async (userId, deckId) => {
  try {
    const response = await fetch(
      `${baseUrl}/deck/next-review-date/${userId}/${deckId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const saveChangeStudy = async (cards) => {
  const headers = {
    "content-type": "application/json",
  };

  try {
    const response = await fetch(`${baseUrl}/study/cards/update`, {
      method: "POST",
      headers,
      body: JSON.stringify({ cards }),
    });
    const { result } = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const addCard = async (userId, deckId, front, back) => {
  const headers = {
    "content-type": "application/json",
  };

  try {
    const response = await fetch(`${baseUrl}/deckDetail/add-card`, {
      method: "POST",
      headers,
      body: JSON.stringify({userId, deckId, front, back }),
    });
    const result = await response.json();

    return result[0];
  } catch (error) {
    console.log(error);
  }
};

const editCard = async (userId, deckId,cardId,front,back) => {
  const headers = {
    "content-type": "application/json",
  };

  try {
    const response = await fetch(`${baseUrl}/deck-detail/card/edit-card`, {
      method: "PUT",
      headers,
      body: JSON.stringify({userId, deckId,cardId,front,back}),
    });
    const result = await response.json();

    if (result) return true

    return false;
  } catch (error) {
    console.log(error);
  }
};

const deleteCard = async (userId, deckId,cardId) => {
  const headers = {
    "content-type": "application/json",
  };

  try {
    const response = await fetch(`${baseUrl}/deck-detail/card/delete-card`, {
      method: "PUT",
      headers,
      body: JSON.stringify({userId, deckId,cardId}),
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result) return {success: true, message: "Deleted card"};

    return {success: false, message: "something went wrong"};
  } catch (error) {
    console.log(error);
    return {success: false, message: error.message};
  }
};

const deleteDeck = async (userId, deckId) => {
  const headers = {
    "content-type": "application/json",
  };

  try {
    const response = await fetch(`${baseUrl}/deck-detail/delete-deck`, {
      method: "PUT",
      headers,
      body: JSON.stringify({userId, deckId}),
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result) return {success: true, message: "Deleted deck"};

    return {success: false, message: "something went wrong"};
  } catch (error) {
    console.log(error);
    return {success: false, message: error.message};
  }
};

const resetProgress = async (userId, deckId) => {
  const headers = {
    "content-type": "application/json",
  };

  try {
    const response = await fetch(`${baseUrl}/deck-config/reset-progress`, {
      method: "POST",
      headers,
      body: JSON.stringify({userId, deckId}),
    });
    const result = await response.json();

    const {success} = result[0]
    if(success === "success") return true

    return false;
  } catch (error) {
    console.log(error);
  }
};




export {
  hasDeck,
  getDeckDetail,
  getCardsByDeck,
  getCardsForReview,
  saveChangeStudy,
  hasCardsToReview,
  getNextReviewDate,
  getCardsForToday,
  addCard,
  editCard,
  deleteCard,
  deleteDeck,
  resetProgress
};
