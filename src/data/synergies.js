/**
 * Definición de sinergias por pares y globales.
 * El motor las evalúa al seleccionar el equipo.
 */

export const PAIR_SYNERGIES = [
  {
    id: 'reyes_cumple',
    name: 'Reyes del Cumple',
    members: ['dani', 'irene'],
    description: 'Dani +20% vida · Irene +10 defensa',
    color: '#ff2d78',
    emoji: '👑',
    effects: [
      { targetId: 'dani',  stat: 'hp',      value: 0.2,  type: 'pct'  },
      { targetId: 'irene', stat: 'defense',  value: 10,   type: 'flat' },
    ],
  },
  {
    id: 'manada_cumple',
    name: 'Manada Cumpleañera',
    members: ['dani', 'gaia'],
    description: 'Gaia protege a Dani con escudo al inicio',
    color: '#ffd700',
    emoji: '🐕',
    effects: [
      { targetId: 'dani', stat: 'shield', value: 30, type: 'flat' },
    ],
  },
  {
    id: 'modo_paseo',
    name: 'Modo Paseo',
    members: ['irene', 'gaia'],
    description: 'Todo el equipo +3 velocidad',
    color: '#00d4ff',
    emoji: '🌿',
    effects: [
      { targetId: 'ALL', stat: 'speed', value: 3, type: 'flat' },
    ],
  },
  {
    id: 'equilibrio',
    name: 'Equilibrio Perfecto',
    members: ['yeray', 'maria'],
    description: '+10 defensa a ambos · +15 HP a ambos',
    color: '#8b5cf6',
    emoji: '⚖️',
    effects: [
      { targetId: 'yeray', stat: 'defense', value: 10, type: 'flat' },
      { targetId: 'maria', stat: 'defense', value: 10, type: 'flat' },
      { targetId: 'yeray', stat: 'hp',      value: 15, type: 'flat' },
      { targetId: 'maria', stat: 'hp',      value: 15, type: 'flat' },
    ],
  },
  {
    id: 'caos_elegante',
    name: 'Caos Elegante',
    members: ['javi', 'iris'],
    description: 'Javi e Iris +15 ataque',
    color: '#ff8c00',
    emoji: '🔥',
    effects: [
      { targetId: 'javi', stat: 'attack', value: 15, type: 'flat' },
      { targetId: 'iris', stat: 'attack', value: 15, type: 'flat' },
    ],
  },
  {
    id: 'instinto_criminal',
    name: 'Instinto Criminal',
    members: ['javi', 'moka'],
    description: 'Moka +30% probabilidad de crítico',
    color: '#ff2d78',
    emoji: '🐱',
    effects: [
      { targetId: 'moka', stat: 'critChance', value: 0.30, type: 'flat' },
    ],
  },
  {
    id: 'mirada_gata',
    name: 'Mirada de Gata',
    members: ['iris', 'moka'],
    description: 'Los enemigos empiezan con -6 velocidad',
    color: '#ec4899',
    emoji: '👁️',
    effects: [
      { targetId: 'ENEMY_ALL', stat: 'speed', value: -6, type: 'flat' },
    ],
  },
  {
    id: 'caleta_creativa',
    name: 'Caleta Creativa',
    members: ['jaime', 'lulu'],
    description: 'Daño crítico del equipo +50%',
    color: '#39ff14',
    emoji: '🌊',
    effects: [
      { targetId: 'ALL', stat: 'critMultiplier', value: 0.5, type: 'flat' },
    ],
  },
  {
    id: 'duo_nomada',
    name: 'Dúo Nómada',
    members: ['jaime', 'loki'],
    description: 'Loki protege a Jaime con escudo de 25 HP',
    color: '#00d4ff',
    emoji: '🌍',
    effects: [
      { targetId: 'jaime', stat: 'shield', value: 25, type: 'flat' },
    ],
  },
  {
    id: 'casa_movimiento',
    name: 'Casa en Movimiento',
    members: ['lulu', 'loki'],
    description: 'Todo el equipo empieza con +20 HP de escudo',
    color: '#8b5cf6',
    emoji: '🏠',
    effects: [
      { targetId: 'ALL', stat: 'shield', value: 20, type: 'flat' },
    ],
  },
]

export const GLOBAL_SYNERGIES = [
  {
    id: 'de_siempre',
    name: 'Los de Siempre',
    condition: 'humans3',
    description: '3+ humanos: equipo +10 ataque',
    color: '#ffd700',
    emoji: '👥',
    effects: [
      { targetId: 'ALL_HUMANS', stat: 'attack', value: 10, type: 'flat' },
    ],
  },
  {
    id: 'consejo_animal',
    name: 'Consejo Animal',
    condition: 'pets2',
    description: '2+ mascotas: equipo +15 HP',
    color: '#39ff14',
    emoji: '🐾',
    effects: [
      { targetId: 'ALL', stat: 'hp', value: 15, type: 'flat' },
    ],
  },
  {
    id: 'manada_legendaria',
    name: 'Manada Legendaria',
    condition: 'pets3',
    description: '3 mascotas: mascotas atacan 2 veces en primer turno',
    color: '#ff8c00',
    emoji: '🦁',
    effects: [
      { targetId: 'ALL_PETS', stat: 'doubleFirstAttack', value: true, type: 'flag' },
    ],
  },
  {
    id: 'cumple_protegido',
    name: 'Cumpleaños Protegido',
    condition: 'dani2pets',
    description: 'Dani + 2 mascotas: Dani +30 HP de escudo',
    color: '#ff2d78',
    emoji: '🎂',
    effects: [
      { targetId: 'dani', stat: 'shield', value: 30, type: 'flat' },
    ],
  },
  {
    id: 'doble_date',
    name: 'Doble Date Final',
    condition: 'allCouples',
    description: 'Las 4 parejas: +20 HP · +10 ataque · +10 defensa',
    color: '#ff2d78',
    emoji: '💑',
    effects: [
      { targetId: 'ALL', stat: 'hp',      value: 20, type: 'flat' },
      { targetId: 'ALL', stat: 'attack',  value: 10, type: 'flat' },
      { targetId: 'ALL', stat: 'defense', value: 10, type: 'flat' },
    ],
  },
  {
    id: 'montan_el_plan',
    name: 'Los que Montan el Plan',
    condition: 'jaime_dani',
    description: 'Jaime + Dani: +15% probabilidad de crítico',
    color: '#00d4ff',
    emoji: '🧠',
    effects: [
      { targetId: 'ALL', stat: 'critChance', value: 0.15, type: 'flat' },
    ],
  },
]
