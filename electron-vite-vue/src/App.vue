<script setup lang="ts">
import ClipElement from './components/ClipElement.vue'
import { ref } from 'vue'

import { Clip } from 'src/components/models.ts';

const clips = ref(<Clip>[]);

async function fetchClips() {
  // @ts-ignore:next-line
  await window.ipcRenderer.getClips()
}

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
    "is_selected": false,
  }
}


function fill_from_clips(clips_data) {
  let newClips: Array<Clip> = []
  Object.values(clips_data)
    .forEach((clip) => (
      newClips.push(clip_data_to_compilation(clip))
    ));
  console.debug(clips)
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

async function removeClip(url: string) {
  clips.value.forEach((clip) => {
    if (clip.url === url) {
      clip.is_selected = false;
    }
  });
}

async function addClip(url: string) {
  clips.value.forEach((clip) => {
    if (clip.url === url) {
      clip.is_selected = true;
    }
  });
}

</script>

<template>
  <div>
    Title:
  </div>
  <div class="flex flex-row h-[85dvh]">
    <div class="flex-none basis-6/12 overflow-y-auto">
      <h2>Clips</h2>
      <ClipElement @add="addClip" v-for="x in clips.filter( (clip) => !clip.is_selected)" :clip=x></ClipElement>
    </div>
    <div class="flex-none basis-6/12 overflow-y-auto">
      <h2>Comp</h2>
      <ClipElement @remove="removeClip" v-for="x in clips.filter( (clip) => clip.is_selected)" :clip=x></ClipElement>
    </div>
  </div>
  <div class="flex-none basis-full mt-4">
    <button class="btn btn-success" type="button" @click="loadClips()">Read clips.json</button>
    <button class="btn btn-primary" type="button" @click="loadClips()">Read compilation.json</button>
    <button class="btn btn-primary" type="button" @click="loadClips()">Shuffle compilation</button>
    <button class="btn btn-primary" type="button" @click="loadClips()">Select Low Freq</button>
    <button class="btn btn-primary" type="button" @click="loadClips()">Select Most Views</button>
    <button class="btn btn-error" type="button" @click="loadClips()">Save compilation</button>
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
