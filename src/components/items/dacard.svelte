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
      <p> Your selected <br>card</p>
    </div>
  {/if}
  
  <style>

@import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap'); 

    .locked-card {
      position: absolute;
      top: 0;
      right: 100;
      height: 20%;
      width: auto;
      margin-top: 2%;
      margin-left: 2%;
      z-index: 1000; 
      transition: transform 0.3s ease-in-out;
    }
  
    .card-front {
      width: 100%;
      height: 60%;
      object-fit: contain; 
    }

    p {
    color: #5B4E88;
    margin: 0;
    font-family: 'Kumbh Sans', sans-serif;
    font-weight: 900;
    text-align: center;
  }
  </style>
  