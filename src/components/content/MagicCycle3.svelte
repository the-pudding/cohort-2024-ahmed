<script>
    import Piles from "../items/piles3.svelte";
    import Dacard from "../items/dacard.svelte";
    import { lockedCard, currentCard, assembly2 } from '../../stores/misc.js';
    import KeyboardDown from "../items/KeyboardDown.svelte";
  </script>
  
  <div class= 'container'>
    {#if $currentCard} 
    <!-- <KeyboardDown/> -->
    <Dacard/>
    {/if}
    <!-- {#if $assembly2} -->
    <Piles/>
    <!-- {:else}
    <p> Still unknown, you can to go through the 2nd cycle.</p> -->
    <!-- {/if} -->
  </div>
  
  
  <style>

@import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap'); 

        p {
        font-family: 'Kumbh Sans', sans-serif;
        font-weight: 500;
        text-align: center;
        color: #5B4E88;
        font-size: 1.7em;
        }

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