<script>
import CardsExpl from "../items/cards_expl.svelte";
import KeyboardUp from "../items/KeyboardUp.svelte";

// import { style } from 'svelte-body';

</script>

<section class='body'>
    <h1> Pick A card</h1>

    <div class='piles'>
        <CardsExpl/>
    </div>
    
<div class='text'>
    <p>Try to replicate this using your card. Your choice is completely random, and no card is being forced. We're just using a deck of <b>27 cards</b> instead of the <b>full 52 cards</b>.</p>
    <p style = 'font-size:1.1em'> <b>PS:</b> The cards displayed in way that flipped, so the last card from Magic would be the last card here too and last card to be dealt!</p>
</div>
   
</section>

<!-- <svelte:body use:style={"background-color: #FDD4D4;"} /> -->

<style>
      @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');

    .body{
        height: 100vh;
        margin-top: 0;
        background-color: #FDD4D4;
        padding-top: 2em;
    }

    .piles {
        height: 350px;
    }

    h1{
        text-align: center;
        color: #A34C48;
        font-family: 'Kumbh Sans', sans-serif;
        margin-top: 2em;
    }

    p{
        text-align: center;
        color: #A34C48;
        font-weight: 300;
        font-size: 1.4em;
        font-family: 'Kumbh Sans', sans-serif;
    }

    .text {
    width: 50%;
    margin: 0 auto; /* Centers horizontally */
    /* display: flex;  */
    justify-content: center; /* Centers content horizontally */
    align-items: center; /* Centers content vertically */
    text-align: center; /* Ensures text alignment is centered */
    }

</style>