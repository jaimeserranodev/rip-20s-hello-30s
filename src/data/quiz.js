/**
 * Preguntas del Quiz de Dani.
 * Edita este array para personalizar las preguntas.
 *
 * Formato:
 * {
 *   question: string,        — La pregunta
 *   options: string[3],      — Exactamente 3 opciones
 *   correct: 0 | 1 | 2,     — Índice de la respuesta correcta
 *   feedback: string,        — Mensaje gracioso al responder
 * }
 */
export const quizQuestions = [
  {
    question: "¿Qué hace Dani cuando le suena el despertador a las 8 de la mañana?",
    options: [
      "Se levanta de un salto, lleno de energía",
      "Le da a snooze exactamente 4 veces seguidas",
      "Ya estaba despierto desde las 6 haciendo yoga"
    ],
    correct: 1,
    feedback: "¡Cuatro snoozes son una ciencia exacta! El quinto ya es peligroso 😂"
  },
  {
    question: "Dani entra a un restaurante. ¿Qué pide primero?",
    options: [
      "Un vaso de agua y mira la carta detenidamente",
      "Lo mismo de siempre, sin mirar la carta",
      "Pregunta qué es lo más raro que tienen"
    ],
    correct: 1,
    feedback: "Si funciona, ¿para qué cambiar? Dani es un ser de costumbres 🍽️"
  },
  {
    question: "¿Cuál es el plan ideal de Dani para un sábado?",
    options: [
      "Senderismo al amanecer con vuelta a las 10am",
      "Lo que sea, pero que empiece después de las 12",
      "Una maratón de productividad desde las 7am"
    ],
    correct: 1,
    feedback: "Los sábados antes del mediodía son un mito urbano para Dani ☀️"
  },
  {
    question: "¿Qué hace Dani cuando no sabe la respuesta a algo?",
    options: [
      "Dice 'no sé' y punto",
      "Lo googlea discretamente y finge que lo sabía",
      "Da una respuesta de 10 minutos de todas formas"
    ],
    correct: 2,
    feedback: "La respuesta correcta siempre tiene al menos 10 minutos de duración 🎤"
  },
  {
    question: "Llega el momento de pagar la cuenta. ¿Qué hace Dani?",
    options: [
      "Saca la tarjeta antes que nadie",
      "Hace el amago pero acaba aceptando que paguen otros",
      "Propone dividir con una calculadora en la mano"
    ],
    correct: 0,
    feedback: "¡Dani siempre va primero! Es un gesto digno de los 30 👏"
  },
  {
    question: "¿Cómo reacciona Dani cuando le ponen mala música?",
    options: [
      "Lo sufre en silencio con dignidad",
      "Saca el móvil y conecta el suyo sin avisar",
      "Da un discurso de 5 minutos sobre buen gusto musical"
    ],
    correct: 1,
    feedback: "Acción rápida, sin explicaciones. El control de la música es sagrado 🎵"
  },
  {
    question: "¿Cuánto tarda Dani en responder un mensaje?",
    options: [
      "Menos de 30 segundos, siempre",
      "Cuando quiere, que para eso tiene notificaciones silenciadas",
      "Exactamente 2 horas, por hacer que está ocupado"
    ],
    correct: 1,
    feedback: "Las notificaciones son para los demás. Dani responde en sus propios términos 📱"
  },
  {
    question: "Dani tiene que tomar una decisión importante. ¿Cómo lo hace?",
    options: [
      "Lista de pros y contras en papel",
      "Lo consulta con la almohada el tiempo necesario",
      "Cara o cruz y a correr"
    ],
    correct: 1,
    feedback: "Las decisiones importantes necesitan reposo. A veces mucho reposo 🛌"
  },
]
