<script>
  // if ArrowIcon forwards rest props, you can pass class="icon"
  import ArrowIcon from './ArrowIcon.svelte';

  let activeKey = '';
  let timer;

  function setActive(dir) {
    activeKey = dir;
    clearTimeout(timer);
    timer = setTimeout(() => (activeKey = ''), 150);
  }

  function handleKeydown(e) {
    const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    const dir = map[e.key];
    if (!dir) return;
    setActive(dir);
  }
</script>

<!-- SSR-safe key handlers -->
<svelte:window on:keydown|preventDefault={handleKeydown} on:keyup={() => (activeKey = '')} />

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

  .position { position:absolute; bottom:0; left:0; margin-bottom:2%; margin-left:4%; z-index:1000; }
  .container { width:30vw; aspect-ratio:3/2; max-width:200px; max-height:200px; display:flex; flex-direction:column; justify-content:center; align-items:center; }
  .keyboard { display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(2,1fr); gap:2%; width:100%; height:100%; }
  .key { display:flex; justify-content:center; align-items:center; border:none; border-radius:20%; background:#D47D79; color:#FCD4D4; cursor:pointer; opacity:.5; transition:background-color .2s, opacity .2s, transform .08s; }
  .key.up { opacity:1; }                /* keep the “down” key fully opaque */
  .key.active, .key:active { background:#A34C48; transform: translateY(1px) scale(.98); }
  .center { visibility:hidden; }
  .instruction { margin-top:10px; font-size:.8rem; color:#A34C48; text-align:center; font-family:'Kumbh Sans', sans-serif; font-weight:900; }
  .icon { width:clamp(18px,2.6vw,28px); height:clamp(18px,2.6vw,28px); }
</style>

<div class='position'>
  <div class="container">
    <div class="keyboard">
      <!-- row 1 -->
      <div class="center"></div>
      <button class="key up {activeKey === 'up' ? 'active' : ''}"
              on:mousedown={() => setActive('up')}
              aria-label="Up">
        <ArrowIcon dir="up" class="icon" />
      </button>
      <!-- this spacer was missing -->
      <div class="center"></div>

      <!-- row 2 -->
      <button class="key {activeKey === 'left' ? 'active' : ''}"
              on:mousedown={() => setActive('left')}
              aria-label="Left">
        <ArrowIcon dir="left" class="icon" />
      </button>

      <button class="key  {activeKey === 'down' ? 'active' : ''}"
              on:mousedown={() => setActive('down')}
              aria-label="Down">
        <ArrowIcon dir="down" class="icon" />
      </button>

      <button class="key {activeKey === 'right' ? 'active' : ''}"
              on:mousedown={() => setActive('right')}
              aria-label="Right">
        <ArrowIcon dir="right" class="icon" />
      </button>
    </div>

    <div class="instruction">Press the ‘UP key’ to see the magic trick!</div>
  </div>
</div>
