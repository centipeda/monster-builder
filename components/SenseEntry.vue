<script setup>
    const sense = defineModel()
</script>

<style scoped>
    .sense-entry {
        padding-bottom: 0;
    }
</style>

<template>
    <InputGroup class="sense-entry">
        <InputGroupAddon><slot></slot></InputGroupAddon>
        <InputNumber v-model="sense" suffix=" ft" step="5" min="0"/>
    </InputGroup>
</template>
