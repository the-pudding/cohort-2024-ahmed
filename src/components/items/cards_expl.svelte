<script>
    import { arrayCards } from '../../stores/misc.js';
  

    function getCardSrc(card) {
      if (!card) return '';
      const fileSuit = { Clubs: "club", Diamonds: "diam", Hearts: "heart", Spades: "spade" };
      return `/src/svg/Cards2PNG/${fileSuit[card.suit]}-${card.value < 10 ? "0" : ""}${card.value}.png`;
    }
  
    function handleCardClick(card) {
      console.log('Card clicked:', card);
    }
  </script>

  <div class="card-container">
    {#each $arrayCards as card, i}
      <div
        class="card"
        style="--index: {i};"
        tabindex="0"
        on:click={() => handleCardClick(card)}
      >
        <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`}>
      </div>
    {/each}
  </div>


    
  <style>
    .card-container {
      height: 200px;
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
      transform-style: preserve-3d;
      left: calc(((var(--index)) / 26) * (100% - 130px));
      top: 50%;
    }
  
    .card:hover {
      transform: translateY(-150px);
    }
  
    .card-front {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
    }
  
    @media (max-width: 600px) {
      .card {
        width: 100px;
        height: 138px;
        left: calc(((var(--index)) / 26) * (100% - 100px));
      }
    }
  </style>
  
  