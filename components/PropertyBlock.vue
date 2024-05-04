<style scoped>
  .block-container {
    margin-top: 0.3em;
    margin-bottom: 0.9em;
    line-height: 1.5;
    display: block;
  }

  :slotted(h4) {
    margin: 0;
    display: inline;
    font-weight: bold;
    font-style: italic;
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
    <div class="block-container">
        <slot></slot>
    </div>
</template>
