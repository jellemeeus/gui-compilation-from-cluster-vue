<script setup lang="ts">
import { ref } from 'vue';

import { Clip } from "./models";
import { calculateEmbedURL } from './utils';

defineProps<{ clip: Clip, isCompilation: boolean }>()

import { defineEmits } from 'vue'

const emit = defineEmits(['add', 'hide', 'remove', 'up', 'down', 'top', 'bottom'])

const isPlayerHidden = ref(true)

</script>

<template>
  <div class="card bg-base-100 shadow-xl image-full text-left">
    <figure class="h-75">
      <img
        :src="clip.thumbnail_url"
        width="100%"
        class="max-h-80"
        @error="
          (e) => {
            if (e.target) {
            e.target as HTMLImageElement
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Placeholder';
            }
          }
        "
      />
    </figure>
    <div class="card-body">
      <h3 class="card-title">{{ clip.creator }} {{ clip.game }}</h3>
<!--
      <div class="flex flex-row">
        <div v-if="clip.embed_url == null" class="badge badge-secondary">
          No embed
        </div>
      </div>
-->

      <p>{{ clip.title }}</p>
      <p>
        {{ clip.duration }}s {{ clip.view_count }} {{ clip.created_at }}
        {{ clip.published }} {{ clip.language }}
      </p>

      <div class="card-actions">
        <div>
          <button
            @click="
              () => {
                isPlayerHidden = !isPlayerHidden;
              }
            "
            class="btn btn-primary"
          >
            <i v-if="isPlayerHidden" class="fa-solid fa-video"></i>
            <i v-if="!isPlayerHidden" class="fa-solid fa-video-slash"></i>
          </button>
          <a
            role="button"
            target="_blank"
            :href="clip.url"
            class="btn btn-info"
          >
            <i class="fa-regular fa-window-restore"></i> Link
          </a>
        </div>
      </div>

      <div v-if="!isCompilation" class="justify-end">
        <button @click="$emit('add', clip.url)" class="btn btn-primary">
          <i class="fa-regular fa-plus"></i>
        </button>
        <button @click="$emit('hide', clip.url)" class="btn btn-error">
          Hide
        </button>
      </div>
      <div v-else class="justify-begin">
        <button @click="$emit('up', clip.url)" class="btn btn-primary">
          Up
        </button>
        <button @click="$emit('down', clip.url)" class="btn btn-primary">
          Down
        </button>
        <button @click="$emit('top', clip.url)" class="btn btn-success">
          Top
        </button>
        <button @click="$emit('bottom', clip.url)" class="btn btn-success">
          Bottom
        </button>
        <button @click="$emit('remove', clip.url)" class="btn btn-error">
          <i class="fa-regular fa-trash-can"></i> Remove
        </button>
      </div>

      <div v-if="!isPlayerHidden && clip.embed_url !== null" class="h-80">
        <iframe
          :src="calculateEmbedURL(clip)"
          class="max-h-80"
          height="320px"
          width="100%"
          allowfullscreen
        >
        </iframe>
      </div>
    </div>

  </div>

</template>

<style scoped>
.card {
  padding: 0.5em;
}

.a {
  margin: 4px;
  padding: 15px;
}

.btn {
  margin: 4px;
  padding: 15px;
}
</style>
