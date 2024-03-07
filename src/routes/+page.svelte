<script lang="ts">
    import { Tabs, Button, Label, Range, Popover } from 'flowbite-svelte';

  const hexColumns = 30;
  const hexRows = 15;

  let size = 140;

  const hexColor = (i:number) => {
    switch(i % 6) {
      case 0: return 'bg-red-900';
      case 1: return 'bg-green-900';
      case 2: return 'bg-blue-900';
      case 3: return 'bg-yellow-900';
      case 4: return 'bg-gray-600';
      case 5: return 'bg-gray-200';}
  }

  let selectedHex: {x: number, y: number} | null = null
  // {x: 0, y: 0};

</script>

<main class="main" style="--size: {size}px; --columns: {hexColumns}; --rows: {hexRows}">
  <div class="absolute pl-6 z-20 top-4 left-0 flex items-center gap-x-4">
    <Label class="ml-auto flex">Scale</Label>
    <Range id="range1" min="20" max="250" bind:value={size} class="w-30" />
  </div>
  <Popover title="Hex handlinger. {JSON.stringify(selectedHex).replace(/"/g, '').replace(/{/g, '').replace(/}/g, '').replace(',', ' ')}" triggeredBy=".hex" trigger="click" class="w-96 z-50">
    <!-- on:close={()=>selectedHex = null} -->
    <Button >Upload</Button>
    <Button >Rando</Button>
    <Button >Rando 1/2</Button>
    <Button >Rando 1/3</Button>

  </Popover>
  <!-- class="absolute flex items-center gap-x-4 p-6 z-20 bg-white rounded-lg transition-opacity duration-1000 {!selectedHex ? 'opacity-0' : 'opacity-100'}" -->
    <section class="hexGrid">
    <!-- <section class="hexGrid hexGrid text-[0px]" style="--hexSize: {hexSize}px; --hexMargin: {hexMargin}px;"> -->

    {#each Array(hexRows) as _, y}
      {#each Array(hexColumns) as _, x}
      <button
      id="hexX{x}Y{y}"
      class="hex relative {hexColor(x)}  transition-transform focus:scale-125 focus:z-10"
      class:oddColum={x % 2}
      on:click={()=> selectedHex = {x,y}}
      >
        <img class="absolute z-30 top-0 left-0" style="width: {size}px" src="https://lzkv4zegmrmck0ot.public.blob.vercel-storage.com/forrest1-nw18osd749NQUVOYppKNvm79qYJ9gc.png"/>
      <!-- <span class=""> -->
        <!-- <img src="blob.svg" alt="Blob"  /> -->
        <!-- </span> -->
      </button>
      {/each}
      <!-- <br /> -->
    {/each}
  </section>
</main>

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
  grid-template-columns: repeat(var(--columns), calc(var(--size) - var(--spikeWidth)));
  grid-template-rows: repeat(var(--rows), calc(var(--size) * var(--ratio) + var(--m)));
  font-size: 0; /* disable white space between inline block element */
}

.hex {
  width: var(--size);
  margin: var(--m) var(--mh);
  height: calc(var(--size)*var(--ratio));
  display: inline-block;
  font-size: initial;
  clip-path: polygon(var(--clipInLeft) 0%, var(--clipInRight) 0%, 100% 50%, var(--clipInRight) 100%, var(--clipInLeft) 100%, 0% 50%);
  margin-bottom: calc(var(--m) - var(--vc));
  /* background-image: url('https://lzkv4zegmrmck0ot.public.blob.vercel-storage.com/forrest1-nw18osd749NQUVOYppKNvm79qYJ9gc.png'); */
}

.oddColum {
  margin-top: calc(var(--size)*var(--ratio) / 2) ;
}

/* .hexGrid::before {
  content: "";
  width: calc(var(--style)/2 + var(--mh));
  float: left;
  height: 120%;
  shape-outside: repeating-linear-gradient(#0000 0 calc(var(--f) - 3px),#000 0 var(--f));
} */



</style>