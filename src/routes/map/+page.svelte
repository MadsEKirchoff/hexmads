<script lang="ts">
import {
  Button,
  Label,
  Popover,
  Range,
  Tabs,
  TabItem,
  ButtonGroup,
  GradientButton,
  Spinner,
} from "flowbite-svelte";
import { dev } from "$app/environment";
import { enhance } from "$app/forms";

const hexColor = (i: number) => {
  switch (i % 6) {
    case 0:
      return "bg-red-900";
    case 1:
      return "bg-green-900";
    case 2:
      return "bg-blue-900";
    case 3:
      return "bg-yellow-900";
    case 4:
      return "bg-gray-600";
    case 5:
      return "bg-gray-400";
  }
};
const prettyObject = (obj: object) =>
  JSON.stringify(obj).replace(/"|{|}/g, "").replace(",", " ");

export let data;
export let form: HTMLFormElement;

let uploading = false;

const columns = 67;
const rows = 32;

let hexWidth = 160;
const heightRatio = 0.87;
$: hexHeight = () => hexWidth * heightRatio;
const sideRatio = 0.75;
$: minWidth = () => sideRatio * hexWidth;
let margin = 3;

const hexhashes = new Map();
data.hexInstance.forEach((hex: any) => {
  hexhashes.set({ x: hex.x, y: hex.y }, hex);
});

let biomeSelected: (typeof data.biome)[number] | null = null;

let selectedHex: { x: number; y: number } | null = null;
$: isHex = (x: number, y: number) =>
  selectedHex?.x === x && selectedHex?.y === y;

let file: File | null = null;
const onChange = (
  event: Event & { currentTarget: EventTarget & HTMLInputElement },
) => {
  file = (event.target as HTMLInputElement)?.files?.[0] ?? null;
};
</script>

<section>
  <div class="absolute pl-6 z-20 top-4 left-0 flex items-center gap-x-4">
    <Label>Margin:</Label>
    <Range
      id="range1"
      min="20"
      max="250"
      bind:value="{hexWidth}"
      class="w-30"
    />
    {hexWidth}
    <Label class="ml-8">Margin</Label>
    <Range id="range2" min="-30" max="30" bind:value="{margin}" class="w-20" />
    {margin}
  </div>
  <Popover
    title="Hex handlinger, {selectedHex && prettyObject(selectedHex)}"
    triggeredBy=".hex"
    trigger="click"
    class="z-50"
  >
    <div class="justify-center gap-4 flex-wrap flex flex-col items-center m-3">
      <!-- on:close={()=>selectedHex = null} -->
      <div>
        <form
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
          <Button color="alternative" size="lg"
            >Upload
            <Spinner size="6" class="ml-4 {!uploading ? 'hidden' : ''}" />
            <input
              id="image-upload"
              name="image-upload"
              type="file"
              accept="image/*"
              class="opacity-0 absolute"
              on:change="{onChange}"
            />
          </Button>
          <!-- <Button
              color="none"
              size="xs"
              class="ml-4 {!hexhashes.has(selectedHex) && 'hidden'}"
              >Slet</Button
            > -->
        </form>
      </div>
      - eller -
      <ButtonGroup
        defaultClass="flex rounded-lg divide-x rtl:divide-x-reverse shadow mt-8 p-4"
      >
        {#each data.biome as bio}
          <Button
            color="{bio.color ?? 'red'}"
            class="h-10 opacity-80 transition-transform {biomeSelected === bio
              ? 'opacity-100 scale-110 z-10'
              : ''}"
            on:click="{() => (biomeSelected = bio)}">{bio.name}</Button
          >
        {/each}
      </ButtonGroup>

      <div class="flex gap-2 mt-2">
        <GradientButton
          pill
          disabled="{!biomeSelected}"
          class="transition-color"
          color="purpleToPink">Rando</GradientButton
        >
        <GradientButton
          pill
          disabled="{!biomeSelected}"
          class="transition-color"
          color="pinkToOrange">Rando 1/2</GradientButton
        >
        <GradientButton
          pill
          disabled="{!biomeSelected}"
          class="transition-color"
          color="tealToLime">Rando 1/3</GradientButton
        >
      </div>
    </div>
  </Popover>

  {#if dev}
    <p class="text-[11px] text-gray-800">{JSON.stringify(data, null, 2)}</p>
  {/if}

  <!-- <section class="hexGrid hexGrid text-[0px]" style="--hexSize: {hexSize}px; --hexMargin: {hexMargin}px;"> -->
  <section
    class="grid"
    style:grid-template-columns="repeat({columns}, {hexWidth * sideRatio +
      margin}px)"
    style:grid-template-rows="repeat({rows}, {hexHeight() + margin}px)"
  >
    {#each Array(rows) as _, y}
      {#each Array(columns) as _, x}
        <button
          on:click="{() => (selectedHex = { x, y })}"
          class="hex relative transition-transform {isHex(x, y) &&
            'scale-125 z-10'}"
          style:margin-top="{x % 2 ? (hexWidth * heightRatio) / 2 : 0}px"
          style:width="{hexWidth}px"
        >
          {#if data.party[0]?.x === x && data.party[0]?.y === y}
            <img src="{data.party[0].imageUrl}" class="w-1/2" alt="party" />
          {/if}
          {#if hexhashes.get({ x, y })}
            <img
              class:oddColum="{x % 2}"
              src="https://lzkv4zegmrmck0ot.public.blob.vercel-storage.com/hex-FwylBqjBXhYVbnA4iFE7c5GQHHvHeK.png"
              alt="Blob"
            />
            <!-- Xsrc="{hexhashes.get({ x, y })?.imageUrl}" -->
          {:else}
            <div
              class="{hexColor(x)} opacity-10"
              style="
              width: {hexWidth}px;
              margin: {margin}px {minWidth}px;
              height: {hexHeight()}px;
              margin-bottom: {margin}px;
              clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
              "
            ></div>
            <!-- margin-top: {x % 2 ? hexHeight() / 2 : 0}px; -->
            <!--
            clip-pathsdds: polygon(
              {minWidth}px 0%,
              {hexWidth - minWidth()}px 0%,
              100% 50%,
              {hexWidth - minWidth()}px 100%,
              {minWidth}px 100%,
            -->
          {/if}
        </button>
      {/each}
    {/each}
  </section>
</section>

<style>
.main {
  --ratio: 0.87;
  --clip: 0.25;
  --m: 4px; /* vertical margin */

  --clipInLeft: calc(var(--clip) * 100%);
  --clipInRight: calc(100% - var(--clipInLeft));
  --spikeWidth: calc(var(--size) * var(--clip) - var(--m));
  /* clip-path parameter */
  /* --hc: 10px;
      --vc: 50px; */

  /* --mh: calc(var(--m) + (var(--size) - 2*var(--hc))/2); horizontal margin */
  /* --f: calc(2*var(--size) + 4*var(--m) - 2*var(--vc) - 2px); */
}

.hexGrid {
  display: grid;
  grid-template-columns: repeat(
    var(--columns),
    calc(var(--size) - var(--spikeWidth))
  );
  grid-template-rows: repeat(
    var(--rows),
    calc(var(--size) * var(--ratio) + var(--m))
  );
  font-size: 0; /* disable white space between inline block element */
}

.hex {
  width: var(--size);
  margin: var(--m) var(--mh);
  height: calc(var(--size) * var(--ratio));
  clip-path: polygon(
    var(--clipInLeft) 0%,
    var(--clipInRight) 0%,
    100% 50%,
    var(--clipInRight) 100%,
    var(--clipInLeft) 100%,
    0% 50%
  );
  margin-bottom: calc(var(--m) - var(--vc));
  /* background-image: url('https://lzkv4zegmrmck0ot.public.blob.vercel-storage.com/forrest1-nw18osd749NQUVOYppKNvm79qYJ9gc.png'); */
}

.hexImg {
  width: var(--size);
  margin-bottom: calc(var(--m) - var(--vc));
}

.oddColum {
  margin-top: calc(var(--size) * var(--ratio) / 2);
}
/* .hexImg {
  width: var(--size);
  margin-bottom: calc(var(--m) - var(--vc));
}*/
</style>
