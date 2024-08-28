<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { allCards } from './cards.js';
	import {lockedCard, currentCard} from '../../stores/misc.js'
  import {arrayCards} from '../../stores/misc.js'
  

  import facedown from '../../svg/Cards_png/back.png'

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
      currentIndex: index, 
      selected: false
    }));
}


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


  function lockInCard() {
    showConfirmation = false;
    showSelectedCard = true;
    flipped = true;
    $currentCard = true

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
    <button on:click={lockInCard}>Lock it in!</button>
  </div>
{/if}

{#if showPickedText}
  <div class="picked-text" in:fade={{ duration: 500 }}>
    <p>Your card is the <br> <b style="font-size: 1.7em; background-color:#E5DEFF; padding: 4px;">{DisplayValue(selectedCard?.value)} of {selectedCard?.suit}</b></p>
    <p> Let's see if I can find your card!</p>
  </div>
{/if}

<style>


  p {
    color: #5B4E88;
    margin: 0;
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

  /* .selected {
    box-shadow: 0 0 5px #333;
  } */

  /* .pile {
    left: 0;
  } */

  .confirmation {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    margin-top: 20%;
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
    margin-top: 20px;
    font-size: 1.8em;
    color: #5B4E88;
    text-align: center;
  }

  button {
    background-color: #E5DEFF;
    color: #5B4E88;
    font-size: 1.5em;
    font-weight: 500;
  }

  @media (max-width: 600px) {
    .card {
      width: 100px;
      height: 138px;
      left: calc(((var(--index)) / 26) * (100% - 100px));
    }
  }
</style>
