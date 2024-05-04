<script setup>
import { ACTIONS_TO_LABELS } from '~/js/tables';

    const monsterProps = defineModel('properties')
    const propId = defineModel('idmarker')

    const actionTypes = [
        { label: 'Ability', value: 'ability', plural: 'Abilities' },
        { label: 'Action', value: 'action', plural: 'Actions' },
        { label: 'Bonus Action', value: 'bonusAction', plural: 'Bonus Actions' },
        { label: 'Reaction', value: 'reaction', plural: 'Reactions' },
    ]

    function filterByType(actionType) {
        const arr = []
        for(const [id, prop] of Object.entries(monsterProps.value)) {
            if(prop.type == actionType) {
                arr.push(id)
            }
        }
        arr.sort((a, b) => {
            return monsterProps.value[a].ordering - monsterProps.value[b].ordering
        })
        return arr
    }

    function newProp(actionType) {
        const p = monsterProps.value
        const i = propId.value

        // Get the max ordering ID of this action type.
        const ids = filterByType(actionType)
        let maxOrdering = ids.reduce((acc, curr) => {
                return Math.max(acc, p[curr].ordering)
            }, 0)

        // Add a new action to the end.
        console.log(maxOrdering)
        p[i] = {
            type: actionType,
            typeName: ACTIONS_TO_LABELS[actionType],
            name: '',
            description: '',
            ordering: maxOrdering+1
        }

        monsterProps.value = p
        propId.value = i+1
    }
</script>

<style scoped>
.action-header  {
    margin-top: 0;
}

.action-block {
    margin-bottom: 1rem;
}
</style>

<template>
    <div v-for="actionType in actionTypes" v-bind:header="actionType.plural" class="action-block">
        <h3 class="action-header">{{ actionType.plural }}</h3>
        <Action v-for="propId in filterByType(actionType.value)" v-model="monsterProps" :id="propId"/>
        <Button @click="newProp(actionType.value)" icon="pi pi-plus" severity="success"></Button>
    </div>
</template>
