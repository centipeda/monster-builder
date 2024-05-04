
export const CRS = [
    "0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5",
    "6", "7", "8", "9", "10", "11", "12", "13", "14",
    "15", "16", "17", "18", "19", "20", "21", "22",
    "23", "24", "25", "26", "27", "28", "29", "30",
]
export const CHALLENGE_RATING = {
    "0": {
        xp: 0,
        proficiency: 2,
    },
    "1/8": {
        xp: 25,
        proficiency: 2,
    },
    "1/4": {
        xp: 50,
        proficiency: 2,
    },
    "1/2": {
        xp: 100,
        proficiency: 2,
    },
    "1": {
        xp: 200,
        proficiency: 2,
    },
    "2": {
        xp: 450,
        proficiency: 2,
    },
    "3": {
        xp: 700,
        proficiency: 2,
    },
    "4": {
        xp: 1100,
        proficiency: 2,
    },
    "5": {
        xp: 1800,
        proficiency: 3,
    },
    "6": {
        xp: 2300,
        proficiency: 3,
    },
    "7": {
        xp: 2900,
        proficiency: 3,
    },
    "8": {
        xp: 3900,
        proficiency: 3,
    },
    "9": {
        xp: 5000,
        proficiency: 4,
    },
    "10": {
        xp: 5900,
        proficiency: 4,
    },
    "11": {
        xp: 7200,
        proficiency: 4,
    },
    "12": {
        xp: 8400,
        proficiency: 4,
    },
    "13": {
        xp: 10000,
        proficiency: 5,
    },
    "14": {
        xp: 11500,
        proficiency: 5,
    },
    "15": {
        xp: 13000,
        proficiency: 5,
    },
    "16": {
        xp: 15000,
        proficiency: 5,
    },
    "17": {
        xp: 18000,
        proficiency: 6,
    },
    "18": {
        xp: 20000,
        proficiency: 6,
    },
    "19": {
        xp: 22000,
        proficiency: 6,
    },
    "20": {
        xp: 25000,
        proficiency: 6,
    },
    "21": {
        xp: 33000,
        proficiency: 7,
    },
    "22": {
        xp: 41000,
        proficiency: 7,
    },
    "23": {
        xp: 50000,
        proficiency: 7,
    },
    "24": {
        xp: 62000,
        proficiency: 7,
    },
    "25": {
        xp: 75000,
        proficiency: 8,
    },
    "26": {
        xp: 90000,
        proficiency: 8,
    },
    "27": {
        xp: 105000,
        proficiency: 8,
    },
    "28": {
        xp: 120000,
        proficiency: 8,
    },
    "29": {
        xp: 135000,
        proficiency: 9,
    },
    "30": {
        xp: 155000,
        proficiency: 9,
    },
}

export const SIZES = [
    "tiny",
    "small",
    "medium",
    "large",
    "huge",
    "gargantuan"
]

export const SIZE_TO_HIT_DIE = {
    "tiny": {
        average: 2.5,
        die: "d4"
    },
    "small": {
        average: 3.5,
        die: "d6"
    },
    "medium": {
        average: 4.5,
        die: "d8"
    },
    "large": {
        average: 5.5,
        die: "d10"
    },
    "huge": {
        average: 6.5,
        die: "d12"
    },
    "gargantuan": {
        average: 10.5,
        die: "d20"
    },
}

export const MONSTER_TYPES = [
    "aberration",
    "celestial",
    "construct",
    "dragon",
    "elemental",
    "fey",
    "fiend",
    "giant",
    "humanoid",
    "monstrosity",
    "plant",
    "undead",
    "other"
]

// TODO: add extra armor types (unarmored defense, suave defense, etc.)
export const ARMOR_TYPES = {
    "other": {
        description: "Other",
        type: "other",
        calc: (m) => m.armorClass
    },
    "natural_armor": {
        description: "Natural Armor",
        type: "natural_armor",
        calc: (m) => m.armorClass
    },
    "mage_armor": {
        description: "Mage Armor",
        type: "mage_armor",
        calc: (m) => 13 + m.dexMod
    },
    "padded": {
        description: "Padded Armor",
        type: "padded",
        calc: (m) => 12 + m.dexMod
    },
    "leather_armor": {
        description: "Leather Armor",
        type: "leather_armor",
        calc: (m) => 11 + m.dexMod
    },
    "studded_leather": {
        description: "Studded Leather",
        type: "studded_leather",
        calc: (m) => 12 + m.dexMod
    },
    "hide_armor": {
        description: "Hide Armor",
        type: "hide_armor",
        calc: (m) => 12 + Math.min(m.dexMod, 2)
    },
    "chain_shirt": {
        description: "Chain Shirt",
        type: "chain_shirt",
        calc: (m) => 13 + Math.min(m.dexMod, 2)
    },
    "scale_mail": {
        description: "Scale Mail",
        type: "scale_mail",
        calc: (m) => 14 + Math.min(m.dexMod, 2)
    },
    "breastplate": {
        description: "Breastplate",
        type: "breastplate",
        calc: (m) => 14 + Math.min(m.dexMod, 2)
    },
    "half_plate": {
        description: "Half Plate",
        type: "half_plate",
        calc: (m) => 15 + Math.min(m.dexMod, 2)
    },
    "ring_mail": {
        description: "Ring Mail",
        type: "ring_mail",
        calc: () => 14
    },
    "chain_mail": {
        description: "Chain Mail",
        type: "chain_mail",
        calc: () => 16
    },
    "splint": {
        description: "Splint",
        type: "splint",
        calc: () => 17
    },
    "plate_armor": {
        description: "Plate Armor",
        type: "plate_armor",
        calc: () => 18
    },
}

export const MANUAL_ARMOR_TYPES = [
    "natural_armor",
    "other"
]

export const SKILLS = [
    "athletics",
    "acrobatics",
    "sleight of hand",
    "stealth",
    "arcana",
    "history",
    "investigation",
    "nature",
    "religion",
    "animal handling",
    "insight",
    "medicine",
    "perception",
    "survival",
    "deception",
    "intimidation",
    "performance",
    "persuasion",
]

export const SKILL_TO_STAT_NAME = {
    "athletics": "strength",
    "acrobatics": "dexterity",
    "sleight of hand": "dexterity",
    "stealth": "dexterity",
    "arcana": "intelligence",
    "history": "intelligence",
    "investigation": "intelligence",
    "nature": "intelligence",
    "religion": "intelligence",
    "animal handling": "wisdom",
    "insight": "wisdom",
    "medicine": "wisdom",
    "perception": "wisdom",
    "survival": "wisdom",
    "deception": "charisma",
    "intimidation": "charisma",
    "performance": "charisma",
    "persuasion": "charisma",
}

export const SKILLS_TO_STATS = {
    "athletics": (m) => m.strMod,
    "acrobatics": (m) => m.dexMod,
    "sleight of hand": (m) => m.dexMod,
    "stealth": (m) => m.dexMod,
    "arcana": (m) => m.intMod,
    "history": (m) => m.intMod,
    "investigation": (m) => m.intMod,
    "nature": (m) => m.intMod,
    "religion": (m) => m.intMod,
    "animal handling": (m) => m.wisMod,
    "insight": (m) => m.wisMod,
    "medicine": (m) => m.wisMod,
    "perception": (m) => m.wisMod,
    "survival": (m) => m.wisMod,
    "deception": (m) => m.chaMod,
    "intimidation": (m) => m.chaMod,
    "performance": (m) => m.chaMod,
    "persuasion": (m) => m.chaMod,
}

export const DAMAGE_TYPES = [
    "acid",
    "cold",
    "fire",
    "lightning",
    "thunder",
    "poison",
    "necrotic",
    "radiant",
    "force",
    "psychic",
    "piercing",
    "bludgeoning",
    "slashing"
]

export const CONDITIONS = [
    "blinded",
    "charmed",
    "deafened",
    "exhausted",
    "frightened",
    "grappled",
    "incapacitated",
    "paralyzed",
    "petrified",
    "poisoned",
    "prone",
    "restrained",
    "stunned",
    "unconscious"
]

export const SKILL_OPTIONS = [
    {
        stat: "Strength",
        skills: [
            { label: "Athletics", value: "athletics" },
        ]
    },
    {
        stat: "Dexterity",
        skills: [
            { label: "Acrobatics", value: "acrobatics" },
            { label: "Sleight of Hand", value: "sleight of hand" },
            { label: "Stealth", value: "stealth" }
        ]
    },
    {
        stat: "Intelligence",
        skills: [
            { label: "Arcana", value: "arcana" },
            { label: "History", value: "history" },
            { label: "Investigation", value: "investigation" },
            { label: "Nature", value: "nature" },
            { label: "Religion", value: "religion" },
        ]
    },
    {
        stat: "Wisdom",
        skills: [
            { label: "Animal Handling", value: "animal handling" },
            { label: "Insight", value: "insight" },
            { label: "Medicine", value: "medicine" },
            { label: "Perception", value: "perception" },
            { label: "Survival", value: "survival" },
        ]
    },
    {
        stat: "Charisma",
        skills: [
            { label: "Deception", value: "deception" },
            { label: "Intimidation", value: "intimidation" },
            { label: "Performance", value: "performance" },
            { label: "Persuasion", value: "persuasion" }
        ]
    },
]

export const PROFTYPE_OPTIONS = [
    {
        label: "Proficiency",
        value: "proficient",
    },
    {
        label: "Expertise",
        value: "expertise",
    },
    {
        label: "Custom",
        value: "custom",
    },
]

export const CR_OPTIONS = CRS.map((cr) => {
    const obj = CHALLENGE_RATING[cr]
    const xp = obj.xp.toLocaleString()
    const prof = obj.proficiency
    return {
        rating: cr,
        label: `CR  ${cr} (${xp} XP, proficiency +${prof})`
    }
})

export const STAT_MOD_SHORTHAND = {
    "STR": "strMod",
    "DEX": "dexMod",
    "CON": "conMod",
    "INT": "intMod",
    "WIS": "wisMod",
    "CHA": "chaMod",
}

export const STAT_OPTIONS = [
    { label: 'Strength', value: 'strength'},
    { label: 'Dexterity', value: 'dexterity'},
    { label: 'Constitution', value: 'constitution'},
    { label: 'Intelligence', value: 'intelligence'},
    { label: 'Wisdom', value: 'wisdom'},
    { label: 'Charisma', value: 'charisma'},
]

// Extra damage types for autocomplete suggestions.
export const DAMAGE_SUGGESTIONS = DAMAGE_TYPES.concat([
    "bludgeoning, piercing, and slashing from nonmagical attacks",
])

export const ACTIONS_TO_LABELS = {
    "action": "Action",
    "bonusAction": "Bonus Action",
    "reaction": "Reaction",
    "ability": "Ability",
}

export const DEFAULT_MONSTER = {
    name: 'Monster',
    shortName: '',
    type: 'humanoid',
    subtype: 'human',
    size: 'medium',
    alignment: 'unaligned',
    armorType: 'natural_armor',
    armorClass: 10,
    hpType: 'hitdice',
    numHitDice: 1,
    hitPoints: 4,
    hitDiceExpr: '1d8',
    languages: '',
    speed: {
        walk: 30,
        fly: 0,
        swim: 0,
        climb: 0,
        burrow: 0
    },
    saves: {
        'strength': false,
        'dexterity': false,
        'constitution': false,
        'intelligence': false,
        'wisdom': false,
        'charisma': false,
    },
    senses: {
        darkvision: 0,
        blindsight: 0,
        tremorsense: 0,
        truesight: 0,
    },
    challengeRating: '0',
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    skillsEnabled: [],
    skillProficiencies: {},
    skills: [],
    properties: {
        0: {
            name: 'Action',
            description: '_Melee Weapon Attack_: [STR ATK] to hit, [1D8] piercing damage.',
            type: 'action',
            typeName: 'Action',
            ordering: 0,
        }
    },
    propId: 1,
    damageImmunities: [],
    skillsEnabled: [],
    damageResistances: [],
    damageVulnerabilities: [],
    conditionImmunities: [],
    twoColumnsEnabled: false,
}

export const FORGE_OF_FOES_STATS = {
    '0': {
        eqLevel: '< 1',
        dc: 10,
        hp: '3 (2–4)',
        bonus: 2,
        damage: 2,
        attacks: 1,
        damagePerAttack: '2 (1d4)',
        example: 'Commoner, rat, spider'
    },
    '1/8': {
        eqLevel: '< 1',
        dc: 11,
        hp: '9 (7–11)',
        bonus: 3,
        damage: 3,
        attacks: 1,
        damagePerAttack: '4 (1d6 + 1)',
        example: 'Bandit, cultist, giant rat'
    },
    '1/4': {
        eqLevel: '1',
        dc: 11,
        hp: '13 (10–16)',
        bonus: 3,
        damage: 5,
        attacks: 1,
        damagePerAttack: '5 (1d6 + 2)',
        example: 'Acolyte, skeleton, wolf'
    },
    '1/2': {
        eqLevel: '2',
        dc: 12,
        hp: '22 (17–28)',
        bonus: 4,
        damage: 8,
        attacks: 2,
        damagePerAttack: '4 (1d4 + 2)',
        example: 'Black bear, scout, shadow'
    },
    '1': {
        eqLevel: '3',
        dc: 12,
        hp: '33 (25–41)',
        bonus: 5,
        damage: 12,
        attacks: 2,
        damagePerAttack: '6 (1d8 + 2)',
        example: 'Dire wolf, specter, spy'
    },
    '2': {
        eqLevel: '5',
        dc: 13,
        hp: '45 (34–56)',
        bonus: 5,
        damage: 17,
        attacks: 2,
        damagePerAttack: '9 (2d6 + 2)',
        example: 'Ghast, ogre, priest'
    },
    '3': {
        eqLevel: '7',
        dc: 13,
        hp: '65 (49–81)',
        bonus: 5,
        damage: 23,
        attacks: 2,
        damagePerAttack: '12 (2d8 + 3)',
        example: 'Knight, mummy, werewolf'
    },
    '4': {
        eqLevel: '9',
        dc: 14,
        hp: '84 (64–106)',
        bonus: 6,
        damage: 28,
        attacks: 2,
        damagePerAttack: '14 (3d8 + 1)',
        example: 'Ettin, ghost'
    },
    '5': {
        eqLevel: '10',
        dc: 15,
        hp: '95 (71–119)',
        bonus: 7,
        damage: 35,
        attacks: 3,
        damagePerAttack: '12 (3d6 + 2)',
        example: 'Elemental, gladiator, vampire spawn'
    },
    '6': {
        eqLevel: '11',
        dc: 15,
        hp: '112 (84–140)',
        bonus: 7,
        damage: 41,
        attacks: 3,
        damagePerAttack: '14 (3d6 + 4)',
        example: 'Mage, medusa, wyvern'
    },
    '7': {
        eqLevel: '12',
        dc: 15,
        hp: '130 (98–162)',
        bonus: 7,
        damage: 47,
        attacks: 3,
        damagePerAttack: '16 (3d8 + 3)',
        example: 'Stone giant, young black dragon'
    },
    '8': {
        eqLevel: '13',
        dc: 15,
        hp: '136 (102–170)',
        bonus: 7,
        damage: 53,
        attacks: 3,
        damagePerAttack: '18 (3d10 + 2)',
        example: 'Assassin, frost giant'
    },
    '9': {
        eqLevel: '15',
        dc: 16,
        hp: '145 (109–181)',
        bonus: 8,
        damage: 59,
        attacks: 3,
        damagePerAttack: '22 (3d12 + 3)',
        example: 'Bone devil, fire giant, young blue dragon'
    },
    '10': {
        eqLevel: '16',
        dc: 17,
        hp: '155 (116–194)',
        bonus: 9,
        damage: 65,
        attacks: 4,
        damagePerAttack: '16 (3d8 + 3)',
        example: 'Stone golem, young red dragon'
    },
    '11': {
        eqLevel: '17',
        dc: 17,
        hp: '165 (124–206)',
        bonus: 9,
        damage: 71,
        attacks: 4,
        damagePerAttack: '18 (3d10 + 2)',
        example: 'Djinni, efreeti, horned devil'
    },
    '12': {
        eqLevel: '18',
        dc: 17,
        hp: '175 (131–219)',
        bonus: 9,
        damage: 77,
        attacks: 4,
        damagePerAttack: '19 (3d10 + 3)',
        example: 'Archmage, erinyes'
    },
    '13': {
        eqLevel: '19',
        dc: 18,
        hp: '184 (138–230)',
        bonus: 10,
        damage: 83,
        attacks: 4,
        damagePerAttack: '21 (4d8 + 3)',
        example: 'Adult white dragon, storm giant, vampire'
    },
    '14': {
        eqLevel: '20',
        dc: 19,
        hp: '196 (147–245)',
        bonus: 11,
        damage: 89,
        attacks: 4,
        damagePerAttack: '22 (4d10)',
        example: 'Adult black dragon, ice devil'
    },
    '15': {
        eqLevel: '> 20',
        dc: 19,
        hp: '210 (158–263)',
        bonus: 11,
        damage: 95,
        attacks: 5,
        damagePerAttack: '19 (3d10 + 3)',
        example: 'Adult green dragon, mummy lord, purple worm'
    },
    '16': {
        eqLevel: '> 20',
        dc: 19,
        hp: '229 (172–286)',
        bonus: 11,
        damage: 101,
        attacks: 5,
        damagePerAttack: '22 (3d12 + 3)',
        example: 'Adult blue dragon, iron golem, marilith'
    },
    '17': {
        eqLevel: '> 20',
        dc: 20,
        hp: '246 (185–308)',
        bonus: 12,
        damage: 107,
        attacks: 5,
        damagePerAttack: '21 (4d8 + 3)',
        example: 'Adult red dragon'
    },
    '18': {
        eqLevel: '> 20',
        dc: 21,
        hp: '266 (200–333)',
        bonus: 13,
        damage: 113,
        attacks: 5,
        damagePerAttack: '23 (4d10 + 1)',
        example: 'Demilich'
    },
    '19': {
        eqLevel: '> 20',
        dc: 21,
        hp: '285 (214–356)',
        bonus: 13,
        damage: 119,
        attacks: 5,
        damagePerAttack: '24 (4d10 + 2)',
        example: 'Balor'
    },
    '20': {
        eqLevel: '> 20',
        dc: 21,
        hp: '300 (225–375)',
        bonus: 13,
        damage: 132,
        attacks: 5,
        damagePerAttack: '26 (4d12)',
        example: 'Ancient white dragon, pit fiend'
    },
    '21': {
        eqLevel: '> 20',
        dc: 22,
        hp: '325 (244–406)',
        bonus: 14,
        damage: 150,
        attacks: 5,
        damagePerAttack: '30 (4d12 + 4)',
        example: 'Ancient black dragon, lich, solar'
    },
    '22': {
        eqLevel: '> 20',
        dc: 23,
        hp: '350 (263–438)',
        bonus: 15,
        damage: 168,
        attacks: 5,
        damagePerAttack: '34 (4d12 + 8)',
        example: 'Ancient green dragon'
    },
    '23': {
        eqLevel: '> 20',
        dc: 23,
        hp: '375 (281–469)',
        bonus: 15,
        damage: 186,
        attacks: 5,
        damagePerAttack: '37 (6d10 + 4)',
        example: 'Ancient blue dragon, kraken'
    },
    '24': {
        eqLevel: '> 20',
        dc: 23,
        hp: '400 (300–500)',
        bonus: 15,
        damage: 204,
        attacks: 5,
        damagePerAttack: '41 (6d10 + 8)',
        example: 'Ancient red dragon'
    },
    '25': {
        eqLevel: '> 20',
        dc: 24,
        hp: '430 (323–538)',
        bonus: 16,
        damage: 222,
        attacks: 5,
        damagePerAttack: '44 (6d10 + 11)',
        example: ''
    },
    '26': {
        eqLevel: '> 20',
        dc: 25,
        hp: '460 (345–575)',
        bonus: 17,
        damage: 240,
        attacks: 5,
        damagePerAttack: '48 (6d10 + 15)',
        example: ''
    },
    '27': {
        eqLevel: '> 20',
        dc: 25,
        hp: '490 (368–613)',
        bonus: 17,
        damage: 258,
        attacks: 5,
        damagePerAttack: '52 (6d10 + 19)',
        example: ''
    },
    '28': {
        eqLevel: '> 20',
        dc: 25,
        hp: '540 (405–675)',
        bonus: 17,
        damage: 276,
        attacks: 5,
        damagePerAttack: '55 (6d10 + 22)',
        example: ''
    },
    '29': {
        eqLevel: '> 20',
        dc: 26,
        hp: '600 (450–750)',
        bonus: 18,
        damage: 294,
        attacks: 5,
        damagePerAttack: '59 (6d10 + 26)',
        example: ''
    },
    '30': {
        eqLevel: '> 20',
        dc: 27,
        hp: '666 (500–833)',
        bonus: 19,
        damage: 312,
        attacks: 5,
        damagePerAttack: '62 (6d10 + 29)',
        example: 'Tarrasque'
    }
}
