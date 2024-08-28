<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { allCards } from './cards.js';
    import {arrayCards, currentCard} from '../../stores/misc.js'
  
    // Provided array of cards
    let cards = [];
    cards = $arrayCards;
  
    let pileAssignments = new Array(cards.length).fill(0);  // Initialize pile assignments
    let zIndexStack = [];  // Track the z-index stack for piles
    let animationDelay = 1000;  // Delay between each card move
    let showButtons = false;  // Control visibility of buttons
    let animationStarted = false;  // Track whether the animation has started
  
    async function moveCardsToPiles() {
      animationStarted = true;  // Animation starts, hide the button
      for (let i = 0; i < cards.length; i++) {
        pileAssignments[i] = i % 3 + 1;  // Assign to pile 1, 2, or 3
        zIndexStack[pileAssignments[i]] = (zIndexStack[pileAssignments[i]] || cards.length) - 1;  // Ensure stacking order
        await new Promise(resolve => setTimeout(resolve, animationDelay));  // Delay before moving the next card
      }
      showButtons = true;  // Show buttons after animation completes
    }
  
    function getCardSrc(card) {
    if (!card) return '';
    const fileSuit = {"Clubs": "club", "Diamonds" : "diam", "Hearts" : "heart", "Spades": "spade"}
    return `/src/svg/Cards_png/${fileSuit[card.suit]}-${card.value < 10 ? "0" : ""}${card.value}.png`;
  }
  
    function assignCycle1(pileNumber) {
      let pilePositions = [0, 0, 0];
      cards.forEach((card, i) => {
        const pile = pileAssignments[i];
        card.cycle2 = { pile: `pile${pile}`, position: ++pilePositions[pile - 1] };
      });
      console.log(`Cycle 1: Selected pile ${pileNumber}`);
      $arrayCards=cards;
      console.log(cards);  
    }
  </script>
  
  {#if !animationStarted}
    <button on:click={moveCardsToPiles}>Start Drawing</button>
  {/if}
  
  <div class="card-container">
    {#each cards as card, i}
      <div
        class="card spread {pileAssignments[i] ? 'pile-' + pileAssignments[i] : ''} {showButtons ? 'hover-enabled' : ''}"
        style="--index: {i}; z-index: {pileAssignments[i] ? zIndexStack[pileAssignments[i]] : cards.length - i-1};"
        in:fade={{ duration: 300 }}
        out:fade={{ duration: 400 }}
      >
        <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`}>
      </div>
    {/each}
  </div>
  
  {#if showButtons}
    <div class="buttons">
      <button on:click={() => assignCycle1(1)}>Pile 1</button>
      <button on:click={() => assignCycle1(2)}>Pile 2</button>
      <button on:click={() => assignCycle1(3)}>Pile 3</button>
    </div>
  {/if}
  
  <style>
    .card-container {
      position: relative;
      height: 200px;
      margin-top: 10%;
    }
  
    .card {
      width: 130px;
      height: 200px;
      position: absolute;
      transition: transform 1.6s ease-in-out;
      transform: translate(0, 0);
    }
  
    .spread {
      left: calc(var(--index) * 5px);  /* Spread effect */
    }
  
    .card-front {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  
    /* Hover effect only enabled when .hover-enabled class is added */
    /* .hover-enabled:hover,
    .hover-enabled:focus {
      transform: translateY(-50px);
    } */
  
    .pile-1 {
      transform: translate(0, 350px);
    }
  
    .pile-2 {
      transform: translate(250%, 350px);
    }
  
    .pile-3 {
      transform: translate(500%, 350px);
    }
  
    .buttons {
      margin-top: 20px;
      display: flex;
      justify-content: space-around;
    }
  
    button {
      padding: 4px;
      font-size: 1.7em;
      background-color: #E5DEFF;
      cursor: pointer;
      color: #5B4E88;
    }
  </style>