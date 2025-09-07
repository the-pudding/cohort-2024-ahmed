<script>
    import { crossfade, scale } from "svelte/transition";
    import { arrayCards } from "../../stores/misc.js";
    import cardback from '../../svg/Cards_png/back.png'
    // If you need to force-bundle assets, keep this import:
  
    // Your helper
    function getCardSrc(card) {
      if (!card) return "";
      const fileSuit = { Clubs: "club", Diamonds: "diam", Hearts: "heart", Spades: "spade" };
      return `/src/svg/Cards_png/${fileSuit[card.suit]}-${card.value < 10 ? "0" : ""}${card.value}.png`;
    }

  
    const [send, receive] = crossfade({ duration: 300, fallback: scale });
  
    let leftPile = [];
    let midPile = [];
    let lastCard = null;
  
    $: count = midPile.length;
  
    // Initialize from your store (first 27 cards; ensure index 0..26)
    $: if ($arrayCards?.length && leftPile.length === 0 && midPile.length === 0) {
      leftPile = $arrayCards.slice(0, 27).map((c, i) => ({ ...c, index: i }));
    }
  
    async function drawOne() {
      if (!leftPile.length || midPile.length >= 15) return;
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
      while (midPile.length < 15 && leftPile.length) {
        drawOne();
        await new Promise(r => setTimeout(r, 250));
      }
      dealing = false;
    }
  
    function reset() {
      if ($arrayCards?.length) {
        leftPile = $arrayCards.slice(0, 27).map((c, i) => ({ ...c, index: i }));
      } else {
        leftPile = [];
      }
      midPile = [];
      lastCard = null;
      revealFlipped = false;
    }

    import facedown from "../../svg/Cards_png/back.png"; // back image
  let flipEl;  
  let dealEl;                   
  let revealFlipped = false;       // controls the flip of the right card

    // flip automatically when we've dealt 15
    // flip automatically when we've dealt 15
  $: if (count === 15 && lastCard && !revealFlipped) {
    setTimeout(() => {
      revealFlipped = true;

      if (flipEl) {
        try {
          flipEl.pause?.();           // ok to use ?. on a call
          flipEl.currentTime = 0;     // guarded assignment ✅
          const p = flipEl.play();
          p?.catch(() => {});          // avoid unhandled promise error
        } catch {}
      }
    }, 250);
  }
  $: lastIndex = midPile.length - 1;

  function playDeal() {
    if (!dealEl) return;
    try {
      dealEl.pause();                 // make re-triggers snappy
      dealEl.currentTime = 0;
      const p = dealEl.play();
      p?.catch(() => {});            // ignore autoplay promise errors
    } catch {}
  }
  </script>


<audio src="/assets/flipcard.wav" bind:this={flipEl} preload="auto" />
<audio src="/assets/deal.ogg"      bind:this={dealEl} preload="auto" />
  
  <main class="stage">
    <!-- Left: Pile 1 (full deck at start) -->
    <section class="pile">
      <div class="title">All cards</div>
      <div class="stack">
        {#each leftPile as card, i (card.index)}
          <div
            class="cardwrap"
            style="--i:{i}; --z:{1000 - i};"
            out:send={{ key: card.index }}>
            <img class="card-front" src={cardback} alt={`Card ${card.value} of ${card.suit}`} />
          </div>
        {/each}
      </div>
    </section>
  
    <!-- Middle: Drawn pile + count -->
    <section class="pile">
        <div class="title">Final Pile</div>
        <div class="stack with-perspective">
          {#each midPile as card, i (card.index)}
            <div
              class="cardwrap2"
              style="--i:{i}; --z:{1000 + i};"
              in:receive={{ key: card.index }}>
              <!-- back shows first; front after flip when it's the last card -->
              <div class="flip3d" class:is-flipped={revealFlipped && i === lastIndex}>
                <img class="face back"  src={cardback}           alt="Card back" />
                <img class="face front" src={getCardSrc(card)}   alt={`Card ${card.value} of ${card.suit}`} />
              </div>
            </div>
          {/each}
        </div>
      </section>
  
    <!-- Right: Last card drawn -->
    <section class="reveal">
        <div class="badge">Your Card is :</div>
        <div class="bigcard-wrap">
          <div class="reveal-card {revealFlipped ? 'is-flipped' : ''}">
            <!-- back (visible first) -->
            <img class="reveal-back" src={facedown} alt="Card back" />
            <!-- front (shown after flip) -->
            {#if lastCard}
              <img
                class="reveal-front"
                src={getCardSrc(lastCard)}
                alt={`Card ${lastCard.value} of ${lastCard.suit}`} />
            {/if}
          </div>
        </div>
      </section>

  </main>
  
  <div class="controls">
    <!-- <button on:click={drawOne} disabled={count >= 15 || !leftPile.length}>Draw one</button> -->
    <button on:click={dealToFifteen} disabled={count >= 15 || dealing}> Reveal The Card!</button>
    <!-- <button on:click={reset}>Reset</button> -->
  </div>
  
  <style>
    .stage {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: end;
      gap: 3rem;
      padding: 3rem 2rem 2rem;
      min-height: 75vh;
      font-family: "Kumbh Sans", system-ui, sans-serif;
      color: #5B4E88;
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
 
    .badge {
      background: #5B4E88;
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

    .reveal-card {
    position: relative;
    height: 100%;
    width: 80%;
    transform-style: preserve-3d;
    transition: transform 700ms;
    }

    .reveal{
        justify-items: center;
    }

    .reveal-card.is-flipped { transform: rotateY(180deg); }

    .reveal-front,
    .reveal-back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    width: 100%;
    height: 100%;
    object-fit: contain;
    }

    /* front starts rotated so the back shows first */
    .reveal-front { transform: rotateY(180deg); }

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
      background: #5B4E88;
      color: #fff;
    }
    .controls button[disabled] { opacity: .5; cursor: not-allowed; }

    .stack.with-perspective { perspective: 1000px; }

.cardwrap2 {
  position: absolute;
  inset: 0;
  transform: translateX(calc(var(--i) * 8px));
  z-index: var(--z, 1);
  display: grid;
  place-items: center;
}

/* flip container */
.flip3d {
  position: relative;
  width: 130px;      /* your card width */
  height: 100%;      /* follows .stack height */
  transform-style: preserve-3d;
  transition: transform 700ms;
}
.flip3d.is-flipped { transform: rotateY(180deg); }

.face {
  position: absolute;
  inset: 0;
  width: 130px;
  height: 100%;
  object-fit: contain;
  backface-visibility: hidden;
}
.face.front { transform: rotateY(180deg); }

  </style>
  