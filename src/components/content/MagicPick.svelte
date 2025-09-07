<script>
  import Cards from "../items/cards.svelte";
  import {lockedCard} from '../../stores/misc.js'
  import KeyboardDown from "../items/KeyboardDown.svelte";

//   import { style } from 'svelte-body';
</script>

<section class='body'>

    <div class="text">
        <h1> Pick A card</h1>
        <h3>Trust me, I won’t look!</h3>
    </div>
    
    <div class= 'container'>
        <Cards/>
    </div>

</section>

<!-- <svelte:body use:style={"background-color: #BFAFF7;"} /> -->

<style>

    .text {
        margin-top: 5%;
    }

    /* html{
        margin: 0;
        padding: 0;
        height: 100%;
    } */

    .body {
        height: 100vh;
        margin-top: 0;
        background-color: #BFAFF7;
        padding-top: 2em;
    }

    h1, h3 {
        margin: 0;
    }
   
    h1 {
        text-align: center;
        color: #3F3075;
        font-family: 'Kumbh Sans', sans-serif;
    }

    h3 {
        text-align: center;
        color: #3F3075;
        font-weight: 100;
        font-family: 'Kumbh Sans', sans-serif;
    }
</style>