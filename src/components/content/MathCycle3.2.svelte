<script>
    import { arrayCards, statuscard, cycle1array } from '../../stores/misc.js';
    import KeyboardUp from '../items/KeyboardUp.svelte';


        console.log('new sorted array',$cycle1array)

        function DisplaySuit (suit) {
        if (suit === 'Hearts') return '♥';
        if (suit === 'Diamonds') return '♦';
        if (suit === 'Clubs') return '♣';
        if (suit === 'Spades') return '♠';
        return suit;
    }
    
    function DisplayValue(selectedValue) {
        if (selectedValue === 11) return 'Jack';
        if (selectedValue === 12) return 'Queen';
        if (selectedValue === 13) return 'King';
        if (selectedValue === 1) return 'Ace';
        return selectedValue;
    }


</script>

<main class="body">
    <!-- <KeyboardUp/> -->
    {#if $statuscard == true}
    <div class ="descPos">
        <div class="desc">
            For each cycle, notice that we'll always place the selected pile in the middle. This detail isn't shown in the trick, but it's absolutely crucial. It's like the secret sauce that guarantees the selected card stays put while the others are eliminated.
        </div>
    </div>
    <div class="container">
        {#each $cycle1array as card}
            <div
                class="card {card.selected ? 'selected' : ''} {card.cycle1pos >= 9 && card.cycle1pos <= 17 && !card.selected ? 'cycle-range' : ''}"
                style=" top: calc({card.cycle1pos} * 3.5%); margin-bottom: {card.cycle1pos === 8 || card.cycle1pos === 17 ? '10%' : '0'};">
                {DisplayValue(card.value)} of {DisplaySuit(card.suit)}
            </div>
        {/each}
    </div>
    <div class="footer">
        <p>Assembly</p>
    </div>
    {/if}
</main>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

    .body {
        height: 100vh;
        background-color: #FDD4D4;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        font-family: 'Kumbh Sans', sans-serif;
        color: #A34C48;
    }

    .container {
        display: flex;
        flex-direction: column-reverse;
        gap: 10px;
        width: 75%;
        align-items: center;
    }

    .row {
        display: flex;
        justify-content: center;
        gap: 2%;
        width: 100%;
    }

    .rectangle {
        flex: 1;
        max-width: 27%;
        aspect-ratio: 8 / 1;
        background-color: #F09D99;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        text-align: center;
        transition: transform 0.2s ease;
    }

    .rectangle.selected {
        background-color: #A34C48;
    }

    .footer {
        position: absolute;
        margin-right: 4rem;
        margin-bottom: 4rem;
        color: #4973B0;
        font-weight: bold;
        font-size: 1.5rem;
        right: 0;
        bottom: 0;

    }
    .container {
        position: relative;
        width: 200px; /* Width of the card stack */
        height: 100vh; /* Height for visualization */
        margin: 2rem auto;
    }

    .card {
        position: absolute;
        width: 100%;
		height: 23px; /* Height of each card */
        background-color: #F09D99;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Kumbh Sans', sans-serif;
        font-size: 0.8rem;
        font-weight: bold;
        color: white;
        text-align: center;
        transition: transform 0.2s ease;
    }

    .card.cycle-range {
        background-color: #558ABB;
    }

    .card.selected {
        background-color: #A34C48;
		outline: 4px solid #558ABB; 
		outline-offset: -4px; 
    }

    .desc {
    background-color: #874c47; 
    color: #FDD4D4;          
    font-size: 1.1rem;          
    line-height: 1.5;        
    padding: 1rem;                 
    max-width: 22vw;        
    margin: 1rem auto;       
    text-align: center;    
  }

  .descPos{
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 3rem;
    margin-left: 3rem; 
  }

  p{
    font-family: 'Kumbh Sans', sans-serif;;
  }
</style>