<script>
  import Cards from "../items/cards.svelte";
  import {lockedCard} from '../../stores/misc.js'
</script>

<h1> Pick A card</h1>
<h3>Trust me, I won’t look!</h3>

<div class= 'container'>
    <Cards/>
    <!-- <p> your card is : {$lockedCard?.suit}</p> -->
</div>







<style>

    img {
        height: auto;
        width: 50%;
        margin-top: 10%;
        
    }
    h1{
        text-align: center;
        color: #3F3075;
        margin-bottom: -0.4%;
    }

    h3{
        text-align: center;
        color: #3F3075;
        font-weight: 100;
        margin-top: 0;
    }
</style>