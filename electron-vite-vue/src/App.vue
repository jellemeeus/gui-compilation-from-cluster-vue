<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'

const data = ref();


async function fetchClips() {
  // @ts-ignore:next-line
  await window.ipcRenderer.getClips()
}

async function loadJSON() {
  // @ts-ignore:next-line
  data.value = await window.ipcRenderer.readJSON('clips.json');
  console.log(data.value)
}


type Data = {
  n: number,
  clips: any,
  project: any,
}

</script>

<template>
  <div>
    <a href="https://www.electronjs.org/" target="_blank">
      <img src="./assets/electron.svg" class="logo electron" alt="Electron logo" />
    </a>
    <a href="https://vitejs.dev/" target="_blank">
      <img src="./assets/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Electron + Vite + Vue" />
  <div class="content">
    <div class="row clips-and-compilation">
      <div class="clips col-6">
        <h2>Clips</h2>
        <h2>Clips</h2>
        <h2>Clips</h2>
        <h2>Clips</h2>
        <h2>Clips</h2>
        <h2>Clips</h2>
        <h2>Clips</h2>
        <h2>Clips</h2>
        <h2>Clips</h2>
        <h2>Clips</h2>
        <h2>Clips</h2>
        <h2>Clips</h2>
        <h2>Clips</h2>
        <h2>Clips</h2>
      </div>

      <div class="compilation col-6">
        <h2>Compilation</h2>
      </div>
    </div>

    <div class="row buttons fixed-bottom">
      <div class="col-12">
        <button class="btn" type="button" @click="loadJSON()">Load JSON</button>
        <button class="btn" type="button" @click="fetchClips()">Fetch Clips</button>
      </div>
    </div>
  </div>
</template>

<style>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

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

.btn {
  margin-left: 5px;
  margin-right: 5px;
}

.clips-and-compilation {
  height: calc(100% - 50px);
}

.read-the-docs {
  color: #888;
}

.row {
  display: flex;
  flex-direction: row;
}

.col-6 {
  flex: 6;
}

.col-12 {
  flex: 12;
}

</style>
