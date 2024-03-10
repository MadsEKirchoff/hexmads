<script lang="ts">
import { Tabs, Button, Label, Range, Popover } from "flowbite-svelte";

export let data;

const columns = 30;
const rows = 15;

let hexWidth = 160;
const heightRatio = 0.87;
$: hexHeight = () => hexWidth * heightRatio;
const sideRatio = 0.75;
$: minWidth = () => sideRatio * hexWidth;
let margin = 5;

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
      return "bg-gray-200";
  }
};

let selectedHex: { x: number; y: number } | null = null;

const prettyObject = (obj: object) =>
  JSON.stringify(obj).replace(/"|{|}/g, "").replace(",", " ");
</script>

<section>
  <div class="absolute pl-6 z-20 top-4 left-0 flex items-center gap-x-4">
    <Label class="ml-auto flex">Scale</Label>
    <Range
      id="range1"
      min="20"
      max="250"
      bind:value="{hexWidth}"
      class="w-30"
    />
    {hexWidth}
    <Label class="ml-auto flex">Margin</Label>
    <Range id="range2" min="-30" max="30" bind:value="{margin}" class="w-20" />
    {margin}
  </div>
  <Popover
    title="Hex handlinger. {selectedHex && prettyObject(selectedHex)}"
    triggeredBy=".hex"
    trigger="click"
    class="w-96 z-50"
  >
    <!-- on:close={()=>selectedHex = null} -->
    <Button>Upload</Button>
    <Button>Rando</Button>
    <Button>Rando 1/2</Button>
    <Button>Rando 1/3</Button>
  </Popover>
  {JSON.stringify(data)}

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
          class="hex relative transition-transform focus:scale-125 focus:z-10"
          style:margin-top="{x % 2 ? (hexWidth * heightRatio) / 2 : 0}px"
          style:width="{hexWidth}px"
        >
          <!-- <div class="bg-black"></div> -->
          <img
            class="w-full"
            class:oddColum="{x % 2}"
            src="https://lzkv4zegmrmck0ot.public.blob.vercel-storage.com/image-9BKY2SNY8T9V8GuOWCQuFFfAbPmGgl.png"
            alt="Blob"
          />
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
</style>
