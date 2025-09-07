<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import ArrowIcon from './ArrowIcon.svelte';

  // --- API parity with Tap.svelte ---
  export let enableKeyboard = true;
  export let directions = ['up', 'down', 'left', 'right'];
  export let disable = [];
  export let title = "Press the ‘UP key’ to see the magic trick!";

  const dispatch = createEventDispatcher();

  let activeKey = '';
  let timer;

  function setActive(dir) {
    activeKey = dir;
    clearTimeout(timer);
    timer = setTimeout(() => (activeKey = ''), 150);
  }

  function fire(dir) {
    if (!directions.includes(dir)) return;
    if (disable.includes(dir)) return;
    dispatch('tap', dir);
  }

  function tap(dir) {
    setActive(dir);
    fire(dir);
  }

  function handleKeydown(e) {
    if (!enableKeyboard) return;
    const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    const dir = map[e.key];
    if (!dir) return;
    e.preventDefault();
    tap(dir);
  }

  onMount(() => () => clearTimeout(timer));
</script>

<!-- SSR-safe key handlers -->
<svelte:window on:keydown={handleKeydown} on:keyup={() => (activeKey = '')} />

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

  .position { position:absolute; bottom:0; left:0; margin-bottom:2%; margin-left:4%; z-index:1000; }
  .container { width:30vw; aspect-ratio:3/2; max-width:200px; max-height:200px; display:flex; flex-direction:column; justify-content:center; align-items:center; }
  .keyboard { display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(2,1fr); gap:2%; width:100%; height:100%; }
  .key { display:flex; justify-content:center; align-items:center; border:none; border-radius:20%; background:#D47D79; color:#FCD4D4; cursor:pointer; opacity:.5; transition:background-color .2s, opacity .2s, transform .08s; }
  .key.up { opacity:1; } /* keep the “up” key fully opaque */
  .key.active, .key:active { background:#A34C48; transform: translateY(1px) scale(.98); }
  .key:disabled { opacity:.25; cursor:not-allowed; }
  .center { visibility:hidden; }
  .instruction { margin-top:10px; font-size:.8rem; color:#A34C48; text-align:center; font-family:'Kumbh Sans', sans-serif; font-weight:900; }
  .icon { width:clamp(18px,2.6vw,28px); height:clamp(18px,2.6vw,28px); }
</style>

<div class='position'>
  <div class="container" role="group" aria-label="Direction pad">
    <div class="keyboard">
      <!-- row 1 -->
      <div class="center"></div>

      {#if directions.includes('up')}
        <button
          class="key up {activeKey === 'up' ? 'active' : ''}"
          on:mousedown={() => tap('up')}
          on:touchstart|preventDefault={() => tap('up')}
          aria-label="Up"
          disabled={disable.includes('up')}
        >
          <ArrowIcon dir="up" class="icon" />
        </button>
      {:else}
        <div class="center"></div>
      {/if}

      <div class="center"></div>

      <!-- row 2 -->
      {#if directions.includes('left')}
        <button
          class="key {activeKey === 'left' ? 'active' : ''}"
          on:mousedown={() => tap('left')}
          on:touchstart|preventDefault={() => tap('left')}
          aria-label="Left"
          disabled={disable.includes('left')}
        >
          <ArrowIcon dir="left" class="icon" />
        </button>
      {:else}
        <div class="center"></div>
      {/if}

      {#if directions.includes('down')}
        <button
          class="key {activeKey === 'down' ? 'active' : ''}"
          on:mousedown={() => tap('down')}
          on:touchstart|preventDefault={() => tap('down')}
          aria-label="Down"
          disabled={disable.includes('down')}
        >
          <ArrowIcon dir="down" class="icon" />
        </button>
      {:else}
        <div class="center"></div>
      {/if}

      {#if directions.includes('right')}
        <button
          class="key {activeKey === 'right' ? 'active' : ''}"
          on:mousedown={() => tap('right')}
          on:touchstart|preventDefault={() => tap('right')}
          aria-label="Right"
          disabled={disable.includes('right')}
        >
          <ArrowIcon dir="right" class="icon" />
        </button>
      {:else}
        <div class="center"></div>
      {/if}
    </div>

    <div class="instruction">{title}</div>
  </div>
</div>
