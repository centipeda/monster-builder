<style scoped>
  div.property-container {
    line-height: 1.4;
    display: block;
    text-indent: -1em;
    padding-left: 1em;
  }

  :slotted(h4) {
    margin: 0;
    display: inline;
    font-weight: bold;
    padding-right: 0.25em;
  }

  :slotted(p:first-of-type) {
    display: inline;
    text-indent: 0;
  }

  :slotted(p) {
    text-indent: 1em;
    margin: 0;
  }
</style>

<template>
  <div class="property-container">
    <slot></slot>
  </div>
</template>
