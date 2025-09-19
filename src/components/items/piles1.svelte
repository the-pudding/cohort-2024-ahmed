<script>
  import { onMount } from 'svelte';
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  // your code
  import { allCards } from './cards.js';
  import { arrayCards, currentCard } from '../../stores/misc.js';

  const [send, receive] = crossfade({
    fallback(node) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;
      return {
        duration: 600,
        easing: quintOut,
        css: (t) => `transform: ${transform} scale(${t});`
      };
    }
  });

  const spreadFactor = 7;

  let audioEl;     // deal sound
  let errorAudio;  // wrong answer sound

  // keep cards reactive to the store
  $: cards = $arrayCards;

  let animationDelay = 400;
  let showButtons = false;
  let animationStarted = false;

  // success state
  let success = false;
  let successPile = null;

  // Get the selected card's pile number (1/2/3) from your data
  function getSelectedCycle1PileNumber() {
    const selectedCard = $arrayCards.find((c) => c.selected === true);
    if (!selectedCard) return null;

    // Preferred: flat number like "cycle1pile: 3" (matches your screenshot)
    if (typeof selectedCard.cycle1pile === 'number') return selectedCard.cycle1pile;

    // Fallbacks: nested or string like 'pile2'
    const p = selectedCard?.cycle1?.pile;
    if (typeof p === 'number') return p;
    const m = /pile(\d+)/i.exec(String(p ?? ''));
    if (m) return Number(m[1]);

    return null;
  }

  async function moveCardsToPiles() {
    animationStarted = true;
    for (let i = 0; i < cards.length; i++) {
      if (audioEl) audioEl.play();

      // mark dealt + assign pile in round-robin
      cards[i].dealt = true;
      cards[i].pile = (i % 3) + 1;
      cards[i].zIndex = i + 1;

      await new Promise((r) => setTimeout(r, animationDelay));
    }
    showButtons = true;
  }

  function getCardSrc(card) {
    if (!card) return '';
    const fileSuit = { Clubs: 'club', Diamonds: 'diam', Hearts: 'heart', Spades: 'spade' };
    return `/src/svg/Cards_png/${fileSuit[card.suit]}-${card.value < 10 ? '0' : ''}${card.value}.png`;
  }

  // Handle pile button clicks
  function onPick(pileNumber, e) {
    const selectedPile = getSelectedCycle1PileNumber();
    if (selectedPile == null) return;

    if (pileNumber === selectedPile) {
      success = true;
      successPile = pileNumber;
      console.log("You're right");
    } else {
      // Shake only the clicked button and play error sound
      const btn = e.currentTarget;
      btn.classList.add('shake');
      setTimeout(() => btn.classList.remove('shake'), 820);

      if (errorAudio) {
        errorAudio.currentTime = 0;
        errorAudio.play();
      }
      console.log('Try again');
    }
  }
</script>

<audio src="/assets/deal2.ogg" bind:this={audioEl} />
<audio src="/assets/error.mp3" bind:this={errorAudio} preload="auto" />

<div class="cycle"><p>I</p></div>

<div class="centered-wrapper">
  <div class="deck-container">
    <div class="divtext">
      {#if showButtons}
        <p class="picktext">Pick the pile containing your card</p>
      {/if}
    </div>

    {#each cards.filter((d) => !d.dealt) as card, i (`${card.value}_${card.suit}`)}
      <div
        id={`${card.value}_${card.suit}`}
        class="card {showButtons ? 'hover-enabled' : ''}"
        style="--spread: {i * spreadFactor - (spreadFactor * 27) / 2}px; --index: {i}; z-index: {27 - i};"
        animate:flip
        in:receive={{ key: `${card.value}_${card.suit}` }}
        out:send={{ key: `${card.value}_${card.suit}` }}
      >
        <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`} />
      </div>
    {/each}
  </div>

  <div class="containerButton">
    {#if !animationStarted}
      <p class="description">
        <span class="first">First</span>, we'll split the deck into three face-up piles. Remember to keep an eye on which pile your card ends up in!
      </p>
      <button on:click={moveCardsToPiles}>Start Drawing</button>
    {/if}
  </div>

  <div class="piles-container">
    {#each [1, 2, 3] as pileI}
      <div class={`pile-${pileI}`}>
        {#each cards.filter((d) => d.dealt && d.pile === pileI) as card, i (`${card.value}_${card.suit}`)}
          <div
            id={`${card.value}_${card.suit}`}
            class="card {showButtons ? 'hover-enabled' : ''}"
            style="--spread: {i * spreadFactor - (spreadFactor * 9) / 2}px; --index: {i}; z-index: {card.zIndex + 100};"
            animate:flip
            in:receive={{ key: `${card.value}_${card.suit}` }}
            out:send={{ key: `${card.value}_${card.suit}` }}
          >
            <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`} />
          </div>
        {/each}

        {#if showButtons}
          <div class="buttons">
            <button
              id={"pile-btn-" + pileI}
              data-pile={pileI}
              on:click={(e) => onPick(pileI, e)}
              disabled={success && pileI !== successPile}
            >
              {#if success && pileI === successPile}
                Great, now let's move to the next cycle!
              {:else}
                Pile {pileI}
              {/if}
            </button>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

  .cycle {
    top: 0;
    right: 0;
    margin-top: 1%;
    margin-right: 4%;
    font-family: 'Kumbh Sans', sans-serif;
    font-weight: 500;
    color: #5B4D88;
    font-size: 4rem;
    position: absolute;
  }

  .first {
    background-color: #5B4D88;
    color: #E5DEFE;
    padding-left: 5px;
    padding-right: 5px;
    font-weight: 900;
  }

  .centered-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 800px;
  }

  .divtext { text-align: center; }

  .picktext {
    color: #BFAFF7;
    font-family: 'Kumbh Sans', sans-serif;
    font-weight: 500;
    text-align: center;
    font-size: 2em;
    padding: 0.2em 0.5em;
    margin: auto;
    display: inline-block;
    background-color: #5B4E88;
    border-radius: 5px;
  }

  .deck-container {
    position: relative;
    width: 100%;
    height: 200px;
  }

  .piles-container {
    position: relative;
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
  }

  .card {
    height: 100%;
    width: 130px;
    position: absolute;
    left: 50%;
    transform: translate(calc(-50% + var(--spread)), 0);
  }

  .pile-1, .pile-2, .pile-3 {
    width: 33%;
    position: relative;
  }

  .pile-1 .card, .pile-2 .card, .pile-3 .card {
    position: absolute;
    left: 50%;
    transform: translate(calc(-50% + var(--spread)), 0);
  }

  img { height: 100%; }

  .buttons {
    margin-top: -50%;
    display: flex;
    justify-content: space-around;
  }

  .description {
    font-family: 'Kumbh Sans', sans-serif;
    font-weight: 500;
    text-align: center;
    color: #5B4E88;
    font-size: 1.7em;
  }

  .containerButton {
    justify-items: center;
    text-align: center;
    margin-top: 6vh;
  }

  button {
    padding: 15px;
    font-size: 1.7em;
    background-color: #E5DEFF;
    border-radius: 15px;
    cursor: pointer;
    color: #5B4E88;
    font-family: 'Kumbh Sans', sans-serif;
    font-weight: 900;
  }

  /* Shake animation */
  :global(.shake) {
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
  }
</style>
