<script>
    import Piles from "../items/piles2.svelte";
    import Dacard from "../items/dacard.svelte";
    import { lockedCard, currentCard, assembly2} from '../../stores/misc.js';
    import KeyboardDown from "../items/KeyboardDown.svelte";



    import { get } from 'svelte/store';
  // Adjust this import list to match what you actually export in ../../stores/misc.js
  import {
    statuscard,
    arrayCards,
    cycle1array,
    resetKey
  } from '../../stores/misc';

  function logStores() {
    // Get snapshot values at click-time
    const data = {
      lockedCard: get(lockedCard),
      currentCard: get(currentCard),
      statuscard: get(statuscard),
      arrayCards: get(arrayCards),
      cycle1array: get(cycle1array),
      resetKey: get(resetKey),
    };

    // Pretty console output
    console.group('%cStores snapshot', 'font-weight:bold');
    Object.entries(data).forEach(([k, v]) => {
      try {
        // Try to stringify nicely
        console.log(`${k}:`, JSON.parse(JSON.stringify(v)));
      } catch {
        // Fallback if there are functions/Proxies/etc.
        console.log(`${k}:`, v);
      }
    });
    console.groupEnd();
  }
  </script>
  
  <div class= 'container'>
    {#if $currentCard} 
    <!-- <KeyboardDown/> -->
    <Dacard/>
    {/if}
    <Piles/>

    <!-- <button on:click={logStores}
  class="px-3 py-2 rounded-md border"
  aria-label="Log all misc stores">
  Log misc stores
</button> -->

  </div>
  
  
  <style>
  
          .container{
              height: 100vh;
              background-color: #BFAFF7;
          }
  
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