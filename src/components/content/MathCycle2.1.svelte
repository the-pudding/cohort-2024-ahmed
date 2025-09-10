<script>
    import { arrayCards, statuscard, cycle1array } from '../../stores/misc.js';
    import Arrow from '../items/Arrow.svelte';
  
    let rows = [];
  
    // which pile contains the selected card?
    const getSelectedPile = () => {
      for (const row of rows) for (const card of row) if (card.selected) return card.cycle1pile;
      return null;
    };
  
    const isInSelectedPile = (card) => {
      const selectedPile = getSelectedPile();
      return card.cycle1pile === selectedPile;
    };
  
    // build 9 rows × 3 cols from the store
    $: if ($statuscard) {
      rows = Array.from({ length: 9 }, (_, i) => $cycle1array.slice(i * 3, i * 3 + 3));
    } else {
      rows = [];
    }
  
    function DisplayValue(v) {
      if (v === 11) return 'Jack';
      if (v === 12) return 'Queen';
      if (v === 13) return 'King';
      if (v === 1) return 'Ace';
      return v;
    }
    function DisplaySuit(s) {
      if (s === 'Hearts') return '♥';
      if (s === 'Diamonds') return '♦';
      if (s === 'Clubs') return '♣';
      if (s === 'Spades') return '♠';
      return s;
    }
  
    // arrow wiring
    let selectedEl = null;
    let note, board;
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
          if (newCard.selected) selectedEl = node;
          else if (!newCard.selected && selectedEl === node) selectedEl = null;
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
    {#if $statuscard}
      <header class="header">
        <h1><u>The Second Cycle</u></h1>
        <p>Let's have a look at the cards inside the piles. <br />Here's where your card went.</p>
      </header>
  
      <div class="container" bind:this={board}>
        {#each rows as row}
          <div class="row">
            {#each row as card}
              <div
                class="rectangle {card.selected ? 'selected' : ''} {isInSelectedPile(card) ? 'in-pile' : ''}"
                use:collect={card}
              >
                {DisplayValue(card.value)} of {DisplaySuit(card.suit)}
              </div>
            {/each}
          </div>
        {/each}
  
        {#if selectedEl && note}
          <Arrow
            mode="container"
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
  
      <div class="footer"></div>
      <div class="footer2"><p>Division</p></div>
    {/if}
  </main>
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');
  
    .body{
      height:100vh; background:#FDD4D4;
      display:flex; flex-direction:column; align-items:center; justify-content:space-between;
      font-family:'Kumbh Sans',sans-serif; color:#A34C48;
    }
  
    .header{ text-align:center; margin-top:4rem; }
    .header h1{ position:absolute; margin-top:3rem; margin-left:5rem; font-size:2rem; font-weight:bold; left:0; top:0; }
    .header p{ margin-top:1rem; margin-bottom:0; font-size:2rem; font-weight:300; }
  
    .container{
      position:relative;                       /* needed for Arrow mode="container" */
      display:flex; flex-direction:column-reverse;
      gap:10px; width:75%; align-items:center;
    }
  
    .row{ display:flex; justify-content:center; gap:2%; width:100%; }
  
    .note{
      color:#5a80c0; font-weight:900; font-size:2rem; font-family:"Nanum Pen Script", cursive;
    }
  
    .rectangle{
      position:relative;                        /* for the right-cap (::after) */
      flex:1; max-width:27%; aspect-ratio:8 / 1;
      background:#F09D99;                       /* base pink */
      display:flex; align-items:center; justify-content:center;
      font-weight:bold; color:#fff; text-align:center;
      border-radius:6px; overflow:hidden;       /* keep cap rounded */
      transition:transform .2s ease;
    }
  
    /* 🔵 In selected pile = show only last 10% blue with a white “I” */
    .rectangle.in-pile:not(.selected){
      background: linear-gradient(to right, #F09D99 0 90%, #558ABB 90% 100%);
      /* padding-right: 12%;                       */
    }
    .rectangle.in-pile:not(.selected)::after{
      content:"I";
      position:absolute; right:0; top:0;
      width:10%; height:100%;
      display:flex; align-items:center; justify-content:center;
      color:#fff; font-weight:900;
      pointer-events:none;
    }
  
    /* selected card stays as your highlight */
    .rectangle.selected{
      color:#A34C48;
       background: linear-gradient(to right, #F09D99 0 90%, #558ABB 90% 100%);
      /* outline:4px solid #558ABB; outline-offset:-4px; */
    }
    .rectangle.selected::after{  content:"I";
      position:absolute; right:0; top:0;
      width:10%; height:100%;
      display:flex; align-items:center; justify-content:center;
      color:#fff; font-weight:900;
      pointer-events:none;}  /* no cap on the selected card */
  
    .footer{ margin-bottom:4rem; color:#4973B0; font-weight:bold; font-size:1.5rem; }
    .footer2{ position:absolute; margin-right:4rem; margin-bottom:4rem; color:#4973B0; font-weight:bold; font-size:1.5rem; right:0; bottom:0; }
  </style>
  