<script setup lang="ts">
import ClipElement from './components/ClipElement.vue'
import { ref } from 'vue'

const data = ref([]);


async function fetchClips() {
  // @ts-ignore:next-line
  await window.ipcRenderer.getClips()
}

async function loadJSON() {
  // @ts-ignore:next-line
  data.value = await window.ipcRenderer.readJSON('clips.json');
  console.log(data.value)
}
</script>

<template>
  <div>
    Title:
</div>
  <div class="flex flex-row h-[90dvh]">
    <div class="flex-none basis-6/12 overflow-y-auto">
      <h2>Clips</h2>
      <ClipElement v-for="x in data" :clip=x></ClipElement>
    </div>
    <div class="flex-none basis-6/12 overflow-y-auto">
      <h2>Comp</h2>
    </div>
  </div>
  <div class="flex-none basis-full mt-4">
    <button class="btn btn-secondary" type="button" @click="loadJSON()">Load JSON</button>
    <button class="btn btn-primary" type="button" @click="fetchClips()">Fetch Clips</button>
  </div>
</template>


<style>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9FEAF9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.buttons {
  padding-bottom: 10px;
}

.clips-and-compilation {
  height: calc(100% - 50px);
}

.read-the-docs {
  color: #888;
}
</style>
