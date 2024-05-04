<script setup>
    const monProps = defineModel()
    const props = defineProps(['id'])
    const editorVisible = ref(false)

    function filterByType(actionType) {
        const arr = []
        for(const [id, prop] of Object.entries(monProps.value)) {
            if(prop.type == actionType) {
                arr.push(id)
            }
        }
        arr.sort((a, b) => {
            return monProps.value[a].ordering - monProps.value[b].ordering
        })
        return arr
    }

    function deleteProp() {
        delete monProps.value[props.id]
    }

    function toggleEditor() {
        editorVisible.value = !editorVisible.value
    }

    function shiftProp(dir) {
        // Filter the props down to the ones that are our action type.
        const us = monProps.value[props.id]
        const usIds = filterByType(us.type)

        if(usIds.length <= 1 || !dir) {
            return
        }

        let other = -1
        for(let i = 0; i < usIds.length; i++) {
            if(dir > 0 && i < usIds.length-1 && usIds[i] == props.id) {
                // If we're shifting forward, swap our ordering with 
                // the prop ahead of us, assuming we're not at the end.
                other = usIds[i+1]
            } else if(dir < 0 && i > 0 && usIds[i] == props.id) {
                // If we're shifting backwards, swap our ordering with 
                // the prop behind us, assuming we're not at the start.
                other = usIds[i-1]
            }
        }

        if(other != -1) {
            let tmp = us.ordering
            us.ordering = monProps.value[other].ordering 
            monProps.value[other].ordering= tmp
        }
    }
</script>

<style scoped>
    .monster-prop {
        margin-bottom: 10px;
    }

    .propbar {
        height: 2.5rem;
    }

    .prop-editor {
        width: 100%;
        max-width: 100%;
        font-family: monospace;
    }
</style>

<template>
    <div class="monster-prop">
        <InputGroup class="propbar">
            <InputGroupAddon>Name</InputGroupAddon>
            <InputText v-model="monProps[props.id].name"></InputText>
            <Button @click="shiftProp(-1)" severity="secondary" icon="pi pi-arrow-up"></Button>
            <Button @click="shiftProp(1)" severity="secondary" icon="pi pi-arrow-down"></Button>
            <Button @click="toggleEditor()" severity="info" icon="pi pi-pen-to-square"></Button>
            <Button @click="deleteProp()" severity="danger" icon="pi pi-times"></Button>
        </InputGroup>
        <Textarea 
            v-if="editorVisible"
            v-model="monProps[props.id].description"
            autoResize="true" class="prop-editor">
        </Textarea>
    </div>
</template>
