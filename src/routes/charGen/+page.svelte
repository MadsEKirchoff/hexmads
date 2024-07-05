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
  Toggle,
  Input,
  NumberInput,
} from "flowbite-svelte";
import { onMount } from "svelte";
import { dev, browser } from "$app/environment";
import { enhance } from "$app/forms";
import fantasyNames from "./fantasyNames";
import {
  TrashBinOutline,
  FileLinesOutline,
  ArrowUpFromBracketOutline,
} from "flowbite-svelte-icons";
import {
  fade,
  fly,
  slide,
  blur,
  scale,
  draw,
  crossfade,
} from "svelte/transition";

const randomName = () => {
  return (
    fantasyNames[Math.floor(Math.random() * fantasyNames.length)] +
    " " +
    fantasyNames[Math.floor(Math.random() * fantasyNames.length)]
  );
};

let configStr;
let config = {
  usePairsOnce: false,
  karma: {
    substractee: 25,
    amount: 2,
    size: 6,
    modifier: 5,
  },
  minStat: 16,
  chars: [
    {
      name: randomName(),
      stats: [18, 14, 13, 12, 10, 8],
    },
  ],
  pairs: [
    [18, 6],
    [17, 8],
    [16, 9],
    [15, 10],
    [14, 11],
    [13, 12],
  ],
};

// onMount(() => {
if (browser) configStr = window.localStorage.getItem("charGenConfig");

if (configStr) config = JSON.parse(configStr);

// const statNames = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

const saveChanges = () =>
  window.localStorage.setItem("charGenConfig", JSON.stringify(config));

// create a color, red being based on the first two stats, green based on the sum and blue on the last three stats
const getCharacterColor = (stats: number[]) => {
  const red = Math.floor((stats[0] + stats[1] + stats[2] - 18) * 8);
  const green = Math.floor(
    (stats.reduce((acc, curr) => acc + curr, 0) - 50) * 3,
  );
  const blue = Math.floor((stats[3] + stats[4] + stats[5] - 18) * 8);
  return `${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
};

const createCharacterFromRandomPair = () => {
  const pairsOG = [...config.pairs];
  const pair = config.pairs[Math.floor(Math.random() * config.pairs.length)];
  if (config.usePairsOnce) {
    const index = config.pairs.indexOf(pair);
    if (index > -1) {
      config.pairs.splice(index, 1);
    }
  }
  const pair2 = config.pairs[Math.floor(Math.random() * config.pairs.length)];
  if (config.usePairsOnce) {
    const index = config.pairs.indexOf(pair);
    if (index > -1) {
      config.pairs.splice(index, 1);
    }
  }
  const pair3 = config.pairs[Math.floor(Math.random() * config.pairs.length)];

  config.pairs = [...pairsOG];

  const name = randomName();
  config.chars.push({ name, stats: [...pair, ...pair2, ...pair3] });

  config = config;
  saveChanges();
};

const karmaCharacter = () => {
  const rollStat = () => {
    const rolls = Array.from(
      { length: config.karma.amount },
      () => Math.floor(Math.random() * config.karma.size) + 1,
    );
    // rolls.sort((a, b) => a - b);
    return rolls.reduce((acc, curr) => acc + curr, 0) + config.karma.modifier;
  };

  const pair1 = [rollStat(), rollStat(), rollStat()];
  const karmaPair = [
    config.karma.substractee - pair1[0],
    config.karma.substractee - pair1[1],
    config.karma.substractee - pair1[2],
  ];
  const name = randomName();
  config.chars.push({ name, stats: [...pair1, ...karmaPair] });
  config = config;
  saveChanges();
};

const rollStat = () => {
  const rolls = Array.from(
    { length: config.karma.amount + 1 },
    () => Math.floor(Math.random() * config.karma.size) + 1,
  );
  rolls.sort((a, b) => a - b);
  return (
    rolls.slice(1).reduce((acc, curr) => acc + curr, 0) + config.karma.modifier
  );
};

const minimumRoller = () => {
  let highestStat = 0;

  let stats = [1];
  let overflows = 0;
  while (highestStat < config.minStat) {
    stats = Array.from({ length: 6 }, rollStat);
    highestStat = Math.max(...stats);
    overflows++;
    if (overflows > 1000) {
      alert("too high");
      break;
    }
  }

  const name = randomName();
  config.chars.push({ name, stats });
  config = config;
  saveChanges();
};

const deleteCharacter = (character: any) => {
  const index = config.chars.indexOf(character);
  if (index > -1) {
    config.chars.splice(index, 1);
  }
  config = config;
  saveChanges();
};

const deletePair = (index: number) => {
  config.pairs.splice(index, 1);
  config = config;
  saveChanges();
};

const newPair = [12, 10];
</script>

<section class="relative flex flex-col items-center px-8">
  <div id="randomMethods" class="flex gap-8">
    <div
      class="flex flex-col flex-wrap items-center p-4 rounded-lg shadow-xl ring-1 ring-gray-900/5 backdrop-blur-lg gap-y-3 bg-white"
    >
      <h2 class="font-bold">Statspar X 3</h2>
      <GradientButton
        pill
        color="purpleToPink"
        on:click="{createCharacterFromRandomPair}"
      >
        Rul karakter
      </GradientButton>
      <div class="flex gap-x-2">
        <Label>Par bruges max én gang:</Label>
        <Toggle bind:checked="{config.usePairsOnce}" />
      </div>
      <div class="flex flex-col flex-wrap gap-y-1 gap-x-4 max-h-44">
        {#each config.pairs as pair, i (pair)}
          <div class="flex items-center gap-2" transition:slide>
            <NumberInput bind:value="{pair[0]}" class="w-14 h-8" />
            <NumberInput bind:value="{pair[1]}" class="w-14 h-8" />
            <button>
              <TrashBinOutline on:click="{() => deletePair(i)}"
                >Slet</TrashBinOutline
              >
            </button>
          </div>
        {/each}
        <div class="flex items-center gap-2">
          <NumberInput
            bind:value="{newPair[0]}"
            class="mr-1 w-14 opacity-50 h-8"
          />
          <NumberInput bind:value="{newPair[1]}" class="w-14 opacity-50 h-8" />
          <button>
            <ArrowUpFromBracketOutline
              class="transition-color h-7"
              color="green"
              on:click="{() => {
                config.pairs.push([...newPair]);
                config = config;
              }}"
            />
          </button>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col items-center max-w-96 p-4 rounded-lg shadow-xl ring-1 ring-gray-900/5 backdrop-blur-lg gap-y-3 bg-white"
    >
      <h2 class="font-bold">Karmarul</h2>
      <GradientButton
        pill
        color="purpleToBlue"
        on:click="{() => karmaCharacter()}"
      >
        Rul karakter
      </GradientButton>
      <Label>Rulles 3 gange:</Label>
      <div
        class="flex gap-x-1 text-lg font-bold items-center border-1 border-black border-solid"
      >
        <NumberInput
          bind:value="{config.karma.amount}"
          class="w-12 p-1 pl-4 border-gray-300"
        />
        D
        <NumberInput
          bind:value="{config.karma.size}"
          class="w-14 p-1 pl-4 border-gray-300"
        />
        +
        <NumberInput
          bind:value="{config.karma.modifier}"
          class="w-12 p-1 pl-4 border-gray-300"
        />
      </div>
      <Label>Rul trækkes fra:</Label>
      <NumberInput bind:value="{config.karma.substractee}" class="-mt-2 w-14" />
    </div>

    <div
      class="flex flex-col items-center max-w-96 p-4 rounded-lg shadow-xl ring-1 ring-gray-900/5 backdrop-blur-lg gap-y-3 bg-white"
    >
      <h2 class="font-bold">Minums ruller</h2>
      <GradientButton
        pill
        color="greenToBlue"
        on:click="{() => minimumRoller()}"
      >
        Rul karakter
      </GradientButton>
      <Label>Rul indtil mindst 1 stat med:</Label>
      <NumberInput bind:value="{config.minStat}" class="w-16" />
      <div class="text-xs">Bruger også karmarul terningesetuppet</div>
    </div>
  </div>

  <!-- characters -->
  <hr />
  <div class="mt-9 flex align-middle justify-center gap-8 flex-wrap bg-white">
    {#each config.chars as character (character.name)}
      <div
        class="w-52 relative p-4 gap-y-2 rounded-lg shadow-xl border-2 border-solid"
        style="{'border-color:#' + getCharacterColor(character.stats)}"
      >
        <!-- transition:scale -->
        <h3 class="font-semibold">{character.name}</h3>
        <div class="flex justify-between">
          <div>
            {#each character.stats as stat, i}
              <span class="{i === 18 ? 'text-red-800' : ''}">
                {stat}{i < 5 ? ", " : ""}
              </span>
            {/each}
          </div>
          <TrashBinOutline
            on:click="{() => deleteCharacter(character)}"
            class="h-6 w-6 p-0.5 rounded-full hover:bg-gray-900/5 hover:text-red-800 transition-colors cursor-pointer border-2"
          ></TrashBinOutline>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
</style>
