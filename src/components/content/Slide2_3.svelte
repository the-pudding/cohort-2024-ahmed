<script>
    import Piles from "../items/piles3.svelte";
    import Dacard from "../items/dacard.svelte";
    import { lockedCard, currentCard } from '../../stores/misc.js';
  </script>
  
  <div class= 'container'>
    {#if $currentCard} 
    <Dacard/>
    {/if}
    <Piles/>
   <p> your card is : {$lockedCard?.suit}</p>
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