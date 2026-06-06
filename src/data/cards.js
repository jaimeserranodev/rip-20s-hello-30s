/**
 * Genera el array de las 12 cartas.
 * Las imágenes deben estar en: public/cards/card-1.png … card-12.png
 * El reverso debe estar en:    public/back-card.png
 */
const TOTAL_CARDS = 12

export const cards = Array.from({ length: TOTAL_CARDS }, (_, i) => ({
  id: i + 1,
  image: `/cards/card-${i + 1}.jpeg`,
  label: `Recuerdo ${i + 1}`,
}))

export const BACK_CARD = '/back-card.jpeg'
