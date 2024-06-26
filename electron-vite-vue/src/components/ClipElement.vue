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
    <figure >
      <img
        :src="clip.thumbnail_url"
        @error="
          (e) => {
            if (e.target) {
            e.target as HTMLImageElement
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = 'https://placehold.co/500x284?text=Placeholder';
            }
          }
        "
      />
    </figure>
    <div class="card-body">
      <h3 class="card-title card_content">{{ clip.creator }} {{  clip.game === "unknown" ? "" : clip.game }}</h3>
      <!-- v-if="clip.game === 'unknown'" -->
      <div class="flex flex-row">
        <div class="badge badge-primary">
          {{ clip.game_id }}
        </div>
      </div>
      <p class="card_content">{{ clip.title }} </p>
      <p class="card_content">
        {{ clip.duration.toFixed(2) }}s
        {{ clip.view_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
        {{ clip.created_at }}
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
        <button @click="$emit('add', clip.url)" class="btn btn-success">
          <i class="fa-regular fa-plus"></i>
        </button>
        <button @click="$emit('hide', clip.url)" class="btn btn-error">
          Hide
        </button>
      </div>
      <div v-else class="justify-begin">
        <button @click="$emit('up', clip.url)" class="btn btn-success">
          Up
        </button>
        <button @click="$emit('down', clip.url)" class="btn btn-success">
          Down
        </button>
        <button @click="$emit('top', clip.url)" class="btn btn-warning">
          Top
        </button>
        <button @click="$emit('bottom', clip.url)" class="btn btn-warning">
          Bottom
        </button>
        <button @click="$emit('remove', clip.url)" class="btn btn-error">
          <i class="fa-regular fa-trash-can"></i> Remove
        </button>
      </div>

      <div v-if="!isPlayerHidden" class="h-80">
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

.card_content {
text-shadow: black 0px 0px 3px;
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
