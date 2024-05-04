<script setup>
import { DAMAGE_SUGGESTIONS } from '../js/tables'

const resistModel = defineModel('resist')
const vulnModel = defineModel('vulnerable')
const immuneModel = defineModel('immune')

// Load up our damage types as a single array.
const damageTypes = ref([])

// Track any changes to our upstream model values.
watchEffect(() => {
    const dmgs = []
    if(resistModel.value) {
        resistModel.value.map((d) => dmgs.push({damage: d, type: 'resistant'}))
    }
    if(vulnModel.value) {
        vulnModel.value.map((d) => dmgs.push({damage: d, type: 'vulnerable'}))
    }
    if(immuneModel.value) {
        immuneModel.value.map((d) => dmgs.push({damage: d, type: 'immune'}))
    }
    damageTypes.value = dmgs
})

const empty = ref([])
const items = ref([
])
const suggestions = ref([

])

function dmgToTypes(d) {
    return [
        { damage: d, type: 'resistant' },
        { damage: d, type: 'vulnerable' },
        { damage: d, type: 'immune' },
    ]
}

function damageComplete(e) {
    if(e.query == '') {
        suggestions.value = DAMAGE_SUGGESTIONS.flatMap((d) => {
            return dmgToTypes(d)
        })
        return
    }

    // Search through damage type names.
    if(DAMAGE_SUGGESTIONS.includes(e.query)) {
        suggestions.value = dmgToTypes(e.query)
        return
    }

    const defaults = DAMAGE_SUGGESTIONS.filter((d) => {
        return (d.includes(e.query))
    })
    // Let the user use a custom suggestion.
    if(e.query != '') {
        defaults.unshift(e.query)
    }


    suggestions.value = defaults.flatMap((d) => {
        return dmgToTypes(d)
    })
}

function damageSelect(e) {
    // Remove duplicates.
    const newDmg = []
    for(const adding of e.value) {
        let unique = true;
        for(const exists of newDmg) {
            if(exists.damage == adding.damage && exists.type == adding.type) {
                unique = false;
                break;
            }
        }
        if(unique) {
            newDmg.push(adding)
        }
    }

    // Resists.
    resistModel.value = newDmg.filter((d) => {
        return (d.type == 'resistant')
    }).map((d) => {
        return d.damage
    })

    // Vulnerabilities.
    vulnModel.value = newDmg.filter((d) => {
        return (d.type == 'vulnerable')
    }).map((d) => {
        return d.damage
    })

    // Immunities.
    immuneModel.value = newDmg.filter((d) => {
        return (d.type == 'immune')
    }).map((d) => {
        return d.damage
    })

    damageTypes.value = newDmg
}

</script>

<style>
/* Let autocomplete bar fill up space. */
.damage-select.p-autocomplete > .p-autocomplete-multiple-container {
    max-width: 100%;
}

/* damage type styles? */
[dmg="cold"] {
    color: #00bfff;
}
[dmg="acid"] {
    color: #80ff00;
}
[dmg="fire"] {
    color: #ff1500;
}
[dmg="thunder"] {
    color: #ffaa00;
}
[dmg="radiant"] {
    color: #ffff00;
}
[dmg="lightning"] {
    color: #002aff;
}
[dmg="necrotic"] {
    color: #006609;
}
[dmg="poison"] {
    color: #00ff40;
}
[dmg="psychic"] {
    color: #ff00ff;
}
[dmg="force"] {
    color: #9933ff;
}
</style>

<template>
    <AutoComplete
        class="damage-select"
        dropdown
        multiple
        :modelValue="damageTypes"
        scrollHeight="500px"
        delay="0"
        :suggestions="suggestions"
        @complete="damageComplete"
        @change="damageSelect">
        <template #chip="slotProps">
            <b>{{ slotProps.value.type }}</b>
            &nbsp;to&nbsp;
            <b v-bind:dmg="slotProps.value.damage">
                {{ slotProps.value.damage }}
            </b>
        </template>
        <template #option="slotProps">
            <b>{{ slotProps.option.type }}</b>
            to
            <b v-bind:dmg="slotProps.option.damage">
                {{ slotProps.option.damage }}
            </b>
        </template>
    </AutoComplete>
</template>
