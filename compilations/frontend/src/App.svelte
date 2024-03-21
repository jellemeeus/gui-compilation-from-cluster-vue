<script lang="ts">
  import type { Clip } from "wailsjs/go/models.js";
  import { BrowserOpenURL } from "../wailsjs/runtime";

  import { onMount } from "svelte";

  import { GetClips, LoadClipsFromDB } from "../wailsjs/go/main/App.js";

  let consoleText: string = "";

  let showLeft: boolean = true;
  let showConsole: boolean = true;

  let clips: Clip[] = [];
  let selectedClips: Clip[] = [];

  function onGetClips(): void {
    GetClips().then((result) => {
      consoleText += result;
    });
  }

  function onLoadClipsFromDB(): void {
    LoadClipsFromDB().then((result) => {
      consoleText += result.map((clip) => clip.thumbnail_url).join("\n");
      console.log({ result });
      clips = result;
    });
  }

  let currentPage = 0;
  function updateClips() {
    clips = clips.slice(currentPage * 10, (currentPage + 1) * 10);
  }
  onMount(async () => {
    updateClips();
  });
</script>

<main>
  <div id="parent" style="display:flex; eight:100%; border:solid 1px black">
    <div id="left" class="center" style="flex:{showLeft ? 3 : 0}">
      <h2>Content area 1</h2>
      <div style="align-items: center">
        Toggle console area
        <input type="checkbox" bind:checked={showConsole} />
      </div>
    </div>

    <div id="right" style="flex:10; display:flex; flex-flow:column;">
      <div style="align-items: center; padding: 1em">
        <h2>Content area 2</h2>
        Top
        <div style="align-items: center">
          <button class="btn" on:click={onGetClips}>Fetch Clips</button>
          <button class="btn" on:click={onLoadClipsFromDB}>Load from DB</button>
        </div>
      </div>
      <div
        id="red"
        class="center white-border"
        style="flex:12;display:{showConsole ? 'flex' : 'none'};"
      >
        <h2>Content area 3</h2>
        Bottom
        <div class="output-box" id="output">
          <div style="display:flex;flex-flow:column; padding:1em">
            <label for="outputText" align="left">Console output:</label>
            <textarea
              class="output"
              id="outputText"
              name="outputText"
              readonly
              cols="80">{consoleText}</textarea
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="clips-box" style="flex:12; display:flex; flex-flow:row;">
    <h2>Content area 3</h2>
    clips
  </div>

  <div
    id="clips-container"
    style="flex:12; display:flex; flex-flow:row; justify-start:start"
  >
    <div id="clips" style="flex:8">
      {#each clips as clip}
        <div class="clip-card" style="display:flex; flex-flow:row">
          <div class="clip-card-actions" style="flex:1 ; background-color:red">
            <button
              class="btn"
              on:click={() => {
                selectedClips.push(clip);
                selectedClips = selectedClips;
                clips = clips.filter((c) => c.id !== clip.id);
              }}
            >
              Add
            </button>

            <button
              class="btn"
              on:click={() => {
                clips = clips.filter((c) => c.id !== clip.id);
              }}
            >
              Remove
            </button>

            <button class="btn" on:click={() => BrowserOpenURL(clip.url)}>
              Link
            </button>
          </div>

          <div class="clip-card-info" style="flex:11">
            <video width="320" height="240" controls>
              <track kind="captions" />
              <source src={clip.embedUrl} type="video/mp4" />
            </video>
            <img src={clip.thumbnail_url} alt={clip.title} />

            <h3>{clip.title}</h3>
            <p>ID: {clip.id}</p>
            <p>Creator ID: {clip.creator_id}</p>
            <p>Creator Name: {clip.creator_name}</p>
            <p>Broadcaster ID: {clip.broadcaster_id}</p>
            <p>Broadcaster Name: {clip.broadcaster_name}</p>
            <p>Views: {clip.view_count}</p>
            <!-- svelte-ignore a11y-missing-attribute -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
          </div>
        </div>
      {/each}

      <button
        on:click={() => {
          currentPage++;
          updateClips();
        }}
      >
        Next
      </button>
    </div>

    <div id="selected" style="flex:4">
      {#each selectedClips as clip}
        <div class="clip-card" style="display:flex; flex-flow:row">
          <div class="clip-card-info" style="flex:11">
            <h3>{clip.title}</h3>
            <p>ID: {clip.id}</p>
            <p>Creator ID: {clip.creator_id}</p>
            <p>Creator Name: {clip.creator_name}</p>
            <p>Broadcaster ID: {clip.broadcaster_id}</p>
            <p>Broadcaster Name: {clip.broadcaster_name}</p>
            <p>Views: {clip.view_count}</p>
          </div>
          <div class="clip-card-actions" style="flex:1 ; background-color:red">
            <button
              class="btn"
              on:click={() => {
                const index = selectedClips.indexOf(clip);
                if (index > 0) {
                  const temp = selectedClips[index];
                  selectedClips[index] = selectedClips[index - 1];
                  selectedClips[index - 1] = temp;
                }
              }}
            >
              Up
            </button>

            <button
              class="btn"
              on:click={() => {
                const index = selectedClips.indexOf(clip);
                if (index < selectedClips.length - 1) {
                  const temp = selectedClips[index];
                  selectedClips[index] = selectedClips[index + 1];
                  selectedClips[index + 1] = temp;
                }
              }}
            >
              Down
            </button>

            <button
              class="btn"
              on:click={() => {
                const index = selectedClips.indexOf(clip);
                if (index > 0) {
                  const temp = selectedClips[index];
                  selectedClips.splice(index, 1);
                  selectedClips.unshift(temp);
                  selectedClips = selectedClips;
                }
              }}
            >
              Top
            </button>

            <button
              class="btn"
              on:click={() => {
                const index = selectedClips.indexOf(clip);
                if (index < selectedClips.length - 1) {
                  const temp = selectedClips[index];
                  selectedClips.splice(index, 1);
                  selectedClips.push(temp);
                  selectedClips = selectedClips;
                }
              }}
            >
              Bottom
            </button>

            <button
              class="btn"
              on:click={() => {
                clips = clips.filter((c) => c.id !== clip.id);
              }}
            >
              Remove
            </button>

            <button class="btn" on:click={() => BrowserOpenURL(clip.url)}>
              Link
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</main>

<style>
  .center {
    text-align: center;
    display: flex;
    flex-flow: column;
    justify-content: center;
  }

  .btn {
    width: 70px;
    height: 40px;
    border-radius: 3px;
    margin: 10px;
    border: none;
    cursor: pointer;
  }
  #outputText {
    height: 80px;
    resize: none;
    overflow: auto;
  }

  .white-border {
    border: 1px solid #dddddd;
    border-radius: 3px;
  }
</style>
