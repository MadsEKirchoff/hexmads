<script lang="ts">
  import { M } from "svelte-motion";
  import { cn } from "$lib/cn";
  import FadeInDiv from "$lib/FadeInDiv.svelte"
  import type { Tab } from "./Tab";

  export let tabs: Tab[];

  let active = tabs[0];
  let hovering = false;

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...tabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    tabs = newTabs;
    active = newTabs[0];
  };

  const isActive = (tab: Tab) => {
    return tab.value === tabs[0].value;
  };
</script>

<div class="flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full">
  {#each tabs as tab, idx (tab.title)}
    <button
      on:click={() => {
        moveSelectedTabToTop(idx);
      }}
      on:mouseenter={() => hovering = true}
      on:mouseleave={() => hovering = false}
      class="px-4 py-2 rounded-full tabClassName"
    >
      {#if active.value === tab.value}
        <div class="inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full"/>
      {/if}
      <span class="relative block text-black dark:text-white">
        {tab.title}
      </span>
    </button>
  {/each}
</div>