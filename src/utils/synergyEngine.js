import { PAIR_SYNERGIES, GLOBAL_SYNERGIES } from '../data/synergies'

/**
 * Dadas las unidades seleccionadas, devuelve las sinergias activas
 * y los modificadores de estadísticas que hay que aplicar.
 */
export function calculateSynergies(selectedUnits) {
  const ids = selectedUnits.map(u => u.id)
  const activeSynergies = []
  const statEffects = [] // { targetId, stat, value, type }

  // ── Sinergias por parejas ──
  for (const syn of PAIR_SYNERGIES) {
    if (syn.members.every(m => ids.includes(m))) {
      activeSynergies.push(syn)
      statEffects.push(...syn.effects)
    }
  }

  // ── Sinergias globales ──
  const petIds   = selectedUnits.filter(u => u.isPet).map(u => u.id)
  const humanIds = selectedUnits.filter(u => !u.isPet).map(u => u.id)

  for (const syn of GLOBAL_SYNERGIES) {
    let active = false

    switch (syn.condition) {
      case 'humans3':     active = humanIds.length >= 3; break
      case 'pets2':       active = petIds.length >= 2; break
      case 'pets3':       active = petIds.length >= 3; break
      case 'dani2pets':   active = ids.includes('dani') && petIds.length >= 2; break
      case 'allCouples':  active = ['dani','irene','yeray','maria','javi','iris','jaime','lulu'].every(id => ids.includes(id)); break
      case 'jaime_dani':  active = ids.includes('jaime') && ids.includes('dani'); break
    }

    if (active) {
      activeSynergies.push(syn)
      statEffects.push(...syn.effects)
    }
  }

  return { activeSynergies, statEffects }
}

/**
 * Aplica los efectos de sinergia a las copias de las unidades.
 * Devuelve nuevas unidades con stats modificadas.
 */
export function applyStatEffects(units, statEffects) {
  return units.map(unit => {
    const modified = {
      ...unit,
      critChance: unit.critChance ?? 0.12,
      critMultiplier: unit.critMultiplier ?? 1.5,
      shield: unit.shield ?? 0,
      doubleFirstAttack: false,
    }

    for (const effect of statEffects) {
      const targets = resolveTargets(effect.targetId, unit, units)
      if (!targets) continue

      if (effect.type === 'flat') {
        if (effect.stat === 'hp') {
          modified.hp = Math.round(modified.hp + effect.value)
        } else if (effect.stat === 'shield') {
          modified.shield = (modified.shield || 0) + effect.value
        } else if (effect.stat === 'critMultiplier') {
          modified.critMultiplier = (modified.critMultiplier || 1.5) + effect.value
        } else if (effect.stat === 'critChance') {
          modified.critChance = Math.min(0.95, (modified.critChance || 0.12) + effect.value)
        } else {
          modified[effect.stat] = (modified[effect.stat] || 0) + effect.value
        }
      } else if (effect.type === 'pct') {
        modified[effect.stat] = Math.round(modified[effect.stat] * (1 + effect.value))
      } else if (effect.type === 'flag') {
        modified[effect.stat] = effect.value
      }
    }

    return modified
  })
}

/** Determina si la unidad actual es un objetivo del efecto */
function resolveTargets(targetId, unit, allUnits) {
  if (targetId === unit.id) return true
  if (targetId === 'ALL') return true
  if (targetId === 'ALL_HUMANS' && !unit.isPet) return true
  if (targetId === 'ALL_PETS' && unit.isPet) return true
  if (targetId === 'ENEMY_ALL') return false // Se aplica a enemigos en el engine
  return false
}

/** Extrae los efectos de velocidad para aplicar a enemigos */
export function getEnemySpeedDebuffs(statEffects) {
  return statEffects
    .filter(e => e.targetId === 'ENEMY_ALL' && e.stat === 'speed')
    .reduce((sum, e) => sum + e.value, 0)
}
