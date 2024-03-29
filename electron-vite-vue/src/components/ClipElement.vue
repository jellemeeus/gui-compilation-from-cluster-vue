<script setup lang="ts">
import { ref } from 'vue';

interface Clip {
  index: number;
  creator: string;
  url: string;
  duration: number;
  view_count: number;
  created_at: string;
  game: string;
  clipper_name: string;
  game_id: string;
  language: string;
  thumbnail_url: string;
  title: string;
  published: number;
  broken: number;
  embed_url?: string;
}

defineProps<{ clip: Clip }>()

const isPlayerHidden = ref(true)

</script>

<template>
  <div class="card bg-base-100 shadow-xl image-full">
    <figure class="h-80">
      <img :src="clip.thumbnail_url" width="100%" class="max-h-80"
        @error="(e) => { e.target.onerror = null; e.target.src = '/src/assets/no-image.png' }" />
    </figure>
    <div class="card-body">

      <h3 class="card-title">{{ clip.title }}</h3>

      <div class="flex flex-row">
        <div v-if="clip.embed_url == null" class="badge badge-secondary">No embed</div>

      </div>

      <p>Creator Name: {{ clip.creator }}</p>
      <p>Views: {{ clip.view_count }}</p>

      <div class="card-actions justify-end">
        <button v-if="clip.embed_url != null" @click="() => { isPlayerHidden = !(isPlayerHidden) }"
          class="btn btn-primary">
         {{ isPlayerHidden ? "View Player" : "Hide Player" }}
        </button>

        <a role="button" target="_blank" :href="clip.url" class="btn btn-primary">Link</a>


        <button @click="() => { isPlayerHidden = !(isPlayerHidden) }"
          class="btn btn-primary">
          Add
        </button>

      </div>

      <div v-if="!isPlayerHidden && clip.embed_url !== null" class="h-80">
        <iframe :src="`${clip.embed_url}&parent=localhost`" class="max-h-80" height="320px" width="100%"
          allowfullscreen>
        </iframe>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
