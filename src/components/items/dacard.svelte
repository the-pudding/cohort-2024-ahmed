<script>
    import { lockedCard } from '../../stores/misc.js';
  
    let card = $lockedCard;
    console.log('you picked',card )
  
    function getCardSrc(card) {
      if (!card) return '';
      const fileSuit = { "Clubs": "club", "Diamonds": "diam", "Hearts": "heart", "Spades": "spade" };
      return `/src/svg/Cards_png/${fileSuit[card.suit]}-${card.value < 10 ? "0" : ""}${card.value}.png`;
    }
  </script>
 
  {#if card}
    <div class="locked-card">
      <img class="card-front" src={getCardSrc(card)} alt={`Card ${card.value} of ${card.suit}`}>
    </div>
  {/if}
  
  <style>
    .locked-card {
      position: absolute;
      top: 0;
      right: 0;
      height: 20%;
      width: auto;
      z-index: 1000; 
      transition: transform 0.3s ease-in-out;
    }
  
    .card-front {
      width: 100%;
      height: 100%;
      object-fit: contain; 
    }
  </style>
  