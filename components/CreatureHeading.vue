<style scoped>
  :slotted(h1) {
    font-family: 'Libre Baskerville', 'Lora', 'Calisto MT',
                 'Bookman Old Style', Bookman, 'Goudy Old Style',
                 Garamond, 'Hoefler Text', 'Bitstream Charter',
                 Georgia, serif;
    color: #7A200D;
    font-weight: 700;
    margin: 0px;
    font-size: 23px;
    letter-spacing: 1px;
    font-variant: small-caps;
  }

  :slotted(h2) {
    font-weight: normal;
    font-style: italic;
    font-size: 12px;
    margin: 0;
  }
</style>

<!-- TODO: fix wrapping for very long names -->
<template>
    <slot></slot>
</template>
