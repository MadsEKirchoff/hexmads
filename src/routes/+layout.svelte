<script>
  import '../app.css'
  import Button from '$lib/Button.svelte'
</script>

<main class="relative flex-col items-center justify-center">
  <!-- https://ui.aceternity.com/components/tailwindcss-buttons -->
  <nav class="flex justify-center space-x-8 py-4">
    <Button><a href="/" class="">Kort</a></Button>
    <Button><a href="/gallery">Hexgalleri</a></Button>
  </nav>
  <slot>

  </slot>
  </main>