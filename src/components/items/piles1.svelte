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

  
    const spreadFactor = 7;

    let audioEl;
    let cards = [];
    cards = $arrayCards;

    let animationDelay = 400;
    let showButtons = false;  
    let animationStarted = false;  
    let pileAssignments;
  
    async function moveCardsToPiles() {
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
  
  <audio src="/assets/deal.ogg" bind:this={audioEl} />


  <div class='cycle'>
    <p>I</p>
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
        style="--spread: {i * spreadFactor - (spreadFactor * 27)/2}px;--index: {i}; z-index: {27 - i};"
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
      <p class='description'> <span class='first'>First</span>, we'll split the deck into three face-up piles. Remember to keep an eye on which pile your card ends up in!</p>
      <button on:click={moveCardsToPiles}>Start Drawing</button>
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
          <div class= 'buttons'>
            <button on:click={() => assignCycle1(pileI)}>Pile {pileI}</button>
          </div>
          {/if}
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