<script setup>
import {
    loadMonster,
    fetchMonster,
    monsterToPrintable,
    titleCase,
    open5eToMonster,
    calcDerived,
} from "./js/monsters";
import {
    SIZES,
    MONSTER_TYPES,
    ARMOR_TYPES,
    MANUAL_ARMOR_TYPES,
    CHALLENGE_RATING,
    CRS,
    SKILLS,
    SKILLS_TO_STATS,
    DAMAGE_TYPES,
    CONDITIONS,
    SKILL_TO_STAT_NAME,
    SKILL_OPTIONS,
    PROFTYPE_OPTIONS,
    CR_OPTIONS,
    DEFAULT_MONSTER
} from "./js/tables";

// Default form input settings.
const statblockHeight = ref(500);
const open5eName = ref("");
const selectedSkill = ref("");
const selectedDamageType = ref("force");
const customDamageType = ref("");
const selectedCondition = ref("blinded");
const sticky = ref(true)

// Load monster on page load, and handle retrieving from open5e API.
const monster = ref(calcDerived(structuredClone(DEFAULT_MONSTER)));
// Should change on any form input changes. Take this opportunity to recalculate any
// derived values.
const monsterPrintable = computed(() => {
    monster.value = calcDerived(monster.value);
    return monsterToPrintable(monster.value);
});
function fetchOpen5e() {
    const url = `https://api.open5e.com/monsters/${open5eName.value}/?format=json`;
    fetchMonster(url).then((m) => {
        monster.value = open5eToMonster(m);
    });
}
function newMonster() {
    monster.value = structuredClone(DEFAULT_MONSTER)
}

const hpTypes = ['hitdice', 'manual']
function getHpLabel(hpType) {
    return (hpType == 'hitdice') ? 'Hit Dice' : 'Manual'
}

function chooseStatModPrefix(s) {
    return s < 0 ? "–" : "+";
}

function removeSkill(skillName) {
    let mon = monster.value;

    // Remove from enabled skills.
    mon.skillsEnabled = mon.skillsEnabled.filter((s) => {
        return (s !== skillName)
    })

    // Reset skill proficiency to unproficient.
    mon.skillProficiencies[skillName].type = 'unproficient'

    monster.value = calcDerived(mon)
}

function addSkill(profBonus) {
    const mon = monster.value;
    const skill = selectedSkill.value;
    const bonus = SKILLS_TO_STATS[skill](mon) + profBonus;

    if (!(skill in mon.skillsEnabled)) {
        mon.skillsEnabled.push(skill)
    }

    mon.skillProficiencies[skill] = bonus;

    monster.value = calcDerived(mon)
}

function addAttr(attrType) {
    const mon = monster.value;
    const con = selectedCondition.value;
    let dmg = selectedDamageType.value;
    if (dmg == "other") {
        dmg = customDamageType.value;
    }

    if (
        attrType == "condition" &&
        con &&
        !mon.conditionImmunities.includes(con)
    ) {
        mon.conditionImmunities.push(con);
    } else if (dmg) {
        if (attrType == "resist" && !mon.damageResistances.includes(dmg)) {
            mon.damageResistances.push(dmg);
        }
        if (attrType == "immune" && !mon.damageImmunities.includes(dmg)) {
            mon.damageImmunities.push(dmg);
        }
        if (
            attrType == "vulnerable" &&
            !mon.damageVulnerabilities.includes(dmg)
        ) {
            mon.damageVulnerabilities.push(dmg);
        }
    }
    monster.value = calcDerived(mon);
}

function removeAttr(attrType, attr) {
    const mon = monster.value;
    if (attrType == "condition" && mon.conditionImmunities.includes(attr)) {
        mon.conditionImmunities = mon.conditionImmunities.filter(
            (a) => a !== attr
        );
    }
    if (attrType == "resist" && mon.damageResistances.includes(attr)) {
        mon.damageResistances = mon.damageResistances.filter((a) => a !== attr);
    }
    if (attrType == "vulnerable" && mon.damageVulnerabilities.includes(attr)) {
        mon.damageVulnerabilities = mon.damageVulnerabilities.filter(
            (a) => a !== attr
        );
    }
    if (attrType == "immune" && mon.damageImmunities.includes(attr)) {
        mon.damageImmunities = mon.damageImmunities.filter((a) => a !== attr);
    }
    monster.value = mon;
}

// If any selected skill is set to non-proficient, set to proficient.
function changeSkills(e) {
    const mon = monster.value
    for (const skill of e.value) {
        if (mon.skillProficiencies[skill].type == 'unproficient') {
            mon.skillProficiencies[skill].type = 'proficient'
        }
    }
    monster.value = calcDerived(mon)
}

</script>

<style>
@import url("primevue/resources/themes/lara-dark-blue/theme.css");
@import url("primeicons/primeicons.css");

/* AC/HP inputs. */
.two-column > div > h3 {
    margin-top: 0;
}
.two-column {
    display: grid;
    grid-template-columns: 2fr 1fr;
}
.ac-container {
    padding: 10px;
}
.hp-container {
    padding: 10px;
}

.app {
    margin-top: 50px;
}

/* Disable animations. */
.p-toggleable-content {
    transition: none;
}

.p-multiselect {
    transition: none;
}

.p-dropdown {
    transition: none;
}

.skill-selection {
    padding-top: 5px;
    justify-content: left;
    height: 2.5rem;
}

.skill-name.p-inputgroup-addon {
    justify-content: center;
    padding-left: 1rem;
    padding-right: 1rem;
    /* Too wide, looks weird. */
    /* width: 10rem; */
}

/* Width for both static/input skill bonuses. */
.skill-bonus.p-inputgroup-addon,
.skill-bonus.p-inputnumber {
    width: 3rem;
    max-width: 3rem;
}

.skill-type.p-dropdown {
    max-width: 10rem;
    align-items: center;
}

.ac-type.p-dropdown {
    max-width: 15rem;
}

/* Styling for both static/input AC */
.ac-display.p-inputgroup-addon,
.ac-display.p-inputnumber {
    width: 5rem;
    max-width: 5rem;
}

.ac-display > span > .p-button.p-button-icon-only {
    width: 1.5rem;
}

.ac-display > input.p-inputnumber-input {
    border-radius: 0;
}

/* .ac-display > .p-inputnumber-input {
    width: 1rem;
} */

.speed-grid {
    width: 80%;
    margin: auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;
    text-align: center;
}

.input-wrapper {
    min-width: 600px;
    width: 75%;
    margin: auto;
    margin-top: 25px;
}

#stat-wrapper {
    margin: auto;
    display: grid;
    /* grid-template-columns: 1fr 1fr 1fr; */
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    text-align: center;
    justify-content: space-evenly;
}

.stat {
    margin-left: 5px;
    margin-right: 5px;
}

.inline {
    display: inline;
}

.app {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

/* Set BG color everywhere. */
.app, body {
    background-color: var(--surface-ground);
}

p {
    font-family: "Noto Sans";
}

.form-input {
    width: 100%;
}

.top-flat > div,
.top-flat > input {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.bottom-flat > div,
.bottom-flat > input {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

</style>

<template>
    <div class="app">
        <!-- TODO: refactor into MonsterForm.vue? -->
        <NavBar v-model:monster="monster" v-model:sticky="sticky"/>

        <div class="input-wrapper">
            <Accordion :multiple="true" :activeIndex="[0]" :transitionDelay="0">
                <AccordionTab header="Stats">
                    <InputGroup class="bottom-flat">
                        <InputGroupAddon>Name</InputGroupAddon>
                        <InputText v-model="monster.name" placeholder="Name"></InputText>
                        <InputGroupAddon>Short Name</InputGroupAddon>
                        <InputText v-model="monster.shortName" placeholder="Shortened Name"></InputText>
                    </InputGroup>
                    <InputGroup class="top-flat bottom-flat">
                        <InputGroupAddon>Size</InputGroupAddon>
                        <Dropdown v-model="monster.size" :options="SIZES" :optionLabel="titleCase"
                            scrollHeight="350px" />
                        <InputGroupAddon>Alignment</InputGroupAddon>
                        <InputText v-model="monster.alignment" placeholder="Alignment" />
                    </InputGroup>
                    <InputGroup class="top-flat bottom-flat">
                        <InputGroupAddon>Type</InputGroupAddon>
                        <Dropdown v-model="monster.type" :options="MONSTER_TYPES" :optionLabel="titleCase"
                            scrollHeight="500px" />
                        <InputText v-model="monster.subtype" placeholder="Subtype" />
                    </InputGroup class="top-flat bottom-flat">
                    <InputGroup v-if="monster.type == 'other'">
                        <InputGroupAddon>Custom Type</InputGroupAddon>
                        <InputText v-model="monster.customType"></InputText>
                    </InputGroup>
                    <InputGroup class="top-flat bottom-flat">
                        <InputGroupAddon>Languages</InputGroupAddon>
                        <InputText v-model="monster.languages"></InputText>
                    </InputGroup>
                    <InputGroup class="top-flat">
                        <InputGroupAddon>Challenge Rating</InputGroupAddon>
                        <Dropdown scrollHeight="350px" :options="CR_OPTIONS" optionLabel="label" optionValue="rating"
                            v-model="monster.challengeRating" />
                    </InputGroup>

                    <Divider/>

                    <h3>Stats</h3>
                    <div id="stat-wrapper">
                        <StatEntry v-model:stat="monster.strength" v-model:save="monster.saves['strength']">
                            STR
                        </StatEntry>
                        <StatEntry v-model:stat="monster.dexterity" v-model:save="monster.saves['dexterity']">
                            DEX
                        </StatEntry>
                        <StatEntry v-model:stat="monster.constitution" v-model:save="monster.saves['constitution']">
                            CON
                        </StatEntry>
                        <StatEntry v-model:stat="monster.intelligence" v-model:save="monster.saves['intelligence']">
                            INT
                        </StatEntry>
                        <StatEntry v-model:stat="monster.wisdom" v-model:save="monster.saves['wisdom']">
                            WIS
                        </StatEntry>
                        <StatEntry v-model:stat="monster.charisma" v-model:save="monster.saves['charisma']">
                            CHA
                        </StatEntry>
                    </div>

                    <Divider />
                    
                    <div class="two-column">
                        <div class="ac-container">
                            <h3>Armor Class</h3>
                            <InputGroup>
                                <InputGroupAddon>AC</InputGroupAddon>
                                <Dropdown class="ac-type" v-model="monster.armorType" :options="Object.keys(ARMOR_TYPES)"
                                    :optionValue="(a) => ARMOR_TYPES[a].type" :optionLabel="(a) => ARMOR_TYPES[a].description"
                                    scrollHeight="350px" />
                                <InputNumber class="ac-display" v-if="MANUAL_ARMOR_TYPES.includes(monster.armorType)"
                                    v-model="monster.armorClass" mode="decimal" showButtons :min="0" />
                                <InputGroupAddon class="ac-display" v-else>{{ ARMOR_TYPES[monster.armorType].calc(monster) }}</InputGroupAddon>
                            </InputGroup>
                            <InputGroup v-if="monster.armorType == 'other'">
                                <InputGroupAddon>Custom Armor Type</InputGroupAddon>
                                <InputText v-model="monster.customArmorType"></InputText>
                            </InputGroup>
                        </div>
                        <!-- TODO: fix my formatting -->
                        <div class="hp-container">
                            <h3>Hit Points</h3>
                            <SelectButton 
                                style="width: max-content; margin: auto"
                                v-model="monster.hpType"
                                :options="hpTypes"
                                :optionLabel="(s) => getHpLabel(s)"
                                :allowEmpty="false" />
                            <InputGroup v-if="monster.hpType == 'hitdice'">
                                <InputGroupAddon>Hit Dice</InputGroupAddon>
                                <InputNumber v-model="monster.numHitDice" :min="1" mode="decimal" />
                            </InputGroup>
                            <div v-else>
                                <InputGroup>
                                    <InputGroupAddon>Hit Points</InputGroupAddon>
                                    <InputNumber v-model="monster.hitPoints" :min="1" mode="decimal" />
                                </InputGroup>
                                <InputGroup>
                                    <InputGroupAddon>Hit Dice</InputGroupAddon>
                                    <InputText v-model="monster.hitDiceExpr"></InputText>
                                </InputGroup>

                            </div>
                        </div>
                    </div>

                    <Divider/>
                    
                    <div class="two-column">
                        <div>
                            <h3>Speed</h3>
                            <div class="speed-grid">
                                <SpeedEntry v-model:speed="monster.speed.walk" name="Walk" />
                                <SpeedEntry v-model:speed="monster.speed.fly" v-model:hover="monster.speed.hover"
                                    hoverCheck="true" name="Fly" />
                                <SpeedEntry v-model:speed="monster.speed.swim" name="Swim" />
                                <SpeedEntry v-model:speed="monster.speed.climb" name="Climb" />
                                <SpeedEntry v-model:speed="monster.speed.burrow" name="Burrow" />
                            </div>
                        </div>
                        <div>
                            <h3>Senses</h3>
                            <SenseEntry v-model="monster.senses.darkvision">Darkvision</SenseEntry>
                            <SenseEntry v-model="monster.senses.blindsight">Blindsight</SenseEntry>
                            <SenseEntry v-model="monster.senses.tremorsense">Tremorsense</SenseEntry>
                            <SenseEntry v-model="monster.senses.truesight">Truesight</SenseEntry>
                        </div>
                    </div>

                </AccordionTab>
                <AccordionTab header="Skills">
                    <MultiSelect style="width: 100%" v-model="monster.skillsEnabled" :options="SKILL_OPTIONS"
                        optionLabel="label" optionValue="value" optionGroupLabel="stat" optionGroupChildren="skills"
                        :showToggleAll="true" scrollHeight="500px" display="chip" placeholder="Select Skills"
                        @change="changeSkills" />
                    <div class="skill-selections">
                        <InputGroup v-for="skill in monster.skillsEnabled" class="skill-selection">
                            <Button icon="pi pi-times" severity="danger" @click="removeSkill(skill)"></Button>
                            <InputGroupAddon class="skill-name">{{ titleCase(skill) }}</InputGroupAddon>
                            <Dropdown class="skill-type" v-model="monster.skillProficiencies[skill].type"
                                :options="PROFTYPE_OPTIONS" optionLabel="label" optionValue="value" />
                            <InputNumber class="skill-bonus" v-model="monster.skillProficiencies[skill].bonus"
                                v-if="monster.skillProficiencies[skill].type == 'custom'" />
                            <InputGroupAddon class="skill-bonus" v-else>
                                {{ chooseStatModPrefix(monster.skillProficiencies[skill].bonus) }}{{
                                    Math.abs(monster.skillProficiencies[skill].bonus) }}
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </AccordionTab>
                <AccordionTab header="Damage & Conditions">
                    <h3>Damage Resistances, Vulnerabilities, and Immunities</h3>
                    <DamageSelect
                        v-model:resist="monster.damageResistances"
                        v-model:vulnerable="monster.damageVulnerabilities"
                        v-model:immune="monster.damageImmunities"/>
                    <h3>Condition Immunities</h3>
                    <ConditionSelect v-model:immunities="monster.conditionImmunities"/>
                </AccordionTab>

                <AccordionTab header="Actions & Abilities">
                    <ActionEditor v-model:properties="monster.properties" v-model:idmarker="monster.propId"/>
                </AccordionTab>
            </Accordion>
        </div>

        <div class="statblock-wrapper">
            <StatBlock
                :height="statblockHeight"
                :monster="monsterPrintable"
                :sticky="sticky"/>
        </div>
    </div>

</template>
