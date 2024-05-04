<script setup>

  const triggerMinHeightCalc = ref(false)
  const props = defineProps(['height', 'monster', 'sticky'])
  const heightStr = computed(() => {
    return (typeof props.height !== undefined && props.monster.twoColumnsEnabled) ? `${props.height}px` : 'auto'
  })
  const widthStr = computed(() => {
    return (props.monster.twoColumnsEnabled) ? '840px' : '420px'
  })
  const positionStr = computed(() => {
    return props.sticky ? 'fixed' : 'inherit'
  })
  const containerHeight = computed(() => {
    return props.sticky ? '90vh' : 'auto'
  })
  const containerOverflow = computed(() => {
    return props.sticky ? 'auto' : 'visible'
  })

  // Calculate the minimum height of the statblock by summing the child element heights.
  // Only needed for 2-column layout.
  const minHeightStr = computed(() => (props.monster.twoColumnsEnabled) ? `${minHeight.value}px` : "auto" )
  const wrapper = ref(null)
  let wrapperElement = undefined
  onMounted(() => {
    wrapperElement = wrapper.value
    triggerMinHeightCalc.value = !triggerMinHeightCalc.value
  })

  // Heuristic calculation for minimum statblock height.
  // Used only for two-column layout.
  const minHeight = computed(() => {
    // explicit dependencies
    props.monster
    props.height
    triggerMinHeightCalc.value

    if(wrapperElement) {
      let totalHeight = 0
      for(const child of wrapperElement.children) {
        totalHeight += child.offsetHeight
      }

      let minHeight = totalHeight
      minHeight = Math.trunc(minHeight / 2)
      // Extra minimum height for spacing.
      minHeight += 100
      return minHeight
    }
  })

</script>

<style scoped>

  .container {
    display: inline-block;
    margin-top: 3vh;
  }

  .bar {
    height: 5px;
    background: #E69A28;
    border: 1px solid #000;
    position: relative;
    z-index: 1;
  }

  :deep(#content-wrap) {
    font-family: 'Noto Sans', 'Myriad Pro', Calibri, Helvetica, Arial,
                  sans-serif;
  }

  #content-wrap {
    box-sizing: content-box;
    font-family: 'Noto Sans', 'Myriad Pro', Calibri, Helvetica, Arial,
                  sans-serif;
    font-size: 13.5px;
    background: #FDF1DC;
    padding: 0.6em;
    padding-bottom: 0.5em;
    border: 1px #DDD solid;
    box-shadow: 0 0 1.5em #867453;
    color: #000;

    /* We don't want the box-shadow in front of the bar divs. */
    position: relative;
    z-index: 0;

    /* Leaving room for the two bars to protrude outwards */
    margin-left: 2px;
    margin-right: 2px;

    /* This is possibly overriden by next CSS rule. */
    width: 100%;

    -webkit-columns: 400px;
       -moz-columns: 400px;
            columns: 400px;
    -webkit-column-gap: 40px;
       -moz-column-gap: 40px;
            column-gap: 40px;

    /* We can't use CSS3 attr() here because no browser currently supports it,
       but we can use a CSS custom property instead. */
    /* height: 500px; */

    /* When height is constrained, we want sequential filling of columns. */
    -webkit-column-fill: auto;
       -moz-column-fill: auto;
            column-fill: auto;

    /* Prevent flickering when changing height smoothly. */
    orphans: 3;
  }

  :deep(h3) {
    border-bottom: 1px solid #7A200D;
    color: #7A200D;
    font-size: 21px;
    font-variant: small-caps;
    font-weight: normal;
    letter-spacing: 1px;
    margin: 0;
    /* margin-bottom: 0.3em; */

    break-inside: avoid-column;
    break-after: avoid-column;
  }

  /* For user-level p elems. */
  :deep(p) {
    margin-top: 0.3em;
    /* margin-bottom: 0.9em; */
    line-height: 1.5;
  }

  /* Last child shouldn't have bottom margin, too much white space. */
  *:last-child {
    margin-bottom: 0;
  }
</style>

<template>
  <div class="container" :style="{ position: positionStr, height: containerHeight, overflowY: containerOverflow }">
    <div class="export-wrapper">
      <div class="bar"></div>
      <div id="content-wrap" :style="{ width: widthStr, height: heightStr, minHeight: minHeightStr}" ref="wrapper">
      <CreatureHeading>
        <h1>{{ monster.name }}</h1>
        <h2>{{ monster.type }}</h2>
      </CreatureHeading>
      <top-stats>
        <PropertyLine>
          <h4>Armor Class</h4>
          <p>{{ monster.ac }}</p>
        </PropertyLine>
        <PropertyLine>
          <h4>Hit Points</h4>
          <p>{{ monster.hp }}</p>
        </PropertyLine>
        <PropertyLine>
          <h4>Speed</h4>
          <p>{{ monster.speed }}</p>
        </PropertyLine>

        <AbilitiesBlock
          :str="monster.stats[0]"
          :dex="monster.stats[1]"
          :con="monster.stats[2]"
          :int="monster.stats[3]"
          :wis="monster.stats[4]"
          :cha="monster.stats[5]"
        ></AbilitiesBlock>
        <PropertyLine v-if="monster.saves">
          <h4>Saving Throws</h4>
          <p>{{ monster.saves }}</p>
        </PropertyLine>
        <PropertyLine v-if="monster.skills">
          <h4>Skills</h4>
          <p>{{ monster.skills }}</p>
        </PropertyLine>
        <PropertyLine v-if="monster.damageVulnerabilities">
          <h4>Damage Vulnerabilities</h4>
          <p>{{ monster.damageVulnerabilities }}</p>
        </PropertyLine>
        <PropertyLine v-if="monster.damageResistances">
          <h4>Damage Resistances</h4>
          <p>{{ monster.damageResistances }}</p>
        </PropertyLine>
        <PropertyLine v-if="monster.damageImmunities">
          <h4>Damage Immunities</h4>
          <p>{{ monster.damageImmunities }}</p>
        </PropertyLine>
        <PropertyLine v-if="monster.conditionImmunities">
          <h4>Condition Immunities</h4>
          <p>{{ monster.conditionImmunities }}</p>
        </PropertyLine>
        <PropertyLine>
          <h4>Senses</h4>
          <p>{{ monster.senses }}</p>
        </PropertyLine>
        <PropertyLine>
          <h4>Languages</h4>
          <p>{{ monster.languages }}</p>
        </PropertyLine>
        <PropertyLine>
          <h4>Challenge</h4>
          <p>{{ monster.cr }}</p>
        </PropertyLine>
        <PropertyLine>
          <!-- TODO: right-align prof bonus -->
          <h4>Proficiency Bonus</h4>
          <p>{{ monster.proficiencyBonus }}</p>
        </PropertyLine>
      </top-stats>

      <PropertyBlock v-for="ability in monster.abilities">
        <h4>{{ ability.name }}</h4>
        <p v-html="ability.description"></p>
      </PropertyBlock>

      <h3 v-if="monster.actions.length > 0">Actions</h3>
      <PropertyBlock v-for="action in monster.actions">
        <h4>{{ action.name }}</h4>
        <p v-html="action.description"></p>
      </PropertyBlock>

      <h3 v-if="monster.bonusActions.length > 0">Bonus Actions</h3>
      <PropertyBlock v-for="action in monster.bonusActions">
        <h4>{{ action.name }}</h4>
        <p v-html="action.description"></p>
      </PropertyBlock>

      <h3 v-if="monster.reactions.length > 0">Reactions</h3>
      <PropertyBlock v-for="action in monster.reactions">
        <h4>{{ action.name }}</h4>
        <p v-html="action.description"></p>
      </PropertyBlock>

      <h3 v-if="monster.legendary.isLegendary">Legendary Actions</h3>
      <p v-if="monster.legendary.isLegendary">
        {{ monster.legendary.description }}
      </p>
      <PropertyLine v-for="action in monster.legendary.actions">
        <h4>{{ action.name }}</h4>
        <p>{{ action.description }}</p>
      </PropertyLine>
      </div>
      <div class="bar"></div>
    </div>
  </div>
</template>
