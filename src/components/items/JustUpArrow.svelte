<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import ArrowIcon from './ArrowIcon.svelte';
  
    // Props you might still use
    export let enableKeyboard = true;
    export let disable = [];
    // export let title = "Press the ‘UP key’ to see the magic trick!";
  
    // Blink config (ms)
    export let blinkDelay = 1500; // 1.5s after mount (or after a tap) to start blinking
  
    const dispatch = createEventDispatcher();
  
    let activeKey = '';
    let pressTimer;      // briefly shows the pressed state
    let blinkUp = false; // blinking state for UP key
    let blinkTimerId;
  
    function setActive(dir) {
      activeKey = dir;
      clearTimeout(pressTimer);
      pressTimer = setTimeout(() => (activeKey = ''), 150);
    }
  
    function fire(dir) {
      if (dir !== 'up') return;            // only UP exists now
      if (disable.includes('up')) return;
      dispatch('tap', dir);
    }
  
    function resetBlinkTimer() {
      clearTimeout(blinkTimerId);
      blinkUp = false; // stop blinking immediately on interaction
      blinkTimerId = setTimeout(() => {
        blinkUp = true; // start blinking after the delay
      }, blinkDelay);
    }
  
    function tapUp() {
      setActive('up');
      fire('up');
      resetBlinkTimer(); // restart the “attention” blink
    }
  
    function handleKeydown(e) {
      if (!enableKeyboard) return;
      if (e.key !== 'ArrowUp') return;
      e.preventDefault();
      tapUp();
    }
  
    onMount(() => {
      resetBlinkTimer(); // start initial countdown to blink
      return () => {
        clearTimeout(pressTimer);
        clearTimeout(blinkTimerId);
      };
    });
  </script>
  
  <!-- SSR-safe key handlers -->
  <svelte:window on:keydown={handleKeydown} on:keyup={() => (activeKey = '')} />
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');
  
    /* .position {
      display: flex;
      text-align: center; */
      /* bottom: 0;
      left: 0;
      margin-bottom: 2%;
      margin-left: 4%;
      z-index: 1000; 
      display: flex;
      text-align: center; */
    
  
    .container {
      display: inline-flex;
    }
  
    /* Single key layout now */
    .key {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border: none;
      border-radius: 20%;
      background: #D47D79;
      color: #FCD4D4;
      cursor: pointer;
      opacity: 1;
      transition: background-color .2s, opacity .2s, transform .08s;
      width: clamp(40px, 6vw, 64px);
      height: clamp(40px, 6vw, 64px);
    }
    .key.active, .key:active { background:#D47D79; transform: translateY(1px) scale(.98); }
    .key:disabled { opacity:.25; cursor:not-allowed; }
  
    .instruction {
      margin-top: 10px;
      font-size: .8rem;
      color: #A34C48;
      text-align: center;
      font-family: 'Kumbh Sans', sans-serif;
      font-weight: 900;
    }
  
    .icon {
      width: clamp(18px, 2.6vw, 28px);
      height: clamp(18px, 2.6vw, 28px);
    }
  
    /* Reuse the burgundy “thumping” blink, now for UP */
    /* @keyframes pulseStrokeUp {
      0%, 100% {
        outline: 0 solid transparent;
        box-shadow: none;
      }
      50% {
        outline: 3px solid #800020; 
        outline-offset: 0;
        box-shadow: 0 0 0 4px rgba(128, 0, 32, 0.85);
      }
    } */
    .blink-up {
      animation: pulseStrokeUp 0.9s infinite;
      border-radius: 20%;
    }
  </style>
  
    <div class="container" role="group" aria-label="Up control">
      <button
        class="key {activeKey === 'up' ? 'active' : ''} {blinkUp ? 'blink-up' : ''}"
        on:mousedown={tapUp}
        on:touchstart|preventDefault={tapUp}
        aria-label="Up"
        disabled={disable.includes('up')}
      >
        <ArrowIcon dir="up" class="icon" />
      </button>
  
      <!-- <div class="instruction">{title}</div> -->
    </div>

  