<script setup>
    const props = defineProps(['str', 'dex', 'con', 'int', 'wis', 'cha'])

    function statWithMod(score) {
        const mod = Math.floor((parseInt(score, 10) - 10) / 2)
        let prefix = (mod < 0) ? '–' : '+'
        return `${score} (${prefix}${Math.abs(mod)})`
    }

    const strWithMod = computed(() => statWithMod(props.str))
    const dexWithMod = computed(() => statWithMod(props.dex))
    const conWithMod = computed(() => statWithMod(props.con))
    const intWithMod = computed(() => statWithMod(props.int))
    const wisWithMod = computed(() => statWithMod(props.wis))
    const chaWithMod = computed(() => statWithMod(props.cha))
</script>

<style scoped>
  table {
    width: 100%;
    border: 0px;
    border-collapse: collapse;
    color: #7A200D;
  }
  th, td {
    width: 50px;
    text-align: center;
  }
</style>

<template>
<tapered-rule></tapered-rule>
<table>
  <tr>
    <th>STR</th>
    <th>DEX</th>
    <th>CON</th>
    <th>INT</th>
    <th>WIS</th>
    <th>CHA</th>
  </tr>
  <tr>
    <td id="str">{{ strWithMod }}</td>
    <td id="dex">{{ dexWithMod }}</td>
    <td id="con">{{ conWithMod }}</td>
    <td id="int">{{ intWithMod }}</td>
    <td id="wis">{{ wisWithMod }}</td>
    <td id="cha">{{ chaWithMod }}</td>
  </tr>
</table>
<tapered-rule></tapered-rule>
</template>
