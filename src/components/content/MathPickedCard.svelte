<script>
  import { lockedCard, statuscard } from '../../stores/misc.js';
	import KeyboardDown from '../items/KeyboardDown.svelte';
  import KeyboardUp from '../items/KeyboardUp.svelte';
  import Up from '../items/JustUpArrow.svelte'

  function DisplayValue(selectedValue) {
    if (selectedValue === 11) return 'Jack';
    if (selectedValue === 12) return 'Queen';
    if (selectedValue === 13) return 'King';
    if (selectedValue === 1) return 'Ace';
    return selectedValue;
  }

  function getCardSrc(card) {
    if (!card) return '';
    const fileSuit = { Clubs: 'club', Diamonds: 'diam', Hearts: 'heart', Spades: 'spade' };
    return `/src/svg/Cards2PNG/${fileSuit[card.suit]}-${card.value < 10 ? '0' : ''}${card.value}.png`;
  }
</script>

<main class="container">
  <!-- <KeyboardUp/> -->
  {#if $statuscard}
    <div class="content">
      <div class="left">
        <p>
          In this section we really don’t care about which card you chose, our only concern is to change the position of the card.
          To track it, we will shade it a
          <mark class="highlight">darker color</mark>.
        </p>
      </div>
      <div class="right">
        <img class="card-front" src={getCardSrc($lockedCard)} alt={`Card ${$lockedCard.value} of ${$lockedCard.suit}`} />
        <div class="picked-text">
          <p>Your card is the</p>
          <b class="card-label">{DisplayValue($lockedCard?.value)} of {$lockedCard?.suit}</b>
        </div>
      </div>
    </div>
    {:else}
    <div class='else'>
      <p>
        Click the <b>Top Arrow or press</b>
        <Up/>
        <b>to jump</b> to the <b>Cards</b>
        and pick one! 
      </p>
    </div>
  {/if}
</main>

<style>

@import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

.body:has(.else) { justify-content: center;  text-align: center; }


.else{
  font-size: 2rem; 
  font-family: 'Kumbh Sans', sans-serif;
  color: #A34C48;

}
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #FDD4D4;
  }



  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    max-width: 1200px;
  }

  .left {
    flex: 1;
    text-align: center;
    font-size: 1.7em;
    color: #A34C48;
    margin-right: 30px;
    font-weight: 300;
    font-family: 'Kumbh Sans', sans-serif;
  }

  .highlight {
    background-color: #A34C48;
    color: #F09D99;
    padding: 0 4px;
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card-front {
    width: 200px;
    height: auto;
    margin-bottom: 20px;
    border-radius: 10px;
    /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); */
  }

  .picked-text {
    font-family: 'Kumbh Sans', sans-serif;
    font-size: 1.5em;
    color: #A34C48;
    text-align: center;
  }

  .card-label {
    font-family: 'Kumbh Sans', sans-serif;
    font-size: 2em;
    background-color: #BA6E6B;
    color: #F09D99;
    padding: 6px 10px;
    /* border-radius: 5px; */
  }
</style>

