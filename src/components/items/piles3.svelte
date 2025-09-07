<script>
  import { onMount } from 'svelte';
  import { allCards } from './cards.js';
  import { arrayCards, currentCard, cycle1array, statuscard, cycle2array, assembly2 } from '../../stores/misc.js';
  import { quintOut } from 'svelte/easing';
  import { crossfade, fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  let audioEl;
  let showButtons = false;  
  let cards = [];
  let animationDelay = 400;
  let animationStarted = false;  
  let pileAssignments;
  const spreadFactor = 7;

  // Fetch cards data from store
  $: cards = $cycle1array || [];

  function getCardSrc(card) {
    if (!card) return '';
    const fileSuit = {
      "Clubs": "club",
      "Diamonds": "diam",
      "Hearts": "heart",
      "Spades": "spade"
    };
    return `/src/svg/Cards_png/${fileSuit[card.suit]}-${card.value < 10 ? "0" : ""}${card.value}.png`;
  }

  const [send, receive] = crossfade({
    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: (t) => `
          transform: ${transform} scale(${t});
        `
      };
    }
  });

  async function moveCardsToPiles() {
    $assembly2 = true;
    if (!cards.length) return; // Guard for empty or undefined cards
    animationStarted = true;  
    for (let i = 0; i < cards.length; i++) {
      if (audioEl) audioEl.play();

      cards[i].dealt = true;
      cards[i].pile = i % 3 + 1;
      cards[i].zIndex = i + 1;

      await new Promise(resolve => setTimeout(resolve, animationDelay));  
    }
    showButtons = true;
  }

  function assignCycle2(pileNumber) {
    if (!cards.length) return; // Guard for empty cards
    let pilePositions = [0, 0, 0];
    cards.forEach((card, i) => {
      const pile = card.pile;
      card.cycle1 = { pile: `pile${pile}`, position: ++pilePositions[pile - 1] };
    });
    console.log(`Cycle 1: Selected pile ${pileNumber}`);
    $arrayCards = cards;
    console.log(cards);  
  }

  function AssignCycle3() {
    $statuscard = true;

// Step 1: Mark the selected card
$cycle1array = $cycle1array.map(card => {
    if (card.suit === selectedCard.suit && card.value === selectedCard.value) {
        return { ...card, selected: true };
    }
    return card;
});
 // Step 2: Calculate cycle1pile
 $cycle1array = $cycle1array.map(card => ({
        ...card,
        cycle2pile: card.index % 3 === 0 ? 1 : card.index % 3 === 1 ? 2 : 3,
    }));

    // Step 3: Assign cycle1pos
    // Group cards by cycle1pile
    const piles = {
        1: [],
        2: [],
        3: []
    };

    $cycle1array.forEach(card => {
        piles[card.cycle2pile].push(card);
    });

    // Sort piles by index in descending order
    Object.values(piles).forEach(pile => {
        pile.sort((a, b) => b.index - a.index);
    });

    // Determine the pile with the selected card
    let selectedPile = Object.values(piles).find(pile =>
        pile.some(card => card.selected)
    );

    // Assign cycle1pos for the selected pile (9 to 17)
    selectedPile.forEach((card, i) => {
        card.cycle2pos = 9 + i;
    });

    // Assign cycle1pos for the other piles
    const otherPiles = Object.values(piles).filter(pile => pile !== selectedPile);

    // Assign cycle1pos (0 to 8) to the pile with the least number
    const pileWithLeastNumber = otherPiles.reduce((minPile, currentPile) =>
        currentPile.length < minPile.length ? currentPile : minPile
    );
    pileWithLeastNumber.forEach((card, i) => {
        card.cycle2pos = i;
    });

    // Assign cycle1pos (18 to 26) to the last pile
    const remainingPile = otherPiles.find(pile => pile !== pileWithLeastNumber);
    remainingPile.forEach((card, i) => {
        card.cycle2pos = 18 + i;
    });

    // Merge the updated piles back into $arrayCards and sort them
    $cycle1array = [...piles[1], ...piles[2], ...piles[3]];

    $cycle1array.sort((a, b) => a.index - b.index);

    $cycle2array = $cycle1array.slice().sort((a, b) => a.cycle2pos - b.cycle2pos);

  
    // Log updated array for debugging
    console.log("New card array",$arrayCards);
    console.log("status card is",$statuscard)

  }
</script>

{#if $statuscard && cards.length > 0} <!-- Safeguard for cards being empty -->

<audio src="/assets/deal.ogg" bind:this={audioEl} />

<div class='cycle'>
  <p>III</p>
</div>

<div class="centered-wrapper">
 
  <div class="deck-container">
    <div class='divtext'>
      {#if showButtons}
        <p class='picktext'>Pick the pile containing your card</p>
      {/if}
    </div>
    {#each cards.filter(d => !d.dealt) as card, i (`${card.value}_${card.suit}`)}
      <div
        id={`${card.value}_${card.suit}`}
        class="card {showButtons ? 'hover-enabled' : ''}"
        style="--spread: {i * spreadFactor - (spreadFactor * 27) / 2}px; --index: {i}; z-index: {27 - i};"
        animate:flip
        in:receive={{ key: `${card.value}_${card.suit}` }}
        out:send={{ key: `${card.value}_${card.suit}` }}
      >
        <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`}>
      </div>
    {/each}
  </div>

  <div class='containerButton'>
    {#if !animationStarted}
      <p class='description'>We promise this is the <span class="first">last</span> time, we'll make it even faster! Always remember to keep an eye on which pile your card ends up in!</p>
      <button on:click={() => { moveCardsToPiles(); AssignCycle3(); }}>Start Drawing</button>
    {/if}
  </div>

  <div class="piles-container">
    {#each [1, 2, 3] as pileI}
      <div class={`pile-${pileI}`}>
        {#each cards.filter(d => d.dealt && d.pile === pileI) as card, i (`${card.value}_${card.suit}`)}
          <div
            id={`${card.value}_${card.suit}`}
            class="card {showButtons ? 'hover-enabled' : ''}"
            style="--spread: {i * spreadFactor - (spreadFactor * 9) / 2}px; --index: {i}; z-index: {card.zIndex + 100};"
            animate:flip
            in:receive={{ key: `${card.value}_${card.suit}` }}
            out:send={{ key: `${card.value}_${card.suit}` }}
          >
            <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`}>
          </div>
        {/each}
        {#if showButtons}
          <div class='buttons'>
            <button on:click={() => assignCycle2(pileI)}>Pile {pileI}</button>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
{/if}


<style>
  @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap'); 

  .cycle{
      top:0;
      right:0;
      margin-top: 1%;
      margin-right:4%;
      font-family: 'Kumbh Sans', sans-serif;
      font-weight: 500;
      color:#5B4D88;
      font-size: 4rem;
      position:absolute;
    }

    .first{
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

  .divtext{
    text-align: center;
  }

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
  img {
    height: 100%;
  }

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
    border-radius:15px;
    cursor: pointer;
    color: #5B4E88;
    font-family: 'Kumbh Sans', sans-serif;
    font-weight: 900;
  }
</style>