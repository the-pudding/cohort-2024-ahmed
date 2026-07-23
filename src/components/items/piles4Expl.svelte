<script>
    import { createEventDispatcher } from "svelte";
    import { crossfade, scale } from "svelte/transition";
    import { cycle3array, statuscard } from "../../stores/misc.js";
    import Up from '../items/JustUpArrow.svelte'

    const dispatch = createEventDispatcher();
    function jumpToCards() {
      dispatch('goto', { y: 1, x: 0 });
    }
    // If you need to force-bundle assets, keep this import:
  
    // Your helper
    function getCardSrc(card) {
      if (!card) return "";
      const fileSuit = { Clubs: "club", Diamonds: "diam", Hearts: "heart", Spades: "spade" };
      return `/src/svg/Cards2PNG/${fileSuit[card.suit]}-${card.value < 10 ? "0" : ""}${card.value}.png`;
    }
  
    const [send, receive] = crossfade({ duration: 300, fallback: scale });
  
    let leftPile = [];
    let midPile = [];
    let lastCard = null;

    let dealEl;   

    function playDeal() {
    if (!dealEl) return;
    try {
      dealEl.pause();                 // make re-triggers snappy
      dealEl.currentTime = 0;
      const p = dealEl.play();
      p?.catch(() => {});            // ignore autoplay promise errors
    } catch {}
  }
  
    $: count = midPile.length;
  
    // Initialize from your store (first 27 cards; ensure index 0..26)
    $: if ($cycle3array?.length && leftPile.length === 0 && midPile.length === 0) {
      leftPile = $cycle3array.slice(0, 27).map((c, i) => ({ ...c, cycle3pos: i }));
    }
  
    async function drawOne() {
      if (!leftPile.length || midPile.length >= 14) return;
      playDeal();
      const card = leftPile[0];
      leftPile = leftPile.slice(1);
      midPile = [...midPile, card];
      lastCard = card;
    }
  
    let dealing = false;
    async function dealToFifteen() {
      if (dealing) return;
      dealing = true;
      while (midPile.length < 14 && leftPile.length) {
        drawOne();
        await new Promise(r => setTimeout(r, 250));
      }
      dealing = false;
    }
  
    function reset() {
      if ($cycle3array?.length) {
        leftPile = $cycle3array.slice(0, 27).map((c, i) => ({ ...c, cycle3pos: i }));
      } else {
        leftPile = [];
      }
      midPile = [];
      lastCard = null;
    }
  </script>

<audio src="/assets/deal.ogg"      bind:this={dealEl} preload="auto" />
{#if $statuscard}
  <main class="stage">

    <!-- Left: Pile 1 (full deck at start) -->
    <section class="pile">
      <div class="title">Pile 1</div>
      <div class="stack">
        {#each leftPile as card, i (card.cycle3pos)}
          <div
            class="cardwrap"
            style="--i:{i}; --z:{1000 - i};"
            out:send={{ key: card.cycle3pos }}>
            <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`} />
          </div>
        {/each}
      </div>
    </section>
  
    <!-- Middle: Drawn pile + count -->
    <section class="pile">
      <div class="title">Count: {count}</div>
      <div class="stack">
        {#each midPile as card, i (card.cycle3pos)}
          <div
            class="cardwrap2"
            style="--i:{i}; --z:{1000 + i};"
            in:receive={{ key: card.cycle3pos }}>
            <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`} />
          </div>
        {/each}
      </div>
    </section>
  
    <!-- Right: Last card drawn -->
    <section class="reveal">
      <div class="badge">Your Card is :</div>
      <div class="bigcard-wrap">
        {#if lastCard}
          <img
            class="bigcard-front"
            src={getCardSrc(lastCard)}
            alt={`Card ${lastCard.value} of ${lastCard.suit}`}
            in:receive={{ key: lastCard.cycle3pos }} />
        {:else}
          <div class="bigcard placeholder"></div>
        {/if}
      </div>
    </section>

    <div class="controls">
      <button on:click={drawOne} disabled={count >= 14 || !leftPile.length}>Draw one</button>
      <button on:click={dealToFifteen} disabled={count >= 14 || dealing}>Deal to 15</button>
      <button on:click={reset}>Reset</button>
    </div>
   
  </main>
  {:else}
  <div class='else'> <p>
    Click the <b>Top Arrow or press</b>
    <Up enableKeyboard={false} on:tap={jumpToCards}/>
    <b>to jump</b> to the <b>Deck</b>,<br />
    And Reveal your card!
  </p> </div>
{/if}
 
  
  <style>

    .else{
  min-height: 100%;          /* give it vertical space */
  display: grid;             /* easy centering */
  place-items: center;       /* center both axes */
  text-align: center;
  font-size: 2rem;
  font-family: 'Kumbh Sans', sans-serif;
  color: #A34C48;
}

    .stage {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: end;
      gap: 3rem;
      padding: 3rem 2rem 2rem;
      min-height: 75vh;
      font-family: "Kumbh Sans", system-ui, sans-serif;
      color: #A34C49;
    }
  
    .pile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: end;
    }
    .title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 1rem;

    }
  
    /* Pile stack area — controls card height; images follow width 130px */
    .stack {
      position: relative;
      width: 170px;                          /* room for fanned overlap */
      height: 320px;                         /* controls .card-front height (100%) */
    }
  
    /* wrapper that moves with crossfade */
    .cardwrap {
      position: absolute;
      inset: 0;
      transform: translateX(calc(var(--i) *8px)); /* slight horizontal fan */
      z-index: var(--z, 1);
      display: grid;
      place-items: center;
    }

    .cardwrap2 {
      position: absolute;
      inset: 0;
      transform: translateX(calc(var(--i) * 8px)); /* slight horizontal fan */
      z-index: var(--z, 1);
      display: grid;
      place-items: center;
    }
  
    /* Your card component sizing */
    .card-front {
      height: 100%;
      width: 130px;                          /* your requirement */
      object-fit: contain;
      /* filter: drop-shadow(0 10px 14px rgba(0,0,0,.18)); */
    }
  
    /* Right-side reveal */
    .reveal {
      display: grid;
      grid-template-rows: auto 1fr;
      align-items: center;
      justify-items: center;
      /* gap: 1rem; */
    }
    .badge {
      background: #A34C49;
      color: #fff;
      font-weight: 800;
      font-size: 1.2rem;
      padding: .6rem 1rem;
      border-radius: 10px;
    }
    .bigcard-wrap {
      height: clamp(220px, 34vw, 380px);
      width: clamp(160px, 26vw, 280px);
      display: grid;
      place-items: center;
    }
    .bigcard-front {
      height: 100%;
      width: 80%;  
      object-fit: contain;                         /* bigger reveal */
      /* filter: drop-shadow(0 12px 16px rgba(0,0,0,.22)); */
    }
    .bigcard.placeholder {
      height: 100%;
      width: auto;
      border-radius: 28px;
      /* background: rgba(0,0,0,.06); */
    }
    .controls {
      display: flex;
      gap: .75rem;
      justify-content: center;
      padding: 1.25rem 0 2rem;
    }
    .controls button {
      padding: .6rem 1rem;
      border: 0;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      background: #A34C49;
      color: #fff;
    }
    .controls button[disabled] { opacity: .5; cursor: not-allowed; }
  </style>
  