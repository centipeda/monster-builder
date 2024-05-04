<script setup>
    const props = defineProps(['name', 'hoverCheck'])
    const speed = defineModel('speed')
    const hover = defineModel('hover')
</script>

<style>
    .speed>p {
        margin-bottom: 5px;
        margin-top: 0;
    }

    span.pi {
        font-size: 0.75rem;
    }

    .speed-input {
        width: 2.5rem;
    }

    .speed-input > .p-inputnumber-input {
        padding-left: 0;
        padding-right: 0;
    }

    .speed-input > .p-button {
        padding-top: 2px;
        padding-bottom: 2px;
    }

</style>

<template>
    <div class="speed">
        <p>{{ props.name }}</p>
        <InputNumber v-model="speed" showButtons buttonLayout="vertical"
            class="speed-input"
            step="5" min="0">
            <template #incrementbuttonicon>
                <span class="pi pi-plus"></span>
            </template>
            <template #decrementbuttonicon>
                <span class="pi pi-minus"></span>
            </template>
        </InputNumber>
        <div v-if="props.hoverCheck">
            <div style="margin-top: 10px" v-if="speed > 0">
                <Checkbox inputId="hover" v-model="hover" :binary="true" />
                <label for="hover">
                    &nbsp;Hover?
                </label>
            </div>
            <div style="margin-top: 10px" v-else>
                <Checkbox inputId="hover" disabled v-model="hover" :binary="true" />
                <label for="hover">
                    &nbsp;Hover?
                </label>
            </div>
        </div>
    </div>
</template>
