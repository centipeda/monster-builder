<script setup>
import { CONDITIONS } from '../js/tables'

const immunities = defineModel('immunities')

const suggestions = ref([])
const testref = ref([])
const items = ref([])

function conditionComplete(e) {
    const q = e.query
    let sugg = CONDITIONS

    // Filter out conditions already included.
    for (const cond of immunities.value) {
        sugg = sugg.filter((c) => c !== cond)
    }

    // If we don't have a query, stop there.
    if (q == '') {
        suggestions.value = sugg
        return
    }

    // Do partial string match.
    sugg = sugg.filter((c) => {
        return c.includes(q)
    })

    // If we have a query, include it directly.
    sugg.unshift(q)

    suggestions.value = sugg
}

function clearImmunities() {
    immunities.value = []
}
</script>

<style>
/* Let autocomplete bar fill up space. */
.condition-select.p-autocomplete>.p-autocomplete-multiple-container {
    max-width: 100%;
}
</style>

<template>
    <AutoComplete class="condition-select" dropdown multiple delay="0" scrollHeight="500px"
        v-model="immunities"
        @complete="conditionComplete" :suggestions="suggestions"
    />
    <br>
    <br>
    <Button 
        label="Clear All" severity="danger" icon="pi pi-times"
        v-if="immunities.length"
        @click="clearImmunities"></Button>
</template>
