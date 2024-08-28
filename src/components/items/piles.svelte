<script>
    import { onMount } from 'svelte';
    import { allCards } from './cards.js';
    import {arrayCards, currentCard} from '../../stores/misc.js'
    import { quintOut } from 'svelte/easing';
	import { crossfade, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

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

  
    const spreadFactor = 10;

    let cards = [];
    cards = $arrayCards;

    let animationDelay = 1000;
    let showButtons = false;  
    let animationStarted = false;  
  
    async function moveCardsToPiles() {
      animationStarted = true;  
      for (let i = 0; i < cards.length; i++) {
        cards[i].dealt = true;
        cards[i].pile = i % 3 + 1;
        cards[i].zIndex = i + 1;

        await new Promise(resolve => setTimeout(resolve, animationDelay));  
      }
      showButtons = true;  
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
        card.cycle1 = { pile: `pile${pile}`, position: ++pilePositions[pile - 1] };
      });
      console.log(`Cycle 1: Selected pile ${pileNumber}`);
      $arrayCards=cards;
      console.log(cards);  
    }
  </script>
  
  {#if !animationStarted}
    <button on:click={moveCardsToPiles}>Start Drawing</button>
  {/if}

  <div class="centered-wrapper">
    <div class="deck-container">
      {#each cards.filter(d => !d.dealt) as card, i (`${card.value}_${card.suit}`)}
      <div
        id={`${card.value}_${card.suit}`}
        class="card {showButtons ? 'hover-enabled' : ''}"
        style="--spread: {i * spreadFactor - (spreadFactor * 27)/2}px;--index: {i}; z-index: {27 - i};"
        animate:flip
        in:receive={{ key: `${card.value}_${card.suit}` }}
        out:send={{ key: `${card.value}_${card.suit}` }}
      >
        <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`}>
      </div>
      {/each}
    </div>

    <div class="piles-container">
      {#each [1,2,3] as pileI}
        <div class={`pile-${pileI}`}>
          {#each cards.filter(d => d.dealt && d.pile === pileI) as card, i (`${card.value}_${card.suit}`)}
            <div
              id={`${card.value}_${card.suit}`}
              class="card {showButtons ? 'hover-enabled' : ''}"
              style="--spread: {i * spreadFactor - (spreadFactor * 9)/2}px;--index: {i}; z-index: {card.zIndex};"
              animate:flip
              in:receive={{ key: `${card.value}_${card.suit}` }}
              out:send={{ key: `${card.value}_${card.suit}` }}
            >
              <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`}>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  
  <!-- {#if showButtons}
    <div class="buttons">
      <button on:click={() => assignCycle1(1)}>Pile 1</button>
      <button on:click={() => assignCycle1(2)}>Pile 2</button>
      <button on:click={() => assignCycle1(3)}>Pile 3</button>
    </div>
  {/if} -->
  
  <style>
    .centered-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      max-width: 800px;
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