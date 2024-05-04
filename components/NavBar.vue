<script setup>
import { DEFAULT_MONSTER, CR_OPTIONS, FORGE_OF_FOES_STATS, STAT_OPTIONS } from '../js/tables'
import { fetchMonster, calcDerived, open5eToMonster,  crToMonster } from '../js/monsters'

import domtoimage from 'dom-to-image'

const monster = defineModel('monster')
const sticky = defineModel('sticky')
const searchDialogVisible = ref(false)
const quickDialogVisible = ref(false)
const toast = useToast()
const selectedCr = ref('0')
const selectedStat = ref('strength')

// https://gist.github.com/wuchengwei/b7e1820d39445f431aeaa9c786753d8e
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

async function searchOpen5e(query, limit) {
    const url = `https://api.open5e.com/monsters/?search=${query}&limit=${limit}`
    const results = await fetch(url)
        .then(response => response.json())
        .catch((e) => console.log(e))
    return results
}

const confirm = useConfirm()
function confirmNew(event) {
    confirm.require({
        target: event.currentTarget,
        message: 'Erase all current monster data?',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-sm p-button-warning',
        rejectLabel: 'Cancel',
        acceptLabel: 'Reset',
        accept: () => monster.value = structuredClone(DEFAULT_MONSTER)
    })
}

async function statblockToImage() {
    const node = document.querySelector('.export-wrapper')
    const scale = 4
    const width = node.clientWidth
    const height = node.clientHeight
    return domtoimage.toPng(node, {
        width: width * scale,
        height: height * scale,
        style: {
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${width}px`,
            height: `${height}px`,
        }
    }).catch(function (error) {
        toast.add({
            severity: 'error',
            summary: 'Failed to export',
            detail: 'Failed to export monster as image.',
            life: 3000,
        })
    })
}

const newItems = [
    {
        label: 'Load from File',
        command: () => { }
    },
    {
        label: 'Quick Monster',
        command: () => { quickDialogVisible.value = true }
    },
    {
        label: 'Open5e Search',
        command: () => { searchDialogVisible.value = true } 
    }
]
const saveItems = [
    {
        label: 'Save as...',
        command: () => console.log('Save to File')
    },
    {
        label: 'Export to Image',
        command: () => {
            toast.add({
                severity: 'info',
                summary: 'Exporting to image...',
                life: 3000
            })
            statblockToImage().then((dataUrl) => {
                const iframe = `<iframe style="position: absolute; height: 100%; width: 100%;" src="${dataUrl}"</iframe>`
                const w = window.open(dataUrl)
                w.document.write(iframe)
            })
        }
    },
    {
        label: 'Export to Foundry',
        command: () => console.log('Save to Foundry')
    },
    {
        label: 'Copy to Clipboard (Image)',
        command: () => {
            statblockToImage().then((dataUrl) => {
                navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': dataURLtoBlob(dataUrl)
                    })
                ])
            }).then(() => {
                toast.add({
                    severity: 'info',
                    summary: 'Copied to clipboard',
                    detail: 'Copied statblock image to clipboard',
                    life: 3000,
                })
            })
        },
    },
    {
        label: 'Copy to Clipboard (JSON)',
        command: () => console.log('Copied to clipboard.')
    },
]

const monsterQuery = ref('')
const searchSuggestions = ref([])
function searchComplete(e) {
    searchOpen5e(e.query, 10).then(resp => {
        // Remove duplicates.
        searchSuggestions.value = [... new Set(resp.results.map(r => r.name))]
    })
}

function loadFromOpen5e() {
    const query = monsterQuery.value
    const url = `https://api.open5e.com/monsters/?name__iexact=${query}`
    const failure = {
        severity: 'error',
        summary: 'Failed',
        detail: `Failed to load monster "${query}".`,
        life: 3000
    }
    const notFound = {
        severity: 'warn',
        summary: 'Not Found',
        detail: `Failed to find monster "${query}".`,
        life: 3000
    }
    fetchMonster(url).then(resp => {
        console.log(resp)
        if(resp.count == 0) {
            toast.add(notFound)
            return
        }
        // Load monster, clear query, and dismiss modal.
        monsterQuery.value = ''
        monster.value = calcDerived(open5eToMonster(resp.results[0]))
        searchDialogVisible.value = false
    }).catch((e) => {
        console.log(e)
        toast.add(failure)
    })
}

function createQuickMonster() {
    monster.value = calcDerived(crToMonster(selectedCr.value, selectedStat.value))
    // monster.forceUpdate()
    quickDialogVisible.value = false
}

</script>

<style>
/* Navbar styling. */
.my-navbar {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    display: flex;
    height: 4rem;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    border-radius: 0;
    border-top: none;
    border-left: none;
    border-right: none;
    background-color: var(--surface-section);
    color: var(--highlight-text-color);
    border-bottom: 1px solid  var(--surface-border);
    justify-content: space-between
}

.left-side {
    display: flex;
    align-items: center;
    align-self: left;
}

.right-side {
    display: flex;
    align-items: center;
    align-self: left;
}

.column-switch {
    margin-left: 1rem;
    margin-right: 1rem;
}


/* Force colors on navbar buttons. */
.export-button:hover,
.export-button:hover > * {
    background-color: var(--surface-hover);
}
.export-button,
.export-button > * {
    background-color: var(--surface-section);
    color: var(--highlight-text-color);
    border: 1px solid var(--surface-border);
    font-weight: normal;
    font-size: 12pt;
}

.export-button {
    height: 2.5rem;
    margin-right: 2rem;
}

.logo {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    margin-right: 2rem;
}

.logo-img {
    filter: invert(100%);
    margin-left: 20px;
    margin-right: 20px;
}

.logo-txt {
    font-family: 'Source Code Pro';
    font-weight: 700;
    font-size: 18pt;
}

/* Disable link coloration. */

.open5e-dialog {
    width: 30rem;
}

.open5e-search {
    width: 100%;
}

.open5e-search > input.p-autocomplete-input {
    margin: auto;
    width: 20rem;
}

.footer {
    margin-bottom: 0;
    color: var(--surface-400);
}

.quick-load {
    display: flex;
    justify-content: end;
    margin-top: 2rem;
}

.bottom-row > div {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.top-row > div {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

</style>

<template>
    <div class="my-navbar">
        <Dialog v-model:visible="quickDialogVisible" modal
                header="Create Quick Monster" dismissableMask="true">
            <InputGroup class="top-row">
                <InputGroupAddon>Challenge Rating</InputGroupAddon>
                <Dropdown scrollHeight="350px" :options="CR_OPTIONS" optionLabel="label" optionValue="rating"
                    v-model="selectedCr" />
            </InputGroup>
            <InputGroup class="bottom-row">
                <InputGroupAddon>Proficient Stat</InputGroupAddon>
                <Dropdown scrollHeight="350px" :options="STAT_OPTIONS" optionLabel="label" optionValue="value"
                    v-model="selectedStat" />
            </InputGroup>

            <ul>
                <li>Equivalent Character Level: {{ FORGE_OF_FOES_STATS[selectedCr].eqLevel }}</li>
                <li>AC: {{ FORGE_OF_FOES_STATS[selectedCr].dc }}</li>
                <li>HP: {{ FORGE_OF_FOES_STATS[selectedCr].hp }}</li>
                <li>To-Hit Bonus: +{{ FORGE_OF_FOES_STATS[selectedCr].bonus }}</li>
                <li>Damage Per Hit: {{ FORGE_OF_FOES_STATS[selectedCr].damagePerAttack }}</li>
                <li>Average Damage Per Round: {{ FORGE_OF_FOES_STATS[selectedCr].damage }}</li>
                <li>Attacks Per Round: {{ FORGE_OF_FOES_STATS[selectedCr].attacks }}</li>
            </ul>

            <div class="quick-load">
                <Button type="button" label="Create" @click="createQuickMonster()"></Button>
            </div>

            <h5 class="footer">Monster stats from <a href="https://slyflourish.com/build_a_quick_monster_with_forge_of_foes.html">Mike Shea's Forge of Foes</a>.</h5>
        </Dialog>

        <Dialog v-model:visible="searchDialogVisible" modal 
                header="Search Open5e Monster Database" :style="{ width: '30rem' }"
                dismissableMask="true" class="open5e-dialog">
            <InputGroup>
                <AutoComplete placeholder="red dragon, assassin, etc..."
                    v-model="monsterQuery" @complete="searchComplete"
                    delay="500" scrollHeight="300px"
                    :suggestions="searchSuggestions" class="open5e-search"/>
                <Button @click="loadFromOpen5e">Load</Button>
            </InputGroup>
            <h5 class="footer">More info at <a href="https://open5e.com/">open5e.com</a></h5>
        </Dialog>

        <ConfirmPopup></ConfirmPopup>
        <Toast/>

        <div class="left-side">
            <div class="logo">
                <img class="logo-img" src="/monster.png" width="35"/>
                <span class="logo-txt">centi’s&nbsp;monstermaker</span>
            </div>

            <SplitButton
                class="export-button" severity="primary"
                @click="confirmNew($event)" :model="newItems"
                label="New">
                New
            </SplitButton>
            <SplitButton class="export-button" severity="primary" :model="saveItems">
                Save
            </SplitButton>
        </div>
        <div class="right-side">
            <p>Sticky</p> 
            <InputSwitch class="column-switch" v-model="sticky"/>
            <p>Two-Column Layout</p>
            <InputSwitch class="column-switch" v-model="monster.twoColumnsEnabled"/>
        </div>
    </div>
</template>
