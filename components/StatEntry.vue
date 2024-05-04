<script setup>

    import { statToMod } from '../js/monsters'

    const stat = defineModel('stat')
    const saveProficient = defineModel('save')
    const printable  = computed(() => {
        const mod  = statToMod(stat.value)
        return `${chooseStatModPrefix(mod)}${Math.abs(mod)}`
    })

    function chooseStatModPrefix(s) {
        return s < 0 ? "–" : "+";
    }
</script>

<style>
    .stat>p {
        margin-bottom: 5px;
        margin-top: 0;
    }

    .stat-display {
        white-space: nowrap;
    }

    .stat-entry {
        width: 2.5rem;
        text-align: center;
    }

    .stat-entry.p-inputtext {
        padding-left: 0;
        padding-right: 0;
    }

    .save-switch {
        margin-top: 0rem;
    }

    .save-text {
        margin-top: 1rem !important;
        margin-bottom: 0;
    }
</style>

<template>
    <div class="stat">
        <p><slot></slot></p>
        <div class="stat-display">
            <InputNumber
                v-model="stat"
                inputClass="stat-entry"
                min=0
                max=30
                />&nbsp;&nbsp;({{ printable }})
        </div>
        <p class="save-text">Save?</p>
        <InputSwitch class="save-switch" v-model="saveProficient"></InputSwitch>
    </div>
</template>
