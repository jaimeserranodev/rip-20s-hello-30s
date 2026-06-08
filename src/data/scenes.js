const B = import.meta.env.BASE_URL
const img = n => `${B}novel/${n}`
// Scene images named: escena1.png, escena2.png … (no hyphen, no zero-padding)
const si = n => img(`escena${n}.png`)

// Secret ending unlocks in escena-25 when visited: escena-12 + escena-23 + (escena-11 or escena-29)
export const START_SCENE = 'escena-01'

export const SCENES = {
  'escena-01': {
    id: 'escena-01',
    act: 'Acto I — El regreso',
    title: 'El pueblo duerme',
    image: si(1),
    text: `El pueblo duerme.
Las olas golpean la costa como si intentaran despertar algo enterrado.

Dani vuelve a la isla después de años fuera.
No ha venido de vacaciones.

Desde hace semanas, algunos vecinos desaparecen.
Otros aparecen muertos.

Esta noche, hay un cadáver en el centro del pueblo.`,
    choices: [
      { label: 'Entrar en la plaza', next: 'escena-02' },
      { label: 'Observar desde lejos', next: 'escena-03' },
    ],
  },

  'escena-02': {
    id: 'escena-02',
    act: 'Acto I — El regreso',
    title: 'La silueta',
    image: si(2),
    text: `La silueta blanca corta la piedra de la plaza como una cicatriz.

No hay cuerpo.
Solo queda la forma.

Junto a la marca, Dani ve tres cosas:

Un pendiente plateado.
Una nota arrugada.
Una huella de barro.

Desde las ventanas, los vecinos miran sin hablar.`,
    choices: [
      { label: 'Examinar la nota', next: 'escena-04' },
      { label: 'Mirar a los vecinos', next: 'escena-05' },
    ],
  },

  'escena-03': {
    id: 'escena-03',
    act: 'Acto I — El regreso',
    title: 'Las ventanas',
    image: si(3),
    text: `Dani no entra todavía.

Prefiere mirar.

En los balcones hay caras.
Algunas asustadas.
Otras demasiado tranquilas.

Una figura se aparta rápido de una ventana de la taberna.`,
    choices: [
      { label: 'Ir hacia la taberna', next: 'escena-06' },
      { label: 'Entrar en la plaza', next: 'escena-02' },
    ],
  },

  'escena-04': {
    id: 'escena-04',
    act: 'Acto II — Los sospechosos',
    title: 'La nota',
    image: si(4),
    text: `Dani abre la nota.

Solo hay una frase escrita con tinta negra:

"Uno de nosotros no es quien dice ser."

La tinta todavía está húmeda.

Alguien ha dejado esto hace muy poco.`,
    choices: [
      { label: 'Guardar la nota', next: 'escena-05' },
      { label: 'Preguntar en voz alta quién la escribió', next: 'escena-07' },
    ],
  },

  'escena-05': {
    id: 'escena-05',
    act: 'Acto II — Los sospechosos',
    title: 'Los vecinos',
    image: si(5),
    text: `Los vecinos salen poco a poco.

Irene, la bailarina, parece salida de un cuento de cristal roto.
Jaime, el surfero, huele a sal y a secretos.
María, la vidente, observa como si ya supiera el final.
Javi, el tabernero, limpia un vaso que ya está limpio.
Iris no deja de mirar el pendiente.
Yeray sonríe demasiado.
Lulu abraza una capa roja contra el pecho.

Todos tienen miedo.

O todos fingen tenerlo.`,
    choices: [
      { label: 'Interrogar a Irene', next: 'escena-08' },
      { label: 'Interrogar a Javi', next: 'escena-09' },
    ],
  },

  'escena-06': {
    id: 'escena-06',
    act: 'Acto II — Los sospechosos',
    title: 'La taberna',
    image: si(6),
    text: `La taberna está abierta, aunque nadie bebe.

Javi levanta la mirada.

—Volviste, detective.

No parece sorprendido.
Eso nunca es buena señal.`,
    choices: [
      { label: 'Preguntar por el cadáver', next: 'escena-09' },
      { label: 'Preguntar quién estaba aquí esta noche', next: 'escena-10' },
    ],
  },

  'escena-07': {
    id: 'escena-07',
    act: 'Acto II — Los sospechosos',
    title: 'El silencio',
    image: si(7),
    text: `Dani levanta la nota.

—¿Quién ha escrito esto?

Nadie responde.

Pero alguien se mueve.

Lulu baja la mirada.
María cierra los ojos.
Yeray sonríe.

El pueblo entero parece contener la respiración.`,
    choices: [
      { label: 'Seguir a Lulu', next: 'escena-11' },
      { label: 'Hablar con María', next: 'escena-12' },
    ],
  },

  'escena-08': {
    id: 'escena-08',
    act: 'Acto III — Pistas',
    title: 'Irene, la bailarina',
    image: si(8),
    text: `Irene dice que estaba ensayando.

Pero sus zapatos tienen barro seco.
El mismo barro que la huella de la plaza.

—Yo no maté a nadie, Dani.

Lo dice rápido.
Demasiado rápido.`,
    choices: [
      { label: 'Presionarla por el barro', next: 'escena-13' },
      { label: 'Preguntarle por el pendiente', next: 'escena-14' },
    ],
  },

  'escena-09': {
    id: 'escena-09',
    act: 'Acto III — Pistas',
    title: 'Javi, el tabernero',
    image: si(9),
    text: `Javi dice que cerró temprano.

Pero Dani ve una copa recién servida en una mesa del fondo.

—Aquí todos mienten un poco —dice Javi—. Es la única forma de seguir vivos.`,
    choices: [
      { label: 'Preguntar quién bebió en esa mesa', next: 'escena-10' },
      { label: 'Acusar a Javi de ocultar algo', next: 'escena-15' },
    ],
  },

  'escena-10': {
    id: 'escena-10',
    act: 'Acto III — Pistas',
    title: 'La última mesa',
    image: si(10),
    text: `Había dos personas sentadas.

Una dejó barro.
La otra dejó arena.

Barro de la montaña.
Arena de la playa.

Irene pudo dejar el barro.
Jaime pudo dejar la arena.

O quizá alguien quiere que Dani piense eso.`,
    choices: [
      { label: 'Buscar a Jaime', next: 'escena-16' },
      { label: 'Volver a la plaza', next: 'escena-05' },
    ],
  },

  'escena-11': {
    id: 'escena-11',
    act: 'Acto III — Pistas',
    title: 'Lulu, la capa roja',
    image: si(11),
    text: `Lulu camina rápido.

Cuando Dani la alcanza, ella tiembla.

—Yo lo vi —susurra—. Vi al lobo.

Dani se queda quieto.

En este pueblo, esa palabra pesa más que una confesión.`,
    choices: [
      { label: 'Preguntar quién es el lobo', next: 'escena-17' },
      { label: 'Preguntar qué vio exactamente', next: 'escena-18' },
    ],
  },

  'escena-12': {
    id: 'escena-12',
    act: 'Acto III — Pistas',
    title: 'María, la vidente',
    image: si(12),
    text: `María no parece sorprendida por la visita.

—El muerto no es el primero —dice—. Y no será el último.

Sobre la mesa hay siete cartas boca abajo.

Cada una tiene el nombre de un vecino.`,
    choices: [
      { label: 'Pedirle que revele una carta', next: 'escena-19' },
      { label: 'Preguntarle si sabe quién mata', next: 'escena-20' },
    ],
  },

  'escena-13': {
    id: 'escena-13',
    act: 'Acto IV — El lobo entre nosotros',
    title: 'El barro de Irene',
    image: si(13),
    text: `Irene confiesa que estuvo en la plaza.

Pero dice que llegó cuando el cuerpo ya no estaba.

—Había alguien más. Alto. Con una sombra enorme.`,
    choices: [
      { label: 'Creerla', next: 'escena-21' },
      { label: 'Marcarla como sospechosa', next: 'escena-22' },
    ],
  },

  'escena-14': {
    id: 'escena-14',
    act: 'Acto IV — El lobo entre nosotros',
    title: 'El pendiente',
    image: si(14),
    text: `Irene mira el pendiente plateado.

—No es mío.

Pero Dani nota algo.

Iris, al fondo, se toca la oreja izquierda.

Le falta un pendiente.`,
    choices: [
      { label: 'Interrogar a Iris', next: 'escena-23' },
      { label: 'No revelar que lo has visto', next: 'escena-24' },
    ],
  },

  'escena-15': {
    id: 'escena-15',
    act: 'Acto IV — El lobo entre nosotros',
    title: 'Javi presionado',
    image: si(15),
    text: `Javi deja de limpiar el vaso.

—¿Quieres una verdad, detective?
El muerto vino aquí buscando a María.

Y después apareció Yeray.

Dani nota miedo en su voz.`,
    choices: [
      { label: 'Buscar a María', next: 'escena-12' },
      { label: 'Seguir el rastro del muerto', next: 'escena-25' },
    ],
  },

  'escena-16': {
    id: 'escena-16',
    act: 'Acto IV — El lobo entre nosotros',
    title: 'Jaime, el surfero',
    image: si(16),
    text: `Jaime mira el mar como si esperara una respuesta.

—Yo no estaba en la plaza. Estaba surfeando.

Dani mira las olas.

Esta noche el mar está plano.

No había olas.`,
    choices: [
      { label: 'Decirle que está mintiendo', next: 'escena-26' },
      { label: 'Preguntar por qué fue a la taberna', next: 'escena-27' },
    ],
  },

  'escena-17': {
    id: 'escena-17',
    act: 'Acto IV — El lobo entre nosotros',
    title: 'El nombre del lobo',
    image: si(17),
    text: `Lulu no quiere decirlo.

—Si digo su nombre, vendrá a por mí.

Dani escucha un ruido detrás.

Alguien está siguiendo la conversación.`,
    choices: [
      { label: 'Perseguir la sombra', next: 'escena-28' },
      { label: 'Proteger a Lulu', next: 'escena-29' },
    ],
  },

  'escena-18': {
    id: 'escena-18',
    act: 'Acto IV — El lobo entre nosotros',
    title: 'Lo que vio Lulu',
    image: si(18),
    text: `Lulu dice que vio una figura arrastrando el cuerpo.

No vio la cara.

Pero sí escuchó una canción.

Una melodía suave.
Como música de baile.

Irene.

O alguien imitando a Irene.`,
    choices: [
      { label: 'Volver con Irene', next: 'escena-08' },
      { label: 'Guardar la información', next: 'escena-21' },
    ],
  },

  'escena-19': {
    id: 'escena-19',
    act: 'Acto IV — El lobo entre nosotros',
    title: 'La carta',
    image: si(19),
    text: `María gira una carta.

Sale un lobo con piel humana.

Debajo hay un nombre:

YERAY.

María se pone pálida.

—Eso no debería haber salido todavía.`,
    choices: [
      { label: 'Seguir el rastro de la carta', next: 'escena-25' },
      { label: 'Sospechar de María', next: 'escena-20' },
    ],
  },

  'escena-20': {
    id: 'escena-20',
    act: 'Acto IV — El lobo entre nosotros',
    title: 'La vidente miente',
    image: si(20),
    text: `María sonríe con tristeza.

—Yo veo posibilidades, Dani. No verdades.

Entonces susurra:

—El asesino necesita que todos acusen al inocente.`,
    choices: [
      { label: 'Preguntar quién es el inocente', next: 'escena-30' },
      { label: 'Salir sin confiar en ella', next: 'escena-05' },
    ],
  },

  'escena-21': {
    id: 'escena-21',
    act: 'Acto V — Acusación final',
    title: 'Reunión en la plaza',
    image: si(21),
    text: `Dani reúne a todos en la plaza.

La isla entera parece mirar.

Hay suficientes pistas para acusar a alguien.

Pero en este pueblo, una acusación equivocada puede matar a un inocente.`,
    choices: [
      { label: 'Acusar a Irene', next: 'escena-22' },
      { label: 'Investigar al vecino que siempre sonríe', next: 'escena-25' },
    ],
  },

  'escena-22': {
    id: 'escena-22',
    act: 'Final malo',
    title: 'El pueblo devora al inocente',
    image: si(22),
    text: `Dani señala a Irene.

Los vecinos murmuran.

Irene cae de rodillas.

Pero entonces aparece otro cadáver.

Dani se ha equivocado.

El lobo sigue libre.`,
    choices: [],
    isEnd: true,
    endType: 'malo',
  },

  'escena-23': {
    id: 'escena-23',
    act: 'Acto V — Acusación final',
    title: 'Iris y el pendiente',
    image: si(23),
    text: `Iris admite que el pendiente es suyo.

Pero dice que lo perdió al escapar.

—Vi a alguien junto al cuerpo. No era Irene. No era Jaime.

Dani pregunta quién era.

Iris mira a Yeray.`,
    choices: [
      { label: 'Seguir la mirada de Iris', next: 'escena-25' },
      { label: 'Pedir a Iris que cuente todo', next: 'escena-31' },
    ],
  },

  'escena-24': {
    id: 'escena-24',
    act: 'Acto V — Acusación final',
    title: 'Callar la pista',
    image: si(24),
    text: `Dani decide no revelar lo del pendiente.

Iris se relaja.

Yeray observa a Dani con interés.

Como si acabara de entender que el detective no es tan fácil de engañar.`,
    choices: [
      { label: 'Seguir a la sombra silenciosa', next: 'escena-25' },
      { label: 'Hablar con Lulu', next: 'escena-11' },
    ],
  },

  'escena-25': {
    id: 'escena-25',
    act: 'Acto V — Acusación final',
    title: 'Yeray, el sonriente',
    image: si(25),
    text: `Yeray sonríe.

—Todos buscan un monstruo, Dani.
Pero los monstruos no existen.

Su sombra se mueve aunque él no lo hace.

Dani siente que la plaza se queda sin aire.`,
    choices: [
      { label: 'Acusarlo delante de todos', next: 'final-bueno' },
      { label: 'Intentar detenerlo a solas', next: 'final-malo-2' },
    ],
    secretChoice: { label: 'Confrontarle con la verdad del pueblo', next: 'final-secreto' },
  },

  'escena-26': {
    id: 'escena-26',
    act: 'Acto V — Acusación final',
    title: 'Jaime miente',
    image: si(26),
    text: `Jaime baja la mirada.

—Vale. No estaba surfeando.

Estaba siguiendo a Yeray.

Lo vi salir de la taberna con alguien.
Luego escuché un grito.`,
    choices: [
      { label: 'Pedirle que declare en la plaza', next: 'escena-21' },
      { label: 'Ir a por el hombre que Jaime siguió', next: 'escena-25' },
    ],
  },

  'escena-27': {
    id: 'escena-27',
    act: 'Acto V — Acusación final',
    title: 'Jaime y la taberna',
    image: si(27),
    text: `Jaime fue a la taberna porque el muerto le había enviado un mensaje.

"Esta noche descubriré quién es el lobo."

Pero cuando llegó, ya era tarde.`,
    choices: [
      { label: 'Buscar a Javi', next: 'escena-09' },
      { label: 'Seguir el rastro del mensaje', next: 'escena-25' },
    ],
  },

  'escena-28': {
    id: 'escena-28',
    act: 'Acto V — Acusación final',
    title: 'La sombra',
    image: si(28),
    text: `Dani corre tras la sombra.

Pero la pierde.

Cuando vuelve, Lulu ha desaparecido.

Solo queda su capa roja en el suelo.`,
    choices: [
      { label: 'Volver a la plaza', next: 'escena-21' },
      { label: 'Buscar a Lulu', next: 'escena-32' },
    ],
  },

  'escena-29': {
    id: 'escena-29',
    act: 'Acto V — Acusación final',
    title: 'Proteger a Lulu',
    image: si(29),
    text: `Dani se queda con Lulu.

Ella, por fin, habla.

—No era un lobo. Era Yeray.

Pero cuando lo vi… sus ojos no eran humanos.`,
    choices: [
      { label: 'Llevar a Lulu a la plaza', next: 'escena-21' },
      { label: 'Confrontar al vecino de los ojos fríos', next: 'escena-25' },
    ],
  },

  'escena-30': {
    id: 'escena-30',
    act: 'Acto V — Acusación final',
    title: 'El inocente',
    image: si(30),
    text: `María susurra:

—El inocente será el primero al que todos quieran culpar.

Dani piensa en Irene.
El barro.
La canción.
El pendiente.

Demasiadas pistas perfectas.

Demasiado fácil.`,
    choices: [
      { label: 'Descartar a Irene como culpable', next: 'escena-21' },
      { label: 'Acusarla igualmente', next: 'escena-22' },
    ],
  },

  'escena-31': {
    id: 'escena-31',
    act: 'Acto V — Acusación final',
    title: 'Iris habla',
    image: si(31),
    text: `Iris cuenta que el muerto intentó revelar al asesino.

Pero Yeray lo interrumpió.

—No lo mató por rabia —dice Iris—. Lo mató para que siguiéramos jugando a su juego.`,
    choices: [
      { label: 'Reunir a todos', next: 'escena-21' },
      { label: 'Ir a por el asesino', next: 'escena-25' },
    ],
  },

  'escena-32': {
    id: 'escena-32',
    act: 'Acto V — Acusación final',
    title: 'Lulu desaparecida',
    image: img('escenca32.png'),
    text: `Dani encuentra huellas cerca del risco.

Una de Lulu.

Otra más grande.

Demasiado grande.

Entonces escucha una voz detrás:

—Llegas tarde, detective.

Es Yeray.`,
    choices: [
      { label: 'Enfrentarlo', next: 'final-malo-2' },
      { label: 'Gritar para llamar a los vecinos', next: 'final-bueno' },
    ],
  },

  'final-bueno': {
    id: 'final-bueno',
    act: 'Final',
    title: 'El lobo entre nosotros',
    image: img('finalbueno.png'),
    text: `Dani no lo enfrenta solo.

Lo lleva al centro del pueblo.
Donde todos pueden verlo.

Las mentiras de Yeray se rompen una a una.

El lobo no era una bestia escondida en el bosque.

Era un vecino.
Una sonrisa.
Una voz tranquila en mitad del miedo.

Dani ha resuelto el caso.

Pero mientras Yeray es llevado lejos, María mira al mar y susurra:

—Este solo era el primero.`,
    choices: [],
    isEnd: true,
    endType: 'bueno',
  },

  'final-malo-2': {
    id: 'final-malo-2',
    act: 'Final malo',
    title: 'El detective caza solo',
    image: img('finalmalo.png'),
    text: `Dani intenta detener a Yeray sin testigos.

Error.

En este pueblo, la verdad necesita ojos.

La mañana siguiente, aparece una nueva silueta en la plaza.

Esta vez, tiene la forma de Dani.`,
    choices: [],
    isEnd: true,
    endType: 'malo',
  },

  'escena-25b': {
    id: 'escena-25b',
    act: 'Acto IV — El lobo entre nosotros',
    title: 'Demasiado pronto',
    image: si(25),
    text: `Dani se acerca al vecino.

Él sonríe.

—¿Necesitas algo, detective?

Su voz es tranquila.
Demasiado tranquila.

Pero Dani no tiene suficiente todavía.
Sin pruebas, una acusación solo le hace más fuerte.

Primero hay que hablar con los demás.`,
    choices: [
      { label: 'Volver con los vecinos', next: 'escena-05' },
      { label: 'Hablar con Irene', next: 'escena-08' },
      { label: 'Hablar con María', next: 'escena-12' },
    ],
  },

  'final-secreto': {
    id: 'final-secreto',
    act: 'Final secreto',
    title: 'El pueblo es el lobo',
    image: img('final-secreto.png'),
    text: `Dani descubre que Yeray mató.

Pero también descubre algo peor.

Todos lo sabían.

Todos callaron.

Porque en este pueblo, el lobo no es una persona.

Es el miedo compartido.

Dani mira a los vecinos.

Y entiende que el verdadero caso acaba de empezar.`,
    choices: [],
    isEnd: true,
    endType: 'secreto',
  },
}
