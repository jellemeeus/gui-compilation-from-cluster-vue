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

const isViewThumbnail = ref(true)

</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <figure v-if="isViewThumbnail" class="h-80">
          <img :src="clip.thumbnail_url" alt="thumbnail" width="100%" />
    </figure>
    <figure v-if="!isViewThumbnail && clip.embed_url !== null" class="h-80">
          <iframe  :src="`${clip.embed_url}&parent=localhost`" height="320px" width="100%" allowfullscreen> </iframe>
    </figure>
    <div class="card-body">

      <h3 class="card-title">{{ clip.title }}</h3>
      <p>Creator Name: {{ clip.creator }}</p>
      <p>Views: {{ clip.view_count }}</p>

      <div class="card-actions justify-end">
        <button @click="() => {isViewThumbnail = !(isViewThumbnail)}" class="btn btn-primary">
          <h2> {{isViewThumbnail ? "View Player" : "View Thumbnail"}}</h2>
          </button>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
