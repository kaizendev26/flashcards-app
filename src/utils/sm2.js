import { format } from "@formkit/tempo";

const GRADE = {
  EASY: 4,
  GOOD: 3,
  HARD: 2,
  AGAIN: 0,
};

// function reviewCard(card, grade) {
//   if (grade === GRADE.AGAIN) {
//     // "Again" -> Intervalo muy corto 1 min
//     card.repetitions = 0;
//     card.interval = 1 / 60;
//   } else if (grade === GRADE.HARD) {
//     // "Hard" -> Intervalo menos corto 8 min
//     card.repetitions = 0;
//     card.interval = 8 / 60; // Intervalo de 8 min
//   } else {
//     // Si la calificación es "Good" o "Easy"
//     if (card.repetitions === 0) {
//       card.interval = 1; // Primera repetición correcta
//     } else if (card.repetitions === 1) {
//       card.interval = 6; // Segunda repetición correcta
//     } else {
//       // A partir de la tercera repetición correcta, aumentamos el intervalo
//       card.interval = card.interval * card.factor;
//     }

//     // Incrementamos las repeticiones correctas
//     card.repetitions += 1;
//   }

//   let newFactor =
//     card.factor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
//   // if (grade >= 3) {
//   //   // Aseguramos que suba ligeramente si se califica con "Good" o "Easy"
//   //   newFactor += 0.05 * (grade - 2); // Pequeño ajuste adicional para "Good" y "Easy"
//   // }
//   card.factor = newFactor;
//   if (card.factor < 1.3) card.factor = 1.3;

//   const dueDate = new Date();

//   // Si el intervalo es menor a 1 día, sumamos minutos
//   if (card.interval < 1) {
//     const minutesToAdd = card.interval * 60; // caculamos los minutos
//     dueDate.setMinutes(dueDate.getMinutes() + Math.ceil(minutesToAdd));
//   } else {
//     // Si el intervalo es mayor o igual a 1 día, sumamos días
//     dueDate.setDate(dueDate.getDate() + Math.round(card.interval));
//   }

//   card.dueDate = format(dueDate, "YYYY-MM-DD HH:mm:ss", "en");
//   card.difficultyId = grade;

// }

function reviewCard(card, grade) {
  const MIN_FACTOR = 1.3;
  const MAX_FACTOR = 2.5;

// Definimos la constante para conversión: 1 día = 1440 minutos
const MINUTES_IN_A_DAY = 1440;

if (grade === GRADE.AGAIN) {
  // "Again" -> 1 minuto
  card.repetitions = 0;
  card.interval = 1 / MINUTES_IN_A_DAY;
} else if (grade === GRADE.HARD) {
  // "Hard" -> 5 minutos
  card.repetitions = 0;
  card.interval = 5 / MINUTES_IN_A_DAY;
} else if (grade === GRADE.GOOD) {
  // "Good" -> Intervalos crecientes
  if (card.repetitions === 0) {
    card.interval = 15 / MINUTES_IN_A_DAY; // Primera repetición: 15 minutos
  } else if (card.repetitions === 1) {
    card.interval = 30 / MINUTES_IN_A_DAY; // Segunda repetición: 30 minutos
  } else {
    card.interval *= card.factor; // A partir de la tercera, usamos el factor
  }
  card.repetitions += 1;
} else {
  // "Easy" -> Intervalos más largos
  if (card.repetitions === 0) {
    card.interval = 0.25; // Primera repetición: 6 horas
  } else if (card.repetitions === 1) {
    card.interval = 1; // Segunda repetición: 1 días
  } else {
    card.interval *= card.factor; // A partir de la tercera, usamos el factor
  }
  card.repetitions += 1;
}

// Ajuste del factor de facilidad
let newFactor = card.factor + (0.1 - (5 - grade) * (0.05 + (5 - grade) * 0.01));
card.factor = Math.max(MIN_FACTOR, Math.min(newFactor, MAX_FACTOR));

// Cálculo de la nueva fecha de revisión
const dueDate = new Date();
if (card.interval < 1) {
  // Si el intervalo es menor a 1 día, sumamos minutos
  const minutesToAdd = Math.round(card.interval * MINUTES_IN_A_DAY);
  dueDate.setMinutes(dueDate.getMinutes() + minutesToAdd);
} else {
  // Si el intervalo es mayor o igual a 1 día, sumamos días
  dueDate.setDate(dueDate.getDate() + Math.round(card.interval));
}

card.dueDate = format(dueDate, "YYYY-MM-DD HH:mm:ss", "en");
card.difficultyId = grade;
}

const formatDateForMySQL = (date) => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

function formatDate(date) {
  const options = {
    year: "numeric",
    month: "2-digit", // También puede ser 'short', 'narrow', '2-digit'
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("es-ES", options);
  const formattedDate = formatter.format(date);

  const dateTimeParts = formattedDate.split(", ");
  const datePart = dateTimeParts[0].replace(/\//g, "-"); // Cambia las / a -
  const timePart = dateTimeParts[1];

  return `${datePart} ${timePart}`;

  //return formattedDate;
}

export default reviewCard;
