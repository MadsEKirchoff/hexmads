<script lang="ts">
import "../app.css";
import { Tabs, TabItem } from "flowbite-svelte";
import Button from "$lib/Button.svelte";

import {
  UserCircleSolid,
  GridOutline,
  GridSolid,
  DrawSquareOutline,
  MapPinAltSolid,
  FileImageOutline,
} from "flowbite-svelte-icons";
import { Alert } from "flowbite-svelte";
import { goto } from "$app/navigation";
import { Spinner } from "flowbite-svelte";
import { fade } from "svelte/transition";
import { page } from "$app/stores";

$page.url.pathname;
let loading = false;

const loadPage = async (url: string) => {
  loading = true;
  await goto(url);
  loading = false;
};
</script>

<!-- https://ui.aceternity.com/components/tailwindcss-buttons -->
<!-- <main class="relative min-h-screen h-full"> -->
<div class="max-h-screen h-full overflow-hidden flex flex-col">
  <Tabs style="underline" contentClass=" " class="justify-end bg-gray-500/20">
    <TabItem
      open="{$page.url.pathname === '/'}"
      title="Profile"
      on:click="{() => loadPage('/')}"
    >
      <div slot="title" class="flex items-center gap-2">
        <!-- <DrawSquareOutline size="sm" /> -->
        <MapPinAltSolid size="sm" />Kort
      </div>
    </TabItem>
    <TabItem
      open="{$page.url.pathname === '/gallery'}"
      title="Profile"
      on:click="{() => loadPage('/gallery')}"
    >
      <div slot="title" class="flex items-center gap-2">
        <FileImageOutline size="sm" />Hexgalleri
      </div>
    </TabItem>
  </Tabs>
  {#if loading}
    <div>
      <div
        class="absolute z-50 left-0 right-0 top-0 bottom-0 flex justify-center items-center"
        transition:fade
      >
        <Spinner size="36" class="absolute z-50" />
      </div>
      <div class="relative">
        <div
          class="absolute z-40 inset-0 min-h-screen min-w-screen bg-[#f0efea]"
          transition:fade
        ></div>
      </div>
    </div>
  {/if}

  <div class="overflow-auto max-h-full pt-4 pb-12 flex-grow flex-1">
    <slot />
  </div>
</div>
<!-- </main> -->
<!-- <nav class="flex justify-center space-x-8 py-4"> -->
<!-- <a href="/" class="">
      <Button>Kort</Button>
    </a>
    <a href="/gallery">
      <Button>Hexgalleri</Button>
    </a>
</main> -->
