<script lang="ts">
import { put, list, type ListBlobResult } from "@vercel/blob";
// import Button from "$lib/Button.svelte";
import { enhance } from "$app/forms";
import { TrashBinOutline } from "flowbite-svelte-icons";
import UploadIcon from "$lib/UploadIcon.svelte";
import { ButtonGroup, Button, GradientButton } from "flowbite-svelte";
import { fly, fade } from "svelte/transition";
import { Spinner } from "flowbite-svelte";
import { index } from "drizzle-orm/mysql-core";
import { dev } from "$app/environment";

export let data;
export let form: HTMLFormElement;

// $: newImage = async () => {
//   let bloos = Array(await data.blobList)
//   bloos = [form?.uploaded, ...bloos]
// }
let file: File | null = null;

let uploading = false;

let biomeSelected: (typeof data.biome)[number] | null;

const confirmTime = 1400;
let confirming = "";

let timeout: number | null = null;

const debounceConfirm = (id: string, func: () => {}) => {
  confirming = id;
  if (timeout) clearTimeout(timeout);
  timeout = window.setTimeout(() => {
    if (confirming) func();
    confirming = "";
  }, confirmTime);
};

let shownBlobs: Record<string, boolean> = { test: true };

const onChange = (
  event: Event & { currentTarget: EventTarget & HTMLInputElement },
) => {
  file = (event.target as HTMLInputElement)?.files?.[0] ?? null;
  form?.dispatchEvent(new Event("submit", { bubbles: true }));
};

$: hexGroups = () =>
  Object.entries(
    data.hexTemplates.reduce(
      (acc, curr) => {
        const biomeName = data.biome.find((b) => b.id === curr.biome)?.name!;
        const group = acc[biomeName] || [];
        group.push(curr);
        acc[biomeName] = group;
        return acc;
      },
      {} as Record<string, typeof data.hexTemplates>,
    ),
  );
</script>

<main class="relative flex min-h-screen flex-col items-center">
  <div
    class="flex flex-col items-center w-full max-w-xl p-8 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white
     ring-1 ring-gray-900/5 backdrop-blur-lg"
  >
    <form
      class="grid gap-6 w-full"
      action="?/upload"
      method="POST"
      enctype="multipart/form-data"
      bind:this="{form}"
      use:enhance="{() => {
        uploading = true;
        return async ({ update }) => {
          file = null;
          update({ reset: true });
          uploading = false;
        };
      }}"
    >
      <ButtonGroup style="h-12" divClass="inline-flex justify-center">
        {#each data.biome as bio}
          <Button
            color="{bio.color ?? 'red'}"
            class="h-10 opacity-80 transition-transform {biomeSelected === bio
              ? 'opacity-100 scale-125 z-10'
              : ''}"
            on:click="{() => (biomeSelected = bio)}"
            name="{biomeSelected == bio && 'biomeBtn'}">{bio.name}</Button
          >
        {/each}
        <Button
          color="alternative"
          class="h-10 opacity-80 transition-all {biomeSelected === null
            ? 'opacity-100 scale-125 z-10'
            : ''}"
          on:click="{() => (biomeSelected = null)}">Ingen</Button
        >
      </ButtonGroup>

      <div class="flex flex-col">
        <GradientButton
          size="xl"
          color="purpleToBlue"
          disabled="{uploading || biomeSelected === undefined}"
          >Upload billede
          <Spinner size="6" class="ml-4 {!uploading ? 'hidden' : ''}" />
          <input
            id="image-upload"
            name="image-upload"
            type="file"
            accept="image/*"
            class="opacity-0 absolute"
            on:change="{onChange}"
          />
        </GradientButton>
        <p class="text-[10px] text-gray-500 text-right h-min">
          Mulige filtyper: .png, .jpg, .gif, .mp4
        </p>
      </div>
      <input
        type="{!dev ? 'hidden' : ''}"
        name="biome"
        value="{biomeSelected?.id}"
      />
    </form>
  </div>
  {hexGroups()?.length}
  {#each hexGroups() as [biome, hexes] (biome)}
    <h2 class="mt-8 mb-6 text-xl font-semibold">{biome}</h2>
    {#each hexes as hex}
      <div
        class="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-lg"
      >
        <img src="{hex.imageUrl}" alt="hex" class="max-h-44" />
      </div>
    {/each}
  {/each}

  <!-- ICONS: https://icon-sets.iconify.design/ -->
  <h2 class="mt-8 mb-6 text-xl font-semibold">billeder</h2>
  <div class="flex max-w-screen gap-4 flex-wrap juAndrestify-center px-8">
    {#await data.blobList}
      <p>Loading...</p>
    {:then blobList}
      {#each blobList.blobs as blob, index (blob.url)}
        <div
          class="relative
          p-4 bg-white rounded-xl group border"
        >
          {#if (blob.size < 1000 && index < 2) || shownBlobs[blob.url]}
            <img
              src="{blob.url}"
              alt="blob"
              class="max-h-44 transition-opacity duration-[1.5s] {confirming ===
              blob.url
                ? 'opacity-0'
                : 'opacity-100'}"
            />
            <div
              class="absolute p-4 top-0 left-0 right-0 bottom-0 opacity-0 group-hover:opacity-30 transition-opacity bg-white"
            ></div>
            <div
              class="absolute p-4 top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <button
                class="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center opacity-80"
                on:mousedown="{async (e) => {
                  debounceConfirm(blob.url, async () => {
                    blobList.blobs = blobList.blobs.filter(
                      (b) => b.url !== blob.url,
                    );
                    await fetch(`/blob`, {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(blob),
                    });
                  });
                }}"
                on:mouseup="{() => (confirming = '')}"
              >
                <TrashBinOutline
                  class="rounded-full w-10 h-10 transition rotate-0 duration-[1.5s] visited:border-0 {confirming ===
                    blob.url && 'rotate-[360deg] scale-150 text-red-500'}"
                />
              </button>
            </div>
          {:else}
            <span class="flex break-all max-w-48 justify-center text-center"
              >{blob.pathname}</span
            >
            <Button
              on:click="{() => (shownBlobs[blob.url] = true)}"
              size="lg"
              class="w-full mt-2">Vis billede</Button
            >
          {/if}
        </div>
      {/each}
    {:catch error}
      <p>{error.message}</p>
    {/await}
  </div>
  <div
    class="flex justify-center gap-1 font-light text-gray-600 w-full max-w-lg text-center mt-6"
  ></div>
</main>
