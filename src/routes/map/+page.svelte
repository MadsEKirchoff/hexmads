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
// import logo from "$lib/assets/logo.png";

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
let margin = -1;

let hexhashes: (typeof data.hexInstance)[] = [];
$: data.hexInstance.forEach((hex) => {
  if (!hexhashes[hex.x]) hexhashes[hex.x] = [];
  hexhashes[hex.x][hex.y] = hex;
});
hexhashes = hexhashes;
console.log(`🚀 > hexhashes:`, hexhashes);
const getKey = (x: number, y: number) =>
  `${x}-${y}` + (hexhashes[x]?.[y] ? hexhashes[x]?.[y]?.id : "");

let biomeSelected: (typeof data.biome)[number] | null = null;

let selectedHex:
  | ({ x: number; y: number } & Partial<(typeof data.hexInstance)[number]>)
  | null = null;
$: isSelected = (x: number, y: number) =>
  selectedHex?.x === x && selectedHex?.y === y;

let file: File | null = null;
const onChange = (
  event: Event & { currentTarget: EventTarget & HTMLInputElement },
) => {
  file = (event.target as HTMLInputElement)?.files?.[0] ?? null;
  form?.dispatchEvent(new Event("submit", { bubbles: true }));
};

let party = data.party[0];
let isDraggingParty = false;

let hexGrid = data.hexGrid[0];
</script>

<section class="">
  <!-- Top actions -->
  <div class="pl-4 flex items-center gap-x-4">
    <Label>Størrelse:</Label>
    <Range
      id="range1"
      min="20"
      max="250"
      bind:value="{hexWidth}"
      class="w-24"
    />
    {hexWidth}
    <Label class="ml-8">Margin:</Label>
    <Range id="range2" min="-30" max="30" bind:value="{margin}" class="w-20" />
    {margin}
  </div>

  <!-- Actions -->
  <Popover
    title="Hex handlinger, {selectedHex &&
      prettyObject({
        x: selectedHex.x,
        y: selectedHex.y,
        imageUrl: selectedHex.imageUrl?.substring(50),
      })}"
    triggeredBy=".hex"
    trigger="click"
    class="z-50 {!selectedHex && 'hidden'}"
    on:show="{(event) => {
      if (!event.detail) selectedHex = null;
    }}"
  >
    {#if selectedHex}
      <div
        class="justify-center gap-4 flex-wrap flex flex-col items-center m-3"
      >
        <div>
          <form
            action="?/createHexInstance"
            method="POST"
            enctype="multipart/form-data"
            bind:this="{form}"
            use:enhance="{() => {
              uploading = true;
              return async ({ update }) => {
                file = null;
                await update({ reset: true });
                uploading = false;
                hexhashes = hexhashes;
              };
            }}"
          >
            <input type="hidden" name="id" value="{selectedHex.id}" />
            <input type="hidden" name="x" value="{selectedHex.x}" />
            <input type="hidden" name="y" value="{selectedHex.y}" />
            <input type="hidden" name="hexGrid" value="{hexGrid.id}" />
            <Button size="lg">
              Upload
              <Spinner size="6" class="ml-4 {!uploading ? 'hidden' : ''}" />
              <input
                id="hex-image"
                name="hex-image"
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
    {/if}
  </Popover>

  {#if dev}
    <p class="text-[11px] text-gray-800">
      {JSON.stringify(data.hexInstance, null, 2)}
    </p>
  {/if}

  <!-- <section class="hexGrid hexGrid text-[0px]" style="--hexSize: {hexSize}px; --hexMargin: {hexMargin}px;"> -->
  <section
    class="grid"
    style:grid-template-columns="repeat({columns}, {hexWidth * sideRatio +
      margin}px)"
    style:grid-template-rows="repeat({rows}, {hexHeight() / 2 + margin}px)"
  >
    {#each Array(rows) as _, y}
      {#each Array(columns) as _, x}
        {@const hexInst = hexhashes[x]?.[y]}
        <button
          on:click="{() => (selectedHex = { ...hexInst, x, y })}"
          class="hex relative flex items-end justify-center transition-transform h-full
          {isSelected(x, y) && 'scale-125 z-10'}"
          style="grid-row: {(y + 1) * 2 - 1 + (x % 2)} / {(y + 1) * 2 +
            1 +
            (x % 2)};"
          style:width="{hexWidth}px"
          on:dragover="{(event) => event.preventDefault()}"
          on:drop="{() => {
            if (isDraggingParty) {
              party.x = x;
              party.y = y;
              // TODO: Persist
              fetch(`/party`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(party),
              });

              isDraggingParty = false;
            }
          }}"
        >
          {#if hexInst}
            <img
              src="{hexInst.imageUrl}"
              class="w-full"
              alt="hexImage"
              style="clip-path: polygon(0 0, 100% 0, 100% 55%, 75% 100%, 25% 100%, 0% 55%);"
            />
            <!-- Xsrc="{hexhashes.get({ x, y })?.imageUrl}" -->
          {:else}
            <div
              class="{hexColor(x)} opacity-30"
              style="
              width: {hexWidth}px;
              margin: {margin}px {minWidth}px;
              height: {hexHeight()}px;
              margin-bottom: {margin}px;
              clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);"
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

          <!-- style:margin-top="{x % 2 ? (hexWidth * heightRatio) / 2 : 0}px" -->
          {#if party?.x === x && party?.y === y}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              on:dragstart="{() => (isDraggingParty = true)}"
              on:dragend="{() => (isDraggingParty = false)}"
              class="z-30 w-1/2 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 opacity-80"
            >
              <img src="/partyIcon.png" class="" alt="party" />
            </div>
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
