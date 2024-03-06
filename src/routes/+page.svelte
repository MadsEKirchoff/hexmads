<script lang="ts">
  const hexColumns = 40;
  const hexRows = 20;

  const hexSize = 80;
  const hexMargin = 1;

  const hexColor = (i:number) => {
    switch(i % 5) {
      case 0: return 'bg-red-900';
      case 1: return 'bg-green-900';
      case 2: return 'bg-blue-900';
      case 3: return 'bg-yellow-900';
      case 4: return 'bg-gray-600';
      case 5: return 'bg-white';}
  }
</script>

<main class="relative flex-col items-center justify-center">
  <section class="hexGrid text-[0px]" style="--hexSize: {hexSize}px; --hexMargin: {hexMargin}px;">
    {#each Array(hexRows) as _, y}
      {#each Array(hexColumns) as _, x}
      <span class="hex {hexColor(x)}" class:oddLineStart={y % 2 && x === 0} >
        <!-- <span class=""> -->
          <!-- <img src="blob.svg" alt="Blob"  /> -->
          <!-- </span> -->
      </span>
      {/each}
      <br />
    {/each}
  </section>
</main>

<style>
.hexGrid {
  --f: calc(var(--hexSize) * 1.732 + 4 * var(----hexMargin) - 1px);
  --widthRatio: calc(195 / 170);
  white-space: nowrap;
  font-size: 0; /* disable white space between inline block element */
}

.hexGrid .hex {
  width: var(--hexSize);
  margin: var(--hexMargin);
  height: calc(var(--hexSize) * 1.1547);
  display: inline-block;
  font-size: initial;
  clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
  margin-bottom: calc(var(--hexMargin) - var(--hexSize) * 0.2885);
  /* background-color: darkslateblue; */
}

.hexGrid .hex.oddLineStart {
  margin-left: calc(var(--hexSize) / 2 + var(--hexMargin));
}

/* .hexGrid::before {
  content: "";
  width: calc(var(--hexSize) / 2 + var(--hexMargin));
  float: left;
  height: 120%;
  shape-outside: repeating-linear-gradient(#0000 0 calc(var(--f) - 3px), #000 0 var(--f));
} */
</style>