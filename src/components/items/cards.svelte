<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { allCards } from './cards.js';
  import {
    lockedCard,
    currentCard,
    statuscard,
    arrayCards,
    cycle1array,
    cycle2array,   // NEW import
    cycle3array,   // NEW import
    resetKey
  } from '../../stores/misc.js'
  import { get } from 'svelte/store';
  
  let audioEl;

  import facedown from '../../svg/Cards_png/back.png'
  import { TableColumnsSplitIcon } from 'lucide-svelte';

  const suits = ["Spades", "Diamonds", "Hearts", "Clubs"];
  const values = Array.from({ length: 13 }, (_, i) => i + 1);

  function generateDeck() {
    const deck = [];
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value });
      }
    }
    return deck;
  }

  function getUniqueCards(deck) {
    return deck.sort(() => Math.random() - 0.5)
      .slice(0, 27)
      .map((card, index) => ({
        ...card, 
        index, 
        selected: false,
      }));
  }

  function hardReset() {
    // clear local UI/state
    selectedCard = null;
    showConfirmation = false;
    showSelectedCard = false;
    showPickedText = false;
    flipped = false;
    showCenterTransition = false;

    // rebuild deck & broadcasting array
    const freshDeck = generateDeck();
    cards = getUniqueCards(freshDeck);
    $arrayCards = cards;

    // clear global stores tied to the trick
    $lockedCard  = null;
    $statuscard  = false;
    $currentCard = false;
    $cycle1array = [];
    $cycle2array = [];
    $cycle3array = [];

    // restart the spread animation
    shuffleAndSpread();
  }

  // subscribe to resetKey; only react when it changes
  let lastSeenReset = -1;
  onMount(() => {
    lastSeenReset = get(resetKey);           // capture current value
    const unsub = resetKey.subscribe(v => {
      if (v !== lastSeenReset) {
        lastSeenReset = v;
        hardReset();
      }
    });
    shuffleAndSpread();
    return unsub;
  });

  const deck = generateDeck();
  let cards = getUniqueCards(deck);

  $arrayCards = cards;
  console.log(cards);

  let spread = false;
  let showCenterTransition = false;  // New state variable

  function shuffleAndSpread() {
    spread = false;
    setTimeout(() => {
      spread = true;
    }, 1000);
  }

  onMount(() => {
    shuffleAndSpread();
  });

  const dispatch = createEventDispatcher();
  let selectedCard = null;
  let showConfirmation = false;
  let showSelectedCard = false;
  let showPickedText = false;

  let flipped = false;

  function handleCardClick(card) {
    selectedCard = card;
    $lockedCard = card;
    showConfirmation = true;
    dispatch('cardSelected', card);
    console.log('Card clicked:', card);
  }

  /**
   * Helper: assign one cycle (pile + pos) based on a reference key.
   *
   * EXACT cycle-1 behavior preserved:
   * - pile = (ref % 3) mapped to 1,2,3
   * - sort each pile by reference **descending** (inverted) — this matches your original cycle1pos rule
   * - pile containing selected card => positions 9..17
   * - among the remaining two piles, the smaller pile number => 0..8; the other => 18..26
   *
   * We use the same rule for cycle2 and cycle3, just changing the reference key.
   *
   * @param {Array} arr - array of card objects (mutated in place)
   * @param {string} referenceKey - 'index' | 'cycle1pos' | 'cycle2pos'
   * @param {string} pileKey - 'cycle1pile' | 'cycle2pile' | 'cycle3pile'
   * @param {string} posKey  - 'cycle1pos'  | 'cycle2pos'  | 'cycle3pos'
   */
  function assignCycleInverted(arr, referenceKey, pileKey, posKey) {
    // 1) assign pile id based on reference
    for (const c of arr) {
      const ref = c[referenceKey];
      const mod = ((ref % 3) + 3) % 3; // just in case
      c[pileKey] = mod === 0 ? 1 : (mod === 1 ? 2 : 3);
    }

    // 2) build piles
    const piles = { 1: [], 2: [], 3: [] };
    for (const c of arr) piles[c[pileKey]].push(c);

    // 3) sort each pile by reference **descending** (inverted) — matches your original cycle1 code
    for (const pid of [1,2,3]) {
      piles[pid].sort((a,b) => b[referenceKey] - a[referenceKey]);
    }

    // 4) find selected pile id (the one that contains selected === true)
    const selectedEntry = arr.find(c => c.selected);
    const selectedPileId = selectedEntry ? selectedEntry[pileKey] : 1;

    // Order the other piles by their numeric id
    const otherPileIds = [1,2,3].filter(p => p !== selectedPileId);
    const lowOther = Math.min(...otherPileIds);
    const highOther = Math.max(...otherPileIds);

    // 5) assign positions
    // lowOther => 0..8
    piles[lowOther].forEach((card, i) => { card[posKey] = i; });
    // selected => 9..17
    piles[selectedPileId].forEach((card, i) => { card[posKey] = 9 + i; });
    // highOther => 18..26
    piles[highOther].forEach((card, i) => { card[posKey] = 18 + i; });
  }

  function lockInCard() {
    $statuscard = true;

    // Step 1: Mark the selected card in $arrayCards
    $arrayCards = $arrayCards.map(card => {
      if (card.suit === selectedCard.suit && card.value === selectedCard.value) {
        return { ...card, selected: true };
      }
      return card;
    });

    // ---- CYCLE 1 (reference: index) ----
    assignCycleInverted($arrayCards, 'index', 'cycle1pile', 'cycle1pos');

    // keep a sorted view for next step
    $cycle1array = $arrayCards.slice().sort((a, b) => a.cycle1pos - b.cycle1pos);

    // ---- CYCLE 2 (reference: cycle1pos) ----
    assignCycleInverted($arrayCards, 'cycle1pos', 'cycle2pile', 'cycle2pos');
    $cycle2array = $arrayCards.slice().sort((a, b) => a.cycle2pos - b.cycle2pos);

    // ---- CYCLE 3 (reference: cycle2pos) ----
    assignCycleInverted($arrayCards, 'cycle2pos', 'cycle3pile', 'cycle3pos');
    $cycle3array = $arrayCards.slice().sort((a, b) => a.cycle3pos - b.cycle3pos);

    // Log updated array for debugging
    console.log("New card array", $arrayCards);
    console.log("status card is", $statuscard);

    showConfirmation = false;
    showSelectedCard = true;
    flipped = true;
    $currentCard = true;

    if (audioEl) {
      setTimeout(() => {
        audioEl.play();
      }, 300);
    }

    setTimeout(() => {
      showPickedText = true;
      // Delay the transition to the center until after the card is flipped
      setTimeout(() => {
        showCenterTransition = true;
      }, 700); // Adjust this timing as needed
    }, 700);

    console.log('Card locked in:', selectedCard);
    console.log(currentCard)
  }

  function handleKeyDown(event, card) {
    console.log('Key down:', event.key, 'Card:', card);
  }

  function handleKeyUp(event, card) {
    console.log('Key up:', event.key, 'Card:', card);
  }

  function handleKeyPress(event, card) {
    console.log('Key press:', event.key, 'Card:', card);
  }

  function getCardSrc(card) {
    if (!card) return '';
    const fileSuit = {"Clubs": "club", "Diamonds" : "diam", "Hearts" : "heart", "Spades": "spade"}
    return `/src/svg/Cards_png/${fileSuit[card.suit]}-${card.value < 10 ? "0" : ""}${card.value}.png`;
  }

  function DisplayValue(selectedValue) {
    if (selectedValue === 11) return 'Jack';
    if (selectedValue === 12) return 'Queen';
    if (selectedValue === 13) return 'King';
    if (selectedValue === 1) return 'Ace';
    return selectedValue;
  }

</script>

<audio src="/assets/flipcard.wav" bind:this={audioEl} />

<div class="card-container">
  {#each cards as card, i}
    {#if !showSelectedCard || card === selectedCard}
      <div
        class="card {spread ? 'spread' : 'pile'} {flipped && card === selectedCard ? 'flipped' : ''} {showCenterTransition && card === selectedCard ? 'card-center' : ''}"
        class:selected={card === selectedCard}
        style="--index: {i};"
        tabindex="0"
        on:click={() => handleCardClick(card)}
        on:keydown={(event) => handleKeyDown(event, card)}
        on:keyup={(event) => handleKeyUp(event, card)}
        on:keypress={(event) => handleKeyPress(event, card)}
        in:fade={{ duration: 300 }}
        out:fade={{ duration: 400 }}
      >
        <img class="card-back" src={facedown} alt={`Card ${card.value} of ${card.suit}`}>
        <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`}>
      </div>
    {/if}
  {/each}
</div>

{#if showConfirmation}
  <div class="confirmation" in:fade={{ duration: 300 }} out:fade={{ duration: 500 }}>
    <p>Sure about this card?</p>
    <button on:click={lockInCard}><b>Lock it in!</b></button>
  </div>
{/if}

{#if showPickedText}
  <div class="picked-text" in:fade={{ duration: 500 }}>
    <p>Your card is the <br> <b style="font-size: 1.7em; background-color:#E5DEFF; padding: 4px;">{DisplayValue(selectedCard?.value)} of {selectedCard?.suit}</b></p>
    <p> Let's see if I can find your card!</p>
  </div>
{/if}

<style>
@import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

p {
  color: #5B4E88;
  margin: 0;
  font-family: 'Kumbh Sans', sans-serif;
}

.card-container {
  height: 300px;
  position: relative;
  max-width: 850px;
  margin: auto;
}

.card {
  width: 130px;
  height: 200px;
  position: absolute;
  transition: transform 0.5s, left 0.8s;
  cursor: pointer;
  outline: none;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  left: calc(((var(--index)) / 26) * (100% - 130px));
  top: 50%;
}

.card:hover,
.selected {
  transform: translateY(-50px);
}

.confirmation {
  position: absolute;
  bottom: 200px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.card-front {
  transform: rotateY(180deg);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.flipped {
  transform: rotateY(180deg);
  transition-delay: 0.7s;
}

.card-center {
  left: 50% !important;
  transform: translateX(-50%) rotateY(180deg) !important;
  transition: transform 1s, left 1s;
  z-index: 10;
}

.picked-text {
  margin-top: 50px;
  font-size: 1.8em;
  color: #5B4E88;
  text-align: center;
  font-family: 'Kumbh Sans', sans-serif;
}

button {
  background-color: #E5DEFF;
  color: #5B4E88;
  font-size: 1.5em;
  font-weight: 500;
  font-family: 'Kumbh Sans', sans-serif;
}

@media (max-width: 600px) {
  .card {
    width: 100px;
    height: 138px;
    left: calc(((var(--index)) / 26) * (100% - 100px));
  }
}
</style>
