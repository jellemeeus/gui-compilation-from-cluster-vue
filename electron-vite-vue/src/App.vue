<script setup lang="ts">
import ClipElement from './components/ClipElement.vue'
import { computed, ref } from 'vue'

import { Clip } from "./components/models";


const clips = ref<Clip[]>([]);
const compilation = ref<Clip[]>([]);

const amountOfCompilation = computed(() => {
  return compilation.value.length
})

const totalDuration = computed(() => {
  return compilation.value.reduce((prev: number, curr: Clip) => prev + curr.duration, 0)
})

const frequency = computed(() => {
  if (compilation.value.length <= 0) {
    return {};
  }
  let freq: { [key: string]: number } = {};
  compilation.value.forEach((clip: Clip) => {
    if (freq[clip.creator]) {
      freq[clip.creator] += 1;
    } else {
      freq[clip.creator] = 1;
    }
  });
  return freq;
});



function clip_data_to_compilation(c: Clip): Clip {
  console.debug(`clip_data_to_compilation ${c}`)
  return <Clip>{
    "creator": c.creator,
    "url": c.url,
    "duration": c.duration,
    "view_count": c.view_count,
    "created_at": c.created_at,
    "game_id": c.game_id,
    "game": c.game,
    "language": c.language,
    "thumbnail_url": c.thumbnail_url,
    "embed_url": c.embed_url,
    "title": c.title,
  }
}

function fill_from_clips(clips_data: string | any[]) {
  let newClips: Array<Clip> = []
  Object.values(clips_data)
    .forEach((clip: Clip) => (
      newClips.push(clip_data_to_compilation(clip))
    ));
  // Filter clips that are present in compilation
  const compURLs = compilation.value.map((clip: Clip) => clip.url)
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


function fill_from_compilation(compilation_data: string | any[]) {
  let newClips: Array<Clip> = []
  console.debug(`Filling compilation with: ${compilation_data}`)
  for (let i = 0; i < compilation_data.length; i++) {
    newClips.push(compilation_data[i])
  }
  console.log(newClips)
}

async function saveCompilation() {
  const compilationCSV = clips.value.map((clip: Clip) => clip.url).join(',');
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
  compilation.value = compilation.value.filter((clip: Clip) => clip.url !== url)
}

async function hideClip(url: string) {
  clips.value = clips.value.filter((clip: Clip) => clip.url !== url)
}

async function upComp(url: string) {
  console.log('up')
  const index = compilation.value.findIndex((clip: Clip) => clip.url === url);
  if (index > 0) {
    const clipToMove = compilation.value[index];
    compilation.value.splice(index, 1);
    compilation.value.splice(index - 1, 0, clipToMove);
  }
}

async function downComp(url: string) {
  console.log('down')
  const index = compilation.value.findIndex((clip: Clip) => clip.url === url);
  if (index < compilation.value.length - 1) {
    const temp = compilation.value[index];
    compilation.value[index] = compilation.value[index + 1];
    compilation.value[index + 1] = temp;
  }
}

async function topComp(url: string) {
  console.log('top')
  const index = compilation.value.findIndex((clip: { url: string; }) => clip.url === url);
  if (index > 0) {
    const temp = compilation.value[index];
    compilation.value.splice(index, 1);
    compilation.value.unshift(temp);
  }
}

async function bottomComp(url: string) {
  console.log('bottom')
  const index = compilation.value.findIndex((clip: { url: string; }) => clip.url === url);

  if (index < compilation.value.length - 1) {
    const temp = compilation.value[index];
    compilation.value.splice(index, 1);
    compilation.value.push(temp);
  }
}

async function addMostViews() {
  const clipToAdd: Clip | undefined = clips.value.shift();
  if (clipToAdd !== undefined) {
    compilation.value.push(clipToAdd)
  }
}

async function addLowFrequency() {
  function getLowestFrequencyIndex() {
    // Check for undefined frequency
    let index = clips.value.findIndex(
      (clip: Clip) =>
        frequency.value[clip.creator as keyof typeof frequency.value] ===
        undefined
    );
    if (index >= 0) {
      return index;
    }
    // Loop through frequencies from 1 up counting matches
    for (let i = 1; i < 128; i++) {
      index = clips.value.findIndex(
        (clip: Clip) => frequency.value[clip.creator] === i
      );
      if (index >= 0) {
        return index;
      }
    }
  }
  const index = getLowestFrequencyIndex();
  console.log(index);
  const clipToAdd = clips.value[index as number];
  compilation.value.push(clipToAdd);
  clips.value.splice(index as number, 1);
}



async function addClip(url: string) {
  clips.value.forEach((clip: Clip) => {
    if (clip.url === url) {
      compilation.value.push(clip)
    }
  });
  clips.value = clips.value.filter((clip: Clip) => clip.url !== url);
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
.buttons {
  padding-bottom: 10px;
}
</style>
