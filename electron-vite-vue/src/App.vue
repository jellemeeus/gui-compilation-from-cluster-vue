<script setup lang="ts">
import ClipElement from './components/ClipElement.vue'
import { computed, ref } from 'vue'

import { Clip } from 'src/components/models.ts';

const clips = ref(<Clip>[]);
const compilation = ref(<Clip>[]);

const amountOfCompilation = computed(() => {
  return compilation.value.length
})

const totalDuration = computed(() => {
  return compilation.value.reduce((prev, curr) => prev + curr.duration, 0)
})

const frequency = computed(() => {
  if (compilation.value.length <= 0) {
    return {}
  }
  let freq = {}
  compilation.value.forEach((clip) => freq[clip.creator] = (freq[clip.creator] || 0) + 1)
  return freq
})


function clip_data_to_compilation(c) {
  console.debug(`clip_data_to_compilation ${c}`)
  return {
    "download": 0,
    "error": 0,
    "url": c.url,
    "created_at": c.created_at,
    "game_id": c.game_id,
    "game": c.game,
    "creator": c.creator,
    "language": c.language,
    "thumbnail_url": c.thumbnail_url,
    "embed_url": c.embed_url,
    "title": c.title,
    "duration": c.duration,
    "view_count": c.view_count,
  }
}

function fill_from_clips(clips_data) {
  let newClips: Array<Clip> = []
  Object.values(clips_data)
    .forEach((clip) => (
      newClips.push(clip_data_to_compilation(clip))
    ));
  // Filter clips that are present in compilation
  const compURLs = compilation.value.map(clip => clip.url)
  newClips = newClips.filter(clip => !compURLs.includes(clip.url))
  clips.value = newClips;
}

async function loadClips() {
  // @ts-ignore:next-line
  const data = await window.ipcRenderer.readJSON('clips.json');
  fill_from_clips(data)

  console.log({ data })
  for (const d of data) {
    console.log(d)
  }
  console.log(clips.value)
}


function fill_from_compilation(compilation_data) {
  let newClips: Array<Clip> = []
  console.debug(`Filling compilation with: ${compilation_data}`)
  for (let i = 0; i < compilation_data.length; i++) {
    newClips.push(compilation_data[i])
  }
  console.log(newClips)
}

async function saveCompilation() {
  const compilationCSV = clips.value.map((clip) => clip.url).join(',');
  console.log(compilationCSV)
  // @ts-ignore:next-line
  await window.ipcRenderer.writeFile('compilation.csv', compilationCSV);
}

async function loadCompilation() {
  // @ts-ignore:next-line
  const data = await window.ipcRenderer.readJSON('compilation.json');
  fill_from_compilation(data)
}

async function shuffleCompilation() {
  compilation.value = compilation.value.sort(() => Math.random() - 0.5);
}


async function removeComp(url: string) {
  compilation.value = compilation.value.filter(clip => clip.url !== url)
}

async function hideClip(url: string) {
  clips.value = clips.value.filter(clip => clip.url !== url)
}

async function upComp(url: string) {
  console.log('up')
  const index = compilation.value.findIndex(clip => clip.url === url);
  if (index > 0) {
    const clipToMove = compilation.value[index];
    compilation.value.splice(index, 1);
    compilation.value.splice(index - 1, 0, clipToMove);
  }
}

async function downComp(url: string) {
  console.log('down')
  const index = compilation.value.findIndex(clip => clip.url === url);
  if (index < compilation.value.length - 1) {
    const temp = compilation.value[index];
    compilation.value[index] = compilation.value[index + 1];
    compilation.value[index + 1] = temp;
  }
}

async function topComp(url: string) {
  console.log('top')
  const index = compilation.value.findIndex(clip => clip.url === url);
  if (index > 0) {
    const temp = compilation.value[index];
    compilation.value.splice(index, 1);
    compilation.value.unshift(temp);
  }
}

async function bottomComp(url: string) {
  console.log('bottom')
  const index = compilation.value.findIndex(clip => clip.url === url);

  if (index < compilation.value.length - 1) {
    const temp = compilation.value[index];
    compilation.value.splice(index, 1);
    compilation.value.push(temp);
  }
}

async function addMostViews() {
  const clipToAdd = clips.value.shift();
  compilation.value.push(clipToAdd)
}

async function addLowFrequency() {
  function getLowestFrequencyIndex() {
    // Check for undefined frequency
    let index = clips.value.findIndex(
      (clip) => frequency[clip.creator] === undefined
    )
    if (index >= 0) {
      return index
    }
    // Loop through frequencies from 1 up counting matches
    for (let i = 1; i < 128; i++) {
      index = clips.value.findIndex(
        (clip) => frequency[clip.creator] === i
      )
      if (index >= 0) {
        return index
      }
    }
  }
  const index = getLowestFrequencyIndex();
  console.log(index)
  const clipToAdd = clips.value[index];
  compilation.value.push(clipToAdd)
  clips.value.splice(index, 1);
}

async function addClip(url: string) {
  clips.value.forEach((clip) => {
    if (clip.url === url) {
      compilation.value.push(clip)
    }
  });
  clips.value = clips.value.filter((clip) => clip.url !== url);
}

</script>

<template>
  <div class="flex flex-row h-[85dvh] mt-5">
    <div class="flex-none basis-6/12 overflow-y-auto">
      <h1 class="text-3xl font-extrabold dark:text-white">Clips</h1>
      <ClipElement @add="addClip" @hide="hideClip" v-for="x in clips" :clip=x :isCompilation="false"></ClipElement>
    </div>
    <div class="flex-none basis-6/12 overflow-y-auto">
      <h1 class="text-3xl font-extrabold dark:text-white">Compilation</h1>
      <ClipElement @up="upComp" @down="downComp" @top="topComp" @bottom="bottomComp" @remove="removeComp"
        :isCompilation="true" v-for="x in compilation" :clip=x></ClipElement>
    </div>
  </div>
  <div class="bg-primary text-primary-content">
    Duration: {{ totalDuration }}s
    Clips: {{ amountOfCompilation }}
    <br>
    Freq: {{ frequency }}
  </div>
  <div class="flex-none basis-full mt-4">
    <button class="btn btn-success" type="button" @click="loadClips()">Read clips.json</button>
    <button class="btn btn-primary" type="button" @click="loadCompilation()">Read compilation.json</button>
    <button class="btn btn-primary" type="button" @click="shuffleCompilation()">Shuffle compilation</button>
    <button class="btn btn-primary" type="button" @click="addLowFrequency()">Select Low Freq</button>
    <button class="btn btn-primary" type="button" @click="addMostViews()">Select Most Views</button>
    <button class="btn btn-error" type="button" @click="saveCompilation()">Save compilation.csv</button>
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
