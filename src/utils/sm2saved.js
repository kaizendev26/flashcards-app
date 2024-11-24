function reviewCard(card, grade){
    const MIN_FACTOR = 1.3; // Factor mínimo permitido
    const MAX_FACTOR = 3.0; // Factor máximo permitido
  
    if (grade === GRADE.AGAIN) {
      // "Again" -> Intervalo muy corto, 1 minuto
      card.repetitions = 0;
      card.interval = 1 / 60;
    } else if (grade === GRADE.HARD) {
      // "Hard" -> Intervalo menos corto, 5 minutos
      card.repetitions = 0;
      card.interval = 5 / 60;
    } 
    else if(grade === GRADE.GOOD){
      // "Good" -> Intervalo menos corto pero se mantienen en un rango que se 
      // puedan estudiar mas
      
      if(card.repetitions === 0){ 
        card.interval = 15 / 60; // primera repeticion good : 15 minutos
      }else if(card.repetitions == 1){
        card.interval = 30 / 60; // a la tercera repeticion subimos a: 30 minutos
      }else{
        // a partir de la tercera repeticion usamos el factor
        card.interval *= card.factor;
      }
      // Incrementamos las repeticiones correctas
      card.repetitions += 1;
  
    }
    else {
      // Para calificaciones "Easy"
      if (card.repetitions === 0) {
        card.interval = 0.5; // Primera repetición correcta: 0.5 días (12 horas)
      } else if (card.repetitions === 1) {
        card.interval = 3; // Segunda repetición correcta: 3 días
      } else {
        // A partir de la tercera repetición, ajustamos el intervalo usando el factor
        card.interval *= card.factor;
      }
      // Incrementamos las repeticiones correctas
      card.repetitions += 1;
    }
  
    // Ajustamos el factor de acuerdo a la calificación
    const newFactor =
      card.factor + (0.1 - (5 - grade) * (0.05 + (5 - grade) * 0.01));
  
    // Aseguramos que el factor esté dentro de los límites
    card.factor = Math.max(MIN_FACTOR, Math.min(newFactor, MAX_FACTOR));
  
    // Calculamos la nueva fecha de revisión
    const dueDate = new Date();
    if (card.interval < 1) {
      // Si el intervalo es menor a un día, sumamos minutos
      const minutesToAdd = card.interval * 60;
      dueDate.setMinutes(dueDate.getMinutes() + Math.ceil(minutesToAdd));
    } else {
      // Si el intervalo es mayor o igual a un día, sumamos días
      dueDate.setDate(dueDate.getDate() + Math.round(card.interval));
    }
  
    // Actualizamos la fecha y la dificultad
    card.dueDate = format(dueDate, "YYYY-MM-DD HH:mm:ss", "en");
    card.difficultyId = grade;
  }