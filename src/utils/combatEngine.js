import { getEnemySpeedDebuffs } from './synergyEngine'

/**
 * Simula la batalla completa y devuelve la secuencia de eventos.
 * Los componentes reproducen esta secuencia animada paso a paso.
 *
 * @param {object[]} playerUnits  - Unidades con sinergias ya aplicadas
 * @param {object[]} levelEnemies - Enemigos del nivel
 * @param {object[]} statEffects  - Efectos de sinergia (para enemigos)
 * @returns {{ events: object[], victory: boolean }}
 */
export function simulateBattle(playerUnits, levelEnemies, statEffects = []) {
  // Copias mutables de los combatientes
  const players = playerUnits.map(u => ({
    ...u,
    currentHp: u.hp,
    maxHp: u.hp,
    currentAttack: u.attack,
    currentDefense: u.defense,
    currentSpeed: u.speed,
    critChance: u.critChance ?? 0.12,
    critMultiplier: u.critMultiplier ?? 1.5,
    shield: u.shield ?? 0,
    damageBoost: 1.0,
    abilityUsed: false,
    stunned: false,
    doubleFirstAttack: u.doubleFirstAttack ?? false,
    firstTurnDone: false,
    isPlayer: true,
  }))

  const enemySpeedDebuff = getEnemySpeedDebuffs(statEffects)

  const enemies = levelEnemies.map(e => ({
    ...e,
    currentHp: e.hp,
    maxHp: e.hp,
    currentAttack: e.attack,
    currentDefense: e.defense,
    currentSpeed: Math.max(1, e.speed + enemySpeedDebuff),
    abilityUsed: false,
    stunned: false,
    isPlayer: false,
  }))

  const events = []

  // ── Snapshot: captura HPs actuales para cada paso ──
  function snap() {
    return {
      playerHPs:     Object.fromEntries(players.map(p => [p.id, p.currentHp])),
      enemyHPs:      Object.fromEntries(enemies.map(e => [e.id, e.currentHp])),
      playerShields: Object.fromEntries(players.map(p => [p.id, p.shield])),
    }
  }

  // ── Inicio del combate ──
  events.push({ type: 'init', message: '⚔️ ¡Comienza el combate!', ...snap() })

  // ── Habilidades de inicio: Javi e Iris ──
  const javi = players.find(p => p.id === 'javi')
  if (javi) {
    const strongestEnemy = [...enemies].sort((a, b) => b.hp - a.hp)[0]
    if (strongestEnemy) {
      const dmg = 15
      strongestEnemy.currentHp = Math.max(0, strongestEnemy.currentHp - dmg)
      events.push({ type: 'ability', attackerId: 'javi', targetId: strongestEnemy.id, damage: dmg, message: `🎉 Javi usa Entrada Triunfal — ${dmg} de daño a ${strongestEnemy.name}`, ...snap() })
      javi.abilityUsed = true
    }
  }

  const iris = players.find(p => p.id === 'iris')
  if (iris) {
    enemies.forEach(e => { e.currentSpeed = Math.max(1, e.currentSpeed - 4) })
    events.push({ type: 'ability', attackerId: 'iris', message: '👁️ Iris usa Mirada Letal — todos los enemigos pierden velocidad', ...snap() })
    iris.abilityUsed = true
  }

  // ── Rondas principales ──
  let round = 0
  const MAX_ROUNDS = 28

  while (round < MAX_ROUNDS) {
    round++

    const alivePlayers = players.filter(p => p.currentHp > 0)
    const aliveEnemies = enemies.filter(e => e.currentHp > 0)
    if (!alivePlayers.length || !aliveEnemies.length) break

    events.push({ type: 'round', message: `── Ronda ${round} ──`, ...snap() })

    // Orden de turno por velocidad
    const turnOrder = [
      ...alivePlayers.map(p => ({ ref: p, isPlayer: true })),
      ...aliveEnemies.map(e => ({ ref: e, isPlayer: false })),
    ].sort((a, b) => b.ref.currentSpeed - a.ref.currentSpeed)

    for (const { ref: actor, isPlayer } of turnOrder) {
      if (actor.currentHp <= 0) continue

      // Aturdir
      if (actor.stunned) {
        actor.stunned = false
        events.push({ type: 'stun', message: `😵 ${actor.name} está aturdido y pierde su turno`, ...snap() })
        continue
      }

      if (isPlayer) {
        // ── Turno jugador ──

        // Habilidad con 35% de prob (si no se ha usado)
        if (!actor.abilityUsed && Math.random() < 0.35) {
          firePlayerAbility(actor, players, enemies, events, snap)
        }

        const targets = enemies.filter(e => e.currentHp > 0)
        if (!targets.length) break
        const target = targets[Math.floor(Math.random() * targets.length)]

        // Moka: si acaba de usar su habilidad, ataque con crit garantizado
        const forceCrit = actor.id === 'moka' && actor.critChance >= 1.0
        const isCrit = forceCrit || Math.random() < actor.critChance
        if (forceCrit) actor.critChance = 0.12 // reset

        const rawDmg = Math.max(1, actor.currentAttack - target.currentDefense)
        const damage = Math.round(isCrit ? rawDmg * actor.critMultiplier * actor.damageBoost : rawDmg * actor.damageBoost)

        target.currentHp = Math.max(0, target.currentHp - damage)

        events.push({
          type: isCrit ? 'crit' : 'attack',
          attackerId: actor.id,
          targetId: target.id,
          damage,
          isCrit,
          message: isCrit
            ? `⚡ ${actor.name} ¡CRÍTICO! — ${damage} de daño a ${target.name}`
            : `⚔️ ${actor.name} ataca a ${target.name} — ${damage} de daño`,
          ...snap(),
        })

        if (target.currentHp <= 0) {
          events.push({ type: 'death', unitId: target.id, isEnemy: true, message: `💀 ${target.name} ha sido derrotado`, ...snap() })
        }

        // Doble ataque primera ronda (Manada Legendaria)
        if (actor.isPet && actor.doubleFirstAttack && !actor.firstTurnDone && round === 1) {
          actor.firstTurnDone = true
          const t2 = enemies.filter(e => e.currentHp > 0)
          if (t2.length) {
            const tgt2 = t2[Math.floor(Math.random() * t2.length)]
            const d2 = Math.max(1, actor.currentAttack - tgt2.currentDefense)
            tgt2.currentHp = Math.max(0, tgt2.currentHp - d2)
            events.push({
              type: 'attack',
              attackerId: actor.id,
              targetId: tgt2.id,
              damage: d2,
              message: `🦁 ${actor.name} ataca de nuevo (Manada Legendaria) — ${d2} de daño`,
              ...snap(),
            })
            if (tgt2.currentHp <= 0) {
              events.push({ type: 'death', unitId: tgt2.id, isEnemy: true, message: `💀 ${tgt2.name} ha sido derrotado`, ...snap() })
            }
          }
        }

      } else {
        // ── Turno enemigo ──

        // Boss al 50% HP usa su habilidad
        if (actor.isBoss && !actor.abilityUsed && actor.currentHp <= actor.maxHp * 0.5) {
          fireBossAbility(actor, players, events, snap)
          actor.abilityUsed = true
        }

        const targets = players.filter(p => p.currentHp > 0)
        if (!targets.length) break
        const target = targets[Math.floor(Math.random() * targets.length)]

        let damage = Math.max(1, actor.currentAttack - target.currentDefense)

        // Escudo absorbe daño
        if (target.shield > 0) {
          const absorbed = Math.min(target.shield, damage)
          damage = Math.max(0, damage - absorbed)
          target.shield = Math.max(0, target.shield - absorbed)
          if (absorbed > 0) {
            events.push({ type: 'shield', targetId: target.id, absorbed, message: `🛡️ El escudo de ${target.name} absorbe ${absorbed} de daño`, ...snap() })
          }
        }

        if (damage > 0) {
          target.currentHp = Math.max(0, target.currentHp - damage)
          events.push({
            type: 'enemy-attack',
            attackerId: actor.id,
            targetId: target.id,
            damage,
            message: `👿 ${actor.name} ataca a ${target.name} — ${damage} de daño`,
            ...snap(),
          })

          if (target.currentHp <= 0) {
            events.push({ type: 'death', unitId: target.id, isEnemy: false, message: `💔 ${target.name} ha caído en combate`, ...snap() })
          }
        }
      }

      // Fin anticipado
      if (enemies.every(e => e.currentHp <= 0) || players.every(p => p.currentHp <= 0)) break
    }

    if (enemies.every(e => e.currentHp <= 0) || players.every(p => p.currentHp <= 0)) break
  }

  const victory = enemies.every(e => e.currentHp <= 0)

  events.push({
    type: victory ? 'victory' : 'defeat',
    message: victory
      ? '🏆 ¡Victoria! ¡El equipo de Dani ha ganado!'
      : '💀 Derrota... El equipo ha caído en combate.',
    ...snap(),
  })

  return { events, victory }
}

// ── Habilidades de jugador ──
function firePlayerAbility(actor, players, enemies, events, snap) {
  actor.abilityUsed = true

  switch (actor.id) {
    case 'dani': {
      players.forEach(p => { p.damageBoost = (p.damageBoost || 1) * 1.2 })
      events.push({ type: 'ability', attackerId: 'dani', message: `✨ Dani usa Crisis Controlada — equipo +20% daño`, ...snap() })
      break
    }
    case 'irene': {
      players.forEach(p => { p.currentDefense += 5 })
      events.push({ type: 'ability', attackerId: 'irene', message: `🛡️ Irene usa Orden en el Caos — equipo +5 defensa`, ...snap() })
      break
    }
    case 'gaia': {
      const wounded = players.filter(p => p.currentHp > 0).sort((a, b) => (a.currentHp / a.maxHp) - (b.currentHp / b.maxHp))[0]
      if (wounded) {
        wounded.shield = (wounded.shield || 0) + 25
        events.push({ type: 'ability', attackerId: 'gaia', targetId: wounded.id, message: `🐕 Gaia usa Ladrido Protector — protege a ${wounded.name} (escudo +25)`, ...snap() })
      }
      break
    }
    case 'yeray': {
      players.forEach(p => { p.currentAttack += 4 })
      events.push({ type: 'ability', attackerId: 'yeray', message: `📋 Yeray usa Plan Perfecto — equipo +4 ataque`, ...snap() })
      break
    }
    case 'maria': {
      const mostWounded = players.filter(p => p.currentHp > 0).sort((a, b) => (a.maxHp - a.currentHp) - (b.maxHp - b.currentHp)).reverse()[0]
      if (mostWounded) {
        const heal = Math.min(30, mostWounded.maxHp - mostWounded.currentHp)
        mostWounded.currentHp += heal
        events.push({ type: 'heal', attackerId: 'maria', targetId: mostWounded.id, heal, message: `💚 María usa Calma del Grupo — cura ${heal} HP a ${mostWounded.name}`, ...snap() })
      }
      break
    }
    case 'moka': {
      actor.critChance = 1.0
      events.push({ type: 'ability', attackerId: 'moka', message: `🐱 Moka usa Zarpazo Invisible — próximo ataque: CRÍTICO garantizado`, ...snap() })
      // El ataque crítico se ejecutará justo después
      const targets = enemies.filter(e => e.currentHp > 0)
      if (targets.length) {
        const target = targets[Math.floor(Math.random() * targets.length)]
        const rawDmg = Math.max(1, actor.currentAttack - target.currentDefense)
        const damage = Math.round(rawDmg * (actor.critMultiplier || 1.5) * 3)
        target.currentHp = Math.max(0, target.currentHp - damage)
        actor.critChance = 0.12
        events.push({ type: 'crit', attackerId: 'moka', targetId: target.id, damage, isCrit: true, message: `⚡ ¡Moka ZARPAZO CRÍTICO! — ${damage} de daño a ${target.name}`, ...snap() })
        if (target.currentHp <= 0) events.push({ type: 'death', unitId: target.id, isEnemy: true, message: `💀 ${target.name} ha sido derrotado`, ...snap() })
      }
      break
    }
    case 'jaime': {
      players.forEach(p => { p.critMultiplier = (p.critMultiplier || 1.5) + 0.5 })
      events.push({ type: 'ability', attackerId: 'jaime', message: `🌊 Jaime usa Marea Creativa — daño crítico del equipo +50%`, ...snap() })
      break
    }
    case 'lulu': {
      const allies = players.filter(p => p.id !== 'lulu' && p.currentHp > 0)
      if (allies.length) {
        const ally = allies[Math.floor(Math.random() * allies.length)]
        ally.currentAttack += 5
        ally.currentDefense += 3
        events.push({ type: 'ability', attackerId: 'lulu', targetId: ally.id, message: `✨ Lulú usa Buff de Realidad — ${ally.name} +5 ataque +3 defensa`, ...snap() })
      }
      break
    }
    case 'loki': {
      const target = enemies.filter(e => e.currentHp > 0)[0]
      if (target) {
        target.stunned = true
        events.push({ type: 'ability', attackerId: 'loki', targetId: target.id, message: `🐕 Loki usa Mordisco de Border Collie — aturde a ${target.name}`, ...snap() })
      }
      break
    }
    default: break
  }
}

// ── Habilidad del Boss ──
function fireBossAbility(boss, players, events, snap) {
  players.forEach(p => {
    p.currentAttack = Math.max(1, p.currentAttack - 6)
    p.currentDefense = Math.max(0, p.currentDefense - 4)
  })
  events.push({
    type: 'boss-ability',
    attackerId: boss.id,
    message: `💀 Los 30 usan "Ahora te duele todo" — equipo -6 ataque y -4 defensa`,
    ...snap(),
  })
}
