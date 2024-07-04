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
import { dev } from "$app/environment";
import { enhance } from "$app/forms";
import fantasyNames from "./fantasyNames";

const randomName = () => {
  return (
    fantasyNames[Math.floor(Math.random() * fantasyNames.length)] +
    " " +
    fantasyNames[Math.floor(Math.random() * fantasyNames.length)] +
    " " +
    fantasyNames[Math.floor(Math.random() * fantasyNames.length)]
  );
};

let configStr;
let config: Record<string, any>;

// onMount(() => {
configStr = window.localStorage.getItem("charGenConfig");
if (!configStr) {
  config = {
    usePairsOnce: false,
    chars: [
      {
        name: randomName(),
        stats: [18, 14, 13, 12, 10, 8],
      },
    ],
    karma: 24,
    pairs: [
      [18, 6],
      [17, 8],
      [16, 9],
      [15, 10],
      [14, 11],
      [13, 12],
    ],
  };
} else config = JSON.parse(configStr);

const statNames = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
];
// });
$: saveChanges = () =>
  window.localStorage.setItem("charGenConfig", JSON.stringify(config));

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
};

const karmaCharacter = () => {
  const roll4d6DropLowest = () => {
    const rolls = Array.from(
      { length: 4 },
      () => Math.floor(Math.random() * 6) + 1,
    );
    rolls.sort((a, b) => a - b);
    return rolls.slice(1).reduce((acc, curr) => acc + curr, 0);
  };

  const pair1 = [roll4d6DropLowest(), roll4d6DropLowest(), roll4d6DropLowest()];
  const karmaPair = [
    config.karma - pair1[0],
    config.karma - pair1[1],
    config.karma - pair1[2],
  ];
  const name = randomName();
  config.chars.push({ name, stats: [...pair1, ...karmaPair] });
  config = config;
};

const deleteCharacter = (character: any) => {
  const index = config.chars.indexOf(character);
  if (index > -1) {
    config.chars.splice(index, 1);
  }
  config = config;
};

const deletePair = (index: number) => {
  config.pairs.splice(index, 1);
  config = config;
};

const newPair = [12, 10];
</script>

<section class="relative flex flex-col items-center">
  <div id="randomMethods" class="flex gap-8">
    <div
      class="flex flex-col items-center max-w-96 p-4 rounded-lg shadow-xl ring-1 ring-gray-900/5 backdrop-blur-lg gap-y-2"
    >
      <h2 class="font-bold">Statspar</h2>
      <GradientButton
        pill
        color="purpleToBlue"
        on:click="{createCharacterFromRandomPair}"
      >
        Rul karakter
      </GradientButton>
      <div class="flex gap-x-2">
        <Label>Par bruges én gang:</Label>
        <Toggle bind:checked="{config.usePairsOnce}" />
      </div>
      {#each config.pairs as pair, i}
        <div class="flex items-center gap-2">
          <NumberInput type="number" bind:value="{pair[0]}" class="w-14" />
          <NumberInput type="number" bind:value="{pair[1]}" class="w-14" />
          <Button on:click="{() => deletePair(i)}">Slet</Button>
        </div>
      {/each}
      <div class="flex items-center gap-2">
        <NumberInput
          type="number"
          bind:value="{newPair[0]}"
          class="mr-1 w-14 opacity-50"
        />
        <NumberInput
          type="number"
          bind:value="{newPair[1]}"
          class="w-14 opacity-50"
        />
        <GradientButton
          pill
          class="transition-color"
          color="blue"
          on:click="{() => {
            config.pairs.push([...newPair]);
            config = config;
          }}">Tilføj</GradientButton
        >
      </div>
    </div>

    <div
      class="flex flex-col items-center max-w-96 p-4 rounded-lg shadow-xl ring-1 ring-gray-900/5 backdrop-blur-lg gap-y-2"
    >
      <h2 class="font-bold">Karmarul</h2>
      <GradientButton
        pill
        color="purpleToBlue"
        on:click="{() => karmaCharacter()}"
      >
        Rul karakter
      </GradientButton>
      <div class="flex align-middel items-center gap-2">
        <Label>Stat rul trækkes fra:</Label>
        <NumberInput
          type="number"
          bind:value="{config.karma}"
          class="mr-1 w-18"
        />
      </div>
    </div>
  </div>
  <hr />
  <div class="mt-9 flex align-middle gap-8 flex-wrap">
    {#each config.chars as character}
      <div class="character p-4 rounded-lg shadow-xl ring-1">
        <h3>{character.name}</h3>
        <ul>
          {#each character.stats as stat, i}
            <li>{statNames[i]}: {stat}</li>
          {/each}
        </ul>
        <Button on:click="{() => deleteCharacter(character)}">Delete</Button>
      </div>
    {/each}
  </div>
</section>

<style>
</style>
