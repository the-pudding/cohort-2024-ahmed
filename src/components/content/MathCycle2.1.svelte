<script>
    import { arrayCards, statuscard, cycle1array } from '../../stores/misc.js';
    import Arrow from '../items/Arrow.svelte';

    let rows = [];
    const getSelectedPile = () => {
        for (const row of rows) {
            for (const card of row) {
                if (card.selected) {
                    return card.cycle1pile;
                }
            }
        }
        return null;
    };

    // Check if a card is in the selected pile
    const isInSelectedPile = (card) => {
        const selectedPile = getSelectedPile();
        return card.cycle1pile === selectedPile;
    };

    // Reactive rows derived from arrayCards (3 cards per row, 9 rows total)
    $: if ($statuscard) {
        rows = Array.from({ length: 9 }, (_, i) => $cycle1array.slice(i * 3, i * 3 + 3));
          // Get the pile of the selected card
   

    } else {
        rows = []; // Clear rows if statuscard is false
    }

    function DisplayValue(selectedValue) {
        if (selectedValue === 11) return 'Jack';
        if (selectedValue === 12) return 'Queen';
        if (selectedValue === 13) return 'King';
        if (selectedValue === 1) return 'Ace';
        return selectedValue;
    }

    function DisplaySuit(suit) {
        if (suit === 'Hearts') return '♥';
        if (suit === 'Diamonds') return '♦';
        if (suit === 'Clubs') return '♣';
        if (suit === 'Spades') return '♠';
        return suit;
    }


    let selectedEl = null;
    let note;
    let board;
    const elMap = new Map();
  
    let layoutVersion = 0;
    const invalidate = () => { layoutVersion += 1; };
  
    function collect(node, card) {
      elMap.set(card.index, node);
      if (card.selected) selectedEl = node;
      invalidate();
  
      return {
        update(newCard) {
          if (newCard.index !== card.index) {
            elMap.delete(card.index);
            elMap.set(newCard.index, node);
          }
          // If selection changed, update selectedEl both ways
          if (newCard.selected) {
            selectedEl = node;
          } else if (!newCard.selected && selectedEl === node) {
            selectedEl = null;
          }
          card = newCard;
          invalidate();
        },
        destroy() {
          elMap.delete(card.index);
          if (selectedEl === node) selectedEl = null;
          invalidate();
        }
      };
    }
</script>

<main class="body">
    {#if $statuscard == true}
    <header class="header">
        <h1><u>The Second Cycle</u></h1>
        <p>Let's have a look at the cards inside the piles. <br> Here's where your card went.</p>
    </header>
    <div class="container" bind:this={board}>
        {#each rows as row}
            <div class="row">
                {#each row as card}
                    <div
                        class="rectangle {card.selected ? 'selected' : ''} {isInSelectedPile(card) ? 'in-pile' : ''}"
                        use:collect={card}>
                        {DisplayValue(card.value)} of {DisplaySuit(card.suit)}
                    </div>
                {/each}
            </div>
        {/each}

        {#if selectedEl && note}
        <Arrow
          container={board}
          fromEl={selectedEl}
          toEl={note}
          fromAnchor="right"
          toAnchor="top"
          headAt="start"
          curvature={0.22}
          bulge={0.16}
          bulgeDir="up"
          width={4}
          color="#5a80c0"
          version={layoutVersion}   
        />
      {/if}

    </div>

    <div class="note" bind:this={note}>The Selected card</div>
    
    <div class="footer">
    </div>
    <div class="footer2">
        <p>Division</p>
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

    .header {
        text-align: center;
        margin-top: 4rem;
    }

    .header h1 {
        position: absolute;
        margin-top: 3rem;
        margin-left:5rem;
        font-size: 2rem;
        font-weight: bold;
        left: 0;
        top:0;
    }

    .header p {
        margin-top: 1rem;
        margin-bottom: 0;
        font-size: 2rem;
        font-weight: 300;
    }

    .container {
        display: flex;
        flex-direction: column-reverse;
        gap: 10px;
        width: 75%;
        align-items: center;
        /* margin-bottom: 15%; */
          position: relative;   

    }

    .row {
        display: flex;
        justify-content: center;
        gap: 2%;
        width: 100%;
    }

    .note {
      color: #5a80c0;
      font-weight: 900;
      font-size: 2rem;
      font-family: "Nanum Pen Script", cursive;
      /* margin: 3% 0 3% 0; */
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

   

    .rectangle.in-pile {
        background-color: #558ABB;
    }

    .rectangle.selected {
        background-color: #A34C48;
		outline: 4px solid #558ABB; 
        outline-offset: -4px; 
    }



    .footer {
        /* position: absolute; */
        /* margin-right: 4rem; */
        margin-bottom: 4rem;
        color: #4973B0;
        font-weight: bold;
        font-size: 1.5rem;
        /* right: 0;
        bottom: 0; */

    }
    .footer2 {
        position: absolute; 
        margin-right: 4rem; 
        margin-bottom: 4rem;
        color: #4973B0;
        font-weight: bold;
        font-size: 1.5rem;
        right: 0;
        bottom: 0;

    }
</style>
