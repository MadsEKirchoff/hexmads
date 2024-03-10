<script lang="ts">
import { put, list, type ListBlobResult } from "@vercel/blob";
import Button from "$lib/Button.svelte";
import { enhance } from "$app/forms";
import { TrashBinOutline } from "flowbite-svelte-icons";
import UploadIcon from "$lib/UploadIcon.svelte";

export let data;
export let form;

// $: newImage = async () => {
//   let bloos = Array(await data.blobList)
//   bloos = [form?.uploaded, ...bloos]
// }
let file: File | null = null;

function onChange(
  event: Event & { currentTarget: EventTarget & HTMLInputElement },
) {
  file = (event.target as HTMLInputElement)?.files?.[0] ?? null;
}
$: buttonClass = file
  ? "border-black bg-black text-white hover:bg-white hover:text-black"
  : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400";
</script>

<main class="relative flex min-h-screen flex-col items-center">
  <div
    class="flex flex-col items-center w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg"
  >
    <form
      class="grid gap-6 w-full"
      action="?/upload"
      method="POST"
      enctype="multipart/form-data"
      use:enhance="{() => {
        return async ({ update }) => {
          file = null;
          update({ reset: true });
        };
      }}"
    >
      <div>
        <div class="space-y-1 mb-4">
          <h2 class="text-xl font-semibold">Upload billede</h2>
          <p class="text-sm text-gray-500">
            Accepted formats: .png, .jpg, .gif, .mp4
          </p>
        </div>
        <label
          for="image-upload"
          class="group relative mt-2 flex h-52 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
        >
          {#if !file}
            <div class="absolute z-[5] h-full w-full rounded-md">
              <div
                class="{`${''} absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${'bg-white opacity-100 hover:bg-gray-50'}`}"
              >
                <UploadIcon class="w-12 h-12 text-gray-500" />

                <p class="mt-2 text-center text-sm text-gray-500">
                  Click to upload.
                </p>
                <p class="mt-2 text-center text-sm text-gray-500">
                  Max file size: 50MB
                </p>
                <span class="sr-only">Photo upload</span>
              </div>
            </div>
          {:else}
            <p>{file.name}</p>
          {/if}
        </label>
        <div class="mt-1 flex rounded-md shadow-sm">
          <input
            id="image-upload"
            name="image-upload"
            type="file"
            accept="image/*"
            class="sr-only"
            on:change="{onChange}"
          />
        </div>
      </div>

      <button
        disabled="{!file}"
        class="{buttonClass} flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
      >
        <p class="text-sm">Confirm upload</p>
      </button>
      {#if form && !file}
        <div class="p-2">
          <p class="font-semibold text-gray-900">File uploaded!</p>
          <p class="mt-1 text-sm text-gray-500">
            Your file has been uploaded to{" "}
            <a
              class="font-medium text-gray-900 underline"
              href="{form.uploaded}"
              target="_blank"
              rel="noopener noreferrer"
            >
              {form.uploaded}
            </a>
          </p>
        </div>
      {/if}
    </form>
  </div>

  <!-- ICONS: https://icon-sets.iconify.design/ -->
  <h2 class="mt-8 mb-6 text-xl font-semibold">Ukategoriserede billeder</h2>
  <div class="flex max-w-screen gap-4 flex-wrap justify-center px-8">
    {#await data.blobList}
      <p>Loading...</p>
    {:then blobList}
      {#each blobList.blobs as blob}
        <div
          class="relative
          p-4 bg-white rounded-xl group border"
        >
          <img src="{blob.url}" alt="blob" class="max-h-44" />
          <div
            class="absolute p-4 top-0 left-0 right-0 bottom-0 opacity-0 group-hover:opacity-70 transition-opacity bg-white"
          ></div>
          <div
            class="absolute p-4 top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <button>
              <TrashBinOutline
                class="w-10 h-10"
                on:click="{async (e) => {
                  blobList.blobs = blobList.blobs.filter(
                    (b) => b.url !== blob.url,
                  );
                  await fetch(`/blob`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(blob),
                  });
                }}"
              />
            </button>
          </div>
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
