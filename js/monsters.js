
import markdownit from 'markdown-it'
const md = markdownit()

export {
    loadMonster,
    fetchMonster,
    monsterToPrintable,
    open5eToMonster,
    titleCase,
    statToMod,
    calcDerived,
    crToMonster
}

import { 
    CHALLENGE_RATING,
    ARMOR_TYPES,
    SIZE_TO_HIT_DIE,
    DAMAGE_TYPES,
    SKILLS,
    SKILLS_TO_STATS,
    ACTIONS_TO_LABELS,
    DEFAULT_MONSTER,
    FORGE_OF_FOES_STATS,
    STAT_MOD_SHORTHAND
} from "./tables"

function titleCase(s) {
    return (!s) ? s : s.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
}

function statToMod(stat) {
    return Math.floor((stat - 10) / 2)
}

async function fetchMonster(url) {
    const mon = await fetch(url)
        .then(response => response.json())
    return mon
}

async function loadMonster() {
    return await fetch('http://localhost:3000/amikuk.json')
        .then(response => response.json())
}

function chooseModPrefix(s) {
    return s < 0 ? "–" : "+";
}

// Calculate certain derived values for convenience.
function calcDerived(m) {

    // Get stat modifiers.
    m.strMod = statToMod(m.strength)
    m.dexMod = statToMod(m.dexterity)
    m.conMod = statToMod(m.constitution)
    m.intMod = statToMod(m.intelligence)
    m.wisMod = statToMod(m.wisdom)
    m.chaMod = statToMod(m.charisma)

    // Recalculate AC based on modifiers.

    // Get proficiency bonus.
    m.profBonus = CHALLENGE_RATING[m.challengeRating].proficiency;

    // Aggregate special damage modifiers.
    m.hasSpecialDamage = (
        m.damageImmunities.length > 0 || 
        m.damageResistances.length > 0 ||
        m.damageVulnerabilities.length > 0
    )

    // Set skill bonuses.
    for(const skill of SKILLS) {
        if(!(skill in m.skillProficiencies)) {
            m.skillProficiencies[skill] = { bonus: 0, type: 'unproficient' }
        }
        const statMod = SKILLS_TO_STATS[skill](m)
        const profType = m.skillProficiencies[skill].type
        let bonus = m.skillProficiencies[skill].bonus
        if(profType == 'unproficient') {
            bonus = statMod
        } else if(profType == 'proficient') {
            bonus = statMod + m.profBonus
        } else if(profType == 'expertise') {
            bonus = statMod + (m.profBonus * 2)
        }
        m.skillProficiencies[skill].bonus = bonus
        m.skillProficiencies[skill].printable = `${titleCase(skill)} ${chooseModPrefix(bonus)}${Math.abs(bonus)}`
    }

    // Make sure the labels line up.
    for(const prop of Object.values(m.properties)) {
        prop.typeName = ACTIONS_TO_LABELS[prop.type]
    }

    // Calculate passive perception.
    m.passivePerception = 10 + m.skillProficiencies['perception'].bonus

    m.strength_save = m.strMod + (m.saves['strength'] ? m.profBonus : 0)
    m.dexterity_save = m.dexMod + (m.saves['dexterity'] ? m.profBonus : 0)
    m.constitution_save = m.conMod + (m.saves['constitution'] ? m.profBonus : 0)
    m.intelligence_save = m.intMod + (m.saves['intelligence'] ? m.profBonus : 0)
    m.wisdom_save = m.wisMod + (m.saves['wisdom'] ? m.profBonus : 0)
    m.charisma_save = m.chaMod + (m.saves['charisma'] ? m.profBonus : 0)

    return m
}

// Get damage types string, return array of types.
function parseDamageType(damageTypes) {
    let parsing = damageTypes.toLowerCase()
    const parsed = []
    if(!damageTypes) {
        return parsed
    }
    
    // Match physical bypass at end.
    const physicalBypass = /^(.*)(bludgeoning, piercing, and slashing(.*))$/.exec(parsing)
    if(physicalBypass && physicalBypass[2]) {
        parsed.push(physicalBypass[2])
        parsing = physicalBypass[1]
    }
    // Try our best to match other weird catch-alls.
    let etc = /^(.*); (.+)$/.exec(parsing)
    if(etc && etc[2]) {
        parsed.push(etc[2])
        parsing = etc[1]
    }

    for(const type of DAMAGE_TYPES) {
        const re = new RegExp(`^(${type})[,;]? ?(.*)`)
        const foundThisType = re.exec(parsing)
        if(foundThisType && foundThisType[1]) {
            parsing = foundThisType[2]
            parsed.push(foundThisType[1])
        }
    }

    // Just take whatever's left as one type.
    parsed.push(parsing)
    return parsed
}

// Create quick monster based of CR and proficient stat.
function crToMonster(cr, stat) {
    const m = structuredClone(DEFAULT_MONSTER)
    const ffStats = FORGE_OF_FOES_STATS[cr]
    m.challengeRating = cr
    m.name = `Challenge ${cr} Monster`
    m.armorClass = ffStats.dc
    if(ffStats.attacks > 1) {
        m.properties.push({
                name: 'Multiattack',
                description: `The [MON] makes up to ${ffStats.attacks} attacks.`,
                type: 'action',
                typeName: ACTIONS_TO_LABELS['action']
        })
    }
    const hp = /(\d+) \((.+)\)/.exec(ffStats.hp)
    m.hpType = 'manual'
    m.hitPoints = parseInt(hp[1])
    m.hitDiceExpr = hp[2]
    m.properties.push({
        name: 'Attack',
        description: `Melee or Ranged Attack: +${ffStats.bonus} to hit, 5 ft. or 60 ft., ${ffStats.damagePerAttack} damage.`,
        type: 'action',
        typeName: ACTIONS_TO_LABELS['action']
    })
    return m
}

// Parse Open5e monster statblock data.
function open5eToMonster(m) {
    if(!m) {
        return m
    }

    m.shortName = ''

    // Get stat modifiers.
    m.strMod = statToMod(m.strength)
    m.dexMod = statToMod(m.dexterity)
    m.conMod = statToMod(m.constitution)
    m.intMod = statToMod(m.intelligence)
    m.wisMod = statToMod(m.wisdom)
    m.chaMod = statToMod(m.charisma)

    // Get proficiency bonus from CR.
    m.challengeRating = m.challenge_rating
    m.profBonus = CHALLENGE_RATING[m.challengeRating].proficiency;

    // Transfer save modifiers.
    m.saves = {}
    m.saves['strength'] = Boolean(m.strength_save)
    m.saves['dexterity'] = Boolean(m.dexterity_save)
    m.saves['constitution'] = Boolean(m.constitution_save)
    m.saves['intelligence'] = Boolean(m.intelligence_save)
    m.saves['wisdom'] = Boolean(m.wisdom_save)
    m.saves['charisma'] = Boolean(m.charisma_save)

    // Load skills as array.
    const skillsEnabled = Object.entries(m.skills).map(([k, v], _) => k)
    const skillProficiencies = {}
    // Load skill bonuses as object.
    for(const skill of SKILLS) {
        const statMod = SKILLS_TO_STATS[skill](m)
        let bonus = statMod
        let profType = 'unproficient'
        if(skill in m.skills) {
            bonus = m.skills[skill]
            // Determine which type of proficiency (unprof/prof/exp/custom)
            if(bonus == statMod) {
                profType = 'unproficient'
            } else if(bonus == statMod+m.profBonus) {
                profType = 'proficient'
            } else if(bonus == statMod+m.profBonus) {
                profType = 'expertise'
            } else {
                profType = 'custom'
            }
        }
        // Add as non-proficient otherwise.
        skillProficiencies[skill] = {
            type: profType,
            bonus: bonus
        }
    }
    m.skillsEnabled = skillsEnabled
    m.skillProficiencies = skillProficiencies

    // Aggregate action types.
    let ordering = 0
    m.propId = 0
    m.properties = {}
    const atypes = [
        { arr: m.actions, type: 'action', typeName: 'Action' },
        { arr: m.bonus_actions, type: 'bonusAction', typeName: 'Bonus Action' },
        { arr: m.reactions, type: 'reaction', typeName: 'Reaction' },
        { arr: m.special_abilities, type: 'ability', typeName: 'Ability' },
    ]

    for(const atype of atypes) {
        if(!atype.arr) {
            continue;
        }

        ordering = 0
        atype.arr.map((a) => {
            m.properties[m.propId] = {
                name: a.name,
                description: a.desc,
                attackBonus: a.attack_bonus,
                damageDice: a.damage_dice,
                type: atype.type,
                typeName: atype.typeName,
                ordering: ordering,
            }
            ordering++
            m.propId++
        })
    }

    // Split up damage types, filter out empty strings.
    m.damageResistances = parseDamageType(m.damage_resistances).filter((s) => s)
    m.damageVulnerabilities = parseDamageType(m.damage_vulnerabilities).filter((s) => s)
    m.damageImmunities = parseDamageType(m.damage_immunities).filter((s) => s)
    m.conditionImmunities = m.condition_immunities.split(", ").filter((s) => s)

    // Regex-search for each special sense.
    let senses = {}
    const darkvision = /darkvision (\d+) ft./.exec(m.senses)
    if(darkvision && darkvision[1]) {
        senses.darkvision = parseInt(darkvision[1])
    } else {
        senses.darkvision = 0
    }
    const blindsight = /blindsight (\d+) ft./.exec(m.senses)
    if(blindsight && blindsight[1]) {
        senses.blindsight = parseInt(blindsight[1])
    } else {
        senses.blindsight = 0
    }
    const tremorsense = /tremorsense (\d+) ft./.exec(m.senses)
    if(tremorsense && tremorsense[1]) {
        senses.tremorsense = parseInt(tremorsense[1])
    } else {
        senses.tremorsense = 0
    }
    const truesight = /truesight (\d+) ft./.exec(m.senses)
    if(truesight && truesight[1]) {
        senses.truesight = parseInt(truesight[1])
    } else {
        senses.truesight = 0
    }
    m.senses = senses

    // TODO: try/catch manual if hitdice regex fails
    m.hpType = "hitdice"
    m.hitPoints = m.hit_points
    m.hitDiceExpr = m.hit_dice
    m.numHitDice = parseInt(/^(\d+)d\d+(\+\d+)?$/.exec(m.hit_dice)[1])

    // Set unused speeds to 0.
    if(!m.speed.walk) {
        m.speed.walk = 0
    }
    if(!m.speed.fly) {
        m.speed.fly = 0
    }
    if(!m.speed.swim) {
        m.speed.swim = 0
    }
    if(!m.speed.burrow) {
        m.speed.burrow = 0
    }
    if(!m.speed.climb) {
        m.speed.climb = 0
    }
    if(!m.speed.hover) {
        m.speed.hover = false
    }

    // Set armor type to custom by default.
    m.armorType = "other"
    m.customArmorType = m.armor_desc
    m.armorClass = m.armor_class
    if(m.type) {
        m.type = m.type.toLowerCase()
    }
    if(m.size) {
        m.size = m.size.toLowerCase()
    }

    // Set to two-column by default.
    m.twoColumnsEnabled = false

    return m
}

// Parse our shorthand expressions.
// [MON] = monster name
// [#D#+/-#] = dice expression
// [STAT ATK/SAVE +/-#] = dice expression with save/atk modifiers.
const MON_REGEX = '\\[MON\\]'
// TODO: handle DICE+STAT
const DICE_REGEX = '\\[(\\d+)[Dd](\\d+)( ?([+\\-])(\\d+))?\\]'
const ATK_SAVE_REGEX = '\\[(STR|DEX|CON|INT|WIS|CHA) (ATK|SAVE) ?(([+\\-]) ?(\\d+))?\\]'
function parseShorthand(m, shorthand) {
    const monMatch = (new RegExp(MON_REGEX)).exec(shorthand)
    const diceMatch = (new RegExp(DICE_REGEX)).exec(shorthand)
    const atkMatch = (new RegExp(ATK_SAVE_REGEX)).exec(shorthand)

    if(monMatch) {
        if(m.shortName) {
            return m.shortName
        }
        return m.name
    }
    if(diceMatch) {
        // Matching NdN+/-N.
        const num = parseInt(diceMatch[1])
        const size = parseInt(diceMatch[2])

        // Parse modifier if present.
        let mod = 0
        if(diceMatch[3]) {
            mod = parseInt(diceMatch[5])
            if(diceMatch[4] == '-') {
                mod = -mod
            }
        }

        // Average value of die is (size + 1) / 2
        const avg = Math.floor(((size + 1) / 2) * num) + mod
        let expr = `${num}d${size}`
        if(mod != 0) {
            expr += ` ${chooseModPrefix(mod)} ${Math.abs(mod)}`
        }
        return `${avg} (${expr})`
    } else if(atkMatch) {
        const statMod = m[STAT_MOD_SHORTHAND[atkMatch[1]]]
        const calcType = atkMatch[2]
        let mod = 0
        if(atkMatch[3]) {
            mod = parseInt(atkMatch[5])
            if(atkMatch[4] == '-') {
                mod = -mod
            }
        }

        if(calcType == 'ATK') {
            // Calculate attack bonus.
            const bonus = statMod + m.profBonus + mod
            return `${chooseModPrefix(bonus)}${Math.abs(bonus)}`
        } else {
            // Otherwise, calculate save DC.
            const dc = 8 + statMod + m.profBonus + mod
            return `DC ${dc}`
        }
    }
}

function formatAbilityDescription(m, text) {
    let newText = ''

    // Match+replace all shorthand expressions.
    const shorthand = new RegExp(`(${MON_REGEX}|${DICE_REGEX}|${ATK_SAVE_REGEX})`, 'g')
    const matches = text.match(shorthand)
    let head = 0
    let tail = 0
    if(matches) {
        for(const match of matches) {
            // Grab everything up before the match.
            tail = text.indexOf(match, head)
            newText += text.slice(head, tail)
            head = tail

            // Splice monster name in the middle.
            newText += parseShorthand(m, match)

            // Advance.
            head += match.length
            tail = head
        }
        newText += text.slice(tail)
    } else {
        newText = text
    }

    return md.renderInline(newText)
}

// Filter monster properties by type and format into printable.
function filterMonsterProps(m, actionType) {
    return Object.values(m.properties)
        .filter(p => p.type == actionType)
        .toSorted((a, b) => a.ordering - b.ordering)
        .map(a => {
            return { 
                name: `${a.name}.`, 
                description: formatAbilityDescription(m, a.description)
            }
        })
}

// Convert monster data to display format.
function monsterToPrintable(m) {

    // Use custom type if provided.
    let type = m.type
    if (m.type == 'other') {
        if (m.customType) {
            type = m.customType
        } else {
            type = ""
        }
    }
    // Format subtype.
    let subtype = ""
    if (m.subtype) {
        subtype = ` (${m.subtype})`
    }

    // Format HP, calculating from hit dice if necessary.
    let hpStr = ""
    if(m.hpType == 'hitdice') {
        // (HD * average) + (HD * CON mod)
        const hdAverage = SIZE_TO_HIT_DIE[m.size].average
        const hdSize = SIZE_TO_HIT_DIE[m.size].die
        let hitPoints = Math.floor(m.numHitDice * hdAverage)
        let hitDiceExpr = `${m.numHitDice}${hdSize}`
        if(m.conMod > 0) {
            hitPoints += m.numHitDice * m.conMod
            hitDiceExpr += `+${m.conMod*m.numHitDice}`
        }
        hpStr = `${hitPoints} (${hitDiceExpr})`
    } else {
        hpStr = `${m.hitPoints} (${m.hitDiceExpr})`
    }

    // Format speeds.
    let speeds = []
    if (m.speed.walk && m.speed.walk > 0) {
        speeds.push(`${m.speed.walk} ft.`)
    }
    if (m.speed.fly && m.speed.fly > 0) {
        if (m.speed.hover) {
            speeds.push(`fly ${m.speed.fly} ft. (hover)`)
        } else {
            speeds.push(`fly ${m.speed.fly} ft.`)
        }
    }
    if (m.speed.swim && m.speed.swim > 0) {
        speeds.push(`swim ${m.speed.swim} ft.`)
    }
    if (m.speed.burrow && m.speed.burrow > 0) {
        speeds.push(`burrow ${m.speed.burrow} ft.`)
    }
    if (m.speed.climb && m.speed.climb > 0) {
        speeds.push(`climb ${m.speed.climb} ft.`)
    }

    // Format saves.
    let saves = []
    if (m.saves['strength'] && m.strength_save) {
        saves.push(`Str +${m.strength_save}`)
    }
    if (m.saves['dexterity'] && m.dexterity_save) {
        saves.push(`Dex +${m.dexterity_save}`)
    }
    if (m.saves['constitution'] && m.constitution_save) {
        saves.push(`Con +${m.constitution_save}`)
    }
    if (m.saves['intelligence'] && m.intelligence_save) {
        saves.push(`Int +${m.intelligence_save}`)
    }
    if (m.saves['wisdom'] && m.wisdom_save) {
        saves.push(`Wis +${m.wisdom_save}`)
    }
    if (m.saves['charisma'] && m.charisma_save) {
        saves.push(`Cha +${m.charisma_save}`)
    }

    // Format armor class.
    let armorType = ""
    let armorClass = 0
    if(m.armorType == "other") {
        armorType = m.customArmorType
        armorClass = m.armorClass
    } else {
        armorType = ARMOR_TYPES[m.armorType].description.toLowerCase()
        // Calculate AC based on type.
        armorClass = ARMOR_TYPES[m.armorType].calc(m)
    }
    let acStr = armorClass.toString()
    if(armorType) {
        acStr += ` (${armorType})`
    }

    // Format senses.
    let senses = Object.entries(m.senses)
        .filter(([sense, value], _) => value > 0)
        .map(([sense, value], _) => `${sense} ${value} ft.`)
    // Keep passive perception non-breaking.
    senses.push(`passive\u00A0Perception\u00A0${m.passivePerception}`)

    // Format challenge rating.
    const xpStr = CHALLENGE_RATING[m.challengeRating].xp.toLocaleString()
    
    // Format skills.
    let skills = m.skillsEnabled.map((skill) => {
        return m.skillProficiencies[skill].printable
    })

    const mon = {
        name: m.name,
        type: `${titleCase(m.size)} ${type.toLowerCase()}${subtype}, ${m.alignment.toLowerCase()}`,
        ac: acStr,
        hp: hpStr,
        speed: speeds.join(", "),
        stats: [
            m.strength,
            m.dexterity,
            m.constitution,
            m.intelligence,
            m.wisdom,
            m.charisma
        ],
        saves: saves.join(", "),
        skills: skills.join(", "),
        // TODO: properly sort these with the extra string at the end
        damageVulnerabilities: m.damageVulnerabilities.sort().join(", "),
        damageResistances: m.damageResistances.sort().join(", "),
        damageImmunities: m.damageImmunities.sort().join(", "),
        conditionImmunities: m.conditionImmunities.sort().join(", "),
        senses: senses.join(", "),
        languages: m.languages ? m.languages : '—',
        cr: `${m.challengeRating} (${xpStr} XP)`,
        abilities: filterMonsterProps(m, 'ability'),
        actions: filterMonsterProps(m, 'action'),
        bonusActions: filterMonsterProps(m, 'bonusAction'),
        reactions: filterMonsterProps(m, 'reaction'),
        legendary: {
            isLegendary: false
        },
        proficiencyBonus: `+${m.profBonus}`,
        twoColumnsEnabled: m.twoColumnsEnabled
    }

    return mon
}
